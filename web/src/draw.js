import _, { each, range } from 'lodash'
import { whiteKeysDistance, keyNotOnPiano, midiKeyCodeToNoteCode, ticksToPx, colors, shadeColor } from './utils'

const STAFF_TOP = 100.5
const LEFT_BOUND = 0
const RIGHT_BOUND = 80000
const GAP_BETWEEN_LINES = 20
const NOTE_RADIUS = 10;
const ACCIDENTAL_X_OFFSET = NOTE_RADIUS * 1.8
const ACCIDENTAL_FONT_SIZE = NOTE_RADIUS * 2.3

class Draw {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.ctx.font = ACCIDENTAL_FONT_SIZE + 'px serif'
    this.ctx.textBaseline = 'middle'
    this.ctx.textAlign = 'center'
  }

  prepareCircle(x, y, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, NOTE_RADIUS, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
  }

  circle(x, y, color) {
    this.prepareCircle(x, y, color)
    this.ctx.fill()
  }

  emptyCircle(x, y, color) {
    this.prepareCircle(x, y, shadeColor(color, 10))
    this.ctx.stroke()
  }

  line(x1, y1, x2, y2, color = '#000', lineWidth = 1) {
    this.ctx.strokeStyle = color
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawText(x, y, text, color) {
    this.ctx.fillStyle = color
    this.ctx.fillText(text, x, y)
  }

  clearAndPan(panX = 0, panY = 0) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.clear()
    this.ctx.translate(panX, panY)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}

export default class DrawMusic extends Draw {
  constructor(canvas) {
    super(canvas)
  }

  staff() {
    each(range(0, 5), step => {
      const y = STAFF_TOP + GAP_BETWEEN_LINES * step
      this.line(LEFT_BOUND, y, RIGHT_BOUND, y)
    })

    each(range(6, 11), step => {
      const y = STAFF_TOP + GAP_BETWEEN_LINES * step
      this.line(LEFT_BOUND, y, RIGHT_BOUND, y)
    })
  }

  divider(offset) {
    const x = this.canvasWidth / 2 - offset
    this.line(x, 0, x, this.canvasHeight)
  }

  drawNatural(x, y, color) {
    this.drawText(x, y, '♮', color)
  }

  note(noteNumber, color, time, accidental) {
    const noteTop = STAFF_TOP - whiteKeysDistance(noteNumber) * GAP_BETWEEN_LINES / 2
    if (accidental) this.drawNatural(time + ACCIDENTAL_X_OFFSET, noteTop, color)
    this.circle(time, noteTop, color)
  }

  peekedNote(noteNumber, color, time, accidental) {
    const noteTop = STAFF_TOP - whiteKeysDistance(noteNumber) * GAP_BETWEEN_LINES / 2
    if (accidental) this.drawNatural(time + ACCIDENTAL_X_OFFSET, noteTop, color)
    this.emptyCircle(time, noteTop, color)
    this.drawText(time, noteTop, midiKeyCodeToNoteCode(noteNumber), color)
  }

  moments(moments) {
    moments.forEach(({totalTicks, chord}) => {
      chord.forEach(({noteNumber, accidental, color = colors.BLACK}) => {
        if (keyNotOnPiano(noteNumber)) color = colors.GRAY
        this.note(noteNumber, color, ticksToPx(totalTicks), accidental)
      })
    })
  }

  peekedMoments(moments) {
    moments.forEach(({totalTicks, chord}) => {
      chord.forEach(({noteNumber, accidental, color = colors.BLACK}) => {
        if (keyNotOnPiano(noteNumber)) color = colors.GRAY
        this.peekedNote(noteNumber, color, ticksToPx(totalTicks), accidental)
      })
    })
  }

  notes(notesList, offset = 0) {
    var px = 0
    notesList.forEach((midiNote, i) => {
      let { deltaTime, subtype, noteNumber, accidental, color = colors.BLACK } = midiNote
      px += ticksToPx(deltaTime)
      if (subtype === 'noteOn') {
        if (keyNotOnPiano(noteNumber)) color = colors.GRAY
        this.note(noteNumber, color, px - offset, accidental)
      }
    })
  }

}
