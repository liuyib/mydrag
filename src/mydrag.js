/**
 * @file        mydrag.js
 * @author      liuyib(https://github.com/liuyib)
 * @date        2020/3/15
 * @version     1.0.0
 * @description 拖动任意元素，自动吸附边缘
 */

'use strict';

import * as utils from './utils';

/**
 * Mydrag 类
 *
 * @param {string}  selector  （必须）元素的选择器
 * @param {Object=}  options  （可选）配置参数
 * @param {boolean=} options.adsorb  （可选）是否自动吸附边缘。默认 true。
 * @param {number=}  options.rate    （可选）吸附动画的缓冲速率。数值越大，缓冲动画执行越慢。默认 5。
 * @param {number=}  options.initX   （可选）初始 x 坐标。默认 0。
 * @param {number=}  options.initY   （可选）初始 y 坐标。默认 0。
 * @param {number=}  options.gap     （可选）安全边距。默认 10px。
 * @example
 *   1. Mydrag('#drag');    |   new Mydrag('#drag');
 *
 *   2. Mydrag('#drag', {   |   new Mydrag('#drag', {
 *        adsorb: false,    |         adsorb: false,
 *        rate: 10,         |         rate: 10,
 *        initX: 100,       |         initX: 100,
 *        initY: 100,       |         initY: 100,
 *        gap: 20,          |         gap: 20,
 *      });                 |       });
 */
var Mydrag = function(selector, options) {
  return new Mydrag.fn.init(selector, options);
};

// 用户可配置的 API
Mydrag.config = {
  adsorb: true, // 是否自动吸附边缘
  rate: 5, // 吸附动画的缓冲速率
  initX: 0, // 初始 x 坐标（单位 px）
  initY: 0, // 初始 y 坐标（单位 px）
  gap: 10 // 安全边距   （单位 px）
};

// 事件名称
Mydrag.events = {
  TOUCH_START: 'touchstart',
  TOUCH_MOVE: 'touchmove',
  TOUCH_END: 'touchend',
  RESIZE: 'resize'
};

Mydrag.fn = Mydrag.prototype = {
  constructor: Mydrag,
  init: function(selector, options) {
    this.elem = document.querySelector(selector);

    if (!this.elem) {
      console.error('Unable to find element by selector "' + selector + '"');
      return;
    }

    // 存储位置时，使用的 Key
    this.storeKey = selector;

    // 元素的 getBoundingClientRect 方法的返回值
    this.rect = null;

    // 配置参数
    this.config = utils.mergeConfig(Mydrag.config, options);

    // 窗口尺寸
    this.winW = utils.getWinSize().width;
    this.winH = utils.getWinSize().height;

    // 移动之前的坐标
    this.initX = 0;
    this.initY = 0;

    // 用户触摸元素时的坐标
    this.oldX = 0;
    this.oldY = 0;

    // 用户释放元素时的坐标
    this.newX = 0;
    this.newY = 0;

    // 元素当前坐标
    this.x = 0;
    this.y = 0;

    // 元素坐标的限制范围
    this.limit = {
      l: 0, // left
      r: 0, // right
      t: 0, // top
      b: 0 // bottom
    };

    // 安全边距
    this.gap = this.config.gap;

    // 是否处于屏幕左半区域
    this.isLeftArea = true;

    // 用户是否正在触摸元素
    this.isTouching = false;

    this.initData();
    this.addListening();
  },
  /**
   * 初始化数据
   */
  initData: function() {
    this.rect = this.elem.getBoundingClientRect();

    // 初始元素的坐标范围
    this.limit.l = this.gap;
    this.limit.r = this.winW - this.rect.width - this.gap;
    this.limit.t = this.gap;
    this.limit.b = this.winH - this.rect.height - this.gap;

    // 初始化元素坐标（超出范围时，使用初始值）
    var initX = this.config.initX;
    var initY = this.config.initY;

    if (initX < this.gap || initX > this.limit.r) {
      initX = Mydrag.config.initX + this.gap;
    }
    if (initY < this.gap || initY > this.limit.b) {
      initY = Mydrag.config.initY + this.gap;
    }

    this.initX = this.oldX = this.newX = initX;
    this.initY = this.oldY = this.newY = initY;
    this.setPos(initX, initY);

    // 恢复存储的元素位置
    this.gainPos();
  },
  /**
   * 添加事件监听
   */
  addListening: function() {
    var isPassive = utils.detectPassive();

    this.elem.addEventListener('touchstart', this);
    this.elem.addEventListener('touchmove', this, isPassive);
    this.elem.addEventListener('touchend', this);
    window.addEventListener('resize', this);
  },
  /**
   * 移除事件监听
   */
  removeListener: function() {
    this.elem.removeEventListener('touchstart', this.touchStart);
    this.elem.removeEventListener('touchmove', this.touchMove);
    this.elem.removeEventListener('touchend', this.touchEnd);
    window.removeEventListener('resize', this.resize);
  },
  /**
   * 被 EventListener 调用
   * 详见：https://developer.mozilla.org/zh-CN/docs/Web/API/EventListener
   *
   * @fires (User#touchstart | User#touchmove | User#touchend | Window#resize)
   * @param  {Object} e （必须）事件对象
   * @return {function(string, Object)} 立即执行函数
   */
  handleEvent: function(e) {
    return function(eType, events) {
      switch (eType) {
        case events.TOUCH_START:
          /**
           * 用户触摸元素时触发
           *
           * @event User#touchstart
           * @param {Object} e （必须）事件对象
           */
          this.touchStart(e);
          break;
        case events.TOUCH_MOVE:
          /**
           * 用户移动元素时触发
           *
           * @event User#touchmove
           * @param {Object} e （必须）事件对象
           */
          this.touchMove(e);
          break;
        case events.TOUCH_END:
          /**
           * 用户释放元素时触发
           *
           * @event User#touchend
           * @param {Object} e （必须）事件对象
           */
          this.touchEnd(e);
          break;
        case events.RESIZE:
          /**
           * 窗口大小改变时调用
           *
           * @event Window#resize
           */
          this.resize();
          break;
      }
    }.bind(this)(e.type, Mydrag.events);
  },
  /**
   * 触摸元素时调用
   *
   * @param {Object} event （必须）事件对象
   */
  touchStart: function(event) {
    if (event.cancelable) {
      event.preventDefault();
    }

    var ev = event.touches ? event.touches[0] : event;

    this.isTouching = true;

    // 每次移动前的初始坐标是上一次移动后的坐标
    if (this.newX) {
      this.initX = this.newX;
    }
    if (this.newY) {
      this.initY = this.newY;
    }

    // 缓存 touchstart 时的坐标
    this.oldX = ev.clientX;
    this.oldY = ev.clientY;
  },
  /**
   * 移动元素时调用
   *
   * @param {Object} event （必须）事件对象
   */
  touchMove: function(event) {
    if (!this.isTouching) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }

    var ev = event.touches ? event.touches[0] : event;

    // 移动的距离
    var deltaX = ev.clientX - this.oldX;
    var deltaY = ev.clientY - this.oldY;

    // 元素当前坐标
    this.x = this.initX + deltaX;
    this.y = this.initY + deltaY;

    // 边缘检测
    this.detectEdge();

    // 区域检测
    this.detectArea();

    // 应用新坐标
    this.setPos(this.x, this.y);

    // 缓存新的坐标（被用作下一次移动之前的初始坐标）
    this.newX = this.x;
    this.newY = this.y;
  },
  /**
   * 释放元素时调用
   */
  touchEnd: function() {
    if (!this.isTouching) {
      return;
    }

    this.isTouching = false;
    // 移除事件监听器
    this.removeListener();

    if (this.config.adsorb) {
      var targetX = 0;

      /* istanbul ignore next */
      if (this.isLeftArea) {
        targetX = this.limit.l;
      } else {
        targetX = this.limit.r;
      }

      var anime = function() {
        if (this.isTouching) {
          return;
        }

        var calcX = utils.easeout(this.x, targetX, this.config.rate);

        /* istanbul ignore else */
        if (calcX !== undefined) {
          this.x = calcX;
          this.newX = calcX;
          this.setPos(this.x, this.y);
          requestAnimationFrame(anime);
        } else {
          this.newX = targetX;
          this.savePos();
        }
      }.bind(this);

      anime();
    } else {
      this.savePos();
    }
  },
  /**
   * 窗口大小改变时调用
   */
  resize: function() {
    this.winW = utils.getWinSize().width;
    this.winH = utils.getWinSize().height;
    this.initData();
  },
  /**
   * 区域检测（屏幕均分为左右两个区域）
   */
  detectArea: function() {
    var winCenterX = this.winW / 2;
    var elemCenterX = this.x + this.rect.width / 2;

    this.isLeftArea = elemCenterX < winCenterX;
  },
  /**
   * 边缘检测
   */
  detectEdge: function() {
    var isOverflow = false;
    var elemL = this.x;
    var elemR = elemL + this.rect.width;
    var elemT = this.y;
    var elemB = elemT + this.rect.height;

    /* istanbul ignore if */
    if (elemL <= this.gap) {
      isOverflow = true;
      this.x = this.limit.l;
    }
    /* istanbul ignore if */
    if (elemR >= this.winW - this.gap) {
      isOverflow = true;
      this.x = this.limit.r;
    }
    /* istanbul ignore if */
    if (elemT <= this.gap) {
      isOverflow = true;
      this.y = this.limit.t;
    }
    /* istanbul ignore if */
    if (elemB >= this.winH - this.gap) {
      isOverflow = true;
      this.y = this.limit.b;
    }

    // 元素位置超出范围时进行限制
    /* istanbul ignore if */
    if (isOverflow) {
      this.setPos(this.x, this.y);
    }
  },
  /**
   * 设置当前坐标
   *
   * @param {number} x （必须）横坐标
   * @param {number} y （必须）竖坐标
   */
  setPos: function(x, y) {
    var newX = Math.round(1000 * x) / 1000;
    var newY = Math.round(1000 * y) / 1000;
    var val = [newX + 'px', newY + 'px'].join(',');

    this.elem.style.transform = 'translate(' + val + ')';
  },
  /**
   * 存储元素位置
   */
  savePos: function() {
    var x = parseInt(this.x, 10);
    var y = parseInt(this.y, 10);
    localStorage.setItem('Mydarg_' + this.storeKey + '_x', x);
    localStorage.setItem('Mydarg_' + this.storeKey + '_y', y);
  },
  /**
   * 恢复元素位置
   */
  gainPos: function() {
    var x = localStorage.getItem('Mydarg_' + this.storeKey + '_x');
    var y = localStorage.getItem('Mydarg_' + this.storeKey + '_y');

    if (x !== null) {
      this.newX = parseInt(x, 10);
    }
    if (y !== null) {
      this.newY = parseInt(y, 10);
    }

    this.setPos(this.newX, this.newY);
  }
};

Mydrag.fn.init.prototype = Mydrag.fn;

export default Mydrag;
