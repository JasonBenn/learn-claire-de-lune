import _, { uniqBy } from 'lodash'

const LOWEST_NOTE = 28
const HIGHEST_NOTE = 103

export const colors = {
  GREEN: '#bada55',
  RED: '#FF0000',
  BLACK: '#000000',
  GRAY: '#888888',
  TEAL: 'rgb(124, 194, 193)',
  DARK_TEAL: 'rgb(63, 94, 104)',
  FOREST_GREEN: 'rgb(25, 69, 81)',
  DARK_BLUE: 'rgb(24, 46, 78)',
  MIDNIGHT: 'rgb(20, 28, 40)',
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

const ifKey = keyCode => function(callback, e) {
  if (e.which === keyCode) {
    callback()
    e.preventDefault()
  }
}

export const ifSpaceBar = ifKey(32)
export const ifEnter = ifKey(13)

export const greenNotesInMoment = chord => _.reduce(chord, (sum, note) => (note.color === colors.GREEN) ? sum + 1 : sum, 0)

export function * zipBy([iterableA, iterableB], getComparable, onTie) {
  let nextA = iterableA.next()
  let nextB = iterableB.next()

  while (!nextA.done || !nextB.done) {
    if (nextA.done) {
      yield nextB.value
      nextB = iterableB.next()
      continue
    }

    if (nextB.done) {
      yield nextA.value
      nextA = iterableA.next()
      continue
    }

    if (getComparable(nextA.value) < getComparable(nextB.value)) {
      yield nextA.value
      nextA = iterableA.next()
      continue
    }

    if (getComparable(nextA.value) > getComparable(nextB.value)) {
      yield nextB.value
      nextB = iterableB.next()
      continue
    }

    if (getComparable(nextA.value) === getComparable(nextB.value)) {
      yield onTie(nextA.value, nextB.value)
      nextA = iterableA.next()
      nextB = iterableB.next()
    }
  }
}

export const midiKeyCodeToOctavelessNote = midiKeyCode => {
  return _.invert(NOTE_OFFSETS)[midiKeyCode % 12]
}

export const midiKeyCodeToNoteCode = midiKeyCode => {
  const note = midiKeyCodeToOctavelessNote(midiKeyCode)
  const octave = Math.floor(midiKeyCode / 12) - 1
  return note + octave
}

export const getIsWhiteKey = midiNote => {
  if (midiNote.accidental) {
    return _.includes(['a', 'b', 'd', 'e', 'g'], midiNote.octavelessNote)
  } else {
    return midiNote.octavelessNote === "f" || midiNote.octavelessNote === "c"
  }
}

export const shadeColor = (color, percent) => {
  var f = parseInt(color.slice(1),16)
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  const R = f >> 16
  const G = f >> 8&0x00FF
  const B = f & 0x0000FF;
  return "#" + (0x1000000+(Math.round((t-R)*p)+R) * 0x10000 + (Math.round((t-G)*p)+G) * 0x100 + (Math.round((t-B)*p)+B)).toString(16).slice(1)
}

export const friendlyChord = chord => {
  return chord.map(note => midiKeyCodeToNoteCode(note.noteNumber))
}

const MS_TO_PX_RATIO = 5
const TICKS_TO_PX_RATIO = 5

export const ticksToPx = ticks => ticks / TICKS_TO_PX_RATIO
export const msToPx = ms => ms / MS_TO_PX_RATIO
export const pxToMs = px => px * MS_TO_PX_RATIO
export const ticksToMs = ticks => pxToMs(ticksToPx(ticks))

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
  return _.includes([2, 4, 7, 9, 11], noteNumber % 12)
}

export const uniqByNoteNumber = chord => {
  return _.uniqBy(chord, note => note.noteNumber)
}

export const mergeMoments = (leftMoment, rightMoment) => {
  return { totalTicks: leftMoment.totalTicks, chord: leftMoment.chord.concat(rightMoment.chord) }
}

export const toPercent = n => (n * 100).toFixed(1) + '%'

export const uuid = () => {
  // return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  var uuid = '', ii;
  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-'
        uuid += (Math.random() * 16 | 0).toString(16)
        break
      case 12:
        uuid += '-'
        uuid += '4'
        break
      case 16:
        uuid += '-'
        uuid += (Math.random() * 4 | 8).toString(16)
        break
      default:
        uuid += (Math.random() * 16 | 0).toString(16)
    }
  }
  return uuid
}

export const getCurrentSessionId = () => {
  let currentSessionId = sessionStorage.getItem("currentSessionId")
  if (!currentSessionId) {
    currentSessionId = uuid()
    sessionStorage.setItem("currentSessionId", currentSessionId)
  }
  return currentSessionId
}
