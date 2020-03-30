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
    function mockDragStart() {
      var dragElem = document.querySelector('.drag');
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('touchstart', false, true);
      dragElem.dispatchEvent(evt);
    }

    Mydrag('.drag');
    // Drag when using default configuration.
    mockDragStart();

    Mydrag('.drag', { gap: 0 });
    // Drag when the gap parameter is set to zero.
    mockDragStart();
  });

  it('should work when `touchmove` event fired', function() {
    function mockDragMove() {
      var dragElem = document.querySelector('.drag');
      var evt1 = document.createEvent('HTMLEvents');
      var evt2 = document.createEvent('HTMLEvents');
      evt1.initEvent('touchstart', false, false);
      evt2.initEvent('touchmove', false, true);
      dragElem.dispatchEvent(evt1);
      dragElem.dispatchEvent(evt2);
    }

    Mydrag('.drag');
    // Drag when using default configuration.
    mockDragMove();
  });

  it('should work when `touchend` event fired', function() {
    function mockDrag() {
      var dragElem = document.querySelector('.drag');
      var evt1 = document.createEvent('HTMLEvents');
      var evt2 = document.createEvent('HTMLEvents');
      var evt3 = document.createEvent('HTMLEvents');
      evt1.initEvent('touchstart', false, false);
      evt2.initEvent('touchmove', false, false);
      evt3.initEvent('touchend', false, true);
      dragElem.dispatchEvent(evt1);
      dragElem.dispatchEvent(evt2);
      dragElem.dispatchEvent(evt3);
    }

    Mydrag('.drag');
    // Drag when using default configuration.
    mockDrag();

    Mydrag('.drag', { adsorb: false });
    // Drag when the adsorb parameter is set to false.
    mockDrag();
  });

  it('should work when `window.resize` event fired', function() {
    Mydrag('.drag');
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('resize', false, true);
    window.dispatchEvent(evt);
  });
});
