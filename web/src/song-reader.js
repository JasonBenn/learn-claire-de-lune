import { midiKeyCodeToNoteCode, notInDFlatMajor } from './utils'

export default class SongReader {
  constructor(midiData) {
    this.rightHand = new MidiTrack(midiData.tracks[1])
    this.leftHand = new MidiTrack(midiData.tracks[2])

    this.updateLeftChord()
    this.updateRightChord()
  }

  updateLeftChord() {
    this.currentLeftChord = this.leftHand.getNextChord(this.leftHand.cursor)
  }

  updateRightChord() {
    this.currentRightChord = this.rightHand.getNextChord(this.rightHand.cursor)
  }

  getNextChord() {
    let currentChord
    if (this.leftHand.totalTicks === this.rightHand.totalTicks) {
      currentChord = this.currentLeftChord.concat(this.currentRightChord)
      this.currentChordTicks = this.leftHand.totalTicks
      this.updateLeftChord()
      this.updateRightChord()
    } else if (this.leftHand.totalTicks < this.rightHand.totalTicks) {
      currentChord = this.currentLeftChord
      this.currentChordTicks = this.leftHand.totalTicks
      this.updateLeftChord()
    } else {
      currentChord = this.currentRightChord
      this.currentChordTicks = this.rightHand.totalTicks
      this.updateRightChord()
    }
    return currentChord
  }
}

class MidiTrack {
  constructor(track) {
    this.track = track.map(note => new MidiNote(note))
    this.cursor = 0
    this.totalTicks = 0
    this.advanceToNextNoteOn()
  }

  advanceToNextNoteOn() {
    while (this.currentNote().subtype !== 'noteOn') this.advanceCursor()
  }

  currentNote() {
    return this.track[this.cursor]
  }

  advanceCursor() {
    this.totalTicks += this.currentNote().deltaTime
    this.cursor += 1
  }

  getNextChord() {
    this.advanceToNextNoteOn()

    let currentChord = [this.currentNote()]
    this.advanceCursor()

    while (!this.currentNote().deltaTime) {
      if (this.currentNote().subtype === 'noteOn') currentChord.push(this.currentNote())
      this.advanceCursor()
    }

    return currentChord
  }

  forEach(fun) {
    return this.track.forEach(fun)
  }
}

export class MidiNote {
  constructor(note) {
    _.extend(this, note)
    if (notInDFlatMajor(this.noteNumber)) this.accidental = true
  }
}
