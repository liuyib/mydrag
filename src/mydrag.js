/**
 * @file        mydrag.js
 * @author      liuyib(https://github.com/liuyib)
 * @date        2020/3/15
 * @version     1.0.0
 * @description 拖动任意元素，自动吸附边缘
 */

(function(window) {
'use strict';

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
 *   1. Mydrag('#root');    |   new Mydrag('#root');
 *
 *   2. Mydrag('#root', {   |   new Mydrag('#root', {
 *        adsorb: false,    |         adsorb: false,
 *        rate: 10,         |         rate: 10,
 *        initX: 100,       |         initX: 100,
 *        initY: 100,       |         initY: 100,
 *        gap: 20,          |         gap: 20,
 *      });                 |       });
 */
var Mydrag = function (selector, options) {
  return new Mydrag.fn.init(selector, options);
};

// 用户可配置的 API
Mydrag.config = {
  adsorb: true,  // 是否自动吸附边缘
  rate: 5,       // 吸附动画的缓冲速率
  initX: 0,      // 初始 x 坐标（单位 px）
  initY: 0,      // 初始 y 坐标（单位 px）
  gap: 10,       // 安全边距   （单位 px）
};

// 事件名称
Mydrag.events = {
  TOUCH_START: 'touchstart',
  TOUCH_MOVE: 'touchmove',
  TOUCH_END: 'touchend',
};

Mydrag.fn = Mydrag.prototype = {
  constructor: Mydrag,
  init: function (selector, options) {
    this.elem = document.querySelector(selector);
    // 元素的 getBoundingClientRect 方法的返回值
    this.rect = null;

    // 配置参数
    this.config = this.mergeConfig(options);

    // 窗口尺寸
    // FIXME: 有些浏览器里，当旋转设备屏幕时，window.innerWidth / window.innerHeight 获取到的值不正确
    //    用 jQuery 的 width() / height() 就没问题
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;

    // 移动之前的坐标
    this.initX = 0;
    this.initY = 0;

    // 元素当前坐标
    this.x = 0;
    this.y = 0;

    // 元素坐标的限制范围
    this.limit = {
      l: 0, // left
      r: 0, // right
      t: 0, // top
      b: 0, // bottom
    };
    // 安全边距
    this.gap = this.config.gap;
    // 区域 ID（0：左上，1：右上，2：左下，3：右下）
    this.areaId = 0;

    this.initData();
    this.startListening();
  },
  /**
   * 初始化数据
   */
  initData() {
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
    this.initX = initX;
    this.initY = initY;
    this.setPos(initX, initY);
  },
  /**
   * 添加事件监听
   */
  startListening() {
    var isPassive = this.detectPassive();
    this.elem.addEventListener('touchstart', this);
    this.elem.addEventListener('touchmove', this, isPassive);
    this.elem.addEventListener('touchend', this);
  },
  /**
   * 移除事件监听
   */
  stopListener() {
    this.elem.removeEventListener('touchstart', this.moveStart);
    this.elem.removeEventListener('touchmove', this.moving);
    this.elem.removeEventListener('touchend', this.moveEnd);
  },
  /**
   * 被 EventListener 调用
   * 详见：https://developer.mozilla.org/zh-CN/docs/Web/API/EventListener
   *
   * @fires (User#touchstart | User#touchmove | User#touchend)
   * @param  {Object} e （必须）事件对象
   * @return {function(string, Object)} 立即执行函数
   */
  handleEvent(e) {
    return (function (eType, events) {
      switch (eType) {
        case events.TOUCH_START:
          /**
           * 用户触摸元素时触发
           *
           * @event User#touchstart
           * @param {Object} e （必须）事件对象
           */
          this.moveStart(e);
          break;
        case events.TOUCH_MOVE:
          /**
           * 用户移动元素时触发
           *
           * @event User#touchmove
           * @param {Object} e （必须）事件对象
           */
          this.moving(e);
          break;
        case events.TOUCH_END:
          /**
           * 用户释放元素时触发
           *
           * @event User#touchend
           * @param {Object} e （必须）事件对象
           */
          this.moveEnd(e);
          break;
        default:
          break;
      }
    }.bind(this))(e.type, Mydrag.events);
  },
  /**
   * 触摸元素时调用
   *
   * @param {Object} event （必须）事件对象
   */
  moveStart(event) {
    if (event.cancelable) event.preventDefault();
    var ev = (event.touches && event.touches[0]) || event || window.event;

    // 每次移动前的初始坐标是上一次移动后的坐标
    if (this.elem.newX) {
      this.initX = this.elem.newX;
    }
    if (this.elem.newY) {
      this.initY = this.elem.newY;
    }

    // 缓存 touchstart 时的坐标
    this.elem.oldX = ev.clientX;
    this.elem.oldY = ev.clientY;
  },
  /**
   * 移动元素时调用
   *
   * @param {Object} event （必须）事件对象
   */
  moving(event) {
    if (event.cancelable) event.preventDefault();
    var ev = (event.touches && event.touches[0]) || event || window.event;

    // 移动的距离
    var deltaX = ev.clientX - this.elem.oldX;
    var deltaY = ev.clientY - this.elem.oldY;

    // 元素当前坐标
    this.x = this.initX + deltaX;
    this.y = this.initY + deltaY;

    // 应用新坐标
    this.setPos(this.x, this.y);

    // 缓存新的坐标（被用作下一次移动之前的初始坐标）
    this.elem.newX = this.x;
    this.elem.newY = this.y;

    // 边缘检测
    this.detectEdge();

    // 区域检测
    this.detectArea();
  },
  /**
   * 释放元素时调用
   */
  moveEnd() {
    // 移除事件监听器
    this.stopListener();

    if (this.config.adsorb) {
      // 根据元素释放时所在的区域，判断要吸附的边缘
      var targetX = this.x;
      if (this.areaId === 0 || this.areaId === 2) {
        targetX = this.limit.l;
      } else if (this.areaId === 1 || this.areaId === 3) {
        targetX = this.limit.r;
      }
      var rate = this.config.rate;
      // 执行吸附动画
      this.easeout(this.x, targetX, rate, function (val) {
        this.x = val;
        this.elem.newX = val;
        this.setPos(this.x, this.y);
      }.bind(this));
    }
  },
  /**
   * 区域检测（屏幕均分为四个区域）
   */
  detectArea() {
    var centerX = this.winW / 2;
    var centerY = this.winH / 2;

    if (this.x < centerX && this.y < centerY) {
      this.areaId = 0;
    } else if (this.x > centerX && this.y < centerY) {
      this.areaId = 1;
    } else if (this.x < centerX && this.y > centerY) {
      this.areaId = 2;
    } else if (this.x > centerX && this.y > centerY) {
      this.areaId = 3;
    }
  },
  /**
   * 边缘检测
   */
  detectEdge() {
    var isOverflow = false;

    var elemL = this.x;
    var elemR = elemL + this.rect.width;
    var elemT = this.y;
    var elemB = elemT + this.rect.height;

    if (elemL <= this.gap) {
      isOverflow = true;
      this.x = this.limit.l;
    }
    if (elemR >= this.winW - this.gap) {
      isOverflow = true;
      this.x = this.limit.r;
    }
    if (elemT <= this.gap) {
      isOverflow = true;
      this.y = this.limit.t;
    }
    if (elemB >= this.winH - this.gap) {
      isOverflow = true;
      this.y = this.limit.b;
    }

    // 元素位置超出范围时进行限制
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
  setPos(x, y) {
    var newX = Math.round(1000 * x) / 1000;
    var newY = Math.round(1000 * y) / 1000;
    var val = [newX + 'px', newY + 'px', 0].join(',');

    this.elem.style.transform = 'translate3d(' + val + ')';
  },
  /**
   * EaseOut 动画算法
   *
   * @param {number} oldPos （必须）起始位置
   * @param {number} newPos （必须）目标位置
   * @param {number=} rate  （可选）缓动速率
   * @param {function(number, boolean)} callback （可选）位置变化的回调
   *    接收两个参数，param1：当前位置的值，param2：动画是否结束
   */
  easeout(oldPos, newPos, rate, callback) {
    if (oldPos === newPos) return;

    var a = oldPos || 0;
    var b = newPos || 0;
    var r = rate || 5;
    var reqId = null;
    var step = function () {
      a = a + (b - a) / r; // 算法核心

      if (Math.abs(b - a) < 1) {
        cancelAnimationFrame(reqId);
        callback && callback(b, true);
        return;
      }
      callback && callback(a, false);
      reqId = requestAnimationFrame(step);
    };
    step();
  },
  /**
   * 检测当前环境是否支持 addEventListener 的 passive 参数
   *
   * @return {(Object | boolean)} 当前环境支持 passive 参数时
   *    返回 { passive: false }，否则返回 false
   */
  detectPassive() {
    var passiveSupported = false;
    try {
      var options = Object.defineProperty({}, 'passive', {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null);
    // eslint-disable-next-line no-empty
    } catch (err) {}
    return passiveSupported ? { passive: false } : false;
  },
  /**
   * 合并配置参数
   *
   * @param {Object} options （必须）配置参数
   * @return {Object} 处理后的配置参数
   */
  mergeConfig(options) {
    var newOptions = JSON.parse(JSON.stringify(Mydrag.config));
    if (options) {
      for (var key in options) {
        var isOwnProperty =
          Object.prototype.hasOwnProperty.call(options, key);
        if (isOwnProperty) {
          var val = options[key];
          newOptions[key] = val;
        }
      }
    }
    return newOptions;
  }
};

Mydrag.fn.init.prototype = Mydrag.fn;

window.Mydrag = Mydrag;
})(window);
