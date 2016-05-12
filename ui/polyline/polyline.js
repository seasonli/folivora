/**
 * @fileoverview 折线图
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2015-01-15 | SeasonLi    // 初始版本
 * @version 1.1 | 2015-03-12 | SeasonLi    // 增加了对于 range 的验证
 *
 * @method constructor(args)    // 构造函数：构造折线图对象。
 *   @param args {Object}       // 参数：构造函数参数 (必选)
 *     categories {Array}       // 参数：折线图 x 轴标签集合（必选）
 *     dataSet {Array}          // 参数：折线数据组（必选，为二维数组，每个一维数组为一条折线数据）
 *     chartSize {Object}       // 参数：折线图尺寸 (可选)
 *       width {Number}         // 参数：折线图宽度 (可选，默认值：200)
 *       height {Number}        // 参数：折线图高度 (可选，默认值：100)
 *     canvasSize {Object}      // 参数：折线图画布尺寸 (可选)
 *       width {Number}         // 参数：折线图画布宽度 (可选，默认值：折线图宽度)
 *       height {Number}        // 参数：折线图画布高度 (可选，默认值：折线图高度)
 *     xAxix {Object}           // 参数：x 轴选项 (可选)
 *       isSHow {Boolean}       // 参数：x 轴是否展现 (可选，默认值：true)
 *       orientation {String}   // 参数：x 轴方向 (可选，取值范围：TOP|BOTTOM，默认值：BOTTOM)
 *       stroke {Object}        // 参数：x 轴线条配置选项 (可选)
 *         width {Number}       // 参数：x 轴线条宽度 (可选，默认值：1)
 *         color {string}       // 参数：x 轴线条色值 (可选，默认值：'#999')
 *       text {Object}          // 参数：x 轴文字配置选项 (可选)
 *         fontSize {Number}    // 参数：x 轴文字尺寸 (可选，默认值：1)
 *         color {String}       // 参数：x 轴文字色值 (可选，默认值：'#666')
 *     yAxix {Object}           // 参数：y 轴配置选项 (可选)
 *       isShow {Boolean}       // 参数：y 轴是否展现 (可选，默认值：false)
 *       orientation {String}   // 参数：y 轴方向 (可选，取值范围：LEFT|RIGHT，默认值：LEFT)
 *       division {Number}      // 参数：y 轴显示刻度数 (可选，默认值：0)
 *       stroke {Object}        // 参数：y 轴线条配置选项 (可选)
 *         width {Number}       // 参数：y 轴线条宽度 (可选，默认值：1)
 *         color {string}       // 参数：y 轴线条色值 (可选，默认值：'#999')
 *       text {Object}          // 参数：y 轴文字配置选项 (可选)
 *         fontSize {Number}    // 参数：y 轴文字尺寸 (可选，默认值：1)
 *         color {String}       // 参数：y 轴文字色值 (可选，默认值：'#666')
 *         formatter {Function} // 参数：y 轴文字刻度格式化方法 (可选，将会传入参数 value 为刻度原始值，默认值：null)
 *     line {Object}            // 参数：折线配置选项 (可选)
 *       isShowShadow {Boolean} // 参数：折线阴影是否展现 (可选，默认值：false)
 *       stroke {Object}        // 参数：折线线条配置选项 (可选)
 *         width {Number}       // 参数：折线线条宽度 (可选，默认值：2)
 *       dot {Object}           // 参数：折线点配置选项 (可选)
 *         radius {Number}      // 参数：折线点半径 (可选，默认值：线条宽度的 3 倍)
 *         isHollow {Boolean}   // 参数：折线点是否空心 (可选，默认值：false)
 *     colorSet {Array}         // 参数：折线颜色数据集（可选，默认值：12种预设色彩中循环按序分派）
 *   @return {Object}           // 返回：折线图对象
 *
 * @method getNode()      // 方法：获得折线图节点 DOM 对象
 *   @param No            // 参数：无
 *   @return {Element}    // 返回：雷达图节点（JQuery 对象）
 *
 * @method getHTML()      // 方法：获得折线图节点 HTML
 *   @param No            // 参数：无
 *   @return {String}     // 返回：雷达图节点 HTML
 *
 * @description
 *
 * @example
    var Polyline = require('wiki-common:widget/ui/polyline/polyline.js');

    var polyline = new Polyline({
      chartSize: {
        width: 400,
        height: 100
      },
      canvasSize: {
        width: 400,
        height: 130
      },
      line: {
        isShowShadow: true,
        dot: {
          isHollow: true
        }
      },
      categories: [
        '2010年', '2011年', '2012年', '2013年', '2014年', '2015年'
      ],
      dataSet: [
        [33, 237, 31, 41, 332, 125]
      ]
    });
    var $polyline = polyline_3.getNode();
    $container.html($polyline);
 */

var browser = require('../util/browser'),
    colorExt = require('../util/color'),
    animation = require('../util/animation'),
    numExt = require('../number');


function factory($) {
    var isSVGSupported = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

    if (!isSVGSupported && browser.ie() && !document.namespaces.v) {
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
        document.createStyleSheet().addRule('.v', 'behavior:url(#default#VML)');
    }

    var painter;
    if (isSVGSupported) {
        painter = {
            createElement: function (tagName) {
                return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));
            },
            group: function () {
                return this.createElement('g');
            },
            line: function (x1, y1, x2, y2) {
                return this.createElement('line').attr({
                    'x1': x1,
                    'y1': y1,
                    'x2': x2,
                    'y2': y2
                });
            },
            polyline: function (points) {
                return this.createElement('polyline').attr('points', points.join(' '));
            },
            polygon: function (points) {
                return this.createElement('polygon').attr('points', points.join(' '));
            },
            circle: function (cx, cy, r) {
                return this.createElement('circle').attr({
                    'cx': cx,
                    'cy': cy,
                    'r': r
                });
            },
            text: function (text) {
                return this.createElement('text').text(text);
            },
            addTitle: function (element, title) {
                $('title', element).remove();
                $(element).append(this.createElement('title')
                    .text(title));
            },
            getCanvas: function (size) {
                return this.createElement('svg').attr({
                    'width': size.width,
                    'height': size.height,
                    'class': 'wgt-polyline'
                }).append(this.createElement('g').attr({
                    'class': 'wgt-polyline-canvas',
                    'transform': 'translate(' + size.width / 2 + ',' + size.height / 2 + ')'
                }));
            }
        };
    } else {
        painter = {
            createElement: function (tagName) {
                return $(document.createElement('<v:' + tagName + ' class="v" />')).css({
                    'position': 'absolute',
                    'display': 'block',
                    'top': 0,
                    'left': 0
                });
            },
            group: function (size) {
                return this.createElement('group').attr({
                    'coordsize': size.width + ' ' + size.height,
                    'coordorigin': -size.width / 2 + ' ' + -size.height / 2
                }).css({
                    'width': size.width,
                    'height': size.height
                });
            },
            line: function (x1, y1, x2, y2) {
                return this.createElement('line').attr({
                    'from': Math.round(x1) + ',' + Math.round(y1),
                    'to': Math.round(x2) + ',' + Math.round(y2)
                });
            },
            polyline: function (points) {
                return this.createElement('polyline').attr('points', $.map(points, function (point) {
                    return [Math.round(point[0]), Math.round(point[1])];
                }).join(' '));
            },
            polygon: function (points) {
                var iePoints = [].concat(points, [points[0]]);

                return this.createElement('polyline').attr('points', $.map(iePoints, function (point) {
                    return [Math.round(point[0]), Math.round(point[1])];
                }).join(' '));
            },
            circle: function (cx, cy, r) {
                return this.createElement('oval').css({
                    'left': Math.round(cx - r),
                    'top': Math.round(cy - r),
                    'width': Math.round(r * 2),
                    'height': Math.round(r * 2)
                });
            },
            text: function (text) {
                return this.createElement('textbox').css({
                    'padding': '0'
                }).text(text);
            },
            addTitle: function (element, title) {
                $(element).attr($.extend({}, title ? {
                    'title': title
                } : {}));
            },
            getCanvas: function (size) {
                return $('<div>').addClass('wgt-polyline').css({
                    'position': 'relative'
                }).append($('<div>').addClass('wgt-polyline-canvas').css({
                    'width': size.width,
                    'height': size.height
                }));
            }
        };
    }

    function Polyline(args) {
        if (!args) {
            throw new Error('[Polyline Exception]: No arguments.');
        } else if (!args.categories || typeof args.categories != 'object' || !(args.categories instanceof Array) || args.categories.length < 1) {
            throw new Error('[Polyline Exception]: Illegal arguments: categories.');
        } else {
            this.conValToLat = function (value) {
                return this.canvasSize.height / 2 - this.paddingY * (this.xAxis.orientation == 'BOTTOM' ? 1 : 0) - this.chartSize.height * (value - this.range[0]) / (this.range[1] - this.range[0]);
            };
            this.conLatToVal = function (latitude) {
                return (this.canvasSize.height / 2 - this.paddingY * (this.xAxis.orientation == 'BOTTOM' ? 1 : 0) - latitude) / this.chartSize.height * (this.range[1] - this.range[0]) + this.range[0];
            };
            this.__setRange = function (__range) {
                function __set(range) {
                    var range = (typeof range == 'object' && range instanceof Array && range[0] != range[1]) ? range : [];
                    if (typeof range[0] != 'number' || typeof range[1] != 'number') {
                        var minArr = [],
                            maxArr = [];
                        for (var i in this.dataSet) {
                            minArr.push(Math.min.apply({}, this.dataSet[i]));
                            maxArr.push(Math.max.apply({}, this.dataSet[i]));
                        }
                        var min = Math.min.apply({}, minArr),
                            max = Math.max.apply({}, maxArr),
                            diff = (typeof range[1] == 'number' ? range[1] : max) - (typeof range[0] == 'number' ? range[0] : min),
                            range = [typeof range[0] == 'number' ? range[0] : min - diff * 0.1, typeof range[1] == 'number' ? range[1] : max + diff * 0.1];
                    }
                    if (range[0] == range[1]) {
                        if (range[0] === 0) {
                            range = [-1, 1];
                        }
                        __set.call(this, range);
                    } else {
                        __range = range;
                    }
                }

                var __range = __range;
                __set.call(this, __range);
                return __range;
            };

            this.chartSize = {
                width: args.chartSize && (typeof args.chartSize.width == 'number') && Math.abs(args.chartSize.width) || 200,
                height: args.chartSize && (typeof args.chartSize.height == 'number') && Math.abs(args.chartSize.height) || 100
            };
            this.canvasSize = {
                width: args.canvasSize && (typeof args.canvasSize.width == 'number') && Math.abs(args.canvasSize.width) || this.chartSize.width,
                height: args.canvasSize && (typeof args.canvasSize.height == 'number') && Math.abs(args.canvasSize.height) || this.chartSize.height
            }

            this.xAxis = args.xAxis || {};
            this.xAxis.isShow = typeof this.xAxis.isShow == 'boolean' ? this.xAxis.isShow : true;
            this.xAxis.orientation = /^TOP|BOTTOM$/i.test(this.xAxis.orientation) ? (RegExp.$_).toUpperCase() : 'BOTTOM';
            this.xAxis.stroke = this.xAxis.stroke || {};
            this.xAxis.stroke.width = (typeof this.xAxis.stroke.width == 'number' && this.xAxis.stroke.width) || 1;
            this.xAxis.stroke.color = this.xAxis.stroke.color || '#999';
            this.xAxis.text = this.xAxis.text || {};
            this.xAxis.text.fontSize = typeof this.xAxis.text.fontSize == 'number' && this.xAxis.text.fontSize || 14;
            this.xAxis.text.color = this.xAxis.text.color || '#666';

            this.yAxis = args.yAxis || {};
            this.yAxis.isShow = typeof this.yAxis.isShow == 'boolean' ? this.yAxis.isShow : false;
            this.yAxis.orientation = /^LEFT|RIGHT$/i.test(this.yAxis.orientation) ? (RegExp.$_).toUpperCase() : 'LEFT';
            this.yAxis.division = this.yAxis.division || 0;
            this.yAxis.stroke = this.yAxis.stroke || {};
            this.yAxis.stroke.width = (typeof this.yAxis.stroke.width == 'number' && this.yAxis.stroke.width) || 1;
            this.yAxis.stroke.color = this.yAxis.stroke.color || '#999';
            this.yAxis.text = this.yAxis.text || {};
            this.yAxis.text.formatter = typeof this.yAxis.text.formatter == 'function' && this.yAxis.text.formatter || function (value) {
                return value;
            }
            this.yAxis.text.fontSize = typeof this.yAxis.text.fontSize == 'number' && this.yAxis.text.fontSize || 14;
            this.yAxis.text.color = this.yAxis.text.color || '#666';


            this.line = args.line || {};
            this.line.stroke = this.line.stroke || {};
            this.line.stroke.width = typeof this.line.stroke.width == 'number' ? this.line.stroke.width : 2;
            this.line.dot = this.line.dot || {};
            this.line.dot.radius = typeof this.line.dot.radius == 'number' ? this.line.dot.radius : this.line.stroke.width * 3;
            this.line.dot.isHollow = typeof this.line.dot.isHollow == 'boolean' ? this.line.dot.isHollow : false;
            this.line.isShowShadow = typeof this.line.isShowShadow == 'boolean' ? this.line.isShowShadow : false;

            this.paddingX = (this.canvasSize.width - this.chartSize.width) * 1,
                this.paddingY = (this.canvasSize.height - this.chartSize.height) * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1);

            this.categories = args.categories;
            this.dataSet = args.dataSet;
            this.range = this.__setRange(args.range);

            this.getColor = (typeof args.colorSet == 'object' && args.colorSet instanceof Array && args.colorSet.length > 0) ? function (idx) {
                var idx = isNaN(parseInt(idx)) ? 0 : parseInt(idx);
                return args.colorSet[idx % 12];
            } : colorExt.getStdHue;
        }
    }

    Polyline.prototype = {
        constructor: Polyline,
        getNode: function () {
            var node = painter.getCanvas(this.canvasSize),
                $canvas = $('.wgt-polyline-canvas', node);

            var graduationWidth = this.chartSize.width / (this.categories.length + 1);

            // Draw axis
            var polylineAxis = painter.group(this.canvasSize).appendTo($canvas);
            if (this.xAxis.isShow) {
                var polylineAxis_x = painter.line(-this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0), this.chartSize.height * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1) / 2 - this.paddingY / 2, this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0), this.chartSize.height * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1) / 2 - this.paddingY / 2),
                    polylineAxis_x_graduation = [];

                for (var i in this.categories) {
                    var i = parseInt(i);
                    var graduation = {
                        point: painter.line(graduationWidth * (i + 1) - this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0), this.chartSize.height * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1) / 2 - this.paddingY / 2 - 5 * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1), graduationWidth * (i + 1) - this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0), this.chartSize.height * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1) / 2 - this.paddingY / 2),
                        text: painter.text(this.categories[i]).css($.extend({
                            'lineHeight': 1,
                            'fontSize': this.xAxis.text.fontSize,
                            'color': this.xAxis.text.color
                        }, isSVGSupported ? {} : {
                            'left': graduationWidth * (i + 1),
                            'top': this.xAxis.text.fontSize * (this.xAxis.orientation == 'BOTTOM' ? 1 : -1.5)
                        })).attr($.extend({}, isSVGSupported ? {
                            'x': graduationWidth * (i + 1) - this.chartSize.width / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 0.5 : -0.5),
                            'y': this.xAxis.orientation == 'BOTTOM' ? (this.chartSize.height / 2 - this.paddingY / 2 + this.xAxis.text.fontSize * 1.625) : -this.chartSize.height / 2 - this.paddingY / 2 - this.xAxis.text.fontSize,
                            'text-anchor': 'middle',
                            'fill': this.xAxis.text.color
                        } : {})).appendTo(polylineAxis)
                    };
                    polylineAxis.append(graduation.point.attr($.extend({}, isSVGSupported ? {
                        'stroke': this.xAxis.stroke.color,
                        'stroke-width': this.xAxis.stroke.width
                    } : {
                        'stroked': true,
                        'strokecolor': this.xAxis.stroke.color,
                        'strokeweight': this.xAxis.stroke.width * 1.5 + 'px'
                    })).attr({}));
                    polylineAxis_x_graduation.push(graduation);
                }
                polylineAxis.append(polylineAxis_x.attr($.extend({}, isSVGSupported ? {
                    'stroke': this.xAxis.stroke.color,
                    'stroke-width': this.xAxis.stroke.width
                } : {
                    'stroked': true,
                    'strokecolor': this.xAxis.stroke.color,
                    'strokeweight': this.xAxis.stroke.width * 1.5 + 'px'
                })));
            }

            if (this.yAxis.isShow) {
                var polylineAxis_y = painter.line((-this.canvasSize.width / 2 + this.paddingX) * (this.yAxis.orientation == 'LEFT' ? 1 : -1), this.conValToLat(this.range[0]), (-this.canvasSize.width / 2 + this.paddingX) * (this.yAxis.orientation == 'LEFT' ? 1 : -1), this.conValToLat(this.range[1])),
                    polylineAxis_y_graduation = [];

                for (var i = 0; i < this.yAxis.division; i++) {
                    var graduation = {
                        point: painter.line((-this.canvasSize.width / 2 + this.paddingX) * (this.yAxis.orientation == 'LEFT' ? 1 : -1), this.conValToLat((this.range[1] - this.range[0]) / (this.yAxis.division + 1) * (i + 1)), (-this.canvasSize.width / 2 + this.paddingX + 5) * (this.yAxis.orientation == 'LEFT' ? 1 : -1), this.conValToLat((this.range[1] - this.range[0]) / (this.yAxis.division + 1) * (i + 1))),
                        text: painter.text(this.yAxis.text.formatter((this.range[1] - this.range[0]) / (this.yAxis.division + 1) * (i + 1))).css($.extend({
                            'lineHeight': 1,
                            'fontSize': this.yAxis.text.fontSize,
                            'color': this.yAxis.text.color
                        }, isSVGSupported ? {} : {
                            'left': (-this.canvasSize.width + this.paddingX) * (this.yAxis.orientation == 'LEFT' ? 0 : -1) - 10 * (this.yAxis.orientation == 'LEFT' ? 1.5 : -1),
                            'top': this.chartSize.height - ((this.chartSize.height / (this.yAxis.division + 1)) * (i + 1) + this.yAxis.text.fontSize / 3)
                        })).attr($.extend({}, isSVGSupported ? {
                            'x': (-this.canvasSize.width / 2 + this.paddingX - 10) * (this.yAxis.orientation == 'LEFT' ? 1 : -1),
                            'y': this.conValToLat((this.range[1] - this.range[0]) / (this.yAxis.division + 1) * (i + 1)) + this.yAxis.text.fontSize / 3,
                            'text-anchor': this.yAxis.orientation == 'LEFT' ? 'end' : 'start',
                            'fill': this.yAxis.text.color
                        } : {})).appendTo(polylineAxis)
                    };
                    polylineAxis.append(graduation.point.attr($.extend({}, isSVGSupported ? {
                        'stroke': this.yAxis.stroke.color,
                        'stroke-width': this.yAxis.stroke.width
                    } : {
                        'stroked': true,
                        'strokecolor': this.yAxis.stroke.color,
                        'strokeweight': this.yAxis.stroke.width * 1.5 + 'px'
                    })).attr({}));
                    polylineAxis_x_graduation.push(graduation);
                    polylineAxis_y_graduation.push(graduation);
                }
                polylineAxis.append(polylineAxis_y.attr($.extend({}, isSVGSupported ? {
                    'stroke': this.yAxis.stroke.color,
                    'stroke-width': this.yAxis.stroke.width
                } : {
                    'stroked': true,
                    'strokecolor': this.yAxis.stroke.color,
                    'strokeweight': this.yAxis.stroke.width * 1.5 + 'px'
                })));
            }

            // Draw polyline
            var polylineChart = painter.group(this.canvasSize).appendTo($canvas);
            var polylineChart_line = [],
                polylineChart_dots = [],
                polylineChart_shadow = [];

            for (var j in this.dataSet) {
                var j = parseInt(j);
                var data = this.dataSet[j],
                    points_line = [],
                    points_polygon = [
                        [graduationWidth - this.chartSize.width / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0) - (this.canvasSize.width - this.chartSize.width) / 2, this.conValToLat(this.range[0])]
                    ];
                polylineChart_dots[j] = [];

                for (var i in data) {
                    var i = parseInt(i);
                    if (i + 1 > this.categories.length) {
                        break;
                    }
                    var point = {
                        x: graduationWidth * (i + 1) - this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0),
                        y: this.conValToLat(data[i])
                    };

                    points_line.push([point.x, point.y]);
                    points_polygon.push([point.x, point.y]);


                    var outerDot = painter.circle(point.x, point.y, this.line.dot.radius * 1.5)
                        .attr($.extend({}, isSVGSupported ? {
                            'fill': '#fff'
                        } : {
                            'fillcolor': '#fff',
                            'stroked': false
                        }));
                    var innerDot = painter.circle(point.x, point.y, this.line.dot.isHollow ? this.line.dot.radius / 3 * 2 : this.line.dot.radius)
                        .addClass('wgt-polyline-dot')
                        .attr($.extend({}, isSVGSupported ? {
                            'Class': 'wgt-polyline-dot',
                            'fill': this.line.dot.isHollow ? '#fff' : this.getColor(j),
                            'stroke': this.getColor(j),
                            'stroke-width': this.line.dot.isHollow ? this.line.dot.radius / 3 : 0
                        } : {
                            'fillcolor': this.line.dot.isHollow ? '#fff' : this.getColor(j),
                            'stroked': this.line.dot.isHollow,
                            'strokecolor': this.getColor(j),
                            'strokeweight': this.line.dot.isHollow ? this.line.dot.radius / 3 : 0 + 'px'
                        })).data({
                            'data': {
                                'category': this.categories[i],
                                'value': data[i],
                                'index': i
                            },
                            'dataSet': {
                                'index': j
                            }
                        });
                    polylineChart_dots[j].push([outerDot, innerDot]);
                }

                points_polygon.push([graduationWidth * points_line.length - this.chartSize.width / 2 - (this.canvasSize.width - this.chartSize.width) / 2 + this.paddingX * (this.yAxis.orientation == 'LEFT' ? 1 : 0), this.conValToLat(this.range[0])]);

                if (this.line.isShowShadow) {
                    polylineChart_shadow.push(painter.polygon(points_polygon).css({
                        'opacity': 0.15
                    }).attr($.extend({}, isSVGSupported ? {
                        'fill': this.getColor(j)
                    } : {
                        'stroked': false,
                        'fillcolor': this.getColor(j)
                    })).addClass('wgt-polyline-shadow').data({
                        'dataSet': {
                            'index': j
                        }
                    }));
                }
                polylineChart_line.push(painter.polyline(points_line).addClass('wgt-polyline-line').attr($.extend({}, isSVGSupported ? {
                    'fill': 'transparent',
                    'stroke': this.getColor(j),
                    'stroke-width': this.line.stroke.width
                } : {
                    'filled': false,
                    'stroked': true,
                    'strokecolor': this.getColor(j),
                    'strokeweight': this.line.stroke.width * 1.5 + 'px'
                })).data({
                    'dataSet': {
                        'index': j
                    }
                }));
            }

            for (var i in this.dataSet) {
                if (this.line.isShowShadow) {
                    polylineChart.append(polylineChart_shadow[i]);
                }
                polylineChart.append(polylineChart_line[i]);
                for (var j in this.dataSet[i]) {
                    polylineChart.append(polylineChart_dots[i][j]);
                }
            }

            return this.node = node;
        },
        getHTML: function () {
            var node = this.getNode();
            return isSVGSupported ? new XMLSerializer().serializeToString(node[0]) : node.html();
        }
    };


    return Polyline;
}


module.exports = factory($);
