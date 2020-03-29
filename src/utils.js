'use strict';

/**
 * 判断是否为数值
 *
 * @param {Object} val 待判断的值
 * @return {boolean} 如果是数值返回 true，否则返回 false
 */
export function isNumber(val) {
  return typeof val === 'number';
}

/**
 * 合并配置参数
 *
 * @param {Object} oldOpts 默认的配置参数
 * @param {Object} newOpts 传入的配置参数
 * @return {Object} 合并后的配置参数
 */
export function mergeConfig(oldOpts, newOpts) {
  var params = {};

  for (var key in oldOpts) {
    if (newOpts && newOpts[key] !== undefined) {
      params[key] = newOpts[key];
    } else {
      params[key] = oldOpts[key];
    }
  }

  return params;
}

/**
 * EaseOut 动画算法
 *
 * @param {number} oldPos （必须）起始位置
 * @param {number} newPos （必须）目标位置
 * @param {number=} rate  （可选）缓动速率
 * @return {number} 根据起始位置计算一次后的数值
 */
export function easeout(oldPos, newPos, rate, threshold) {
  if (oldPos === newPos) {
    return;
  }

  var a = (isNumber(oldPos) && oldPos) || 0;
  var b = (isNumber(newPos) && newPos) || 0;
  var r = (isNumber(rate) && rate) || 5;
  // 判定运动结束的阈值（当两次移动的距离差小于该值时，判定运动结束）
  var MOVE_END_THRESHOLD = (isNumber(threshold) && threshold) || 0.2;

  // 算法核心
  a = a + (b - a) / r;

  if (Math.abs(b - a) < MOVE_END_THRESHOLD) {
    return b;
  }

  return a;
}

/**
 * 获取浏览器中 Window 对象的宽高
 *
 * @return {Object} 返回以 width 和 height 为属性的对象
 * @example
 *
 * getWinSize().width
 *
 * getWinSize().height
 */
export function getWinSize() {
  var docElem = window.document.documentElement;
  return {
    width: docElem.clientWidth,
    height: docElem.clientHeight
  };
}

/**
 * 检测当前环境是否支持 addEventListener 的 passive 参数
 *
 * @return {(Object | boolean)} 当前环境支持 passive 参数时
 *    返回 { passive: false }，否则返回 false
 */
export function detectPassive() {
  var passive = false;

  try {
    var options = Object.defineProperty({}, 'passive', {
      get: function() {
        passive = true;
        return true;
      }
    });
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null);
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return passive ? { passive: false } : false;
}
