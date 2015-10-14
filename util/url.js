/**
 * @fileoverview 有关 url 的扩展工具方法
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-11 | SeasonLi    // 初始版本
 *
 * @method queryToJson(url, shouldDecode)    // 方法：将编码在 url query 中的数据转换成 json 格式
 *   @param url {String}                     // 参数：url 或其 query 部分(可选，默认为空)
 *   @param shouldDecode {Boolean}           // 参数：指示是否对 query 部分进行 decodeURIComponent 解码(可选，默认值：false；请参阅下文详述)
 *   @return {Object}                        // 返回：编码成 json 格式的数据
 *
 * @description    // 附加说明
 *   1) queryToJson() 方法在参数 shouldDecode 为 true 时，将尝试用 decodeURIComponent() 方法对 query 部分进行解码；
 *      如果解码失败则将保留原数据
 *
 * @example    // 典型的调用示例
    var url = require('util/url.js');

    url.queryToJson('http://google.hk/s?ie=utf-8&kw=%E8%8B%8F%E8%8B%8F');    // {ie: "utf-8", kw: "%E8%8B%8F%E8%8B%8F"}
    url.queryToJson('ie=utf-8&kw=%E8%8B%8F%E8%8B%8F', true);                       // {ie: "utf-8", kw: "苏苏"}
 */

module.exports = {
  queryToJson: function (url, shouldDecode) {
    url = url ? (url + '') : '';
    shouldDecode = typeof shouldDecode == 'boolean' ? shouldDecode : false;

    var qJson = {},
      qList = url.substr(url.lastIndexOf('?') + 1).split('&');

    function getQueryValue(val) {
      var _val = val;

      if (shouldDecode) {
        try {
          _val = decodeURIComponent(val);
        } catch (ex) {}
      }

      return _val;
    }

    for (var i = 0; i < qList.length; ++i) {
      if (qList[i]) {
        var _query = qList[i].split('=');
        if (_query.length > 1) {
          var _key = _query[0],
            _val = _query[1];

          if (qJson[_key] === undefined) {
            qJson[_key] = getQueryValue(_val);
          } else {
            if (typeof qJson[_key] !== 'Object' && !(qJson[_key] instanceOf Array)) {
              qJson[_key] = [qJson[_key]];
            }
            qJson[_key].push(getQueryValue(_val));
          }
        }
      }
    }

    return qJson;
  }
};