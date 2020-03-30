import { expect } from 'chai';
import { getWinSize } from '../../../src/utils';

describe('utils::getWinSize', function() {
  it('should correct width of window', function() {
    var docElem = window.document.documentElement;
    expect(getWinSize().width).to.equal(docElem.clientWidth);
  });

  it('should correct height of window', function() {
    var docElem = window.document.documentElement;
    expect(getWinSize().height).to.equal(docElem.clientHeight);
  });
});
