var expect = require('chai').expect;  
var isNumber = require('../../../src/utils').isNumber;

describe('utils::isXxx', function() {
  it('should validate Number', function() {
    expect(isNumber(123)).to.equal(true);
    expect(isNumber('123')).to.equal(false);
  });
});
