import { expect } from 'chai';
import { isNumber } from '../../../src/utils';

describe('utils::isXxx', function() {
  it('should validate Number', function() {
    expect(isNumber(123)).to.equal(true);
    expect(isNumber('123')).to.equal(false);
  });
});
