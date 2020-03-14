(function() {
  'use strict';

  function Mydrag(elem, options) {
    this.elem = document.querySelector(elem);
    this.rect = null;

    this.config = this.mergeConfig(options);

    this.winW = window.innerWidth;
    this.winH = window.innerHeight;

    this.x = 0;
    this.y = 0;

    this.oldX = 0;
    this.oldY = 0;

    this.gap = this.config.gap; // 安全边距
    this.areaId = 0;  // 区域 ID（0：左上，1：右上，2：左下，3：右下）

    this.init();
  }

  window['Mydrag'] = Mydrag;

  Mydrag.config = {
    adsorb: true, // 是否自动吸附边缘
    initX: 0, // 初始 x 坐标（单位 px）
    initY: 0, // 初始 y 坐标（单位 px）
    gap: 10,  // 安全边距（单位 px）
  };

  Mydrag.events = {
    TOUCH_START: 'touchstart',
    TOUCH_MOVE: 'touchmove',
    TOUCH_END: 'touchend'
  };

  Mydrag.prototype = {
    init() {
      this.rect = this.elem.getBoundingClientRect();

      // 初始元素坐标
      this.setPos(this.config.initX, this.config.initY);

      // 开始监听鼠标事件
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
    moveStart(event) {
      var ev = (event.touches && event.touches[0]) || event;

      // 开始移动时的坐标
      this.oldX = this.oldX || ev.clientX;
      this.oldY = this.oldY || ev.clientY;
    },
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
    moveEnd() {
      this.stopListener();
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
        this.areaId = 2;
      } else if (this.x < centerX && this.y > centerY) {
        this.areaId = 3;
      } else if (this.x > centerX && this.y > centerY) {
        this.areaId = 4;
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

      var limitL = this.gap;
      var limitR = this.winW - this.rect.width - this.gap;
      var limitT = this.gap;
      var limitB = this.winH - this.rect.height - this.gap;

      if (elemL <= this.gap) {
        isOverflow = true;
        this.x = limitL;
      }
      if (elemR >= this.winW - this.gap) {
        isOverflow = true;
        this.x = limitR;
      }
      if (elemT <= this.gap) {
        isOverflow = true;
        this.y = limitT;
      }
      if (elemB >= this.winH - this.gap) {
        isOverflow = true;
        this.y = limitB;
      }

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
