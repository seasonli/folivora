/**
 * @fileoverview 函数调用器
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-13 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-07-20 | SeasonLi    // 修复一处变量拼写错误
 *
 * @method safeCall(fun, args, thisArg)    // 方法：函数调用器(参阅下文详述)
 *   @param fun {Function}                 // 参数：要调用的函数(可选，默认为空)
 *   @param args {Object}                  // 参数：函数被调用时传入的参数(可选，默认值为空)
 *   @param thisArg {Object}               // 参数：函数被调用时传入的 this 参数(可选，默认值：null)
 *   @return {Unknown}                     // 返回：被调用函数返回的结果
 *
 * @description    // 附加说明
 *   1) safeCall() 方法用于“安全地”调用某一函数，它会检查被调用方法是否存在，
 *      并在未指定 thisArg 时，确保函数不会在全局 window 对象上调用(仅高级浏览器支持)
 *   2) 在需要给被调用函数传入多个参数时，请使用数组；单个参数时可不用数组
 *   3) safeCall() 特别适合用来调用经由“非必须”参数传入的方法(通常是回调)
 *
 * @example    // 典型的调用示例
    var safeCall = require('util/safeCall.js');

    // 传入单个参数
    safeCall(function(name){
      return 'We all love ' + name;
    }, 'Baike!');    // 'We all love Baike!'

    // 传入多个参数
    safeCall(function(name, attitude){
      return 'We all ' + [attitude, name].join(' ');
    }, ['Baike!', 'love']);    // 传入多个参数
 */

module.exports = function (fun, args, thisArg) {
  'use strict'; // Use strict mode to ensure that function will not be called on global 'window' object when 'thisArg' was omitted.

  if (fun && typeof fun === 'function') {
    return fun.apply(typeof thisArg === 'object' ? thisArg : null, args !== undefined ? [].concat(args) : []);
  }
};