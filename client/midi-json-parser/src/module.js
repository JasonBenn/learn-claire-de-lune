'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _workerMidiJsonParser = require('./worker//midi-json-parser');

var _workerMidiJsonParser2 = _interopRequireDefault(_workerMidiJsonParser);

var _webworkify = require('webworkify');

var _webworkify2 = _interopRequireDefault(_webworkify);

var worker = (0, _webworkify2['default'])(_workerMidiJsonParser2['default']);

var index = 0;

var parseArrayBuffer = function parseArrayBuffer(arrayBuffer) {
    var currentIndex = index;

    index += 1;

    var transferSlice = function transferSlice(byteIndex) {
        var slice;

        if (byteIndex + 1048576 < arrayBuffer.byteLength) {
            slice = arrayBuffer.slice(byteIndex, byteIndex + 1048576);

            worker.postMessage({
                arrayBuffer: slice,
                byteIndex: byteIndex,
                byteLength: arrayBuffer.byteLength,
                index: currentIndex
            }, [slice]);

            setTimeout(function () {
                return transferSlice(byteIndex + 1048576);
            });
        } else {
            slice = arrayBuffer.slice(byteIndex);

            worker.postMessage({
                arrayBuffer: slice,
                byteIndex: byteIndex,
                byteLength: arrayBuffer.byteLength,
                index: currentIndex
            }, [slice]);
        }
    };

    return new Promise(function (resolve, reject) {
        var onMessage = function onMessage(_ref) {
            var data = _ref.data;

            if (data.index === currentIndex) {
                worker.removeEventListener('message', onMessage);

                if (data.midiFile === null) {
                    reject(new Error(data.err.message));
                } else {
                    resolve(data.midiFile);
                }
            }
        };

        worker.addEventListener('message', onMessage);

        transferSlice(0);
    });
};
exports.parseArrayBuffer = parseArrayBuffer;