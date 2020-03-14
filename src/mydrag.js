(function() {
  'use strict';

  function Mydrag(elem, options) {
    this.elem = document.querySelector(elem);
    // 元素的 getBoundingClientRect 对象
    this.rect = null;

    // 配置参数
    this.config = this.mergeConfig(options);

    // 窗口尺寸
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;

    // 元素最初的坐标
    this.oldX = 0;
    this.oldY = 0;

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

    this.init();
  }

  window['Mydrag'] = Mydrag;

  // 用户可配置的 API
  Mydrag.config = {
    adsorb: true,  // 是否自动吸附边缘
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

  Mydrag.prototype = {
    init() {
      this.rect = this.elem.getBoundingClientRect();

      // 初始元素的坐标范围
      this.limit.l = this.gap;
      this.limit.r = this.winW - this.rect.width - this.gap;
      this.limit.t = this.gap;
      this.limit.b = this.winH - this.rect.height - this.gap;

      // 初始元素坐标
      this.setPos(this.config.initX, this.config.initY);

      // 监听鼠标事件
      this.startListening();
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
     * @param {Object} e 事件对象
     */
    handleEvent(e) {
      return (function (eType, events) {
        switch (eType) {
          case events.TOUCH_START:
            this.moveStart(e);
            break;
          case events.TOUCH_MOVE:
            this.moving(e);
            break;
          case events.TOUCH_END:
            this.moveEnd(e);
            break;
          default:
            break;
        }
      }.bind(this))(e.type, Mydrag.events);
    },
    /**
     * 触摸元素时调用
     * @param {Object} event 事件对象
     */
    moveStart(event) {
      var ev = (event.touches && event.touches[0]) || event;

      // 开始移动时的坐标
      this.oldX = this.oldX || ev.clientX;
      this.oldY = this.oldY || ev.clientY;
    },
    /**
     * 移动元素时调用
     * @param {Object} event 事件对象
     */
    moving(event) {
      var ev = (event.touches && event.touches[0]) || event;

      // 移动的距离
      var deltaX = ev.clientX - this.oldX;
      var deltaY = ev.clientY - this.oldY;

      // 元素当前坐标
      this.x = this.config.initX + deltaX;
      this.y = this.config.initY + deltaY;

      // 应用新坐标
      this.setPos(this.x, this.y);

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

      // 根据元素释放时所在的区域，判断要吸附的边缘
      var targetX = this.x;
      if (this.areaId === 0 || this.areaId === 2) {
        targetX = this.limit.l;
      } else if (this.areaId === 1 || this.areaId === 3) {
        targetX = this.limit.r;
      }
      // 执行吸附动画
      this.easeout(this.x, targetX, 4, function (val) {
        this.x = val;
        this.setPos(this.x, this.y);
      }.bind(this));
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
     * @param {number} x 横坐标
     * @param {number} y 竖坐标
     */
    setPos(x, y) {
      var newX = Math.round(1000 * x) / 1000;
      var newY = Math.round(1000 * y) / 1000;
      var val = [newX + 'px', newY + 'px', 0].join(',');

      this.elem.style.transform = 'translate3d(' + val + ')';
    },
    /**
     * EaseOut 动画算法
     * @param {number} oldPos 起始位置
     * @param {number} newPos 目标位置
     * @param {number} rate 缓动速率
     * @param {Function} callback 位置变化的回调
     *   接收两个参数。param1：当前位置的值，param2：动画是否结束
     */
    easeout(oldPos, newPos, rate, callback) {
      if (oldPos === newPos) return;

      var a = oldPos || 0;
      var b = newPos || 0;
      var r = rate || 2;
      var reqId = null;
      var step = function () {
        a = a + (b - a) / r; // 算法核心

        if (Math.abs(b - a) < 1) {
          cancelAnimationFrame(reqId);
          callback(b, true);
          return;
        }
        callback(a, false);
        reqId = requestAnimationFrame(step);
      };
      step();
    },
    /**
     * 检测当前环境是否支持 addEventListener 的 passive 参数
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
     * @param {Object} options 配置参数
     */
    mergeConfig(options) {
      var newOptions = Mydrag.config;
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
})();
