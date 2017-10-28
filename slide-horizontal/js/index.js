

init();

function init() {
    var divEl = document.getElementsByClassName('slide');
    var slideEl = document.getElementsByClassName('slide-ul')[0];
    var containerLi = slideEl.getElementsByTagName('li');
    if (containerLi.length <= 1) {
        slideEl.style.width = document.documentElement.clientWidth + 'px';
        return;
    }

    var slide = new Slide(divEl[0]);
    slide.init();

    window.addEventListener('resize', function() {
        slide.resize();
    }, false);
}