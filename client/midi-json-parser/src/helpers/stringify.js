/**
 * This function turns a part of a given ArrayBuffer into a String.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var stringify = function stringify(dataView) {
    var offset = arguments[1] === undefined ? 0 : arguments[1];
    var length = arguments[2] === undefined ? dataView.byteLength - (offset - dataView.byteOffset) : arguments[2];
    return (function () {
        var array;

        offset += dataView.byteOffset;
        array = new Uint8Array(dataView.buffer, offset, length);

        return String.fromCharCode.apply(null, array);
    })();
};
exports.stringify = stringify;