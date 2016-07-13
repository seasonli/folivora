/**
 * @fileoverview 浏览器类型判断
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-03 | SeasonLi    // 初始版本，引自 tangram.
 * @version 1.1 | 2014-07-15 | SeasonLi    // 添加对 IE 11 的支持
 * @version 1.2 | 2014-09-04 | SeasonLi    // 完善注释
 * @version 1.3 | 2014-10-14 | SeasonLi    // 修改接口的“属性”方式为“函数”的方式，避免不必要逻辑的执行
 *
 * @method chrome()                // 方法：检测浏览器是否为 Chrome.
 *   @param No                     // 参数：无
 *   @return {Number|undefined}    // 返回：Chrome 版本号(非 Chrome 浏览器返回 undefined)
 *
 * @method firefox()               // 方法：检测浏览器是否为 Firefox.
 *   @param No                     // 参数：无
 *   @return {Number|undefined}    // 返回：Firefox 版本号(非 Firefox 浏览器返回 undefined)
 *
 * @method ie()                    // 方法：检测浏览器是否为 IE.
 *   @param No                     // 参数：无
 *   @return {Number|undefined}    // 返回：IE 版本号(非 IE 浏览器返回 undefined)
 *
 * @method safari()                // 方法：检测浏览器是否为 Safari.
 *   @param No                     // 参数：无
 *   @return {Number|undefined}    // 返回：Safari 版本号(非 Safari 浏览器返回 undefined)
 *
 * @method isStandard()    // 方法：检测文档是否启用“标准模式”渲染
 *   @param No             // 参数：无
 *   @return {Boolean}     // 返回：检测结果
 *
 * @method isGecko()      // 方法：检测浏览器的排版引擎是否为 gecko.
 *   @param No            // 参数：无
 *   @return {Boolean}    // 返回：检测结果
 *
 * @method isWebkit()     // 方法：检测浏览器的排版引擎是否为 webkit.
 *   @param No            // 参数：无
 *   @return {Boolean}    // 返回：检测结果
 *
 * @description    // 附加说明
 *   1) 本方法用于检测浏览器类型及渲染模式、排版引擎等；相应的浏览器检测方法返回检测到的浏览器版本号；
 *      不匹配的浏览器类型字段值为 undefined (请参阅示例)
 *
 * @example    // 典型的调用示例
    var browser = require('util/browser');

    browser.chrome();        // 39
    browser.firefox();       // undefined
    browser.ie();            // undefined
    browser.safari();        // undefined
    browser.isGecko();       // false
    browser.isStandard();    // true
    browser.isWebkit();      // true
 */

var ua = navigator.userAgent;

module.exports = {
  chrome: function () {
    return /chrome\/(\d+\.\d+)/i.test(ua) ? +RegExp.$1 : undefined;
  },
  firefox: function () {
    return /firefox\/(\d+\.\d+)/i.test(ua) ? +RegExp.$1 : undefined;
  },
  ie: function () {
    return /(?:msie |rv:)(\d+\.\d+)/i.test(ua) ? (document.documentMode || +RegExp.$1) : undefined;
  },
  safari: function () {
    return /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp.$1 || RegExp.$2) : undefined;
  },
  isStandard: function () {
    return document.compatMode == "CSS1Compat";
  },
  isGecko: function () {
    return /gecko/i.test(ua) && !/like gecko/i.test(ua);
  },
  isWebkit: function () {
    return /webkit/i.test(ua);
  }
};
