/**
 * This function turns a part of a given ArrayBuffer into a hexadecimal String.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var hexify = function hexify(dataView) {
    var offset = arguments[1] === undefined ? 0 : arguments[1];
    var length = arguments[2] === undefined ? dataView.byteLength - (offset - dataView.byteOffset) : arguments[2];
    return (function () {
        var hexArray, uint8Array;

        hexArray = [];
        offset += dataView.byteOffset;
        uint8Array = new Uint8Array(dataView.buffer, offset, length);

        for (var i = 0, _length = uint8Array.length; i < _length; i += 1) {
            var hex = uint8Array[i].toString(16).toUpperCase();

            if (hex.length === 1) {
                hex = 0 + hex;
            }

            hexArray[i] = hex;
        }

        return hexArray.join('');
    })();
};
exports.hexify = hexify;