'use strict';

var _srcHelpersHexify = require('../../../src/helpers/hexify');

describe('hexify()', function () {

    var dataView;

    beforeEach(function () {
        var uint8Array = new Uint8Array([1, 2, 3]);

        dataView = new DataView(uint8Array.buffer);
    });

    it('should hexify the given buffer', function () {
        expect((0, _srcHelpersHexify.hexify)(dataView)).to.equal('010203');
    });

    it('should hexify the given buffer beginning at the given offset', function () {
        expect((0, _srcHelpersHexify.hexify)(dataView, 1)).to.equal('0203');
    });

    it('should hexify the given buffer with the specified lengtht', function () {
        expect((0, _srcHelpersHexify.hexify)(dataView, 0, 2)).to.equal('0102');
    });
});