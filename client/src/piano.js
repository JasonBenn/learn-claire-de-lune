export default class Piano {
  constructor(onMidiMessage) {
    this.onMidiMessage = onMidiMessage
    return navigator.requestMIDIAccess().then(this.listenForKeyboardEvents.bind(this))
  }

  listenForKeyboardEvents(midiAccess) {
    for (let input of midiAccess.inputs.values()) input.onmidimessage = this.onMidiMessage
  }
}
