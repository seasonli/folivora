/**
 * @fileoverview cookie
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-08-25 | SeasonLi    // 初始版本
 *
 * @method get(key)         // 方法：按 cookie 的键名获取其值
 *   @param key {String}    // 参数：key（必选）
 *   @return {String}       // 返回：value
 *
 * @method set(key, value, option)    // 方法：按 cookie 的键名设定其值
 *   @param key {String}              // 参数：key（必选）
 *   @param value {String}            // 参数：value（必选）
 *   @param option {Object}           // 参数：选项（可选）
 *          expires {Number}          // 参数：生命周期（可选），即该 cookie生命周期，单位毫秒，不传则关闭浏览器该 cookie 失效
 *          path {String}             // 参数：cookie 所在目录（可选），不传则为空，及该域名下所有路径都可以访问到该 cookie
 *   @return no                       // 返回：无
 *
 * @method remove(key)      // 方法：按 cookie 的键名删除
 *   @param key {String}    // 参数：key（必选）
 *   @return no             // 返回：无
 */


var cookie = {};

cookie._isValidKey = function (key) {
  return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
};

cookie.setRaw = function (key, value, options) {
  if (!cookie._isValidKey(key)) {
    return;
  }
  options = options || {};
  var expires = options.expires;
  if ('number' == typeof options.expires) {
    expires = new Date();
    expires.setTime(expires.getTime() + options.expires);
  }
  document.cookie = key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : '');
};

cookie.getRaw = function (key) {
  if (cookie._isValidKey(key)) {
    var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
      result = reg.exec(document.cookie);
    if (result) {
      return result[2] || null;
    }
  }
  return null;
};

cookie.get = function (key) {
  var value = cookie.getRaw(key);
  if ('string' == typeof value) {
    value = decodeURIComponent(value);
    return value;
  }
  return null;
};

cookie.set = function (key, value, options) {
  cookie.setRaw(key, encodeURIComponent(value), options);
};

cookie.remove = function (key, options) {
  options = options || {};
  options.expires = new Date(0);
  cookie.setRaw(key, '', options);
};


module.exports = cookie;