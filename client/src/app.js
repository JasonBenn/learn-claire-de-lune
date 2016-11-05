import 'normalize.css'
import './styles.scss'
import $ from 'jquery'
import Trainer from './trainer'
import Piano from './piano'
import SongReader from './song-reader'
import DrawMusic from './draw'
import ControlPane from './control-pane'
import { each, partial } from 'lodash'
import { uuid, ticksToPx, ifSpaceBar, ifEnter } from './utils'

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
  const draw = new DrawMusic(canvas, ::controlPane.settings)
  window.onresize = partial(requestAnimationFrame, ::draw.resizeCanvas)
  const trainer = new Trainer(draw, moments, ::controlPane.settings)
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

  const MAX_SCROLL = 2000  // Where does this come from?  Probably something to do with the longest layer (in this
  // case, the bg) and the window width.
  const $parallax = $('.parallax')[0]
  function scrollParallax() {
    $parallax.scrollLeft += 10
    if (!trainer.paused && $parallax.scrollLeft <= MAX_SCROLL) requestAnimationFrame(scrollParallax)
  }
  $('canvas').on('unpause', scrollParallax)
}

main()
