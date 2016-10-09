import 'normalize.css'
import './styles.scss'
import $ from 'jquery'
import Trainer from './trainer'
import Piano from './piano'
import SongReader from './song-reader'
import DrawMusic from './draw'
import ControlPane from './control-pane'
import { each, partial } from 'lodash'
import { ticksToPx, ifSpaceBar, ifEnter } from './utils'

if (!bookmarks.length) bookmarks = [0]
const START_POINT = bookmarks[0]

const renderBookmark = (moments, settings, bookmark, i) => {
  const canvas = $(`<canvas data-bookmark='${bookmark}' width='1000px' height='400px' class="bookmark ${i}" />`)[0]
  $('.bookmarks').append(canvas)
  const draw = new DrawMusic(canvas, settings)
  draw.clearAndPan(-ticksToPx(bookmark) + 500)
  draw.staff()
  draw.moments(moments)
}

async function main() {
  const midiJSON = await $.get('https://s3-us-west-2.amazonaws.com/sight-reading-trainer/claire-de-lune.json')
  const songReader = new SongReader(JSON.parse(midiJSON))
  const moments = Array.from(songReader)
  const canvas = document.getElementById("sheet-music")
  const controlPane = new ControlPane()
  const trainer = new Trainer(canvas, moments, ::controlPane.settings)
  window.trainer = trainer
  new Piano(::trainer.onMidiMessage)
  trainer.setToTick(START_POINT)
  each(bookmarks, partial(renderBookmark, moments, ::controlPane.settings))
  $('.bookmarks').on('click', 'canvas', function(e) {
    trainer.setToTick($(this).data('bookmark'))
  })
  $('#sheet-music').click(::trainer.logCurrentDeltaTime)
  $(document).keydown(partial(ifSpaceBar, ::trainer.activatePeekMode))
  $(document).keyup(partial(ifSpaceBar, ::trainer.deactivatedPeekMode))
  $(document).keydown(partial(ifEnter, ::trainer.updateChord))
}

main()
