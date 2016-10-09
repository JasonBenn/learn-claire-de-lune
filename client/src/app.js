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
// import midiFileParser from 'midi-file-parser'
import { parseArrayBuffer } from 'midi-json-parser'

const START_POINT = bookmarks[0]

const renderBookmark = (moments, settings, bookmark, i) => {
  const canvas = $(`<canvas data-bookmark='${bookmark}' width='1000px' height='400px' class="bookmark ${i}" />`)[0]
  $('.bookmarks').append(canvas)
  const draw = new DrawMusic(canvas, settings)
  draw.clearAndPan(-ticksToPx(bookmark) + 500)
  draw.staff()
  draw.moments(moments)
}

const binaryDownload = (url) => {
  const promise = $.Deferred()
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function(e) {
    if (this.status == 200) {
      promise.resolve(this.response)
    }
  };

  xhr.send()
  return promise
}

async function main() {
  const midiFile = await binaryDownload('https://s3-us-west-2.amazonaws.com/sight-reading-trainer/claire-de-lune.mid')
  // const midiFile = await $.get('https://s3-us-west-2.amazonaws.com/sight-reading-trainer/claire-de-lune.mid')

  // Ugh, this is a big clusterfuck. I could fork this library, make it work with ArrayBuffers, and hope that does it.
  // var midiJSON = midiFileParser(midiFile);


  // This has a better chance of working, I think. Pass the arrayBuffer to this lib.
  const midiJSON = await parseArrayBuffer(midiFile)
  const songReader = new SongReader(midiJSON)
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
