import 'normalize.css'
import './styles.scss'
import $ from 'jquery'
import Trainer from './trainer'
import Piano from './piano'
import SongReader from './song-reader'
import DrawMusic from './draw'
import { each, partial } from 'lodash'
import { ticksToPx } from './utils'

const bookmarks = [19680, 26640, 31200, 34920]

const renderBookmark = (moments, bookmark, i) => {
  const canvas = $(`<canvas data-bookmark='${bookmark}' width='1000px' height='400px' class="bookmark ${i}" />`)[0]
  $('.bookmarks').append(canvas)
  const draw = new DrawMusic(canvas)
  draw.clearAndPan(-ticksToPx(bookmark) + 500)
  draw.staff()
  draw.moments(moments)
}

async function main() {
  const midiData = await $.get('api/claire')
  const songReader = new SongReader(midiData)
  const moments = Array.from(songReader)
  const canvas = document.getElementById("sheet-music")
  const trainer = new Trainer(canvas, moments)
  new Piano(::trainer.onMidiMessage)
  each(bookmarks, partial(renderBookmark, moments))
  $('.bookmarks').on('click', 'canvas', function(e) {
    trainer.setToTick($(this).data('bookmark'))
    trainer.resetColors()
  })
}

main()
