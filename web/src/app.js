import 'normalize.css'
import './styles.scss'
import { floor, range, partial, each, filter, find, pluck, uniq } from 'lodash'
import $ from 'jquery'
import DrawMusic from './draw'
import SongReader, { MidiNote } from './song-reader'
import Piano from './piano'
import { midiKeyCodeToNoteCode, friendlyChord, ticksToPx, msToPx, colors } from './utils'

const PEDAL_CODE = 176
const TIMING_CLOCK = 248
const PAN_STARTING_OFFSET_PX = 500

class Trainer {
  constructor() {
    var canvas = document.getElementById("sheet-music")
    this.draw = new DrawMusic(canvas)

    this.errorTime = 0
    this.currentTime = 0

    this.incorrectNotes = {}
    this.incorrectNotesCount = 0
    this.correctNotesCount = 0

    this.historicalPanX = PAN_STARTING_OFFSET_PX
  }

  connectToPiano() {
    return new Piano(this.onMidiMessage.bind(this))
  }

  load(url) {
    return $.get(url)
  }

  updateChord() {
    this.currentChord = this.songReader.getNextChord()
  }

  start(data) {
    this.songReader = new SongReader(data)
    this.updateChord()
    this.unpause()
    this.render(Date.now())
  }

  renderTranslated(panX, panY = 0) {
    this.draw.clearAndPan(panX, panY)
    this.draw.staff()
    this.draw.notes(this.songReader.leftHand)
    this.draw.notes(this.songReader.rightHand)
    this.draw.divider(panX)
    this.draw.notes(_.values(this.incorrectNotes), panX)
  }

  currentPanX() {
    return msToPx(Date.now() - this.lastUnpausedTime || 0)
  }

  pause() {
    this.historicalPanX -= this.currentPanX()
    this.paused = true

    console.log('Current chord:', friendlyChord(this.currentChord))
  }

  unpause() {
    this.lastUnpausedTime = Date.now()
    this.paused = false
  }

  currentChordTicks() {
    return this.songReader.currentChordTicks
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
    const correctNotePlayed = _.find(this.currentChord, note => note.noteNumber === noteNumber)

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

    if (this.correctNotesCount === this.currentChord.length && !this.incorrectNotesCount) {
      this.correctNotesCount = 0
      this.incorrectNotesCount = 0
      this.updateChord()
    }
  }
}

const trainer = new Trainer()
trainer.connectToPiano()
  .then(() => trainer.load('api/claire'))
  .then(::trainer.start)
