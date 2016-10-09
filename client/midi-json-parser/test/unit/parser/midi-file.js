'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _srcParserMidiFile = require('../../../src/parser/midi-file');

var midiFileParser = _interopRequireWildcard(_srcParserMidiFile);

var _helperLoadFixture = require('../../helper/load-fixture');

describe('midiFileParser', function () {

    describe('parseArrayBuffer()', function () {

        leche.withData([// eslint-disable-line no-undef
        ['because'], ['scale'], ['SubTractor 1'], ['SubTractor 2']], function (filename) {

            it('should parse the midi file', function (done) {
                this.timeout(6000);

                (0, _helperLoadFixture.loadFixtureAsJson)(filename + '.json', function (err, json) {
                    expect(err).to.be['null'];

                    (0, _helperLoadFixture.loadFixtureAsArrayBuffer)(filename + '.mid', function (err, arrayBuffer) {
                        expect(err).to.be['null'];

                        expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(json);

                        done();
                    });
                });
            });

            it('should refuse to parse a none midi file', function (done) {
                this.timeout(6000);

                (0, _helperLoadFixture.loadFixtureAsArrayBuffer)(filename + '.json', function (err, arrayBuffer) {
                    expect(err).to.be['null'];

                    expect(function () {
                        midiFileParser.parseArrayBuffer(arrayBuffer);
                    }).to['throw'](Error, 'Unexpected characters "{\n  " found instead of "MThd"');

                    done();
                });
            });
        });
    });
});