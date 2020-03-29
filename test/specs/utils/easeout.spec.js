import { expect } from 'chai';
import { easeout } from '../../../src/utils';

describe('Mydrag::easeout', function() {
  it('should `undefined` when `oldPos === newPos`', function() {
    expect(easeout(0, 0, 0)).to.equal(undefined);
  });

  it('should a correct number when `rate` not a number', function() {
    expect(easeout(0, 10, '123')).to.equal(2);
  });

  it('should a correct number when `oldPos` not a number', function() {
    expect(easeout('123', 10, 5)).to.equal(2);
  });

  it('should a correct number when `newPos` not a number', function() {
    expect(easeout(10, '123', 5)).to.equal(8);
  });

  it('should `newPos` when calc value < `threshold`', function() {
    var THRESHOLD = 1;
    expect(easeout(0, 1, 5, THRESHOLD)).to.equal(1);
  });

  it('should `oldPos + (newPos - oldPos) / rate` when calc value > `threshold`', function() {
    var THRESHOLD = 1;
    expect(easeout(0, 5, 5, THRESHOLD)).to.equal(1);
  });

  it('should `oldPos + (newPos - oldPos) / rate` when calc value > `threshold`', function() {
    var THRESHOLD = 1;
    expect(easeout(5, 0, 5, THRESHOLD)).to.equal(4);
  });
});
