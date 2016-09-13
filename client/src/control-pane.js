import $ from 'jquery'

export default class ControlPane {
  constructor() {
    this.updateSettings()
    $('.control-pane input, .control-pane select').change(::this.updateSettings)
  }

  updateSettings() {
    this.settingsCache = {
      hardMode: $('#hard-mode').prop('checked'),
      whiteKeysMode: $('#show-white-keys-mode').prop('checked'),
      handMode: $('#hand-mode').val()
    }
  }

  settings() {
    return this.settingsCache
  }
}
