import { floor, range, partial, each, filter, find, pluck, uniq } from 'lodash'
import $ from 'jquery'
import DrawMusic from './draw'
import { MidiNote } from './song-reader'
import { keyNotOnPiano, midiKeyCodeToNoteCode, friendlyChord, ticksToPx, msToPx, colors, greenNotesInMoment, toPercent } from './utils'

const PEDAL_CODE_A = 176
const PEDAL_CODE_B = 177
const TIMING_CLOCK = 248
const PAN_STARTING_OFFSET_PX = 500

export default class Trainer {
  constructor(canvas, moments, settings) {
    this.draw = new DrawMusic(canvas, settings)

    this.moments = moments
    this.settings = settings

    this.errorTime = 0
    this.currentTime = 0

    this.incorrectNotes = {}
    this.incorrectNotesCount = 0
    this.correctNotesCount = 0

    this.onSuccess = function() {}

    this.index = -1

    this.historicalPanX = PAN_STARTING_OFFSET_PX

    this.updateChord()
    this.unpause()
    this.render(Date.now())

    this.currentPlayId = getCurrentPlayId()
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

  resetColors(fromTick = 0) {
    const fromIndex = this.moments.findIndex(moment => moment.totalTicks >= fromTick)
    range(fromIndex, this.moments.length).forEach(partial(::this.setChordColor, undefined))
  }

  setToTick(tick) {
    this.resetColors(tick)
    this.index = this.moments.findIndex(moment => moment.totalTicks >= tick)
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
    this.updateProgress()
  }

  updateChord() {
    this.index += 1
    this.updateProgress()
  }

  updateProgress() {
    const greenNotes = this.moments.reduce((sum, moment) => sum + greenNotesInMoment(moment.chord), 0)
    const totalNotes = this.moments.reduce((sum, moment) => moment.chord.length + sum, 0)
    $('.progress .value').text(toPercent(greenNotes / totalNotes))
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
    return this.currentMoment().totalTicks
  }

  currentChord() {
    const chord = this.currentMoment().chord
    if (this.settings().handMode === 'left') return _.filter(chord, note => note.hand === 'left')
    if (this.settings().handMode === 'right') return _.filter(chord, note => note.hand === 'right')
    return chord
  }

  currentMoment() {
    return this.moments[this.index]
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
    if (eventType === PEDAL_CODE_A || eventType === PEDAL_CODE_B || eventType === TIMING_CLOCK) return
    const correctNotePlayed = _.find(this.currentChord(), note => note.noteNumber === noteNumber)
    const currentChordLength = _.reject(this.currentChord(), note => keyNotOnPiano(note.noteNumber)).length

    if (correctNotePlayed) {
      if (velocity) {
        this.correctNotesCount += 1
        correctNotePlayed.color = colors.GREEN
      } else {
        this.correctNotesCount = Math.max(this.correctNotesCount - 1, 0)
        delete correctNotePlayed.color
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
      this.incorrectNotesCount = 0;
      (this.settings().hardMode ? ::this.maybeTryLastNoteAgain : ::this.updateChord)()
    } else if (this.incorrectNotesCount && !this.alreadyTryingAgain) {
      this.tryAgain = true
      this.alreadyTryingAgain = true
    }
  }

  logCurrentDeltaTime() {
    console.log('current:', this.currentChordTicks(), this.currentChord(), this.index);
    var nextChord = this.moments[this.index + 1]
    console.log('next:', nextChord.totalTicks, nextChord.chord, this.index + 1);
  }

  maybeTryLastNoteAgain() {
    if (this.tryAgain) {
      this.resetToLastNote()
      this.tryAgain = false
    } else {
      this.updateChord()
      this.alreadyTryingAgain = false
    }
  }
}
