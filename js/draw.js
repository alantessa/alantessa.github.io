(function () {
    'use strict';
    var DEFAULT_FPS = 50;
    var DEFAULT_ON_INIT = 'init';
    var DEFAULT_ON_UPDATE = 'update';
    var DEFAULT_ON_RESIZE = 'resize';

    var canvas;
    var ctx;
    var w, h;
    var fps;
    var tick;
    
    var onInit;
    var onUpdate;
    var onResize;


    function main() {
        canvas = document.querySelector('canvas.draw-target');
        ctx = canvas.getContext('2d');
        fps = +canvas.dataset.fps || DEFAULT_FPS;
        tick = 0;
        onInit = window[canvas.dataset.onInit || DEFAULT_ON_INIT] || function () {};
        onUpdate = window[canvas.dataset.onUpdate || DEFAULT_ON_UPDATE] || function () {};
        onResize = window[canvas.dataset.onResize || DEFAULT_ON_RESIZE] || function () {};

        resize();

        onInit(ctx, w, h);
        checkForUpdate();
    }

    function resize() {
        if (canvas.dataset.autofit === 'false') {
            return;
        }

        w = canvas.parentNode.clientWidth;
        h = canvas.parentNode.clientHeight;
        canvas.width = w;
        canvas.height = h;

        onResize(ctx, w, h);
    }

    
    function checkForUpdate() {
        window.requestAnimationFrame(checkForUpdate);
        
        var now = Date.now();
        if (checkForUpdate.updatedAt && now - checkForUpdate.updatedAt < 1000 / fps) {
            return;
        }
        checkForUpdate.updatedAt = now;
        onUpdate(ctx, w, h, tick++);
    }
    checkForUpdate.updatedAt = null;

    
    window.addEventListener('load', main);
    window.addEventListener('resize', resize);
})();
