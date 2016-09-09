Mission: learn to play Claire de Lune smoothly, without looking at the keyboard, without memorizing the song (sightreading).

To do:
- read from a midi file!
- notes scroll across page
- scrolling pauses until you get the chord right
- played notes stay green
- show incorrect notes
- render accidentals
- skip unplayable notes (if not playing on full keyboard)
- hard mode: rewind one note when you mess up
- hard mode: don't rewind indefinitely, fuck lol, just 1 at most
- Bookmarks!!
- peek mode: show note (i.e., e flat 4) instead of circle when holding spacebar
- skipping to bookmark only resets played notes AFTER that tick, not all notes
- scoreboard: progress %
- enter key skips a note (there's one bug in the MIDI file that's impossible to play)
- white keys mode: determine which notes are white keys vs black keys
- hand modes: play only the left hand notes/right hand notes, skip the others
- differentiate hand mode: show which notes should be played w left hand vs right hand
- live updating control panel to toggle above modes
=== ABOVE THIS LINE IS DONE ===
- scoreboard: accuracy %
- scoreboard: timing %
- persist scores to backend
- persist bookmarks to backend, add new ones by clicking
- scoreboard: areas you fucked up the hardest, so you can play them over and over again. composite rating over all plays, weighting of each play rating decays with time
- bugfix: better detection of connected piano so I don't have to do the unplug/replug dance
- deploy on heroku or aws
=== THIS IS MVP, POST ON FB ===
- click and drag a section to loop playing that section for practice
- rock-band style timing window - you can only hit the notes after they cross a dotted line. solid line is perfect timing. last dotted line is pause point.
- modulate bpm according to midi data (show on scoreboard)
- determine note lengths from noteOff midi data and render
- bugfix: detect and fix impossible chords
- scaled mode: music-theory-aware algorithm that turns notes "off" for beginners. detects root note for a particular passage (mostly D flat for claire de lune, but sometimes I've seen G flat or A flat. dumbest thing that might work: look at left hand lowest note?) favoring root notes, major thirds, perfect fifths, & minor sevenths in chords and arpeggios. dynamically turns notes back on as you play better. goal is to play in time at any skill level.
