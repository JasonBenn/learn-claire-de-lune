# Claire de Lune
Plug your electronic piano into your computer with a USB-to-MIDI cable, get live feedback as you play the best song ever written. No music theory required, includes several difficulty levels.

Sure, there are many other apps for learning to play piano - but none are a) aesthetically beautiful, and b) free. This app is a passion project; an homage to my favorite song for piano.

## Features
* Correctly played notes are highlighted in green, incorrect notes are shown on the staff in red, and the sheet music will resume scrolling only once you’re playing the current chord or note correctly.
* Unplayable notes (i.e., beyond the edge of an electronic piano with fewer than 88 keys) are automatically bypassed.
* Left and right hand mode allow you to practice each hand independently.
* Differentiated hand mode visually distinguishes notes for the left hand from notes for the right hand.
* White keys mode (my personal favorite) will visually distinguish white keys from black keys. Makes the song _much_ easier to play.
* Hard mode forces you to replay the previous chord every time you make a mistake before allowing you to advance. The upshot is that you drill the transition from each chord to the next.
* Peek mode (hold the space bar) will display note values currently on the page.
* Bookmarks allow you to skip to the parts of the song you most need to work on.
* The enter key will allow you to skip to the next chord.
* A meter above the top right corner shows your progress.

## Roadmap
* Drill mode: by tracking the notes a player hits and misses (and how long the player waited before playing the chord correctly and any incorrect attempts), calculate the most difficult measures for a player and allow them to drill those sections repeatedly, until their weaknesses are transformed into strengths.
* Scaled mode: dynamically toggle notes to adapt to the player's skill so that they can always play in time, at the limit of their current ability, and still play something that sounds like Claire de Lune. The algorithm will be music-theory aware: the notes that will be disabled last are those that are most important to the sound of the chord or arpeggio, for example: the root and the third in an ordinary chord (which determines whether the chord has a major or minor sound), or the root and the fifth in an altered chord.
* An aesthetically beautiful experience: I'm looking to hire an animator to provide beautiful background art to scroll past the player as he plays the song; the foreground and midground would scroll at different rates to the background to provide the illusion of depth. I imagine a moonlit alpine lake :)
