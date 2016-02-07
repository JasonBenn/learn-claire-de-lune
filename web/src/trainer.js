import { floor, range, partial, each, filter, find, pluck, uniq } from 'lodash'
import DrawMusic from './draw'
import { MidiNote } from './song-reader'
import { keyNotOnPiano, midiKeyCodeToNoteCode, friendlyChord, ticksToPx, msToPx, colors } from './utils'

const PEDAL_CODE = 176
const TIMING_CLOCK = 248
const PAN_STARTING_OFFSET_PX = 500

export default class Trainer {
  constructor(canvas, moments) {
    this.draw = new DrawMusic(canvas)
    this.moments = moments

    this.errorTime = 0
    this.currentTime = 0

    this.incorrectNotes = {}
    this.incorrectNotesCount = 0
    this.correctNotesCount = 0

    this.index = -1

    this.historicalPanX = PAN_STARTING_OFFSET_PX

    this.updateChord()
    this.unpause()
    this.render(Date.now())
  }

  activatePeekMode() {
    this.peekMode = true
  }

  deactivatedPeekMode() {
    this.peekMode = false
  }

  setChordColor(color, index) {
    this.moments[index].chord.forEach(note => note.color = color)
  }

  resetColors() {
    range(0, this.moments.length).forEach(partial(::this.setChordColor, colors.BLACK))
  }

  setToTick(tick) {
    this.resetColors()
    this.index = this.moments.findIndex(moment => moment.totalTicks === tick)
    this.panToTick(tick)
  }

  panToTick(tick) {
    this.pause()
    this.historicalPanX = PAN_STARTING_OFFSET_PX - ticksToPx(this.currentChordTicks())
  }

  resetToLastNote() {
    this.setChordColor(colors.BLACK, this.index)
    this.index = Math.max(this.index - 1, 0)
    this.setChordColor(colors.BLACK, this.index)
    this.panToTick(this.currentChordTicks())
  }

  updateChord() {
    this.index += 1
  }

  renderTranslated(panX, panY = 0) {
    this.draw.clearAndPan(panX, panY)
    this.draw.staff()
    this.peekMode ? this.draw.peekedMoments(this.moments) : this.draw.moments(this.moments)
    this.draw.divider(panX)
    this.draw.notes(_.values(this.incorrectNotes), panX - PAN_STARTING_OFFSET_PX)
  }

  currentPanX() {
    return msToPx(Date.now() - this.lastUnpausedTime || 0)
  }

  pause() {
    this.historicalPanX -= this.currentPanX()
    this.paused = true
    if (this.currentChordOutOfRange()) {
      this.updateChord()
    }
  }

  currentChordOutOfRange() {
    return _.every(this.currentChord().map(note => keyNotOnPiano(note.noteNumber)))
  }

  unpause() {
    this.lastUnpausedTime = Date.now()
    this.paused = false
  }

  currentChordTicks() {
    return this.moments[this.index].totalTicks
  }

  currentChord() {
    return this.moments[this.index].chord
  }

  nextChordPx() {
    return PAN_STARTING_OFFSET_PX - ticksToPx(this.currentChordTicks())
  }

  render() {
    const totalPanX = this.paused ? this.historicalPanX : this.historicalPanX - this.currentPanX()

    if (totalPanX < this.nextChordPx() && !this.paused) this.pause()
    if (totalPanX > this.nextChordPx() && this.paused) this.unpause()

    this.renderTranslated(totalPanX)
    requestAnimationFrame(this.render.bind(this))
  }

  onMidiMessage(msg, correctCb, incorrectCb) {
    const [eventType, noteNumber, velocity] = msg.data
    if (eventType === PEDAL_CODE || eventType === TIMING_CLOCK) return
    const correctNotePlayed = _.find(this.currentChord(), note => note.noteNumber === noteNumber)
    const currentChordLength = _.reject(this.currentChord(), note => keyNotOnPiano(note.noteNumber)).length

    if (correctNotePlayed) {
      if (velocity) {
        this.correctNotesCount += 1
        correctNotePlayed.color = colors.GREEN
      } else {
        this.correctNotesCount = Math.max(this.correctNotesCount - 1, 0)
        correctNotePlayed.color = colors.BLACK
      }
    } else {
      if (velocity) {
        this.incorrectNotes[noteNumber] = new MidiNote({ noteNumber, color: colors.RED, deltaTime: 0, subtype: 'noteOn' })
        this.incorrectNotesCount += 1
      } else {
        delete this.incorrectNotes[noteNumber]
        this.incorrectNotesCount = Math.max(this.incorrectNotesCount - 1, 0)
      }
    }

    if (this.correctNotesCount === currentChordLength && !this.incorrectNotesCount) {
      this.correctNotesCount = 0
      this.incorrectNotesCount = 0
      if (this.tryAgain) {
        this.resetToLastNote()
        this.tryAgain = false
      } else {
        this.updateChord()
        this.alreadyTryingAgain = false
      }
    } else if (this.incorrectNotesCount && !this.alreadyTryingAgain) {
      this.tryAgain = true
      this.alreadyTryingAgain = true
    }
  }
}