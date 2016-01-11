import 'normalize.css'
import './styles.scss'
import { floor, range, partial, each, filter, find, pluck } from 'lodash'
import $ from 'jquery'
import NOTES from './notes'

// import midiFileParser from 'midi-file-parser'

// const file = require('fs').readFileSync('deb_clai.mid', 'binary')
// const midi = midiFileParser(file);


const canvas = document.getElementById("sheet-music");
const ctx = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;
const GREEN = '#bada55'
const STAFF_TOP = 100.5
const LEFT_BOUND = 100
const RIGHT_BOUND = 10000
const GAP_BETWEEN_LINES = 20

const noteRadius = 10;

const drawNote = (x, y, color = "#000") => {
  ctx.beginPath();
  ctx.arc(x, y, noteRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill()
}

const drawLine = (x1, y1, x2, y2) => {
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

const drawStaff = () => {
  each(range(0, 5), step => {
    const y = STAFF_TOP + GAP_BETWEEN_LINES * step
    drawLine(LEFT_BOUND, y, RIGHT_BOUND, y)
  })

  each(range(6, 11), step => {
    const y = STAFF_TOP + GAP_BETWEEN_LINES * step
    drawLine(LEFT_BOUND, y, RIGHT_BOUND, y)
  })
}

const whiteKeysDistance = code => {
  const fromBaseKey = code - 77
  let inOctave = fromBaseKey % 12
  if (inOctave < 0) inOctave += 12 // mimics negative indices for an array of size 12.
  const outOfOctave = floor(fromBaseKey / 12) * 7
  return [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6][inOctave] + outOfOctave
}

const drawNotes = () => {
  each(NOTES, ({ code, time, color }) => {
    const noteTop = STAFF_TOP - whiteKeysDistance(code) * GAP_BETWEEN_LINES / 2
    drawNote(time * 0.1, noteTop, color)
  })
}


// 120 bpm is the number of quarter notes in 60 seconds.
// 2 quarter notes per second.

// 100px.

// I can control how far apart to place quarter notes.
// 9 eighth notes should cover 300px.
// Ah, fuck, MIDI will have its own timing markings.

// I need to open a new MIDI file.

// I'm translating milliseconds to pixels.
// I can change the


const drawTranslated = (panX, panY = 0) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  ctx.translate(panX, panY)
  drawStaff()
  drawNotes()
}

let errorTime = 0
let currentTime = 0

$(document).click(() => errorTime -= 300) // ms


const scroll = (startTime) => {
  currentTime = (Date.now() - startTime)
  drawTranslated(-currentTime * 0.1 - errorTime)
  requestAnimationFrame(partial(scroll, startTime))
}

const onMidiMessage = (msg, correctCb, incorrectCb) => {
  const [eventType, midiKeyCode, velocity] = msg.data
  const currentNotes = filter(NOTES, ({ time }) => currentTime < time && time < currentTime + 1000)
  const playedNote = find(currentNotes, ({ code }) => code === midiKeyCode )
  // TODO
}

const onMIDISuccess = midiAccess => {
  var inputs = midiAccess.inputs.values()
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMidiMessage
  }
  scroll(Date.now())
}

const start = () => {
  navigator.requestMIDIAccess().then(onMIDISuccess);
}

start()
