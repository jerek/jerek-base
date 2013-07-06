"use strict";

var JF = new function() {
    // Define some constants
    this.DOMAIN = 'jerekframework'; // Filler var that should always be overridden.
    this.ABBREVIATION = 'jf'; // Filler var that should always be overridden.
    this.CDNHOST = 'jf.jerek.net'; // Filler var that should always be overridden.
    this.TLD = 'com'; // Top level domain.
    this.MENUMOUSELEAVEDELAY = 333;
    this.DEBUG = false;

    this.urlPieces = function(url) {
        var match = url.match(/(https?):\/\/([^\/]+)\/(.*)/);

        if (match) {
            return {
                type: match[1],
                domain: match[2],
                path: match[3]
            };
        }

        return false;
    }

    this.boxDim = function(x, y, width, height) { // Return an object with box offsets on all sides from top and left.
        return {
            l: x,
            t: y,
            r: x + width,
            b: y + height
        }
    };

    this.boxInfo = function(element) {
        var position = $(element).offset();
        return JF.boxDim(position.left, position.top, element.offsetWidth, element.offsetHeight);
    };

    this.screenInfo = function() {
        var $window = $(window);
        var left = $window.scrollLeft();
        var top = $window.scrollTop();
        return {
            l: left,
            t: top,
            r: left + $window.width(),
            b: top + $window.height()
        }
    };

    this.intersect = function(a, b) { // Test that a doesn't intersect with b - boxDim style objects only.
        return !(a.l >= b.r || b.l >= a.r || a.t >= b.b || b.t >= a.b)
    };

    this.overflow = function(a, b, margin, padding) { // Test that a doesn't overflow outside of b - boxDim style objects only; padding is how much padding shouldn't be overflowed either.
        if (typeof padding != 'undefined') {
            b.t = b.t - padding;
            b.r = b.r - padding;
            b.b = b.b - padding;
            b.l = b.l - padding;
        }
        var a2 = {
            t: a.t + margin,
            r: a.r,
            b: a.b + margin,
            l: a.l
        }
        return !(a2.l >= b.l && b.r >= a2.r && a2.t >= b.t && b.b >= a2.b)
    };

    this.isOver = function(a, b) { // Test if point a is inside box b - a is an object with x and y; b is boxDim objects only.
        return (a.x > b.l && a.x < b.r && a.y > b.t && a.y < b.b)
    };

    this.ua = navigator.userAgent.toLowerCase();

    this.pxToInt = function(num) {
        num = parseInt(num);
        return (typeof num != 'number' || !(num > 0)) ? 0 : num;
    };

    function trueOffset(element, height) { // This gets the true offset sizes in new browsers such as FF4+ and IE9+ which now can have fractions of pixels for widths, but don't report it correctly with the built in .offsetWidth and .offsetHeight.
        var cStyle = element.ownerDocument && element.ownerDocument.defaultView && element.ownerDocument.defaultView.getComputedStyle
                && element.ownerDocument.defaultView.getComputedStyle(element, null),
            ret = cStyle && cStyle.getPropertyValue(height ? 'height' : 'width') || '';
        if (ret && ret.indexOf('.') > -1) {
            ret = parseFloat(ret)
                + parseInt(cStyle.getPropertyValue(height ? 'padding-top' : 'padding-left'))
                + parseInt(cStyle.getPropertyValue(height ? 'padding-bottom' : 'padding-right'))
                + parseInt(cStyle.getPropertyValue(height ? 'border-top-width' : 'border-left-width'))
                + parseInt(cStyle.getPropertyValue(height ? 'border-bottom-width' : 'border-right-width'));
        } else {
            ret = height ? element.offsetHeight : element.offsetWidth;
        }
        return ret;
    };

    this.trueOffsetWidth = function(element) {
        return trueOffset(element);
    };

    this.trueOffsetHeight = function(element) {
        return trueOffset(element, true);
    };

    this.commas = function(num) {
        num = num + '';
        if (num.length > 3) {
            var mod = num.length % 3;
            var ret = mod > 0 ? num.substring(0,mod) : '';
            for (var i = 0; i < Math.floor(num.length / 3); i++) {
                if (mod == 0 && i == 0)
                    ret += num.substring(mod+ 3 * i, mod + 3 * i + 3);
                else
                    ret+= ',' + num.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return ret;
        } else {
            return num;
        }
    };

    this.scrollPosition = function() {
        return [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        ];
    };

    this.nonScrollingHash = function(hash) {
        hash = hash.replace(/^#/, '');
        if (hash.match(/[^A-Za-z0-9-_]/)) { // If it's not a valid ID anyway, just do it.
            document.location.hash = hash;
            return;
        }
        var node = $('#' + hash);
        if (node.length) {
            node.attr('id', '');
        }
        document.location.hash = hash;
        if (node.length) {
            node.attr('id', hash);
        }
    };

    this.scrolling = function(enabled, element) {
        var stopScrolling = function(event) {
            if (event.stopPropagation) event.stopPropagation();
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
            event.cancelBubble = true;

            return false;
        }

        if (typeof element != 'undefined') {
            if(!enabled) {
                $(element).bind('mousewheel', stopScrolling);
            } else {
                $(element).unbind('mousewheel', stopScrolling);
            }
        } else {
            if(!enabled) {
                $(document).bind('mousewheel', stopScrolling);
                $(window).bind('DOMMouseScroll', stopScrolling);
            } else {
                $(document).unbind('mousewheel', stopScrolling);
                $(window).unbind('DOMMouseScroll', stopScrolling);
            }
        }
    };

    this.staticUrl = function(includeHTTP) {
        if (!JF.STATICURL) {
            if ((window.location+'').match(new RegExp('^https?:\/\/(.*\.)?' + JF.DOMAIN + '\.' + JF.TLD + '\/'))) {
                JF.STATICURL = '//' + JF.CDNHOST;
            } else {
                JF.STATICURL = (window.location+'').match(/^https?:(\/\/[^\/]+)\//)[1];
            }
        }

        return includeHTTP ? 'http:' + JF.STATICURL : JF.STATICURL;
    };

    this.setDebug = function(value) {
        this.DEBUG = value;
    };

    this.warnIE = function(parent) {
        $(parent || document.body).append('<div class="warn-ie"><b>Warning:</b> Your browser is unsupported (IE8 or lower). Please upgrade to a modern browser such as <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.getfirefox.com/" target="_blank">Firefox</a>. If you cannot change browsers try <a href="http://www.google.com/chromeframe" target="_blank">Chrome Frame</a>.</div>');
    };

    this.ieLog = function(text) { // A quick stand-in for console.log() in IE.
        var $log = $('#ieLog');
        if (!$log.length) {
            $log = $('<div id="ieLog" style="bottom:40px;overflow-y:scroll;position:fixed;right:10px;top:40px;z-index:999999999"></div>');
            $(document.body).prepend($log);
        }
        $log.append(text + '<br>');
        $log.get(0).scrollTop = 9999999;
    };

    this.debug = function() {
        if (!this.DEBUG) return;
        if (typeof console != 'undefined' && console && console.log && console.log.apply) {
            var prefixedArguments = ['DEBUG'].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, prefixedArguments);
        }
    };

    this.log = function() {
        if (typeof console != 'undefined' && console && console.log && console.log.apply) {
            var prefixedArguments = ['LOG'].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, prefixedArguments);
        }
    };

    this.error = function() {
        if (typeof console != 'undefined' && console && console.error && console.error.apply) {
            var prefixedArguments = ['>>> ERROR >>>'].concat(Array.prototype.slice.call(arguments));
            console.error.apply(console, prefixedArguments);
        }
    };

    this.view = function(category, label) {
        if (category && label) {
            if (typeof _gaq != 'undefined') {
                _gaq.push(['_trackEvent', category, 'Impression', label]);
            } else {
                setTimeout(function() { JF.log.view(category, label) }, 50);
            }
        }
    };

    this.click = function(category, label) {
        if (category && label) {
            if (typeof _gaq != 'undefined') {
                _gaq.push(['_trackEvent', category, 'Clickthrough', label]);
            } else {
                setTimeout(function() { JF.log.click(category, label) }, 5);
            }
        }
    };

    this.openInBackground = function(url) {
        var a = document.createElement('a');
        a.href = url;
        var event = document.createEvent('MouseEvents');
        // The 10th parameter of initMouseEvent sets the CTRL key.
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0,
            true, false, false, false, 0, null);
        a.dispatchEvent(event);
    };

    this.lockScrolling = function(element) {
        $(element)
            .hover(function() {
                JF.lockNormalScrolling = true;
            }, function() {
                delete JF.lockNormalScrolling;
            })
            .bind('mousewheel', function(event) {
                if (JF.lockNormalScrolling) {
                    $(this).scrollTop($(this).scrollTop() - event.originalEvent.wheelDelta);
                    return false;
                }
            });
    };

    this.ucFirst = function(string) {
        if (!string.length || string.length < 2) return string;

        return string.substr(0,1).toUpperCase() + string.substr(1);
    };

    this.indexOfArray = function(array, value, start) { // IE does not have indexOf for arrays, and most or all browsers don't have it for objects
        if ($.isArray(array)) {
            if (array.indexOf) return array.indexOf(value, start);
            for (var index = (start || 0); index < array.length; index++) {
                if ('' + array[index] == '' + value) {
                    return index;
                }
            }
        } else if (typeof array == 'object') {
            for (var key in array) {
                if (typeof array[key] != 'string' && typeof array[key] != 'number') {
                    continue;
                }
                if (array[key] == value) {
                    return key;
                }
            }
        }
        return -1;
    };

    this.isInArray = function(array, value) {
        return (JF.indexOfArray(array, value) > -1);
    };

    this.rebuildArray = function(array) { // TODO: Surely there's a better way to do this...
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
        return newArray;
    };

    this.getValueFromObject = function(object, key) {
        if (typeof key == 'string' && key.indexOf('/') > -1) {
            key = key.split('/');
        }

        if (JF.isInArray(['number', 'string'], typeof key)) {
            return object[key];
        }

        if ($.isArray(key)) {
            key = this.rebuildArray(key);
            var value = object;
            while (key.length) {
                if (typeof value != 'object') {
                    JF.debug('Dead end while fetching key from object.', object, key);
                    return;
                }
                value = value[key.shift()];
            }
            return value;
        }
    };

    this.setValueOnObject = function(object, key, value) {
        if (typeof key == 'string' && key.indexOf('/') > -1) {
            key = key.split('/');
        }

        if (JF.isInArray(['number', 'string'], typeof key)) {
            object[key] = value;
            return object;
        }

        if ($.isArray(key)) {
            key = this.rebuildArray(key);
            var subObject = object,
                nextKey;
            while (key.length > 1) {
                nextKey = key.shift();
                if (typeof subObject[nextKey] == 'undefined') {
                    subObject[nextKey] = {};
                }
                if (typeof subObject[nextKey] != 'object') {
                    JF.debug('Dead end while setting value on object.', object, key, value);
                    return;
                }
                subObject = subObject[nextKey];
            }
            subObject[key.shift()] = value;
            return object;
        }
    };

    this.getPropertyOrder = function(object) {
        var propertyKeys = [];
        for (var i in object) {
            propertyKeys.push(i);
        }
        return propertyKeys.sort();
    };

    this.getPropertyValueOrder = function(object, key) {
        var propertyValues = [];
        for (var i in object) {
            propertyValues.push(this.getValueFromObject(object[i], key));
        }
        return propertyValues.sort();
    };

    this.isMiddleClick = function(e) {
        if (!e.which) {
            return false;
        }
        return (e.which == 2);
    };

    this.isNotMiddleClick = function(e) {
        if (!e.which) {
            return true;
        }
        return (e.which != 2);
    };

    this.preventDefault = function(event, middleClickCondition) {
        if (typeof middleClickCondition != 'undefined') {
            if (middleClickCondition && JF.isMiddleClick(event)) {
                event.preventDefault();
            } else if (!middleClickCondition && JF.isNotMiddleClick(event)) {
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    };

    this.returnFalse = function(event, middleClickCondition) {
        if (typeof middleClickCondition != 'undefined') {
            if (middleClickCondition && JF.isMiddleClick(event)) {
                return false;
            } else if (!middleClickCondition && JF.isNotMiddleClick(event)) {
                return false;
            }
        } else {
            return false;
        }
    };

    this.romanize = function(num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    };

    this.deromanize = function(str) {
        var str = str.toUpperCase(),
            validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
            token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
            key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
            num = 0, m;
        if (!(str && validator.test(str)))
            return false;
        while (m = token.exec(str))
            num += key[m[0]];
        return num;
    };

    this.activate = function(element, scope) {
        if (scope) {
            if (typeof scope == 'number') {
                var $scope = $element = $(element);
                while (scope > 0) {
                    $scope = $scope.parent();
                    scope--;
                }
                $('.active', $scope).removeClass('active');
                $element.addClass('active');
            } else {
                $('.active', scope).removeClass('active');
                $(element).addClass('active');
            }
        } else {
            var $element = $(element);
            $element.siblings().removeClass('active');
            $element.addClass('active');
        }
    };

    this.deactivate = function(element) {
        $(element).removeClass('active');
    };

    this.slug = function(string) {
        return string
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    this.trim = function(string) {
        return string.replace(/^\s+|\s+$/g, '');
    };
};
