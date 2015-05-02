(function () {
    'use strict';
    var DEFAULT_FPS = 50;
    var DEFAULT_INITIALIZER = 'init';
    var DEFAULT_UPDATER = 'update';

    var canvas;
    var ctx;
    var w, h;
    var fps;
    var tick;
    
    var initializer;
    var updater;


    function main() {
        canvas = document.querySelector('canvas.draw-target');
        ctx = canvas.getContext('2d');
        fps = +canvas.dataset.fps || DEFAULT_FPS;
        tick = 0;
        initializer = window[canvas.dataset.initializer || DEFAULT_INITIALIZER] || function () {};
        updater = window[canvas.dataset.updater || DEFAULT_UPDATER] || function () {};

        resize();

        initializer(ctx, w, h);
        checkForUpdate();
    }

    
    function resize() {
        if (canvas.dataset.autofit === 'false') {
            return;
        }

        w = canvas.parentNode.offsetWidth;
        h = canvas.parentNode.offsetHeight;
        canvas.width = w;
        canvas.height = h;
    }

    
    function checkForUpdate() {
        window.requestAnimationFrame(checkForUpdate);
        
        var now = Date.now();
        if (checkForUpdate.updatedAt && now - checkForUpdate.updatedAt < 1000 / fps) {
            return;
        }
        checkForUpdate.updatedAt = now;
        updater(ctx, w, h, tick++);
    }
    checkForUpdate.updatedAt = null;

    
    window.addEventListener('load', main);
    window.addEventListener('resize', resize);
})();
