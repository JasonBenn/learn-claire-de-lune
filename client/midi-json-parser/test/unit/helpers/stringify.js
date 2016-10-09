'use strict';

var _srcHelpersStringify = require('../../../src/helpers/stringify');

describe('stringify()', function () {

    var dataView;

    beforeEach(function () {
        var uint8Array = new Uint8Array([65, 66, 67]);

        dataView = new DataView(uint8Array.buffer);
    });

    it('should stringify the given buffer', function () {
        expect((0, _srcHelpersStringify.stringify)(dataView)).to.equal('ABC');
    });

    it('should stringify the given buffer beginning at the given offset', function () {
        expect((0, _srcHelpersStringify.stringify)(dataView, 1)).to.equal('BC');
    });

    it('should stringify the given buffer with the specified lengtht', function () {
        expect((0, _srcHelpersStringify.stringify)(dataView, 0, 2)).to.equal('AB');
    });
});