'use strict';

var _helperLoadFixture = require('../helper/load-fixture');

var _srcModule = require('../../src/module');

describe('midi-parser', function () {

    describe('parseArrayBuffer()', function () {

        leche.withData([// eslint-disable-line no-undef
        ['because'], ['scale'], ['SubTractor 1'], ['SubTractor 2']], function (filename) {

            it('should parse the midi file', function (done) {
                this.timeout(6000);

                (0, _helperLoadFixture.loadFixtureAsJson)(filename + '.json', function (err, json) {
                    expect(err).to.be['null'];

                    (0, _helperLoadFixture.loadFixtureAsArrayBuffer)(filename + '.mid', function (err, arrayBuffer) {
                        expect(err).to.be['null'];

                        (0, _srcModule.parseArrayBuffer)(arrayBuffer).then(function (midiFile) {
                            expect(midiFile).to.deep.equal(json);

                            done();
                        })['catch'](done);
                    });
                });
            });

            it('should refuse to parse a none midi file', function (done) {
                this.timeout(6000);

                (0, _helperLoadFixture.loadFixtureAsArrayBuffer)(filename + '.json', function (err, arrayBuffer) {
                    expect(err).to.be['null'];

                    (0, _srcModule.parseArrayBuffer)(arrayBuffer)['catch'](function (err) {
                        expect(err.message).to.equal('Unexpected characters "{\n  " found instead of "MThd"');

                        done();
                    });
                });
            });
        });
    });
});