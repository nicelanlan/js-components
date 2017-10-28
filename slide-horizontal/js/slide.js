// 构造函数
function Slide(wrapEl) {
    this.winWidth = document.documentElement.clientWidth;
    this.wrap = wrapEl;
    this.containerUl = wrapEl.getElementsByClassName('slide-ul')[0];
    this.containerLi = this.containerUl.getElementsByTagName('li');
    this.containerLiLength = this.containerLi.length;

    var el = this.containerLi[0].cloneNode(true);
    this.containerUl.appendChild(el);
    this.slidePoints = wrapEl.getElementsByClassName('slide-point')[0].getElementsByTagName('span');
    this.startNum = 1;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.transX = 0;
    this.transY = 0;
    this.interval = 0;
    this.replay = false;
    this.isMoved = false;
    this.isScrollX = false;
}


Slide.prototype = {

    init: function() {

        this.resize();
        // 超过 1 张图片才滚动
        if (this.containerLiLength > 1) {
            this.autoPlay();

            this.addHandler(this.wrap, 'touchstart', this.bindFn(this, this.touchStart));
            this.addHandler(this.wrap, 'touchmove', this.bindFn(this, this.touchMove));
            this.addHandler(this.wrap, 'touchend', this.bindFn(this, this.touchEnd));
        }
    },

    resize: function() {
        this.winWidth = document.documentElement.clientWidth;
        this.containerUl.style.width = (this.containerLiLength + 1) * this.winWidth + 'px';
        this.wrap.style.width = this.winWidth + 'px';
        for (var i = 0; i < this.containerLi.length; i++) {
            this.containerLi[i].style.width = this.winWidth + 'px';
        }
    },

    regenerate: function(slide) {
        if (this.containerLiLength > 0) {

            var containerLi = this.containerUl.getElementsByTagName('li');
            slide.wrap.children[0].removeChild(this.containerUl.children[containerLi.length - 2]);
            var el = this.containerLi[0].cloneNode(true);
            slide.containerUl.appendChild(el);
            slide.containerLiLength++;
        }

        slide.slidePoints = this.wrap.getElementsByClassName('slide-point')[0].getElementsByTagName('span');

        slide.resize();
        // this.containerUl.style.cssText = '-webkit-transform:translateX(' + (-this.winW) * this.startN + 'px);-ms-transform:translateX(' + (-this.winW) * this.startN + 'px)';
        // this.containerUl.style.width = this.startN * 3 * this.winW + 'px';
    },

    addHandler: function(elem, evtype, fn) {
        if (elem.attachEvent) {
            elem.attachEvent('on' + evtype, fn);
        } else if (elem.addEventListener) {
            elem.addEventListener(evtype, fn, false);
        } else {
            elem['on' + evtype] = fn;
        }
    },

    bindFn: function(obj, func) {
        return function() {
            func.apply(obj, arguments);
        };
    },

    touchStart: function() {
        //e.preventDefault();
        if (!event.touches.length) {
            return;
        }
        this.isMoved = false;
        var touch = event.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
        clearInterval(this.interval);
    },

    touchMove: function(e) {
        if (!event.touches.length) {
            return;
        }
        var touch = event.touches[0];
        this.transX = this.startX - touch.pageX;
        this.transY = this.startY - touch.pageY;

        if (this.isMoved && this.isScrollX) {
            e.preventDefault();
            this.transX = this.startX - touch.pageX;
        } else {
            this.isMoved = true;
            this.isScrollX = Math.abs(this.transY) - Math.abs(this.transX) < 1;
            this.autoPlay();
        }
    },

    touchEnd: function() {
        if (this.isMoved && this.isScrollX) {
            if (this.transX > 10) {
                this.play(this.startNum);
            } else if (this.transX < -10) {
                // startNum=0时，表示已滑动到最后一张图片，手动触发往左滑动时应滑动到倒数第二张。
                if (this.startNum == 0) {
                    this.startNum = this.containerLiLength - 2;
                } else {
                    this.startNum -= 2;
                }
                this.play(this.startNum);
            }
        }
        this.autoPlay();
    },

    autoPlay: function() {
        var that = this;
        clearInterval(this.interval);
        this.interval = setInterval(function() {
            if (visibility(that.wrap)) {
                that.play(that.startNum);
            }
        }, 3000);
    },

    play: function(num) {
        var that = this;
        if (this.startNum < 0) {
            this.startNum = 0;
        }

        num = this.startNum;
        if (num === 1 && this.replay) {
            // this.containerUl.removeAttribute('style');
            var width = (this.containerLiLength + 1) * this.winWidth;
            this.containerUl.setAttribute('style', 'width: ' + width + 'px; -webkit-transition: 0ms; transition: 0ms; -webkit-transform: translate(0px, 0px);');
            setTimeout(function() {
                that.slideImg(num);
            }, 10);
            this.replay = false;
            return;
        }
        this.slideImg(num);

        if (this.startNum > this.containerLiLength) {
            this.startNum = 1;
            this.replay = true;
        }
    },

    slideImg: function(num) {
        this.containerUl.style.webkitTransitionDuration = '800ms';
        this.containerUl.style.webkitTransform = 'translate(' + (-this.winWidth) * num + 'px,0)';
        this.slidePoint();
        this.startNum++;
    },

    slidePoint: function() {
        for (var i = 0; i < this.containerLiLength; i++) {
            this.slidePoints[i].className = '';
        }
        this.slidePoints[this.startNum % this.containerLiLength].className = 'current';
    },

    toLeft: function() {
        this.play(--this.startNum);
        this.autoPlay();
    },

    toRight: function() {
        this.play(++this.startNum);
        this.autoPlay();
    }
};

function getScreenHeight() {
    if (/ucbrowser/i.test(navigator.userAgent)) {
        return document.documentElement.clientHeight;
    } else {
        return window.screen.height;
    }
}

// 计算轮播图区域的可视性
function visibility(el) {
    var minHeight = el.offsetTop,
        maxHeight = minHeight + el.offsetHeight,
        scrollTop = document.body.scrollTop,
        screenHeight = getScreenHeight();
    if (maxHeight >= scrollTop && minHeight < (scrollTop + screenHeight)) {
        return true;
    }
}