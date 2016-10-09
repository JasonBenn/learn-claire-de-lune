'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _helpersHexify = require('../helpers/hexify');

var _helpersStringify = require('../helpers/stringify');

var parseArrayBuffer = function parseArrayBuffer(arrayBuffer) {
    var dataView, header, offset, tracks;

    dataView = new DataView(arrayBuffer);

    header = _parseHeaderChunk(dataView);

    offset = 14;
    tracks = [];

    for (var i = 0, _length = header.numberOfTracks; i < _length; i += 1) {
        var track = undefined;

        var _parseTrackChunk2 = _parseTrackChunk(dataView, offset);

        offset = _parseTrackChunk2.offset;
        track = _parseTrackChunk2.track;

        tracks.push(track);
    }

    return {
        division: header.division,
        format: header.format,
        tracks: tracks
    };
};

exports.parseArrayBuffer = parseArrayBuffer;
var _parseEvent = function _parseEvent(dataView, offset, lastEvent) {
    var delta, eventTypeByte, result;

    var _readVariableLengthQuantity2 = _readVariableLengthQuantity(dataView, offset);

    offset = _readVariableLengthQuantity2.offset;
    delta = _readVariableLengthQuantity2.value;

    offset += 1;

    eventTypeByte = dataView.getUint8(offset);

    if (eventTypeByte === 240) {
        result = _parseSysexEvent(dataView, offset + 1);
    } else if (eventTypeByte === 255) {
        result = _parseMetaEvent(dataView, offset + 1);
    } else {
        result = _parseMidiEvent(eventTypeByte, dataView, offset + 1, lastEvent);
    }

    result.event.delta = delta;

    return result;
};

var _parseHeaderChunk = function _parseHeaderChunk(dataView) {
    var division, format, numberOfTracks;

    if ((0, _helpersStringify.stringify)(dataView, 0, 4) !== 'MThd') {
        throw new Error('Unexpected characters "' + (0, _helpersStringify.stringify)(dataView, 0, 4) + '" found instead of "MThd"');
    }

    if (dataView.getUint32(4) !== 6) {
        throw new Error('The header has an unexpected length of ' + dataView.getUint32(4) + ' instead of 6');
    }

    format = dataView.getUint16(8);
    numberOfTracks = dataView.getUint16(10);
    division = dataView.getUint16(12);

    return {
        division: division,
        format: format,
        numberOfTracks: numberOfTracks
    };
};

var _parseMetaEvent = function _parseMetaEvent(dataView, offset) {
    var event, length, metaTypeByte;

    metaTypeByte = dataView.getUint8(offset);

    var _readVariableLengthQuantity3 = _readVariableLengthQuantity(dataView, offset + 1);

    offset = _readVariableLengthQuantity3.offset;
    length = _readVariableLengthQuantity3.value;

    if (metaTypeByte === 3) {
        event = {
            trackName: (0, _helpersStringify.stringify)(dataView, offset + 1, length)
        };
    } else if (metaTypeByte === 32) {
        event = {
            channelPrefix: dataView.getUint8(offset + 1)
        };
    } else if (metaTypeByte === 33) {
        event = {
            midiPort: dataView.getUint8(offset + 1)
        };
    } else if (metaTypeByte === 47) {

        // @todo length must be 0

        event = {
            endOfTrack: true
        };
    } else if (metaTypeByte === 81) {

        // @todo length must be 5

        event = {
            setTempo: {
                microsecondsPerBeat: (dataView.getUint8(offset + 1) << 16) + (dataView.getUint8(offset + 2) << 8) + dataView.getUint8(offset + 3) // eslint-disable-line no-bitwise
            }
        };
    } else if (metaTypeByte === 84) {
        var frameRate = undefined,
            hourByte = undefined;

        // @todo length must be 5

        hourByte = dataView.getUint8(offset + 1);

        if ((hourByte & 96) === 0) {
            // eslint-disable-line no-bitwise
            frameRate = 24;
        } else if ((hourByte & 96) === 32) {
            // eslint-disable-line no-bitwise
            frameRate = 25;
        } else if ((hourByte & 96) === 64) {
            // eslint-disable-line no-bitwise
            frameRate = 29;
        } else if ((hourByte & 96) === 96) {
            // eslint-disable-line no-bitwise
            frameRate = 30;
        }

        event = {
            smpteOffset: {
                frame: dataView.getUint8(offset + 4),
                frameRate: frameRate,
                hour: hourByte & 31, // eslint-disable-line no-bitwise
                minutes: dataView.getUint8(offset + 2),
                seconds: dataView.getUint8(offset + 3),
                subFrame: dataView.getUint8(offset + 5)
            }
        };
    } else if (metaTypeByte === 88) {
        event = {
            timeSignature: {
                denominator: Math.pow(2, dataView.getUint8(offset + 2)),
                metronome: dataView.getUint8(offset + 3),
                numerator: dataView.getUint8(offset + 1),
                thirtyseconds: dataView.getUint8(offset + 4)
            }
        };
    } else if (metaTypeByte === 89) {

        // @todo length must be 2

        event = {
            keySignature: {
                key: dataView.getInt8(offset + 1),
                scale: dataView.getInt8(offset + 2)
            }
        };
    } else {
        throw new Error('Cannot parse a meta event with a type of "' + metaTypeByte.toString(16) + '"');
    }

    return {
        event: event,
        offset: offset + length + 1
    };
};

var _parseMidiEvent = function _parseMidiEvent(statusByte, dataView, offset, lastEvent) {
    var event,
        eventType = statusByte >> 4; // eslint-disable-line no-bitwise

    if ((statusByte & 128) === 0) {
        // eslint-disable-line no-bitwise
        offset -= 1;
    } else {
        lastEvent = null;
    }

    if (eventType === 8 || lastEvent !== null && lastEvent.noteOff !== undefined) {
        event = {
            noteOff: {
                noteNumber: dataView.getUint8(offset),
                velocity: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 9 || lastEvent !== null && lastEvent.noteOn !== undefined) {
        var noteNumber = undefined,
            velocity = undefined;

        noteNumber = dataView.getUint8(offset);
        velocity = dataView.getUint8(offset + 1);

        if (velocity === 0) {
            event = {
                noteOff: {
                    noteNumber: noteNumber,
                    velocity: velocity
                }
            };
        } else {
            event = {
                noteOn: {
                    noteNumber: noteNumber,
                    velocity: velocity
                }
            };
        }

        offset += 2;
    } else if (eventType === 11 || lastEvent !== null && lastEvent.controlChange !== undefined) {
        event = {
            controlChange: {
                type: dataView.getUint8(offset),
                value: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 12 || lastEvent !== null && lastEvent.programChange !== undefined) {
        event = {
            programChange: {
                programNumber: dataView.getUint8(offset)
            }
        };

        offset += 1;
    } else if (eventType === 14 || lastEvent !== null && lastEvent.pitchBend !== undefined) {
        event = {
            pitchBend: dataView.getUint8(offset) | dataView.getUint8(offset + 1) << 7 // eslint-disable-line no-bitwise
        };

        offset += 2;
    } else {
        throw new Error('Cannot parse a midi event with a type of "' + eventType.toString(16) + '"');
    }

    event.channel = statusByte & 15; // eslint-disable-line no-bitwise

    return { event: event, offset: offset };
};

var _parseSysexEvent = function _parseSysexEvent(dataView, offset) {
    var length;

    var _readVariableLengthQuantity4 = _readVariableLengthQuantity(dataView, offset);

    offset = _readVariableLengthQuantity4.offset;
    length = _readVariableLengthQuantity4.value;

    return {
        event: {
            sysex: (0, _helpersHexify.hexify)(dataView, offset + 1, length)
        },
        offset: offset + length + 1
    };
};

var _parseTrackChunk = function _parseTrackChunk(dataView, offset) {
    var event, events, length;

    if ((0, _helpersStringify.stringify)(dataView, offset, 4) !== 'MTrk') {
        throw new Error('Unexpected characters "' + (0, _helpersStringify.stringify)(dataView, offset, 4) + '" found instead of "MTrk"');
    }

    event = null;
    events = [];
    length = dataView.getUint32(offset + 4) + offset + 8;
    offset += 8;

    while (offset < length) {
        var _parseEvent2 = _parseEvent(dataView, offset, event);

        event = _parseEvent2.event;
        offset = _parseEvent2.offset;

        events.push(event);
    }

    return {
        offset: offset,
        track: events
    };
};

var _readVariableLengthQuantity = function _readVariableLengthQuantity(dataView, offset) {
    var value = 0;

    while (true) {
        var byte = dataView.getUint8(offset);

        if (byte & 128) {
            // eslint-disable-line no-bitwise
            value += byte & 127; // eslint-disable-line no-bitwise
            value <<= 7; // eslint-disable-line no-bitwise
            offset += 1;
        } else {
            value += byte;

            return {
                offset: offset,
                value: value
            };
        }
    }
};