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
    if (this.leftHand.absoluteTime === this.rightHand.absoluteTime) {
      currentChord = this.currentLeftChord.concat(this.currentRightChord)
      this.updateLeftChord()
      this.updateRightChord()
    } else if (this.leftHand.absoluteTime < this.rightHand.absoluteTime) {
      currentChord = this.currentLeftChord
      this.updateLeftChord()
    } else {
      currentChord = this.currentRightChord
      this.updateRightChord()
    }
    return currentChord
  }
}

class MidiTrack {
  constructor(track) {
    this.track = track.map(note => new MidiNote(note))
    this.cursor = this.firstNoteOn()
    this.absoluteTime = 0
  }

  firstNoteOn() {
    return this.track.findIndex(note => note.subtype === 'noteOn')
  }

  currentNote() {
    return this.track[this.cursor]
  }

  advanceCursor() {
    this.absoluteTime += this.currentNote().deltaTime
    this.cursor += 1
  }

  getNextChord() {
    while (this.currentNote().subtype !== 'noteOn') this.advanceCursor()

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
    this.playedCorrectly = null
    _.extend(this, note)
  }
}
