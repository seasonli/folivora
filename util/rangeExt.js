var $ = require('jquery');


function Rangy() {};

Rangy.prototype = {
    constructor: Rangy
};


var latestSelectionString = null;

var onSelectionChangeFunc = [];

$('body').on('mouseup', function (e) {
    // 现代浏览器
    if (window.getSelection) {
        var selectionString = window.getSelection().toString();

        if (selectionString !== latestSelectionString) {
            latestSelectionString = selectionString;
            for (var i in onSelectionChangeFunc) {
                onSelectionChangeFunc[i](e);
            }
        }
    }
    // IE
    else if (document.selection) {
        var selectionString = document.selection.createRange().text;

        if (selectionString !== latestSelectionString) {
            latestSelectionString = selectionString;
            for (var i in onSelectionChangeFunc) {
                onSelectionChangeFunc[i](e);
            }
        }
    }
});

// For damn IE
function getPosition(range, isStart) {
    range = range.duplicate();
    range.collapse(isStart);

    var parent = range.parentElement();
    var siblings = parent.childNodes;
    var startRange, startIndex = -1;

    for (var i = 0; i < siblings.length; i++) {
        var child = siblings[i];

        if (child.nodeType == 1) {
            var tr = range.duplicate();
            tr.moveToElementText(child);

            // 用户选区起/末点 相对于 被比较选区
            var comparisonStart = tr.compareEndPoints('StartToStart', range);
            var comparisonEnd = tr.compareEndPoints('EndToStart', range);

            // 用户选区起/末点 在被比较选取 左侧
            if (comparisonStart > 0) {
                break;
            }
            // 用户选区起/末点 与被比较选区左侧 重合 或在被比较选区 内部
            else if (comparisonStart === 0 || comparisonEnd === 1 && comparisonStart === -1) {
                return {
                    container: siblings[i - 1],
                    offset: siblings[i - 1].nodeValue.length
                };
            }
            // 用户选区起/末点 与被比较选区右侧 重合
            else if (comparisonEnd === 0) {
                return {
                    container: parent,
                    offset: i + 1
                };
            }
            startRange = tr;
            startIndex = i;
        }
    }

    if (!startRange) {
        startRange = range.duplicate();
        startRange.moveToElementText(parent);
        startRange.collapse(true);
    } else {
        startRange.collapse(false);
    }

    startRange.setEndPoint('EndToEnd', range);
    var totalL = startRange.text.replace(/(\r\n|\r)/g, '\n').length;
    var realL = 0;
    for (var j = startIndex + 1; j < siblings.length; j++) {
        realL = totalL;
        totalL -= siblings[j].length;

        if (totalL <= 0) break;
    }
    if (totalL == 0) {
        return {
            container: siblings[0],
            offset: siblings[0].length
        };
    }
    return {
        container: siblings[j],
        offset: realL
    };
}

// 接口方法
module.exports = {
    Rangy: Rangy,
    onSelectionChange: function (callback) {
        onSelectionChangeFunc.push(callback);
    },
    clearSelection: function () {
        window.getSelection && window.getSelection().removeAllRanges();
        if (document.selection) {
            var selection = document.selection.createRange();
            selection.collapse(true);
            selection.select();
        }
    },
    getSelectionRangy: function () {
        // 现代浏览器
        if (window.getSelection) {
            var selection = window.getSelection();

            // 未选中内容或存在复选内容直接 return
            if (selection.isCollapsed || selection.rangeCount !== 1) return;

            if (selection.getRangeAt) {
                // 现代浏览器
                var range = selection.getRangeAt(0);
            } else {
                // 兼容低版本 safari
                var range = document.createRange();
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.focusNode, selection.focusOffset);
            }

            var rangy = new Rangy();
            rangy.startContainer = range.startContainer;
            rangy.startOffset = range.startOffset;
            rangy.endContainer = range.endContainer;
            rangy.endOffset = range.endOffset;
            rangy.collapsed = range.collapsed;
            rangy.commonAncestorContainer = range.commonAncestorContainer;

            return rangy;
        }
        // IE
        else if (document.selection) {
            var selection = document.selection.createRange();

            // 未选中内容或存在复选内容直接 return
            if (!selection || !selection.boundingWidth) return;

            var start = getPosition(selection, true);
            var end = getPosition(selection, false);

            var rangy = new Rangy();
            rangy.startContainer = start.container;
            rangy.startOffset = start.offset;
            rangy.endContainer = end.container;
            rangy.endOffset = end.offset;
            rangy.collapsed = !selection.boundingWidth;
            rangy.commonAncestorContainer = selection.parentElement();

            return rangy;
        }
    }
};