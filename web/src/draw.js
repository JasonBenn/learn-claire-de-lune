import _, { each, range } from 'lodash'
import { keyNotOnPiano, midiKeyCodeToNoteCode, ticksToPx, colors } from './utils'

const STAFF_TOP = 100.5
const LEFT_BOUND = 0
const RIGHT_BOUND = 80000
const GAP_BETWEEN_LINES = 20
const NOTE_RADIUS = 10;

class Draw {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  circle(x, y, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, NOTE_RADIUS, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill()
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

  clearAndPan(panX, panY) {
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

  whiteKeysDistance(code) {
    const fromBaseKey = code - 77
    let inOctave = fromBaseKey % 12
    if (inOctave < 0) inOctave += 12 // mimics negative indices for an array of size 12.
    const outOfOctave = _.floor(fromBaseKey / 12) * 7
    return [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6][inOctave] + outOfOctave
  }

  note(noteNumber, color, time) {
    const noteTop = STAFF_TOP - this.whiteKeysDistance(noteNumber) * GAP_BETWEEN_LINES / 2
    this.circle(time, noteTop, color)
  }

  notes(notesList, offset = 0) {
    var px = 0
    notesList.forEach((midiNote, i) => {
      let { deltaTime, subtype, noteNumber, color = colors.BLACK } = midiNote
      px += ticksToPx(deltaTime)
      if (subtype === 'noteOn') {
        if (keyNotOnPiano(noteNumber)) color = colors.GRAY
        this.note(noteNumber, color, px - offset)
      }
    })
  }

}
