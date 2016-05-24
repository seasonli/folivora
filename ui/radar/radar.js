/**
 * @fileoverview 雷达图
 * @author SeasonLi | season.chopsticks@gmail.com
 * @version 1.0 | 2015-01-15 | SeasonLi    // 初始版本
 * @version 1.1 | 2014-12-03 | SeasonLi    // 修复 resetDataSet() 方法无法正确重置覆盖层颜色的 bug.
 * @version 1.2 | 2014-12-16 | SeasonLi    // 引入数值序列生成方法。
 *
 * @method constructor(args)     // 构造函数：构造雷达图对象。
 *   @param args {Object}        // 参数：构造函数参数(必选)
 *     categories {Array}        // 参数：雷达图数据展现维度标签集合(必选，长度 >= 3)
 *     chartSize {Number}        // 参数：雷达图直径(可选，默认值：100)
 *     canvasSize {Object}       // 参数：画布尺寸(可选，默认为雷达图绘制所需最小尺寸，不包含 label 展现所需的空间；参阅下文详述)
 *       width {Number}          // 参数：画布宽度(可选，默认值：chartSize)
 *       height {Number}         // 参数：画布高度(可选，默认值：chartSize)
 *     radarType {String}        // 参数：雷达图类型(可选，取值范围：'SPIDER'、'CIRCLE'，默认值：'SPIDER'；参阅下文详述)
 *     bgColor {String}          // 参数：雷达图背景色(可选，默认值：'#E3E3E3')
 *     bgFillingMode {String}    // 参数：雷达图背景填充模式(可选，默认值：'NONE'；参阅下文详述)
 *     lineColor {String}        // 参数：雷达图背景分区线颜色(可选，默认值：'#E3E3E3')
 *     borderColor {String}      // 参数：雷达图背景折线(圆弧)颜色(可选，默认与 lineColor 相同)
 *     valueRange {Array}        // 参数：雷达图示数取值范围(数组表示，可选，默认值：[0, 10])
 *     scaleSpan {Number}        // 参数：雷达图刻度间隔(可选，默认值：valueRange / 3；参阅下文详述)
 *     scaleColor {String}       // 参数：雷达图刻度颜色(可选，默认值：同 borderColor 或 lineColor)
 *     showScales {Boolean}      // 参数：是否绘制刻度(可选，默认值：true)
 *     labelColor {String}       // 参数：雷达图数据维度标签颜色(可选，默认值：'#666')
 *     labelFontSize {Number}    // 参数：雷达图数据维度标签字号(可选，默认值：12)
 *     dataSet {Array}           // 参数：雷达图前景(覆盖层)数据集(可选，参阅下文详述)
 *       color {String}          // 参数：覆盖层颜色(可选，默认在 12 种预设色彩中循环按序分派)
 *       title {String}          // 参数：覆盖层鼠标 hover 时 tip(可选，默认为空)
 *       data {Array}            // 参数：覆盖层在雷达图各数据维度上的取值(可选，默认所有取值都为 0)
 *   @return {Object}            // 返回：雷达图对象。
 *
 * @method getNode()     // 方法：获得雷达图节点 DOM 对象。
 *   @param No           // 参数：无。
 *   @return {Element}   // 返回：雷达图节点(jQuery 对象)。
 *
 * @method getHTML()     // 方法：获得雷达图节点 HTML(注：此处不严谨，事实上是XML；参阅下文详述)。
 *   @param No           // 参数：无。
 *   @return {String}    // 返回：雷达图节点 HTML。
 *
 * @method addDataSet(newDataSets, callback)    // 方法：向雷达图中插入新的前景覆盖层(参阅下文详述)。
 *   @param newDataSets {Array}                 // 参数：新覆盖层参数(可选，默认为空)。
 *     color {String}                           // 参数：覆盖层颜色(可选，默认在 12 种预设色彩中按序分派)
 *     title {String}                           // 参数：覆盖层鼠标 hover 时 tip(可选，默认为空)
 *     data {Array}                             // 参数：覆盖层在雷达图各数据维度上的取值(可选，默认所有取值都为 0)
 *   @param callback {Function}                 // 参数：回调，在插入操作完成时被调用(可选，默认无；调用时无传参)
 *   @return No                                 // 返回：无。
 *
 * @method removeDataSet(indexes, callback)    // 方法：从雷达图中移除前景覆盖层(参阅下文详述)。
 *   @param indexes {Array|Number}             // 参数：要移除的覆盖层索引序列(可选，默认为空，移除所有覆盖层)。
 *   @param callback {Function}                // 参数：回调，在移除操作完成时被调用(可选，默认无；调用时无传参)
 *   @return No                                // 返回：无。
 *
 * @method resetDataSet(index, resetData, callback)    // 方法：重置(修改)雷达图中某前景覆盖层的参数(参阅下文详述)。
 *   @param index {Numer}                              // 参数：要重置(修改)的覆盖层索引(可选，默认值无，不执行任何操作)
 *   @param resetData {Object}                         // 参数：要重置(修改)的覆盖层参数(可选，默认保留此覆盖层原参数)
 *     color {String}                                  // 参数：覆盖层颜色(可选，默认保留原色)
 *     title {String}                                  // 参数：覆盖层鼠标 hover 时 tip(可选，默认保留原 title)
 *     data {Array}                                    // 参数：覆盖层在雷达图各数据维度上的取值(可选，默认保留原值)
 *   @param callback {Function}                        // 参数：回调，在重置操作完成时被调用(可选，默认无；调用时无传参)
 *   @return No                                        // 返回：无。
 *
 * @description    // 附加说明。
 *   1) 雷达图在高级浏览器下使用 svg 绘制；在 IE 8 及更低版本 IE 下，使用 vml 绘制。
 *   2) canvasSize 定义画布尺寸，雷达图会绘制在画布的中央。
 *      因雷达图数据维度标签文本长度的不确定，用户需要自行根据实际显示效果调整画布尺寸以保证显示完整或符合需求。
 *   2) radarType 为 'SPIDER' 时，雷达图背景采用多边形折线绘制；值为 'CIRCLE' 时，采用圆形绘制。
 *   3) bgFillingMode 可选值为：'NONE'、'ALTERNATIVE' 和 'GRADIENT'；
 *      为 'NONE' 时，雷达图背景绘制为白色，此时参数 bgColor 的配置将被忽略；
 *      值为 'ALTERNATIVE' 时，雷达图背景采用 bgColor 与白色间隔填充；
 *      值为 'GRADIENT' 时，雷达图背景从中心向外，填充白色到 bgColor 的逐层渐变。
 *   4) valueRange 以数组的形式定义了雷达图示数的取值范围；scaleSpan 则定义了折线(圆弧)绘制的步进长度。
 *      例如：valueRange 为 [1, 10]，scaleSpan 为 2，则绘制的雷达图背景包含 5 个区段。
 *   5) getHTML() 方法用于获取雷达图节点的 HTML(XML) 文本，但通过此种方式手动插入文档的雷达图，
 *      无法通过 addDataSet()、removeDataSet()、resetDataSet() 等方法做后续的动态操作。
 *   6) 构造雷达图时的 dataSet 参数、addDataSet() 方法的 newDataSets 参数及 resetDataSet() 方法的 resetData 参数拥有相同的数据结构，
 *      包含覆盖层的颜色(color)、hover tip(title)、各维度数值集合(data)。
 *   7) removeDataSet() 方法和 resetDataSet() 方法都通过索引值确定要操作的目标覆盖层，此索引值为目标覆盖层在加入雷达图时的索引(从 0 起始的序数)，
 *      而非覆盖层 DOM 元素在其父容器中的层叠顺序(此层叠顺序可能会因用户操作而发生变化)。
 *
 * @example    // 典型的调用示例。
    var Radar = require('wiki-common:widget/ui/radar/radar.js');

    var radar = new Radar({
      chartSize: 150,
      canvasSize: {
        width: 200,
        height: 200
      },
      valueRange: [0, 10],
      borderWidth: 2,
      scaleSpan: 2,
      labelColor: '#666',
      categories: ['A', 'B', 'C', 'D', 'E', 'F'],
      dataSet:[{
        title: '覆盖层_1',
        data: [1, 2, 3, 4, 5, 6]
      }]
    });
    $('#someContainerId').append(radar.getNode());
 */

var browser = require('../util/browser'),
  colorExt = require('../util/color'),
  animation = require('../util/animation'),
  safeCall = require('../util/safeCall'),
  numExt = require('../number');


function factory($) {
  var isSVGSupported = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

  if (!isSVGSupported && browser.ie() && !document.namespaces.v) {
    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
    document.createStyleSheet().addRule('.v', 'behavior:url(#default#VML)');
  }

  // Global events.
  if (isSVGSupported) {
    $('body').on('mouseover', '.wgt_radar .data-graphic', function () {
      var graphic = $(this);
      graphic.parent().append(graphic);
    });
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
          'class': 'wgt_radar'
        }).append(this.createElement('g').attr({
          'class': 'canvas',
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
      polygon: function (points) {
        var iePoints = [].concat(points, [points[0]]); // Duplicate the first point as the last, otherwise the border of the polygon would not be closed in IE.

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
        return $('<div>').addClass('wgt_radar').css({
          'position': 'relative'
        }).append($('<div>').addClass('canvas').css({
          'width': size.width,
          'height': size.height
        }));
      }
    };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function Radar(args) {
    if (!args) {
      throw new Error('[Radar Exception]: No arguments.');
    } else if (!args.categories || args.categories.length < 3) {
      throw new Error('[Radar Exception]: Invalid argument "categories".');
    } else {
      this.chartSize = isNaN(parseInt(args.chartSize)) ? 100 : parseInt(args.chartSize);
      this.radarType = /^SPIDER|CIRCLE$/i.test(args.radarType) ? RegExp.$_ : 'SPIDER';
      this.canvasSize = $.extend({
        width: this.chartSize,
        height: this.chartSize
      }, args.canvasSize);

      this.bgColor = args.bgColor || '#F8F8F8';
      this.bgFillingMode = /^NONE|ALTERNATIVE|GRADIENT$/i.test(args.bgFillingMode) ? RegExp.$_ : 'NONE';
      this.lineColor = args.lineColor || '#E3E3E3';
      this.borderColor = args.borderColor || this.lineColor;
      this.showBorder = this.borderColor.toLowerCase() != 'transparent';
      this.graphicR = (this.chartSize - (this.showBorder ? 2 : 0)) / 2;

      this.valueRange = [].concat(args.valueRange || 10).slice(0, 2);
      this.valueRange.length < 2 && this.valueRange.unshift(0);
      this.scaleSpan = (isNaN(parseFloat(args.scaleSpan)) ? ((this.valueRange[1] - this.valueRange[0]) / 3) : parseFloat(args.scaleSpan)) || 1;
      this.scaleCount = Math.ceil((this.valueRange[1] - this.valueRange[0]) / this.scaleSpan);
      this.scaleColor = args.scaleColor || (this.showBorder ? this.borderColor : this.lineColor);
      this.showScales = typeof args.showScales == 'boolean' ? args.showScales : true;

      this.categories = args.categories;
      this.labelColor = args.labelColor || '#666';
      this.labelFontSize = Math.max(isNaN(parseInt(args.labelFontSize)) ? 12 : parseInt(args.labelFontSize), 10);
      this.categoryAngleStep = Math.PI * 2 / this.categories.length;

      this.initialDataSet = args.dataSet || [];
      this.dataSet = [];
      this.dataSetGroup;
    }
  }

  Radar.prototype = {
    constructor: Radar,
    getNode: function () {
      var node = painter.getCanvas(this.canvasSize),
        canvas = $('.canvas', node);

      // Paint background.
      var radarBg = painter.group(this.canvasSize).appendTo(canvas),
        backgroundLightenStep = (100 - colorExt.getL(this.bgColor)) / (this.scaleCount - 1);

      // Background color.
      for (var i = this.scaleCount - 1; i >= 0; --i) {
        var points = [],
          isOutline = i == this.scaleCount - 1,
          r = (i + 1) / this.scaleCount * this.graphicR,
          scales;

        if (this.radarType == 'SPIDER') {
          for (var j = 0; j < this.categories.length; ++j) {
            points.push([Math.cos(j * this.categoryAngleStep - Math.PI / 2) * r, Math.sin(j * this.categoryAngleStep - Math.PI / 2) * r]);
          }
          scales = painter.polygon(points);
        } else {
          scales = painter.circle(0, 0, r);
        }

        var bgColor = this.bgFillingMode == 'ALTERNATIVE' ? (i % 2 ? this.bgColor : '#FFF') : (this.bgFillingMode == 'GRADIENT' ? colorExt.lighten(this.bgColor, backgroundLightenStep * (this.scaleCount - 1 - i)) : '#FFF');

        if (isSVGSupported) {
          radarBg.append(scales.attr($.extend({
            'fill': bgColor
          }, this.showBorder ? {
            'stroke': this.borderColor,
            'stroke-width': isOutline ? 2 : 1
          } : null)));
        } else {
          radarBg.append(scales.attr($.extend({
            'fillcolor': bgColor
          }, this.showBorder ? {
            'stroked': true,
            'strokecolor': this.borderColor,
            'strokeweight': (isOutline ? 2 : 1) + 'px'
          } : {
            'stroked': false
          })));
        }
      }

      // Spider web lines.
      for (var i = 0; i < this.categories.length; ++i) {
        var line = painter.line(
          0,
          0,
          Math.cos(i * this.categoryAngleStep - Math.PI / 2) * this.chartSize / 2,
          Math.sin(i * this.categoryAngleStep - Math.PI / 2) * this.chartSize / 2
        );

        if (isSVGSupported) {
          radarBg.append(line.attr({
            'stroke': this.lineColor,
            'stroke-width': '1'
          }));
        } else {
          radarBg.append(line.attr({
            'stroked': true,
            'strokecolor': this.lineColor,
            'strokeweight': '1px'
          }));
        }
      }

      // Paint scale.
      if (this.showScales) {
        var valueStep = (this.valueRange[1] - this.valueRange[0]) / this.scaleCount,
          scaleSpace = this.graphicR / this.scaleCount,
          fontSize = Math.max(scaleSpace / 2, 10);

        for (var i = 0; i < this.scaleCount - 1; ++i) {
          var textLeft = fontSize / 4,
            textTop = -(i + 1) * scaleSpace - 2

          radarBg.append(painter.text(Math.round((this.valueRange[0] + valueStep * (i + 1)) * 100) / 100).attr({
            'x': textLeft,
            'y': textTop
          }).css($.extend({
            'fontSize': fontSize,
            'lineHeight': 1
          }, isSVGSupported ? {
            'fill': this.scaleColor
          } : {
            'color': this.scaleColor,
            'left': textLeft + this.chartSize / 2 - fontSize,
            'top': textTop + this.chartSize / 2 - fontSize / 2
          })));
        }
      }

      // Paint category labels.
      var r = (this.chartSize + this.labelFontSize) / 2;

      for (var i = 0; i < this.categories.length; ++i) {
        var halfPI = Math.PI / 2,
          angle = i * this.categoryAngleStep - halfPI,
          labelLen = this.categories[i].length * this.labelFontSize,
          textLeft = Math.cos(angle) * r + (Math.abs(angle) == halfPI ? -labelLen / 2 : (angle > -halfPI && angle < halfPI ? 0 : -labelLen)),
          textTop = Math.sin(angle) * r + (angle % Math.PI == 0 ? this.labelFontSize / 2 : (angle > 0 && angle < Math.PI ? this.labelFontSize : 0));

        radarBg.append(painter.text(this.categories[i]).attr({
          'x': textLeft,
          'y': textTop
        }).css($.extend({
          'fontSize': this.labelFontSize,
          'lineHeight': 1
        }, isSVGSupported ? {
          'fill': this.labelColor
        } : {
          'color': this.labelColor,
          'left': textLeft + this.chartSize / 2 - this.labelFontSize,
          'top': textTop + this.chartSize / 2 - this.labelFontSize,
          'white-space': 'nowrap'
        })));
      }

      // Paint data set.
      this.dataSetGroup = painter.group(this.canvasSize).attr({
        'class': 'v data-graphic-group'
      }).appendTo(canvas);

      this.addDataSet(this.initialDataSet);

      return this.node = node;
    },
    getHTML: function () {
      var node = this.getNode();
      return isSVGSupported ? new XMLSerializer().serializeToString(node[0]) : node.html();
    },
    addDataSet: function (newDataSets, callback) {
      newDataSets = [].concat(newDataSets);

      if (newDataSets.length) {
        var existDataSetLen = $('.data-graphic', this.dataSetGroup).length,
          graphicsToAdd = [];

        for (var i = 0; i < newDataSets.length; ++i) {
          var points = [];

          for (var j = 0; j < this.categories.length; ++j) {
            var r = (newDataSets[i].data[j] || 0) / this.valueRange[1] * this.graphicR;
            points.push([Math.cos(j * this.categoryAngleStep - Math.PI / 2) * r, Math.sin(j * this.categoryAngleStep - Math.PI / 2) * r])
          }

          newDataSets[i].color = newDataSets[i].color || colorExt.getStdHue(existDataSetLen + i);
          newDataSets[i].title = newDataSets[i].title || '';
          newDataSets[i].polygonPoints = points;
          newDataSets[i].graphic = painter.polygon(points).attr($.extend({
            'class': 'v data-graphic',
            'transform': 'scale(0)'
          }, isSVGSupported ? {
            'fill': newDataSets[i].color || colorExt.getStdHue(existDataSetLen + i)
          } : {
            'stroked': 'false',
            'fillcolor': newDataSets[i].color || colorExt.getStdHue(existDataSetLen + i)
          }));

          painter.addTitle(newDataSets[i].graphic, newDataSets[i].title);

          graphicsToAdd.push(newDataSets[i].graphic);
        }

        this.dataSet = this.dataSet.concat(newDataSets);
        this.dataSetGroup.append(graphicsToAdd);

        var self = this;
        animation(800, function (progress) {
          $.each(graphicsToAdd, function (i, graphic) {
            $(graphic).attr('transform', 'scale(' + progress + ')');
          });
        }, 'easeOutBack', function () {
          graphicsToAdd = null;
          safeCall(callback, null, self);
        });
      }
    },
    removeDataSet: function (indexes, callback) {
      indexes = [].concat(indexes || []);

      if (!indexes.length && this.dataSet.length) {
        indexes = numExt.getSerialNums(this.dataSet.length);
      }

      if (indexes.length) {
        var self = this;
        animation(400, function (progress) {
          $.each(indexes, function (i, index) {
            self.dataSet[index] && $(self.dataSet[index].graphic).attr('transform', 'scale(' + (1 - progress) + ')');
          });
        }, 'easeInBack', function () {
          $.each(indexes, function (i, index) {
            if (self.dataSet[index]) {
              $(self.dataSet[index].graphic).remove();
              self.dataSet[index] = null;
            }
          });

          self.dataSet = $.map(self.dataSet, function (dataSet) {
            return dataSet;
          });

          safeCall(callback, null, self);
        });
      } else {
        safeCall(callback, null, self);
      }
    },
    resetDataSet: function (index, resetData, callback) {
      index = parseInt(index);
      resetData = resetData || {};

      if (!isNaN(index) && index >= 0 && index < this.dataSet.length) {
        var targetDataSet = this.dataSet[index];

        // Reset title.
        if (resetData.title && resetData.title != targetDataSet.title) {
          targetDataSet.title = resetData.title;
          painter.addTitle(targetDataSet.graphic, targetDataSet.title);
        }

        // Reset color.
        if (resetData.color && resetData.color != targetDataSet.color) {
          targetDataSet.color = resetData.color;
          targetDataSet.graphic.attr(isSVGSupported ? 'fill' : 'fillcolor', targetDataSet.color);
        }

        // Reset graphic data.
        if (resetData.data && resetData.data.length) {
          var targetPoints = [],
            pointsDiff;

          for (var i = 0; i < this.categories.length; ++i) {
            var r = (resetData.data[i] || 0) / this.valueRange[1] * this.graphicR;
            targetPoints.push([Math.cos(i * this.categoryAngleStep - Math.PI / 2) * r, Math.sin(i * this.categoryAngleStep - Math.PI / 2) * r])
          }

          var pointsDiff = $.map(targetPoints, function (point, i) {
            return [
              [point[0] - targetDataSet.polygonPoints[i][0], point[1] - targetDataSet.polygonPoints[i][1]]
            ];
          });

          if (isSVGSupported) {
            var self = this;
            animation(400, function (progress) {
              targetDataSet.graphic.attr({
                'points': $.map(targetDataSet.polygonPoints, function (point, i) {
                  return [
                    [point[0] + pointsDiff[i][0] * progress, point[1] + pointsDiff[i][1] * progress]
                  ]
                }).join(' ')
              });
            }, null, function () {
              targetDataSet.polygonPoints = targetPoints;

              safeCall(callback, null, self);
            });
          } else {
            var points = [].concat(targetPoints, [targetPoints[0]]),
              newPolygon = painter.polygon(points).attr({
                'class': 'v data-graphic',
                'stroked': 'false',
                'fillcolor': targetDataSet.color,
                'title': targetDataSet.title
              });

            targetDataSet.graphic.replaceWith(newPolygon);
            targetDataSet.graphic = newPolygon;
            targetDataSet.polygonPoints = targetPoints;

            safeCall(callback, null, this);
          }
        } else {
          safeCall(callback, null, self);
        }
      }
    }
  };


  return Radar;
}


module.exports = factory($);
