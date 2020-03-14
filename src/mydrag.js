(function() {
  'use strict';

  function Mydrag(elem, options) {
    this.elem = document.querySelector(elem);
    this.rect = null;

    this.config = this.mergeConfig(options);

    this.x = 0;
    this.y = 0;

    this.oldX = 0;
    this.oldY = 0;

    this.isMove = false;

    this.init();
  }

  window['Mydrag'] = Mydrag;

  Mydrag.config = {
    adsorb: true, // 是否自动吸附边缘
    initX: 0, // 初始 x 坐标
    initY: 0 // 初始 y 坐标
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

      this.isMove = true;
    },
    moving(event) {
      if (!this.isMove) return;
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
    },
    moveEnd() {
      this.isMove = false;
      this.stopListener();
    },
    /**
     * 边缘检测
     */
    detectEdge() {
      var isOverflow = false;
      var winW = window.innerWidth;
      var winH = window.innerHeight;
      
      var elemL = this.x;
      var elemR = elemL + this.rect.width;
      var elemT = this.y;
      var elemB = elemT + this.rect.height;

      var limitL = 0;
      var limitR = winW - this.rect.width;
      var limitT = 0;
      var limitB = winH - this.rect.height;

      if (elemL <= 0) {
        isOverflow = true;
        this.x = limitL;
      }
      if (elemR >= winW) {
        isOverflow = true;
        this.x = limitR;
      }
      if (elemT <= 0) {
        isOverflow = true;
        this.y = limitT;
      }
      if (elemB >= winH) {
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
