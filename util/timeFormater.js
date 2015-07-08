/**
 * @fileoverview 时间格式化组件
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2013-10-17 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-07-12 | SeasonLi    // 时间格式化模式串增加对保留字符的转义处理
 *                                         // span()、diff() 方法增加 keepZero、onlyTop 参数
 * @version 1.2 | 2014-08-14 | SeasonLi    // 支持以 UTC 时间进行格式化
 *
 * @method build(time)                   // 方法：从指定来源构造时间对象，来源不合法时将抛出异常
 *   @param time {Number|String|Date}    // 参数：构造来源(可选，默认为客户端当前时间)
 *   @return {Date}                      // 返回：构造好的Date对象
 *
 * @method format(time, formatPattern, language, useUTC)    // 方法：根据指定模式、指定语言及是否使用 UTC 时间来格式化时间点(请参阅示例描述)
 *   @param time {Number|String|Date}                       // 参数：要格式化的时间(可选，此值将经由build()方法处理，默认为客户端当前时间)
 *   @param formatPattern {String}                          // 参数：格式化模式串(可选，默认为'yyyy/MM/dd HH:mm:ss')
 *   @param language {String}                               // 参数：语言，取值'zh'(中文)、'en'(英文)(可选，默认根据用户浏览器语言自动选择，目前仅支持英文和中文)
 *   @param useUTC {Boolean}                                // 参数：是否使用 UTC 时间(可选，默认值：false)
 *   @return {String}                                       // 返回：格式化后的时间字符串
 *
 * @method span(startTime, endTime, formatPattern, onlyTop, keepZero)    // 方法：根据指定模式格式化时间段(请参阅示例描述)
 *   @param startTime {Number|String|Date}                               // 参数：要格式化的时间段的起始时间(可选，此值将经由build()方法处理，默认为客户端当前时间)
 *   @param endTime {Number|String|Date}                                 // 参数：要格式化的时间段的结束时间(可选，此值将经由build()方法处理，默认为客户端当前时间)
 *   @param formatPattern {String}                                       // 参数：格式化模式串(可选，默认为'd天h小时m分s秒f毫秒')
 *   @param onlyTop {Boolean}                                            // 参数：指示是否仅保留最高单位的时间单元，舍弃低级时间单元(可选，默认值：false；请参阅下文详述)
 *   @param keepZero {Boolean}                                           // 参数：指示是否保留数值为 0 的时间单元(可选，默认值：false)
 *   @return {String}                                                    // 返回：格式化后的时间段字符串
 *
 * @method diff(timeDifference, formatPattern, onlyTop, keepZero)    // 方法：根据指定模式格式化时间差(请参阅示例描述)
 *   @param timeDifference {Number}                                  // 参数：要格式化的时间差(必选，单位：毫秒)
 *   @param formatPattern {String}                                   // 参数：格式化模式串(可选，默认为'd天h小时m分s秒f毫秒')
 *   @param onlyTop {Boolean}                                        // 参数：指示是否仅保留最高单位的时间单元，舍弃低级时间单元(可选，默认值：false；请参阅下文详述)
 *   @param keepZero {Boolean}                                       // 参数：指示是否保留数值为 0 的时间单元(可选，默认值：false)
 *   @return {String}                                                // 返回：格式化后的时间差字符串
 *
 * @method startEnd(startTime, endTime, startTimePattern, endTimePattern, separator, language, useUTC)    // 方法：根据指定模式格式化起止时间(请参阅示例描述)
 *   @param startTime {Number|String|Date}                                                                // 参数：要格式化的起始时间(可选，此值将经由build()方法处理，默认为客户端当前时间)
 *   @param endTime {Number|String|Date}                                                                  // 参数：要格式化的结束时间(可选，此值将经由build()方法处理，默认为客户端当前时间)
 *   @param startTimePattern {String}                                                                     // 参数：起始时间格式化模式串(可选，默认为'yyyy/MM/dd HH:mm:ss')
 *   @param endTimePattern {String}                                                                       // 参数：结束时间格式化模式串(可选，默认同起始时间格式化模式串)
 *   @param separator {String}                                                                            // 参数：分隔符(可选，默认为'-')
 *   @param language {String}                                                                             // 参数：语言，取值'zh'(中文)、'en'(英文)(可选，默认根据用户浏览器语言自动选择，目前仅支持英文和中文)
 *   @param useUTC {Boolean}                                                                              // 参数：是否使用 UTC 时间(可选，默认值：false)
 *   @return {String}                                                                                     // 返回：格式化后的起止时间字符串
 *
 * @description    // 附加说明
 *   1) build() 方法用于对时间值做标准化处理，可以传入时间戳的数字、字符串形式(如："1382013040000")，或表示日期的标准序列(如："2013-10-17 20:30:40.0")等
 *      方法将返回一个表示此时间的标准 JavaScript Date 对象，具体请参阅使用示例
 *      format()、span()、diff()、startEnd() 等时间格式化方法中需要传入的时间参数，都将经过 build() 方法处理，因而这些参数都可以接受各种形式的时间表示
 *   2) format() 方法 formatPattern 参数说明：
 *             y : 不包含纪元的年输出，如'1'、'13'
 *            yy : 不包含纪元的年输出，不足两位时以前缀0补足，如'01'、'13'
 *       yyy(3+) : 包含纪元的年输出，以前缀0补足余位，如'2001'、'002013'
 *             M : 月，如'1'、'12'
 *            MM : 月，不足两位时以前缀0补足，如'01'、'12'
 *           MMM : 月，中文输出中文数字月表示，如'一月'、'十二月'；英文输出英文月简写，如'Jan'、'Dec'
 *      MMMM(4+) : 月，中文输出中文数字月表示，如'一月'、'十二月'；英文输出英文月全写，如'January'、'December'
 *             d : 日期，如'1'、'10'、'22'
 *            dd : 日期，不足两位时以前缀0补足，如'01'、'10'、'22'
 *       ddd(3+) : 日期，中文输出中文数字月表示，如'一日'、'十日'、'二十二日'；英文输出英文日表示，如'1st'、'10th'、'22nd'
 *             w : 星期，中文输出中文星期简写，如'周一'、'周日'；英文输出英文星期简写，如'Mon'、'Sun'
 *        ww(2+) : 星期，中文输出中文星期全写，如'星期一'、'星期日'；英文输出英文星期全写，如'Monday'、'Sunday'
 *             h : 小时(12时制)，如'1'、'8'
 *        hh(2+) : 小时(12时制)，不足两位时以前缀0补足，如'01'、'08'
 *             H : 小时(24时制)，如'1'、'20'
 *        HH(2+) : 小时(24时制)，不足两位时以前缀0补足，如'01'、'20'
 *             m : 分，如'1'、'30'
 *        mm(2+) : 分，不足两位时以前缀0补足，如'01'、'30'
 *             s : 秒，如'1'、'30'
 *        ss(2+) : 秒，不足两位时以前缀0补足，如'01'、'30'
 *             f : 毫秒，截取一位毫秒值，如'0'、'1'，注意：此处是截取值
 *            ff : 毫秒，截取两位毫秒值，不足两位时以前缀0补足，如'00'、'01'、'10'，注意：此处是截取值
 *       fff(3+) : 毫秒，取全部三位毫秒值，不足三位时以前缀0补足，如'001'、'010'、'456'
 *   3) span() 方法说明：
 *      本方法输出某时间段(由起止时间指定)的格式化表示，最高度量单位为'天'(此级以上时间单位具有不确定性，故不予采用)
 *      格式化模式串中如缺失某度量单位的表示，则该度量单位下的时间分量值自动向下一级可用度量单位累计(请参阅示例)；如下级度量单位缺失，不向上级度量单位累计
 *      当指定的起始时间晚于结束时间时，输出带有负号('-')的格式化串
 *      如果忽略参数 formatPattern，则默认使用'd天h小时m分s秒f毫秒'模式串格式化，并且输出结果中将不包含值为0的计量部分，请参阅调用示例
 *
 *      span() 方法 formatPattern 参数说明：
 *       d(n+) : 天分量，以前缀0补足余位，如'10'、'0010'
 *           h : 小时分量(24时制)，如'1'、'30'
 *      hh(2+) : 小时分量(24时制)，不足两位时以前缀0补足，如'01'、'30'
 *           m : 分分量，如'1'、'30'
 *      mm(2+) : 分分量，不足两位时以前缀0补足，如'01'、'30'
 *           s : 秒分量，如'1'、'30'
 *      ss(2+) : 秒分量，不足两位时以前缀0补足，如'01'、'30'
 *           f : 毫秒分量，如'0'、'10'、'100'，注意：此处非截取值
 *          ff : 毫秒分量，不足两位时以前缀0补足，如'01'、'10'、'100'，注意：此处非截取值
 *      ff(3+) : 毫秒分量，不足三位时以前缀0补足，如'001'、'010'、'100'，注意：此处非截取值
 *   4) diff() 方法中的格式化模式串及规则与 span() 方法中一致
 *   5) startEnd() 方法中的格式化模式串及规则与 formatTime() 方法中一致
 *   6) 在上述所有方法中的 formatPattern 参数里，'y'、'M'、'd'、's'、'h'、'H'、'm'、's'、'f' 皆为保留字，
 *      如果想要在模式串中使用这些字符的本意，请用 '\' 对其进行转义，例如：
 *      format(null, 'Year: yyyy, \\Mont\\h: M, Date: d');    // 'Year: 2014, Month: 7, Date: 12'
 *   7) span()、diff() 方法中的参数 keepZero 为 true 时，输出结果将保留数值为 0 的时间单元，否则将之移除(请参阅示例)
 *   8) span()、diff() 方法中的参数 onlyTop 为 true 时，输出结果仅保留最高单位时间单元，移除低级时间单元(请参阅示例)
 *
 * @example    // 典型的调用示例
     var timeFormater = require('util/timeFormater');

     // 构造时间
     timeFormater.build('2013-10-17 20:30:40.0');    // 构造时间(2013-10-17 20:30:40.0)
     timeFormater.build('1382013040000');            // 构造时间(2013-10-17 20:30:40.0)
     timeFormater.build(1382013040000);              // 构造时间(2013-10-17 20:30:40.0)
     timeFormater.build(new Date());                 // 构造时间(客户端当前时间)
     timeFormater.build();                           // 构造时间(客户端当前时间)

     // 格式化时间点
     var t = '2013-10-08 17:03:50.012';                    // 待格式化的时间
     timeFormater.format(t);                               // '2013/10/08 17:03:50'(默认格式化模式)
     timeFormater.format(t, 'yy-MM-dd hh:mm:ss.f');        // '13-10-08 05:03:50.0'
     timeFormater.format(t, 'yyyyy-MM-dd HH:mm:ss.ff');    // '02013-10-08 17:03:50.01'
     timeFormater.format(t, 'yyyy-MM-dd w');               // '2013-10-08 周二'
     timeFormater.format(t, 'yyyy年 MMM ddd ww');          // '2013年 十月 八日 星期二'
     timeFormater.format(t, 'yyyy MMM ddd w', 'en');       // '2013 Oct 8th Tue'
     timeFormater.format(t, 'yyyy MMMM dddd ww', 'en');    // '2013 October 8th Tuesday'
     timeFormater.format(t, null, null, true);             // '2013/10/08 09:03:50'(使用 UTC 时间)

     // 格式化时间段
     var st = '2013-10-08 0:0:0.0';                 // 构造待格式化的时间段起始时间
     var et = '2013-10-09 08:09:10.012';            // 构造待格式化的时间段结束时间(与起始时间相差86950123毫秒)
     timeFormater.span(st, et);                     // '1天8小时9分10秒12毫秒'(默认格式化模式)
     timeFormater.span(et, st);                     // '-1天8小时9分10秒12毫秒'(默认格式化模式)
     timeFormater.span(st, et, 'd天h小时m分s秒');    // '1天8小时9分10秒'
     timeFormater.span(st, et, 'm分s秒ff毫秒');      // '1929分10秒12毫秒'
     timeFormater.span(st, et, 's秒fff毫秒');        // '115750秒012毫秒'
     timeFormater.span(st, et, 'd天s秒');            // '1天29350秒'
     timeFormater.span(st, et, 'hh:mm:ss');          // '32:09:10'

     timeFormater.span('2013-10-09 0:0:0.0', '2013-10-09 10:1:1.0');    // '10小时1分1秒'(默认格式化模式)
     timeFormater.span('2013-10-09 0:0:0.0', '2013-10-09 1:30:0.0');    // '1小时30分'(默认格式化模式)
     timeFormater.span('2013-10-09 0:0:0.0', '2013-10-10 0:30:0.0');    // '1天30分'(默认格式化模式)
     timeFormater.span('2013-10-09 0:0:0.0', '2013-10-10 0:30:0.1');    // '1天30分100毫秒'(默认格式化模式)

     // 格式化时间差
     timeFormater.diff(2000);                                // '2秒'(默认格式化模式)
     timeFormater.diff(5400000);                             // '1小时30分'(默认格式化模式)
     timeFormater.diff(3630000);                             // '1小时30秒'(默认格式化模式)
     timeFormater.diff(5400000, 'hh:mm:ss', false, true);    // '01:30:00'(指定格式化模式值，保留全部时间单元，保留 0 值)
     timeFormater.diff(3630000, 'd\\dh\\hm\'s"', true);      // '1h'(指定格式化模式，仅保留最高单位时间单元，不保留 0 值)

     // 格式化起止时间
     timeFormater.startEnd('2013-10-23 17:30:0', '2013-10-23 20:00');                                  // '2013/10/23 17:30:00-2013/10/23 20:00:00'(默认格式化模式)
     timeFormater.startEnd('2013-10-23 17:30:0', '2013-10-23 20:00', 'HH:mm');                         // '17:30-20:00'
     timeFormater.startEnd('2013-10-23 17:30:0', '2013-10-23 20:00', 'HH:mm', 'hh:mm');                // '17:30-08:00'
     timeFormater.startEnd('2013-10-23 17:30:0', '2013-10-23 20:00', 'HH:mm', null, '~');              // '17:30~20:00'
     timeFormater.startEnd('2013-10-23 17:30:0', '2013-10-23 20:00', null, null, null, null, true);    // '2013/10/23 09:30:00-2013/10/23 12:00:00'(使用 UTC 时间)
 */

var numExtend = require('./number'),
  numPad = numExtend.pad, // 引入数字格式化方法(增补前缀 0)
  numToCN = numExtend.toCN; // 引入数字转中文方法


function getMonthStr(month, isAbbr, language) {
  switch (language) {
  case 'zh':
    return numToCN(month + 1) + '月';
  case 'en':
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month].substr(0, isAbbr ? 3 : undefined);
  default:
    return '';
  }
};

function getWeekdayStr(weekday, isAbbr, language) {
  switch (language) {
  case 'zh':
    return (isAbbr ? '周' : '星期') + (weekday ? numToCN(weekday) : '日');
  case 'en':
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday].substr(0, isAbbr ? 3 : undefined);
  default:
    return '';
  }
};

function getDateStr(date, language) {
  switch (language) {
  case 'zh':
    return numToCN(date) + '日';
  case 'en':
    return date + (date % 10 < 4 && Math.floor(date / 10) != 1 ? ['th', 'st', 'nd', 'rd'][date % 10] : 'th');
  default:
    return '';
  }
};

function encodeFormatPattern(formatPattern) {
  return formatPattern.replace(/\\([yMdwhHmsf])/g, '$1\0');
}

function decodeFormatPattern(formatPattern) {
  return formatPattern.replace(/([yMdwhHmsf])\0/g, '$1');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var timeFormater = {
  build: function (time) {
    var builtTime;

    switch (typeof (time)) {
    case 'number':
      builtTime = new Date(parseInt(time));
      break;
    case 'string':
      if (Number(time)) {
        builtTime = arguments.callee(parseInt(time));
      } else {
        time = time.replace(/-/g, '/').replace('/\+\d+/', ''); // 去掉时区信息，IE不支持

        var tMatch = time.match(/^(.+?)\.(\d+)$/);
        if (tMatch && tMatch[2]) { // 包含毫秒信息时，需特殊处理，不能直接调用Date构造函数，firefox下不支持
          builtTime = new Date(+new Date(tMatch[1]) + parseInt(tMatch[2]));
        } else {
          builtTime = new Date(time);
        }
      }
      break;
    default:
      builtTime = time instanceof Date ? time : new Date();
    }

    if (builtTime == 'Invalid Date') {
      throw new Error('[TimeFormater Exception]: Invalid Date!');
    }

    return builtTime;
  },
  format: function (time, formatPattern, language, useUTC) {
    time = timeFormater.build(time);
    formatPattern = encodeFormatPattern(formatPattern || 'yyyy/MM/dd HH:mm:ss');
    language = /^(zh|en)$/i.test(language || (navigator.browserLanguage || navigator.language).substr(0, 2)) ? RegExp.$1.toLowerCase() : 'en';
    useUTC = typeof useUTC == 'boolean' ? useUTC : false;

    var _time = {
      year: useUTC ? time.getUTCFullYear() : time.getFullYear(),
      month: useUTC ? time.getUTCMonth() : time.getMonth(),
      date: useUTC ? time.getUTCDate() : time.getDate(),
      day: useUTC ? time.getUTCDay() : time.getDay(),
      hour: useUTC ? time.getUTCHours() : time.getHours(),
      minute: useUTC ? time.getUTCMinutes() : time.getMinutes(),
      second: useUTC ? time.getUTCSeconds() : time.getSeconds(),
      millisecond: useUTC ? time.getUTCMilliseconds() : time.getMilliseconds()
    };

    // Hours/Minutes/Seconds.
    var timeSlices = {
      '(?:h(?!\0))+': _time.hour > 12 ? _time.hour - 12 : _time.hour,
      '(?:H(?!\0))+': _time.hour,
      '(?:m(?!\0))+': _time.minute,
      '(?:s(?!\0))+': _time.second
    };

    for (var timeSlice in timeSlices) {
      formatPattern = formatPattern.replace(new RegExp(timeSlice, 'g'), function (matchStr) {
        return numPad(timeSlices[timeSlice], Math.min(2, matchStr.length));
      });
    }

    // Milliseconds.
    formatPattern = formatPattern.replace(/(?:f(?!\0))+/g, function (matchStr) {
      return numPad(_time.millisecond, 3).substr(0, Math.min(matchStr.length, 3));
    });

    // Year.
    formatPattern = formatPattern.replace(/(?:y(?!\0))+/g, function (matchStr) {
      return matchStr.length < 3 ? numPad(_time.year % 1000, Math.min(matchStr.length, 2)) : numPad(_time.year, matchStr.length);
    });

    // Month.
    formatPattern = formatPattern.replace(/(?:M(?!\0))+/g, function (matchStr) {
      return matchStr.length < 3 ? numPad(_time.month + 1, matchStr.length) : getMonthStr(_time.month, matchStr.length == 3, language);
    });

    // Date.
    formatPattern = formatPattern.replace(/(?:d(?!\0))+/g, function (matchStr) {
      return matchStr.length < 3 ? numPad(_time.date, matchStr.length) : getDateStr(_time.date, language);
    });

    // Weekday.
    formatPattern = formatPattern.replace(/(?:w(?!\0))+/g, function (matchStr) {
      return getWeekdayStr(_time.day, matchStr.length < 2, language);
    });

    return decodeFormatPattern(formatPattern);
  },
  span: function (startTime, endTime, formatPattern, onlyTop, keepZero) {
    var oriFormatPattern = formatPattern;
    startTime = timeFormater.build(startTime);
    endTime = timeFormater.build(endTime);
    formatPattern = encodeFormatPattern(formatPattern || 'd天h小时m分s秒f毫秒');
    keepZero = typeof keepZero == 'boolean' ? keepZero : false;
    onlyTop = typeof onlyTop == 'boolean' ? onlyTop : false;

    var timeDifference = Math.abs(endTime.getTime() - startTime.getTime());
    var timeSlices = [{
      pattern: /(?:d(?!\0))+/g,
      rate: 24 * 60 * 60 * 1000
    }, {
      pattern: /(?:h(?!\0))+/g,
      rate: 60 * 60 * 1000
    }, {
      pattern: /(?:m(?!\0))+/g,
      rate: 60 * 1000
    }, {
      pattern: /(?:s(?!\0))+/g,
      rate: 1000
    }, {
      pattern: /(?:f(?!\0))+/g,
      rate: 1
    }];

    for (var i = 0; i < timeSlices.length; ++i) {
      timeSlices[i].value = timeDifference;
      for (var j = 0; j < i; ++j) {
        if (formatPattern.match(timeSlices[j].pattern)) {
          timeSlices[i].value -= timeSlices[j].value * timeSlices[j].rate;
        }
      }
      timeSlices[i].value = Math.floor(timeSlices[i].value / timeSlices[i].rate);
    }

    for (var i = 0; i < timeSlices.length; ++i) {
      formatPattern = formatPattern.replace(timeSlices[i].pattern, function (matchStr) {
        var subLen = Math.min(matchStr.length, (i == 0 ? Infinity : (i == 4 ? 3 : 2)));
        return numPad(timeSlices[i].value, subLen);
      });
    }

    if (!keepZero) {
      formatPattern = formatPattern.replace(/(\d+)\D+/g, function (matchStr, num) {
        return Number(num) ? matchStr : '';
      });
    }

    if (onlyTop) {
      formatPattern = formatPattern.match(/\d+\D+/g)[0];
    }

    return (endTime >= startTime ? '' : '-') + decodeFormatPattern(formatPattern);
  },
  diff: function (timeDifference, formatPattern, onlyTop, keepZero) {
    if (timeDifference == undefined) {
      throw new Error('[TimeFormater Exception]: Invalid arguments!');
    }
    return timeFormater.span(0, timeDifference, formatPattern, onlyTop, keepZero);
  },
  startEnd: function (startTime, endTime, startTimePattern, endTimePattern, separator, language, useUTC) {
    startTime = timeFormater.build(startTime);
    endTime = timeFormater.build(endTime);
    separator = (separator == undefined ? '-' : separator) + '';
    startTimePattern = startTimePattern || 'yyyy/MM/dd HH:mm:ss';
    endTimePattern = endTimePattern || startTimePattern;

    return timeFormater.format(startTime, startTimePattern, language, useUTC) + separator + timeFormater.format(endTime, endTimePattern, language, useUTC);
  }
};


module.exports = timeFormater;
