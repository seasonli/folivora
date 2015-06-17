/**
 * @fileoverview 检测 CSS 属性的浏览器支持情况(同时用于获取浏览器支持的 CSS 属性名)
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2013-07-09 | SeasonLi    // 初始版本
 *
 * @method checkCSS(cssProperty)    // 方法：检测 CSS 属性的浏览器支持情况(参阅下文详述)
 *   @param cssProperty {String}    // 参数：待检测的 CSS 属性(可选，默认为空)
 *   @return {String}               // 返回：基于源属性得到的当前浏览器支持的属性名
 *
 * @description    // 附加说明
 *   1) 本方法接受一个标准的 CSS 属性名(连字符拼接或驼峰形式)，之后通过添加浏览器特异的前缀来获得用户当前浏览器环境所支持的“同等功能”的 CSS 属性名；
 *      返回的 CSS 属性名可用于 jQuery.css() 等方法
 *   2) 如果用户当前浏览器不支持此 CSS 属性，则方法返回空字符串，据此可用于检测某 CSS 属性的受支持情况
 *
 * @example    // 典型的调用示例
    var checkCSS = require('util/checkCSS');

    checkCSS('background-image');    // 各浏览器下返回 'background-image' 或 'backgroundImage'
    checkCSS('backgroundImage');     // 各浏览器下返回 'background-image' 或 'backgroundImage'
    checkCSS('boxShadow');           // 现代浏览器下返回 'box-shadow' 或 'boxShadow'；IE 8 及更低版本下返回 ''
    checkCSS('transform');           // Chrome 35 下返回 '-webkit-transform'; Firefox 30 下返回 'transform'; IE 9 下返回 '-ms-transform'
 */

module.exports = function (cssProperty) {
  var testDiv = document.createElement('div'),
    browserPrefix = ['webkit', 'moz', 'o', 'ms'],
    supportedProperty = '';

  cssProperty = (typeof (cssProperty) == 'string' ? cssProperty : '').replace(/[A-Z]/g, function (upperCaseLetter) {
    return '-' + upperCaseLetter.toLowerCase();
  });

  var checkList = [cssProperty, cssProperty.replace(/-(\w)/g, function (_, firstLetter) {
    return firstLetter.toUpperCase();
  })];
  for (var i = 0; i < browserPrefix.length; ++i) {
    var _property = '-' + browserPrefix[i] + '-' + cssProperty,
      _ccProperty = _property.replace(/-(\w)/g, function (_, firstLetter) {
        return firstLetter.toUpperCase();
      });

    checkList.push(_property, _ccProperty);
  }

  for (var i = 0; i < checkList.length; ++i) {
    if (checkList[i] in testDiv.style) {
      supportedProperty = checkList[i];
      break;
    }
  }

  return supportedProperty;
};
