/**
 * @fileoverview GUID 生成器
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-09-04 | SeasonLi    // 初始版本
 *
 * @method guid(len)        // 方法：生成 GUID.
 *   @param len {Number}    // 参数：GUID 的长度(可选，默认值：7，取值范围：[1, 32])
 *   @return {String}       // 返回：GUID
 *
 * @description    // 附加说明
 *   1) 本方法用于生成全局唯一标识符 GUID(Globally Unique Identifier)
 *   2) 方法没有采用国际常用的 GUID 算法，输出结果也并未采用国际常用的 GUID 表示形式，仅适用于一般性用途，对于苛刻要求“不可重复”的场景请慎用
 *      具体算法为：采集用户操作系统、浏览器、硬件的若干信息，结合 cookie 中的 BAIDUID、一些不确定因素(时间、随机数)等，
 *      拼合成 GUID 的源串，返回对此源串做 MD5 哈希后的结果
 *   3) 方法默认截取并返回 7 位长度的哈希结果，可通过参数控制，有效长度范围：[1, 32](双闭区间)
 *      注：长度越长，生成的 GUID 重复的可能性越小
 *
 *      实际测试结果显示：连续生成 10,000 个 GUID，耗时 3.4 秒左右，
 *      在截取 7 位的情况下，多次测试无重复出现；截取 6 位的情况下，平均每组测试有 3 个左右的重复
 *
 *      连续生成 100,000 个 GUID，耗时 34 秒左右，
 *      在截取 8 位的情况下，多次测试无重复出现；截取 7 位的情况下，平均每组测试有 20 多个重复
 *
 *      因此，在需要生成大量 GUID 时，请根据需要增加生成长度，以尽可能避免出现重复
 *
 * @example    // 典型的调用示例
    var guid = require('util/guid');

    guid();      // '6bed4d0'
    guid(32);    // '87221c39799b311fc97ec4e5d608c90d'
 */

var sparkMD5 = require('../lib/sparkMD5/sparkMD5'),
  cookie = require('./cookie');


module.exports = function (len) {
  len = isNaN(parseInt(len)) ? 7 : Math.max(Math.min(parseInt(len), 32), 1);

  var factors = [
    navigator.platform || '',
    navigator.appName || '',
    navigator.userAgent || '',
    window.screen.availWidth || 0,
    window.screen.availHeight || 0,
    cookie.get('BAIDUID') || '', +new Date(),
    Math.random()
  ];

  return sparkMD5.hashBinary(factors.join('-')).substr(0, len);
};
