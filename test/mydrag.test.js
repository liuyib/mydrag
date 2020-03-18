var Mydrag = require('../src/mydrag').default;
var should = require('should');

describe('src/mydrag.js', function() {
  it('function easeout has the correct return value.', function() {
    should(Mydrag.fn.easeout(0, 0, 0)).equal(undefined);
    should(Mydrag.fn.easeout(0, 10, 0)).equal(2);
    should(Mydrag.fn.easeout(0, 10, 10)).equal(1);
  });
});
