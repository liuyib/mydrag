(function() {
  'use strict';

  function Mydrag(elem, options) {
    this.elem = document.querySelector(elem);
    this.config = this.mergeConfig(options);

    this.x = 0;
    this.y = 0;

    this.oldX = 0;
    this.oldY = 0;

    this.init();
  }

  window['Mydrag'] = Mydrag;

  Mydrag.config = {
    adsorb: true, // 是否自动吸附边缘
    initX: 0, // 初始 x 坐标
    initY: 0 // 初始 y 坐标
  };

  Mydrag.prototype = {
    init() {
      this.startListening();
    },
    /**
     * 添加事件监听
     */
    startListening() {
      var ctx = this;

      this.elem.addEventListener('touchstart', function(event) {
        var ev = event.touches[0] || event;

        // 开始移动时的坐标
        ctx.oldX = ctx.oldX || ev.clientX;
        ctx.oldY = ctx.oldY || ev.clientY;
      });

      this.elem.addEventListener(
        'touchmove',
        function(event) {
          var ev = event.touches[0] || event;

          // 移动的距离
          var deltaX = ev.clientX - ctx.oldX;
          var deltaY = ev.clientY - ctx.oldY;

          // 元素当前坐标
          var x = ctx.x + deltaX;
          var y = ctx.y + deltaY;

          // 应用新坐标
          ctx.setPos(x, y);

          ctx.log({ x, y });
        },
        ctx.detectPassive()
      );

      this.elem.addEventListener('touchend', function() {});
    },
    /**
     * 移除事件监听
     */
    stopListener() {
      this.elem.removeEventListener('touchstart');
      this.elem.removeEventListener('touchmove');
      this.elem.removeEventListener('touchend');
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
    },
    log(obj) {
      var log = document.querySelector('#log');
      var result = '';
      for (const key in obj) {
        var isOwnProperty =
          Object.prototype.hasOwnProperty.call(obj, key);
        if (isOwnProperty) {
          const val = obj[key];
          result += `${key}: ${val}\n`;
        }
      }
      log.value = result;
    }
  };
})();
