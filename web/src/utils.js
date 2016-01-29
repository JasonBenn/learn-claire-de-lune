const LOWEST_NOTE = 28
const HIGHEST_NOTE = 103

export const colors = {
  GREEN: '#bada55',
  RED: '#FF0000',
  BLACK: '#000',
  GRAY: '#888'
}

const NOTE_OFFSETS = {
  c: 0,
  'c#': 1, db: 1,
  d: 2,
  'd#': 3, eb: 3,
  e: 4,
  f: 5,
  'f#': 6, gb: 6,
  g: 7,
  'g#': 8, ab: 8,
  a: 9,
  'a#': 10, bb: 10,
  b: 11
}

export const midiKeyCodeToNoteCode = midiKeyCode => {
  const note = _.invert(NOTE_OFFSETS)[midiKeyCode % 12]
  const octave = Math.floor(midiKeyCode / 12) - 1
  return note + octave
}

export const friendlyChord = chord => {
  return chord.map(note => midiKeyCodeToNoteCode(note.noteNumber))
}

const MS_TO_PX_RATIO = 5
const TICKS_TO_PX_RATIO = 5

export const ticksToPx = (ticks) => {
  return ticks / TICKS_TO_PX_RATIO
}

export const msToPx = (ms) => {
  return ms / MS_TO_PX_RATIO
}

export const keyNotOnPiano = (noteNumber) => {
  return noteNumber < LOWEST_NOTE || noteNumber > HIGHEST_NOTE
}

export const whiteKeysDistance = code => {
  const fromBaseKey = code - 77
  let inOctave = fromBaseKey % 12
  if (inOctave < 0) inOctave += 12 // mimics negative indices for an array of size 12.
  const outOfOctave = _.floor(fromBaseKey / 12) * 7
  return [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6][inOctave] + outOfOctave
}

export const notInDFlatMajor = noteNumber => {
  return _.contains([2, 4, 7, 9, 11], noteNumber % 12)
}
