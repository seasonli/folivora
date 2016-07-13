/**
 * @fileoverview 有关数值的扩展工具方法
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-02 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-10-06 | SeasonLi    // 重命名方法 prefix() 为 pad()，使命名更规范；
 *                                         // 调整 pad() 方法逻辑，使返回结果不会因填充字符串的长度大于 1 或原数值包含小数部分而超长
 *
 * @method split(num, delimiter, len)    // 方法：以指定定界符，按指定长度分隔数值
 *   @param num {Number|String}          // 参数：待格式化的数值(必选，具体参阅下文详细说明)
 *   @param delimiter {String}           // 参数：分隔符(可选，默认值：',')
 *   @param len {Number}                 // 参数：切割长度(可选，默认值：3)
 *   @return {String}                    // 返回：格式化后的数值串
 *
 * @method pad(num, len, char)     // 方法：使用指定填充符(串)给数值添加前缀，使其达到指定长度
 *   @param num {Number|String}    // 参数：待格式化的数值(必选，具体参阅下文详细说明)
 *   @param len {Number}           // 参数：长度(可选，默认值：0，即不对传入的数字添补前缀)
 *   @param char {String}          // 参数：用于填充前缀的字符(串)(可选，默认值：'0'，具体参阅下文详细说明)
 *   @return {String}              // 返回：格式化后的数值串
 *
 * @method toCN(num, useCap)       // 方法：将指定数值转换为中文数值(读法)
 *   @param num {Number|String}    // 参数：待转换的数值(必选，具体参阅下文详细说明)
 *   @param useCap {Boolean}       // 参数：是否使用中文大写数值表示(可选，默认值：false)
 *   @return {String}              // 返回：转换后的中文数值串
 *
 * @description    // 附加说明
 *   1) split()、pad()、toCN() 方法接受的第一个参数 num 可以是数字，也可以是数字字符串；
 *      前者因受到 JS Integer 有效范围的限制，可处理的数值范围为：[-9007199254740991, 9007199254740991]；
 *      如果传入的是数值字符串，则可以突破这一限制
 *   2) split()、pad()、toCN() 方法支持正负数值，支持整数、浮点数
 *   3) 如果传入 pad() 方法中的数值 num 在转换成字符串后本身长度已经达到或超过了指定长度 len，则返回原数值，不做截断处理
 *      pad() 方法按照字符数计算要补充的前缀长度，即使前缀字符(串)包含多字节字符
 *   4) toCN() 方法在启用大写模式(指定 useCap 参数为 true)时，按照中文货币常用数值表示方式输出
 *
 * @example    // 典型的调用示例
    var numExt = require('util/number');

    numExt.split(12345678);         // '12,345,678'
    numExt.split('-12345.6789');    // '-12,345.6789'

    numExt.pad(123, 6);          // '000123'
    numExt.pad(123, 6, '_');     // '___123'
    numExt.pad(123, 6, '_#');    // '_#_123'

    numExt.toCN(1024);                     // '一千零二十四'
    numExt.toCN(1024, true);               // '壹仟零贰拾肆'
    numExt.toCN('9007199254740991230');    // '九百亿七千一百九十九万二千五百四十七亿四千零九十九万一千二百三十'
 */

function num2str(num) {
  if (typeof (num) == 'number' && Math.abs(num) > (Number.MAX_SAFE_INTEGER || 9007199254740991)) {
    throw new Error('[Util.number Exception]: Input numnber is too big.');
  } else {
    var numStr = (num + '').replace(/^\s+|\s+$/g, '') || '0';

    if (!/^[+-]?(?:\d+\.?|\d*\.\d+)$/.test(numStr)) {
      throw new Error('[Util.number Exception]: Invalid input number.');
    } else {
      return numStr;
    }
  }
}


module.exports = {
  split: function (num, delimiter, len) {
    var numStr = num2str(num),
      numParts = numStr.split('.');

    numParts[0] = numParts[0].replace(new RegExp('(\\d)(?=(?:\\d{' + (len || 3) + '})+$)', 'g'), '$1' + (delimiter || ','));

    return numParts[1] ? numParts.join('.') : numParts[0];
  },
  pad: function (num, len, char) {
    var numStr = num2str(num),
      numParts = numStr.split('.');

    numParts[0] = numParts[0].replace(/([+-]?)(\d*)/, function () {
      var prefixLen = Math.max((len || 0) - numStr.length, 0);
      return arguments[1] + Array(prefixLen + 1).join(char || '0').substr(0, prefixLen) + arguments[2];
    });

    return numParts[1] ? numParts.join('.') : numParts[0];
  },
  toCN: function (num, useCap) {
    var useCap = typeof (useCap) == 'boolean' ? useCap : false,
      cnNum = [
        ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      ][useCap ? 1 : 0],
      cnUnit = [
        ['', '十', '百', '千'],
        ['', '拾', '佰', '仟']
      ][useCap ? 1 : 0];

    var numStr = num2str(num).replace(/^([+-]?)0*(?=\d)/, '$1'),
      numParts = numStr.split('.'),
      cnNumStr = '';

    // Integral part.
    var firstDigit = numParts[0].substr(0, 1),
      isNegative = firstDigit == '-',
      numArray = numParts[0].substr(/\d/.test(firstDigit) ? 0 : 1).replace(/(\d)(?=(?:\d{4})+$)/g, '$1,').split(',');

    for (var len = numArray.length, i = len; i > 0; --i) {
      var subNumArray = numArray[len - i].split('').reverse();

      for (var j = 0; j < subNumArray.length; ++j) {
        var n = subNumArray[j];
        subNumArray[j] = ((!useCap && n == 1 && j == 1 && subNumArray.length < 3 || !parseInt(numArray[len - i].substr(-j - 1)) || n == 0 && subNumArray[j + 1] == 0) ? '' : cnNum[n]) + (n > 0 ? cnUnit[j] : '');
      };

      cnNumStr += (subNumArray.reverse().join('') + (i > 1 ? (i % 2 ? '亿' : (parseInt(numArray[len - i]) ? '万' : '')) : ''));
    }
    cnNumStr = cnNumStr || '零';

    // Decimal part.
    if (numParts[1]) {
      numArray = numParts[1].split('');

      cnNumStr += '点';
      for (var i = 0; i < numArray.length; ++i) {
        cnNumStr += cnNum[parseInt(numArray[i])];
      };
    }

    cnNumStr = (isNegative ? '负' : '') + cnNumStr;

    return cnNumStr;
  }
};
