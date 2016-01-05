/**
 * @fileoverview 有关字符串的扩展工具方法
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-03 | SeasonLi    // 初始版本，部分方法引自 tangram
 * @version 1.1 | 2014-08-15 | SeasonLi    // 新增 encodeJSON() 方法；
 *                                           // 新增 jsonStringify() 方法
 * @version 1.2 | 2014-10-06 | SeasonLi    // 新增 pad() 方法；
 *                                           // 优化 jsonStringify() 方法使之在现代浏览器下更高效
 * @version 1.3 | 2014-10-10 | SeasonLi    // 修复因 JSON 对象不存在，在 IE 7 下报错的问题
 * @version 1.4 | 2014-10-20 | SeasonLi    // 修改 getSubStr() 字符截断策略，在最大限制长度小于等于后缀长度时，不添加后缀；
 *                                           // 修改 getSubStr() 方法默认后缀为实体符号 '&hellip;'；
 *                                           // 修改一处表述不够准确的注释
 *   
 * @method getByteLen(str)    // 方法：获取字符串字节长度(双字节字符计数 2)
 *   @param str {String}      // 参数：要计算长度的字符串(可选，默认为空)
 *   @return {Number}         // 返回：字符串字节长度
 *   
 * @method getSubStr(str, maxLen, suffix)    // 方法：将字符串在指定的字节长度内截断并补以指定后缀(请参阅下文详述)
 *   @param str {String}                     // 参数：要截断的字符串(可选，默认为空)
 *   @param maxLen {Number}                  // 参数：最大限制字节长度(可选，默认为原字符串长度，即不对传入的字符串进行截断)
 *   @param suffix {String}                  // 参数：截断发生时添加的后缀字符串(可选，默认值：'…'，具体参阅下文详述)
 *   @return {String}                        // 返回：截断并添加后缀后的字符串
 *
 * @method encodeHTML(str)    // 方法：HTML编码
 *   @param str {String}      // 参数：要编码的字符串(可选，默认为空)
 *   @return {Number}         // 返回：编码后的字符串
 *
 * @method decodeHTML(str)    // 方法：HTML解码
 *   @param str {String}      // 参数：要解码的字符串(可选，默认为空)
 *   @return {String}         // 返回：解码后的字符串
 *
 * @method toHalfWidth(str)    // 方法：转换常见全角字符到对应半角字符(请参阅下文详述)
 *   @param str {String}       // 参数：要转换的字符串(可选，默认为空)
 *   @return {String}          // 返回：转换后的字符串
 *
 * @method pad(str, len, char)    // 方法：使用指定填充符(串)给指定字符串添加前缀，使其达到指定长度
 *   @param str {String}          // 参数：待补充前缀的字符串(可选，默认为空)
 *   @param len {Number}          // 参数：要补足到的长度(可选，默认值：0，即不对传入的字符串添补前缀)
 *   @param char {String}         // 参数：用于填充前缀的字符(串)(可选，默认值：空格，具体参阅下文详细说明)
 *   @return {String}             // 返回：补充前缀后的字符串
 *
 * @description    // 附加说明
 *   1) getByteLen()、getSubStr() 方法在计算字符串长度时，对编码范围在 \x00-\xff 范围以外的字符长度计数为 2；
 *      如果字符超过此编码范畴，则此二方法返回的结果可能不正确
 *   2) getSubStr() 方法的第二个参数 maxLen 是最大限制字节长度，通常指目标字符串容器“能够显示的”最大字符串字节长度；
 *      当原始字符串没有超过这个限制长度时，不进行截断，不添加后缀，使原始字符串内容尽可能多地得到保留；
 *      超过这个限制长度时，进行截断，并补以后缀(默认为 '…'，若不需要后缀则需将参数 suffix 置为 '')；
 *      当最大限制长度小于等于后缀长度时，即使发生截断，也不添加后缀，优先保证原始字符串内容的展示；
 *      截断时会将后缀的长度计算在内，整体在 maxLen 限定的长度内
 *   3) toHalfWidth() 方法转换常见的中文全角字符(包含大小写字母、数字及常见符号、空格)到对应形式的半角字符
 *   4) 如果传入 pad() 方法中的字符串 str 本身长度已经达到或超过了指定长度 len，则原样返回，不做截断处理
 *      pad() 方法按照字符数计算要补充的前缀长度，即使前缀字符(串)包含多字节字符
 *
 * @example    // 典型的调用示例
    var strExt = require('wiki-common:widget/util/string.js');

    var str = "AB中文C汉D字";

    strExt.getByteLen(str);    // 12

    strExt.getSubStr(str, 3);    // 'A…'
    strExt.getSubStr(str, 6);    // 'AB中...'
    strExt.getSubStr(str, 9);    // 'AB中文C...'

    strExt.getSubStr(str, 4, '');     // 'AB中'
    strExt.getSubStr(str, 7, '');     // 'AB中文C'
    strExt.getSubStr(str, 10, '');    // 'AB中文C汉D'

    strExt.encodeHTML('<a href="javascript:;"></a>');                          // '&lt;a href=&quot;javascript:;&quot;&gt;&lt;/a&gt;'
    strExt.decodeHTML('&lt;a href=&quot;javascript:;&quot;&gt;&lt;/a&gt;');    // '<a href="javascript:;"></a>'

    strExt.toHalfWidth('＠Ｂａｉ');    // '@Bai'

    strExt.pad('abc', 6);          // '   abc'
    strExt.pad('abc', 6, '#');     // '###abc'
    strExt.pad('abc', 6, '@#');    // '@#@abc'
 */

var timeFormater = require('./timeFormater.js');


// 初始化输入，转为字符串，默认为空
function getStr(input) {
  return input ? (input + '') : '';
}

// 按照双字节方式截断字符串
function subByte(str, len) {
  return str.substr(0, len).replace(/([^\x00-\xff])/g, '$1 ') // 双字节字符替换成两个
    .substr(0, len) // 截取长度
    .replace(/[^\x00-\xff]$/, '') // 去掉临界双字节字符
    .replace(/([^\x00-\xff]) /g, '$1'); // 还原
}

// 使用指定字符补足前缀
function getPrefix(char, len) {
  return char ? Array(len + 1).join(char) : '';
}

var strExt = {
  getByteLen: function (str) {
    return getStr(str).replace(/[^\x00-\xff]/g, '**').length;
  },
  getSubStr: function (str, maxLen, suffix) {
    var subStr = getStr(str);

    if (Math.max(Math.floor(maxLen), 0)) {
      suffix = suffix == undefined ? '…' : (suffix + '');

      var suffixLen = this.getByteLen(suffix);
      if (this.getByteLen(str) > maxLen) {
        if (suffixLen >= maxLen) {
          suffix = '';
          suffixLen = 0;
        }

        subStr = subByte(str, maxLen - suffixLen) + suffix;
      }
    }

    return subStr;
  },
  encodeHTML: function (str) {
    return getStr(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },
  decodeHTML: function (str) {
    var str = getStr(str)
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, "&");

    // 处理转义的中文和实体字符
    return str.replace(/&#([\d]+);/g, function () {
      return String.fromCharCode(parseInt(arguments[1], 10));
    });
  },
  toHalfWidth: function (str) {
    return getStr(str).replace(/[\uFF01-\uFF5E]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 65248);
    }).replace(/\u3000/g, ' ');
  },
  pad: function (str, len, char) {
    str = getStr(str);
    char = getStr(char) || ' ';

    var prefixLen = Math.max((len || 0) - str.length, 0);
    return getPrefix(char, prefixLen).substr(0, prefixLen) + str;
  }
};


module.exports = strExt;