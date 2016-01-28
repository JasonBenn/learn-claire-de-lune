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

