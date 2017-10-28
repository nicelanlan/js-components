var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
}

function Marquee(wrap, options) {
    if (!wrap) {
        return;
    }
    var duration = 2000,
        speed = options.speed || 300,
        divice = 20;
    var lastTime,
        fromY = 0,
        displaceY = 0,
        toY = 0;

    var mHeight = 0,
        num = 0;
    var ul = wrap.children[0],
        li = ul.children;
    var i = 0;

    runMarquee();

    function runMarquee() {

        if (!li || li.length === 0) {
            return false;
        }

        ul.appendChild(li[0].cloneNode(true));
        mHeight = li[0].offsetHeight;

        num = li.length;

        // var animate = function(now) { // webkitRequestAnimationFrame方法会给回调函数中传入一个当前时间的参数。
        //     var per = now - lastTime;
        //     if (per < speed && displaceY > toY && -displaceY <= mHeight * (num + 1)) {
        //         var translateHeight = getTransHeight();
        //         displaceY += translateHeight;
        //         translateY(ul, displaceY, i);

        //         lastTime = now;
        //         setTimeout(function() {
        //             window.requestAnimationFrame(animate); // 此方法调用一次只会重绘一次动画，如果需要连续的动画，则需要重复调用
        //         }, speed / divice);


        //     } else {
        //         translateY(ul, toY, i);
        //     }
        //     if (i > num - 1) {
        //         // translateY(ul, 0, i);
        //         i = 0;
        //     }
        // };

        // var start = () => {
        //     lastTime = Date.now();
        //     i++;
        //     fromY = -mHeight * (i - 1);
        //     toY = -mHeight * i;
        //     displaceY = fromY;
        //     window.requestAnimationFrame(animate); // 此方法可以传入两个参数，第一个是回调，第二个是执行动画的元素节点（可选），返回一个ID。
        // };

        window.cancelAnimationFrame(animate);
        setInterval(start, duration);
    };

    function animate(now) { // webkitRequestAnimationFrame方法会给回调函数中传入一个当前时间的参数。
        var per = now - lastTime;
        if (per < speed && displaceY > toY && -displaceY <= mHeight * (num + 1)) {
            var translateHeight = getTransHeight();
            displaceY += translateHeight;
            translateY(ul, displaceY, i);

            lastTime = now;
            setTimeout(function() {
                window.requestAnimationFrame(animate); // 此方法调用一次只会重绘一次动画，如果需要连续的动画，则需要重复调用
            }, speed / divice);


        } else {
            translateY(ul, toY, i);
        }
        if (i > num - 1) {
            // translateY(ul, 0, i);
            i = 0;
            setTimeout(start, 20);
        }
    };

    function start() {
        lastTime = Date.now();
        i++;
        fromY = -mHeight * (i - 1);
        toY = -mHeight * i;
        displaceY = fromY;
        window.requestAnimationFrame(animate); // 此方法可以传入两个参数，第一个是回调，第二个是执行动画的元素节点（可选），返回一个ID。
    };

    function translateY(el, displace) {
        el.style.transfrom = 'translate(0,' + displace + 'px)';
        el.style.webkitTransform = 'translate(0,' + displace + 'px)';
        if (displace < -mHeight * (num - 1)) {
            el.style.transfrom = 'translate(0, 0)';
            el.style.webkitTransform = 'translate(0, 0)';
        }
    }

    function getTransHeight() {
        return (toY - fromY) / divice;
    }
}