'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _parserMidiFile = require('../parser/midi-file');

var arrayBuffers = new Map();

exports['default'] = function (self) {
    self.addEventListener('message', function (_ref) {
        var _ref$data = _ref.data;
        var arrayBuffer = _ref$data.arrayBuffer;
        var byteIndex = _ref$data.byteIndex;
        var byteLength = _ref$data.byteLength;
        var index = _ref$data.index;

        var completeArrayBuffer, destination, length, source;

        completeArrayBuffer = arrayBuffers.get(index);

        if (completeArrayBuffer === undefined) {
            completeArrayBuffer = new ArrayBuffer(byteLength);
            arrayBuffers.set(index, completeArrayBuffer);
        }

        destination = new Uint8Array(completeArrayBuffer);
        length = Math.min(byteIndex + 1048576, byteLength);
        source = new Uint8Array(arrayBuffer);

        for (var i = byteIndex; i < length; i += 1) {
            destination[i] = source[i - byteIndex];
        }

        if (length === byteLength) {
            try {
                self.postMessage({
                    index: index,
                    midiFile: (0, _parserMidiFile.parseArrayBuffer)(completeArrayBuffer)
                });
            } catch (err) {
                self.postMessage({
                    err: {
                        message: err.message
                    },
                    index: index,
                    midiFile: null
                });
            }

            arrayBuffers['delete'](index);
        }
    });
};

module.exports = exports['default'];