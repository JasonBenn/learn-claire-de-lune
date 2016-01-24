export default class Piano {
  constructor(onMidiMessage) {
    this.onMidiMessage = onMidiMessage
    return navigator.requestMIDIAccess().then(this.listenForKeyboardEvents.bind(this))
  }

  listenForKeyboardEvents(midiAccess) {
    var inputs = midiAccess.inputs.values()
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.onMidiMessage
    }
  }
}
