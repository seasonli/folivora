/**
 * @fileoverview 逐帧动画
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2014-07-18 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-07-20 | SeasonLi    // 调整重载版本 animation() 方法的接口定义使之更适合 setTimeout() 的应用场景
 * @version 1.2 | 2014-08-06 | SeasonLi    // 修正重载版本 animation() 接口参数引用顺序错误
 * @version 1.3 | 2014-08-07 | SeasonLi    // 统一修改：通用组件中回调被调用时，设置 this 指向实例自身
 * @version 1.4 | 2014-08-24 | SeasonLi    // 修复数值有效性校验的一处遗漏
 * @version 1.5 | 2014-09-10 | SeasonLi    // 修复因 Mac 环境 Safari 浏览器不支持 window.performance 而引起的动画无法正常执行的 bug
 * @version 1.6 | 2014-09-11 | SeasonLi    // 调整重载版本 animation() 方法的接口定义，放弃适应 setTimeout() 应用场景，使之更合适动画应用场景
 *
 * @method animation(args)      // 方法：初始化并启动动画(单参数完整配置)
 *   @param args {Object}       // 参数：动画初始化属性(必选，参阅下文详述)
 *     duration {Number}        // 参数：动画持续时长，单位 ms(可选，默认值：400)
 *     delay {Number}           // 参数：动画延迟执行的时间，单位 ms(可选，默认值：0)
 *     easing {String}          // 参数：动画缓动类型(可选，默认值：'easeOutQuad'，参阅下文详述)
 *     onStart {Function}       // 参数：动画启动时回调(可选，默认无，参阅下文详述)
 *     onStep {Function}        // 参数：每帧动画回调(可选，默认无，参阅下文详述)
 *     onComplete {Function}    // 参数：动画完成时回调(可选，默认无，参阅下文详述)
 *   @return {Object}           // 返回：动画操作句柄(参阅下文详述)
 *
 * @method animation(duration, onStep, easing, onComplete)    // 方法：初始化并启动动画(重载，多参数便捷配置)
 *   @param duration {Number}                                 // 参数：动画持续时长，单位 ms(可选，默认值：400)
 *   @param onStep {Function}                                 // 参数：每帧动画回调(可选，默认无，参阅下文详述)
 *   @param easing {String}                                   // 参数：动画缓动类型(可选，默认值：'easeOutQuad'，参阅下文详述)
 *   @param onComplete {Function}                             // 参数：动画完成时回调(可选，默认无，参阅下文详述)
 *   @return {Object}                                         // 返回：动画操作句柄(参阅下文详述)
 *
 * @description    // 附加说明
 *   1) 逐帧动画是基于现代浏览器 window.requestAnimationFrame() 接口构建的，能够根据浏览器的刷新重绘频率逐帧执行
 *      使动画平滑、连贯而又不至于产生冗余的计算迭代，降低 CPU 性能开销
 *      在不受支持的浏览器下采用 setTimeout() 的方式模拟(帧率 60 fps)
 *   2) animation() 初始化方法采用“单参数完整配置”的版本可以配置全部受支持的参数；
 *      此外还有一个采用“多参数便捷配置”的重载版本，仅保留了最常用参数
 *   3) 所有参数其实都有默认值，但考虑到初始化一个没有任何操作的空 animation 没有任何意义，因而当不传任何参数初始化时，会抛出异常
 *   4) 动画缓动类型 easing 采用 wiki-common:widget/util/tween.js 中定义的缓动类型，使用时传入缓动函数名称即可(参阅示例)；
 *      如果想要使用自定义缓动算法，请直接传入缓动算法函数，接口定义请参阅上述 tween.js 中的缓动算法函数
 *   5) 动画可以延迟执行(通过参数 delay 配置)，相应的 onStart() 回调只有在动画真正开始执行时才会触发；
 *      动画一旦初始化完成即进入计时流程，根据参数 delay 的配置，动画会立即或延迟执行
 *   6) onStart()、onStep()、onComplete() 三个回调在触发时，传入参数 progress {Number}，取值 [0, 1](双闭区间)，表示动画执行进度
 *   7) animation() 初始化方法返回一个“动画操作句柄”(动画对象)，在此句柄上可以调用 stop()、reseume() 方法，实现对动画的操控
 *      方法说明如下，使用方式请参阅示例
 *      · stop()   : 暂停动画执行，只有在动画处于“执行”状态时，此方法才有效；
 *      · resume() : 在动画暂停时，恢复执行；在动画执行结束后，重新开始执行动画(将忽略第一次执行时设置的延时 delay 参数)
 *   8) “动画操作句柄”同样可以用来查看动画当前的执行状态，其 aniState 属性包含如下值：
 *      · STOP   : 动画未启动或执行结束
 *      · PLAY   : 动画正在执行
 *      · PAUSED : 动画暂停
 *      需要查询动画执行状态时，请务必(MUST)使用此属性，而不要(MUST NOT)通过“动画操作句柄”上的其他属性来判断
 *
 * @example    // 典型的调用示例
    var animation = require('util/animation.js');

    var ani = animation({
      duration: 2000,                        // 执行时长 3s
      delay: 1000,                           // 延迟 1s 执行
      easing: 'linear',                      // 使用线性动画缓动
      onStart: function(progress){           // 动画结束回调
        console.log('start: ' + progress);
      },
      onStep: function(progress){            // 逐帧回调
        console.log('step: ' + progress);    // 输出动画执行进度
      },
      onComplete: function(progress){        // 动画结束回调
        console.log('complete: ' + progress);
      }
    });

    // 可在动画执行过程中做如下操控：
    ani.stop();      // 暂停动画
    ani.resume();    // 恢复或重新开始动画

    // 使用快捷版本重载：
    animation(2000, function(progress){
      console.log('step: ' + progress);
    }, 'linear');

    // 使用自定义动画缓动算法：
    animation(2000, function(progress){
      console.log('step: ' + progress);
    }, function(x, t, b, c, d){    // 自定义缓动算法
      // return ...
    });
 */

var tween = require('./tween'),
    safeCall = require('./safeCall');


// 初始化 raf、caf.
var browserPrefix = ['webkit', 'moz'],
    screenRefreshInterval = 1000 / 60,
    initialTimeStamp = +new Date(),
    isDomHighResTimeStampSupported = window.performance && typeof window.performance.now === 'function',
    ani = {};

ani.raf = window.requestAnimationFrame;
ani.caf = window.cancelAnimationFrame;

if (!ani.raf) {
    for (var i = 0; i < browserPrefix.length; ++i) {
        ani.raf = window[browserPrefix + 'RequestAnimationFrame'];
        ani.caf = window[browserPrefix + 'CancelAnimationFrame'] || window[browserPrefix + 'CancelRequestAnimationFrame'];

        if (ani.raf) {
            break;
        }
    }
}

if (!ani.raf || !isDomHighResTimeStampSupported) {
    ani.raf = function (callback) {
        return setTimeout(function () {
            callback(isDomHighResTimeStampSupported ? window.performance.now() : (new Date() - initialTimeStamp));
        }, screenRefreshInterval);
    };
}

if (!ani.caf) {
    ani.caf = function (handler) {
        clearTimeout(handler);
    }
}

// 动画类
function Animation(args) {
    if (arguments.length == 1 && typeof arguments[0] === 'object') {
        this.duration = isNaN(parseInt(args.duration)) ? 400 : Math.abs(parseInt(args.duration));
        this.delay = isNaN(parseInt(args.delay)) ? 0 : Math.abs(parseInt(args.delay));
        this.easing = typeof args.easing === 'function' ? args.easing : (typeof tween[args.easing] === 'function' ? tween[args.easing] : tween.easeOutQuad);
        this.onStart = typeof args.onStart === 'function' ? args.onStart : null;
        this.onStep = typeof args.onStep === 'function' ? args.onStep : null;
        this.onComplete = typeof args.onComplete === 'function' ? args.onComplete : null;
    } else {
        this.duration = isNaN(parseInt(arguments[0])) ? 400 : Math.abs(parseInt(arguments[0]));
        this.delay = 0;
        this.onStep = typeof arguments[1] === 'function' ? arguments[1] : null;
        this.easing = arguments[2] && typeof arguments[2] === 'function' ? arguments[2] : (typeof tween[arguments[2]] === 'function' ? tween[arguments[2]] : tween.easeOutQuad);
        this.onComplete = typeof arguments[3] === 'function' ? arguments[3] : null;
    }

    this.elapsedTime = 0;
    this.progress = 0;
    this.curDuration = 0;
    this.hasAniStarted = false;
    this.aniState = 'STOP';

    this.resume();
}

Animation.prototype = {
    constructor: Animation,
    stop: function () {
        if (this.aniState == 'PLAY') {
            this.aniState = this.progress < 1 ? 'PAUSED' : 'STOP';
            this.elapsedTime = this.curDuration;

            ani.caf.call(window, this.aniRollId);

            return this.progress;
        }
    },
    resume: function () {
        if (this.aniState != 'PLAY') {
            var self = this;

            this.aniState = 'PLAY';
            this.startTick = isDomHighResTimeStampSupported ? window.performance.now() : (new Date() - initialTimeStamp);
            this.elapsedTime > 0 && (this.delay = 0);

            (this.aniRoll = function (tick) {
                var _interval = tick - self.startTick;

                if (_interval >= self.delay) {
                    if (!self.hasAniStarted) {
                        self.hasAniStarted = true;

                        safeCall(self.onStart, 0, self);
                        safeCall(self.onStep, 0, self);
                    } else {
                        self.curDuration = self.elapsedTime + _interval - self.delay;

                        if (self.curDuration < self.duration) {
                            self.progress = self.easing(null, self.curDuration, 0, 1, self.duration);
                            safeCall(self.onStep, self.progress, self);
                        }
                    }
                }

                if (self.curDuration < self.duration) {
                    self.aniRollId = ani.raf.call(window, self.aniRoll);
                } else {
                    if (self.progress < 1) {
                        safeCall(self.onStep, 1, self);
                    }

                    self.elapsedTime = 0;
                    self.curDuration = 0;
                    self.hasAniStarted = false;
                    self.progress = 0;
                    self.aniState = 'STOP';

                    safeCall(self.onComplete, 1, self);
                }
            })(this.startTick);
        }
    }
};

// 动画类代理
function AnimationProxy() {
    return Animation.apply(this, arguments[0]);
}
AnimationProxy.prototype = Animation.prototype;


module.exports = function () {
    if (arguments.length < 1) {
        throw new Error('[Animation Exception]: No arguments.');
    } else {
        return new AnimationProxy(arguments);
    }
}
