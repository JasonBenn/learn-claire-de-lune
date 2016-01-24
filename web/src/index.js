import 'normalize.css'
import './styles.scss'
import { floor, range, partial, each, filter, find, pluck, uniq } from 'lodash'
import $ from 'jquery'
import DrawMusic from './draw'

let leftHand
let rightHand

const canvas = document.getElementById("sheet-music");
const draw = new DrawMusic(canvas)

const drawTranslated = (panX, panY = 0) => {
  draw.clearAndPan(panX, panY)
  draw.staff()
  draw.notes(leftHand)
  draw.notes(rightHand)
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
}

const onMIDISuccess = midiAccess => {
  var inputs = midiAccess.inputs.values()
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMidiMessage
  }

  return $.get('api/claire', data => {
    leftHand = data.tracks[1]
    rightHand = data.tracks[2]
  })

}

const start = () => {
  navigator.requestMIDIAccess()
    .then(onMIDISuccess)
    .then(() => scroll(Date.now()))
}

start()
