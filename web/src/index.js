import 'normalize.css'
import './styles.scss'
import { floor, range, partial, each, filter, find, pluck } from 'lodash'
import $ from 'jquery'

const canvas = document.getElementById("sheet-music");
const ctx = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;
const GREEN = '#bada55'
const STAFF_TOP = 100.5
const LEFT_BOUND = 100
const RIGHT_BOUND = 900
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

let notes = [
  { code: 77, time: 1100 },
  { code: 75, time: 2000 },
  { code: 60, time: 2500 },
  { code: 59, time: 2800 },
  { code: 57, time: 3100 },
  { code: 63, time: 2500 },
  { code: 66, time: 2500 },
  { code: 73, time: 4000 },
  { code: 68, time: 4000 },
  { code: 60, time: 4000 },
  { code: 80, time: 4000 },
]

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

// console.log('eb', whiteKeysDistance(75) === -1)
// console.log('e', whiteKeysDistance(76) === -1)
// console.log('f', whiteKeysDistance(77) === 0)
// console.log('gb', whiteKeysDistance(78) === 1)
// console.log('g', whiteKeysDistance(79) === 1)
// console.log('ab', whiteKeysDistance(80) === 2)
// console.log('a', whiteKeysDistance(81) === 2)
// console.log('bb', whiteKeysDistance(82) === 3)
// console.log('b', whiteKeysDistance(83) === 3)
// console.log('c', whiteKeysDistance(84) === 4)
// console.log('db', whiteKeysDistance(85) === 5)
// console.log('d', whiteKeysDistance(86) === 5)
// console.log('eb', whiteKeysDistance(87) === 6)
// console.log('e', whiteKeysDistance(88) === 6)
// console.log('f', whiteKeysDistance(89) === 7)
// console.log('gb', whiteKeysDistance(90) === 8)
// console.log('g', whiteKeysDistance(91) === 8)
// console.log('ab', whiteKeysDistance(92) === 9)
// console.log('a', whiteKeysDistance(93) === 9)
// console.log('bb', whiteKeysDistance(94) ===10)
// console.log('b', whiteKeysDistance(95) ===10)
// console.log('c', whiteKeysDistance(96) ===11)
// console.log('db', whiteKeysDistance(97) ===12)
// console.log('d', whiteKeysDistance(98) ===12)
// console.log('eb', whiteKeysDistance(99) ===13)
// console.log('e', whiteKeysDistance(100) ===13)

const drawNotes = () => {
  each(notes, ({ code, time, color }) => {
    console.log(whiteKeysDistance(code))
    const noteTop = STAFF_TOP - whiteKeysDistance(code) * GAP_BETWEEN_LINES / 2
    drawNote(time * 0.1, noteTop, color)
  })
}

const drawTranslated = (panX, panY = 0) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  ctx.translate(panX, panY)
  drawStaff()
  drawNotes()
}

let errorsOffset = 0
let currentTime = 0

$(document).click(() => currentTime -= 1000) // ms


const scroll = (startTime) => {
  currentTime = (Date.now() - startTime)
  drawTranslated(-currentTime * 0.1)
  requestAnimationFrame(partial(scroll, startTime))
}

const onMidiMessage = (msg, correctCb, incorrectCb) => {
  const [eventType, midiKeyCode, velocity] = msg.data
  const currentNotes = filter(notes, ({ time }) => currentTime < time && time < currentTime + 1000)
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
