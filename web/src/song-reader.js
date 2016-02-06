import { midiKeyCodeToNoteCode, notInDFlatMajor, uniqByNoteNumber, mergeMoments, zipBy } from './utils'

export default class SongReader {
  constructor(midiData) {
    this.rightHand = new MomentsIterator(midiData.tracks[1])
    this.leftHand = new MomentsIterator(midiData.tracks[2])
  }

  *[Symbol.iterator]() {
    yield * zipBy([this.leftHand, this.rightHand], ({totalTicks}) => totalTicks, mergeMoments)
  }
}

function * MomentsIterator(midiTrack) {
  const notes = midiTrack.map(note => new MidiNote(note))

  const advanceCursor = () => {
    if (!currentNote) return
    totalTicks += currentNote.deltaTime
    cursor += 1
    currentNote = notes[cursor]
  }

  const addNoteToChord = (chord, note) => {
    if (note && note.subtype === 'noteOn') chord.push(note)
    advanceCursor()
  }

  let cursor = 0
  let totalTicks = 0
  let currentNote = notes[cursor]
  while (currentNote && currentNote.subtype !== 'noteOn') advanceCursor()

  const nextMoment = () => {
    const chord = []
    while (currentNote && currentNote.subtype !== 'noteOn') advanceCursor()
    addNoteToChord(chord, currentNote)
    while (currentNote && currentNote.deltaTime === 0) addNoteToChord(chord, currentNote)
    return { totalTicks, chord: uniqByNoteNumber(chord) }
  }

  while (currentNote) yield nextMoment()
}

export class MidiNote {
  constructor(note) {
    _.extend(this, note)
    if (notInDFlatMajor(this.noteNumber)) this.accidental = true
  }
}
