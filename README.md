For practice reading music off a page, without looking at the keyboard.


Midi note subtypes:

type meta:
  trackName - "Piano right", "Piano left"
  copyrightNotice
  text
  timeSignature
  keySignature
  setTempo
  marker - ignore for now, eventually display up top
  endOfTrack

type channel:
  controller

programChange
noteOn
noteOff - eventually use a hash of stacks. first note goes on, when corresponding noteOff comes, figure out the duration and place it where the first note is.

snippet for getting info on note types:
console.table(_.uniq(_.flatten(data.tracks.map(track => track.filter(item => item.subtype === 'trackName')))))

TRACK NAME PIANO LEFT AND PIANO RIGHT!!


first track is all meta.
it has timeSignature, keySignature, and tons of setTempos.
setTempo has microsecondsPerBeat (div by 1000 to get milliseconds) and deltaTime.

track 1 - first event is trackName


How to translate deltaTime into absolute? Actually, don't. Keep a running state var of current place.
Just make it px, see how it feels.
