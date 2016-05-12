/**
 * @fileoverview 日历(仅生成日历数据)
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-11 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-07-13 | SeasonLi    // 引入 safeCall() 方法替代 checkAndCall() 方法
 * @version 1.2 | 2014-08-07 | SeasonLi    // 统一修改：通用组件中回调被调用时，设置 this 指向实例自身
 * @version 1.3 | 2014-08-14 | SeasonLi    // 修复构造日历对象后直接调用 add* 方法时出错的 bug (this.curDate 未初始化)
 * @version 1.4 | 2014-08-24 | SeasonLi    // 修复数值有效性校验的一处遗漏
 *
 * @method constructor(args)         // 构造函数：初始化日历
 *   @param args {Object}            // 参数：初始化参数(可选)
 *     firstDayOfWeek {Number}       // 参数：指定一周的第一天是星期几，以数字 0~6 表示周日~周六(可选，默认值：0，取值范围：[0,6])
 *     today {Date|String|Number}    // 参数：指定“今日”时间，建议选用服务器时间(可选，默认为客户端当前时间)
 *     onDateCheck {Function}        // 参数：检测日期可用性时的回调(可选，默认无；请参阅下文详述)
 *   @return {Object}                // 返回：日历对象
 *
 * @method getCanlendarData(curDate)        // 方法：基于“当前日期” curDate 获取当月日历数据(请参阅下文详述)
 *   @param curDate {Date|String|Number}    // 参数：“当前日期”(可选，默认值：今日 || 客户端当前日期），此串由 util/timeFormater 中的 format()方法解析，请确保格式正确
 *   @return {Object}                       // 返回：构造好的日历数据
 *
 * @method addDays(dayCount)     // 方法：基于“当前日期”，增加/减少若干天数，获取新的“当月”日历数据(请参阅下文详述)
 *   @param dayCount {Number}    // 参数：增加的天数(需要减少时请传入负值，可选，默认值：1)
 *   @return {Object}            // 返回：构造好的日历数据
 *
 * @method addMonths(monthCount)    // 方法：基于“当前日期”，增加/减少若干月，获取新的“当月”日历数据(请参阅下文详述)
 *   @param monthCount {Number}     // 参数：增加的月数(需要减少时请传入负值，可选，默认值：1)
 *   @return {Object}               // 返回：构造好的日历数据
 *
 * @method addYears(yearCount)    // 方法：基于“当前日期”，增加/减少若干年，获取新的“当月”日历数据(请参阅下文详述)
 *   @param yearCount {Number}    // 参数：增加的年数(需要减少时请传入负值，可选，默认值：1)
 *   @return {Object}             // 返回：构造好的日历数据
 *
 * @description    // 附加说明
 *   1) 本组件用于生成整月的日历标签数据，并不构造 DOM 结构，具体数据格式说明请参阅下文
 *   2) 校验参数输入的时间使用 util/timeFormater 组件，需要时请参阅其说明
 *   3) onDateCheck() 为检测日期可用性时的回调方法，用于用户自定义要禁用的日期；
 *      onDateCheck() 回调应该返回 true 或 false，当返回值 === false 时，对应的日期数据中的 isDisabled 字段将被置为 true；
 *      onDateCheck() 回调被调用时传入参数 date {Date}(代表本日日期的 Date 对象)
 *   4) getCanlendarData(curDate) 方法用于获取基于“当前日期”的月历数据，此处的“当前日期”是指：方法调用时传入的 curDate || 今日 || 客户端当前日期
 *      方法返回的数据结构为：
 *      {
 *        calendarDays: {Array[42]}        // 包含“当月”所有日期标签数据的数组
 *        curYear: {Number}                // 当前年份值(包含纪元)
 *        curMonth: {Number}               // 当前月份值(用于显示，起始值为 1)
 *        curDate: {Number}                // 当前日期值
 *        curMonthDaysCount: {Number}      // 当前月天数
 *        curMonthDaysIndex: {Array[2]}    // 当前月的日期数据在 calendarDays 数组中的索引范围(闭区间，请参阅下文详述)
 *        curMonthOverWeeks: {Number}      // 当前月的日期跨越的周数
 *      }
 *      其中，calendarDays 数组中每一项的数据结构为(本结构内数据的描述皆是基于当前数据项所代表的日期，以下称为“本日”)：
 *      {
 *        year: {Number}           // 本日所属的年份值(包含纪元)
 *        month: {Number}          // 本日所属的月份值(用于显示，起始值为 1)
 *        date: {Number}           // 本日日期值
 *        dateObj: {Date}          // 本日的 Date 对象
 *        isDisabled: {Boolean}    // 本日是否不可用(可用性状态受本日是否属于当前月、onDateCheck() 回调影响，请参阅下文详述)
 *        isCurDate: {Boolean}     // 本日是否是“当前日期”(本附加说明第 2) 条中所指的“当前日期”)
 *        isHoliday: {Boolean}     // 本日是否是双休日
 *        isToday: {Boolean}       // 本日是否是“今日”(构造函数中所配置的“今日”)
 *      }
 *
 *      calendarDays 恒定包含 42 天(即6周)的日期数据，这意味着这些数据中除了当前月的日期外，首尾还分别包含一部分上一月及下一月的日期；
 *      包含哪些非当前月日期，会受到初始化构造参数 firstDayOfWeek 的影响；
 *      curMonthDaysIndex 指示了当前月的日期在 calendarDays 数组中的首尾索引值，是一个闭区间；
 *      curMonthOverWeeks 指示了当前月的日期在当前 firstDayOfWeek 配置下所跨越的周数(如果日历打算显示为 6 行 7 列，则此值表示了当前月的日期所跨越的行数)
 *   5) addDays()、addMonths()、addYears() 三个方法分别用于在当前日期基础上增加/减少指定的天、月、年；
 *      增减行为将尽可能地保持“语义化”，例如，在 2012-2-29(闰年2月29日) 基础上调用 addYears() 方法增加 1 年，当前日期会变为 2013-2-28(保持为2月最后一天)；
 *      如果增减操作使当前日期超出 JS 可表示的有效时间范围，或者传入的参数无效，则增减操作无效，当期日期保持在操作前的值
 *   6) 想获取当前日期的日期对象，请直接使用 this.curDate.
 *
 * @example    // 典型的调用示例
    var Calendar = require('util/calendar'),
      canlendar = new Calendar();

    canlendar.getCanlendarData();    // {curYear: 2014, curMonth: 7, curDate: 11, calendarDays: Array[42], curMonthDaysCount: 31…}
    canlendar.addMonths(7);          // {curYear: 2015, curMonth: 2, curDate: 11, calendarDays: Array[42], curMonthDaysCount: 28…}
    canlendar.curDate;               // Date 对象 (Wed Feb 11 2015 00:00:00 GMT+0800 (中国标准时间))

    canlendar.getCanlendarData('2012-02-29');    // {curYear: 2012, curMonth: 2, curDate: 29, calendarDays: Array[42], curMonthDaysCount: 29…}
    canlendar.addYears(-2);                      // {curYear: 2010, curMonth: 2, curDate: 28, calendarDays: Array[42], curMonthDaysCount: 28…}
 */

var timeFormater = require('./timeFormater'),
  safeCall = require('./safeCall');

// 构造日历数据
function buildCalendar() {
  var _firstDay = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1, 0, 0, 0, 0),
    _preDayCount = (_firstDay.getDay() || 7) - this.firstDayOfWeek,
    _leftDayCount = 42 - _preDayCount,
    _days = [],
    _daysCount = 0,
    _daysIndex = [_preDayCount];

  for (var i = -_preDayCount; i < _leftDayCount; ++i) {
    var _date = new Date(_firstDay.getTime() + i * 24 * 3600 * 1000),
      isDisabled = _date.getMonth() != _firstDay.getMonth() || safeCall(this.onDateCheck, _date, this) === false;

    i >= 0 && _date.getMonth() == _firstDay.getMonth() && ++_daysCount;

    _days.push({
      isHoliday: _date.getDay() % 6 == 0,
      isDisabled: isDisabled,
      isCurDate: !isDisabled && _date.getTime() == this.curDate.getTime(),
      isToday: _date.getTime() == this.today.getTime(),
      year: _date.getFullYear(),
      month: _date.getMonth() + 1,
      date: _date.getDate(),
      dateObj: new Date(_date)
    });
  }

  return {
    curYear: this.curDate.getFullYear(),
    curMonth: this.curDate.getMonth() + 1,
    curDate: this.curDate.getDate(),
    calendarDays: _days,
    curMonthDaysCount: _daysCount,
    curMonthDaysIndex: [_preDayCount, _preDayCount + _daysCount - 1],
    curMonthOverWeeks: Math.ceil((_daysCount - (7 - _preDayCount)) / 7) + (_preDayCount < 7 ? 1 : 0)
  };
}

// 构造函数
function Calendar(args) {
  args = args || {};

  this.firstDayOfWeek = isNaN(parseInt(args.firstDayOfWeek)) ? 0 : Math.max(Math.min(args.firstDayOfWeek, 6), 0);
  this.onDateCheck = typeof args.onDateCheck === 'function' ? args.onDateCheck : null;

  try {
    this.today = timeFormater.build(args.today);
  } catch (ex) {
    this.today = new Date();
  } finally {
    this.today.setHours(0, 0, 0, 0);
    this.curDate = this.today;
  }
}

Calendar.prototype = {
  constructor: Calendar,
  getCanlendarData: function (curDate) {
    try {
      this.curDate = timeFormater.build(curDate || this.curDate || this.today);
    } catch (ex) {
      this.curDate = new Date(this.today);
    } finally {
      this.curDate.setHours(0, 0, 0, 0);

      return buildCalendar.call(this);
    }
  },
  addDays: function (dayCount) {
    dayCount = dayCount == undefined ? 1 : (isNaN(parseInt(dayCount)) ? 0 : parseInt(dayCount));
    var _date = new Date(this.curDate.getTime() + dayCount * 24 * 3600 * 1000);

    if (_date.toString() != 'Invalid Date') {
      this.curDate = new Date(_date);
    }
    _date = null;

    return buildCalendar.call(this);
  },
  addMonths: function (monthCount) {
    monthCount = monthCount == undefined ? 1 : (isNaN(parseInt(monthCount)) ? 0 : parseInt(monthCount));
    var _date = new Date(this.curDate);

    _date.setFullYear(this.curDate.getFullYear() + (monthCount > 0 ? Math.floor : Math.ceil).call(null, monthCount / 12), this.curDate.getMonth() + monthCount % 12);

    if (_date.toString() != 'Invalid Date') {
      this.curDate = new Date(_date.getTime() - (_date.getMonth() - (this.curDate.getMonth() + monthCount % 12 + 12) % 12) * 24 * 3600 * 1000);
    }
    _date = null;

    return buildCalendar.call(this);
  },
  addYears: function (yearCount) {
    yearCount = yearCount == undefined ? 1 : (isNaN(parseInt(yearCount)) ? 0 : parseInt(yearCount));
    var _date = new Date(this.curDate);

    _date.setFullYear(_date.getFullYear() + yearCount);

    if (_date.toString() != 'Invalid Date') {
      if (_date.getMonth() != this.curDate.getMonth()) {
        _date = new Date(_date.getTime() - 1 * 24 * 3600 * 1000);
      }

      this.curDate = new Date(_date);
    }
    _date = null;

    return buildCalendar.call(this);
  }
};


module.exports = Calendar;
