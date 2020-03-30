import { expect } from 'chai';
import Mydrag from '../src/mydrag';

describe('Mydrag class', function() {
  beforeEach(function() {
    document.body.innerHTML = '<div class="drag"></div>';
  });

  it('should work with `new`', function() {
    new Mydrag('.drag');
  });

  it('should work without `new`', function() {
    Mydrag('.drag');
  });

  it('should work with a empty `selector`', function() {
    Mydrag('.drag-not-exist');
  });

  it('should work width parameters', function() {
    Mydrag('.drag', {
      initX: 100,
      initY: 100,
      adsorb: false,
      rate: 10,
      gap: 20
    });
  });

  it('should work when `touchstart` event fired', function() {
    Mydrag('.drag');
    var dragElem = document.querySelector('.drag');
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('touchstart', false, false);
    dragElem.dispatchEvent(evt);
  });

  it('should work when `touchmove` event fired', function() {
    Mydrag('.drag');
    var dragElem = document.querySelector('.drag');
    var evt1 = document.createEvent('HTMLEvents');
    var evt2 = document.createEvent('HTMLEvents');
    evt1.initEvent('touchstart', false, false);
    evt2.initEvent('touchmove', false, false);
    dragElem.dispatchEvent(evt1);
    dragElem.dispatchEvent(evt2);
  });

  it('should work when `touchend` event fired', function() {
    Mydrag('.drag');
    var dragElem = document.querySelector('.drag');
    var evt1 = document.createEvent('HTMLEvents');
    var evt2 = document.createEvent('HTMLEvents');
    var evt3 = document.createEvent('HTMLEvents');
    evt1.initEvent('touchstart', false, false);
    evt2.initEvent('touchmove', false, false);
    evt3.initEvent('touchend', false, false);
    dragElem.dispatchEvent(evt1);
    dragElem.dispatchEvent(evt2);
    dragElem.dispatchEvent(evt3);
  });

  it('should work when `window.resize` event fired', function() {
    Mydrag('.drag');
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('resize', false, false);
    window.dispatchEvent(evt);
  });
});
