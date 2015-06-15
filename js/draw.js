var draw = (function () {
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

        onInit(ctx, w, h);
        resize();
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


    function showControlPanel(ctx) {
    }

    function fontMetrics(font, text) {
        // create offline canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.font = font;

        // estimate height
        var estimatedHeight = Math.ceil(ctx.measureText('M').width) * 2;

        // get width
        var width = Math.ceil(ctx.measureText(text).width);

        // prepare canvas
        var scaledWidth = 50;
        canvas.width = width;
        canvas.height = estimatedHeight;
        ctx.font = font;
        ctx.scale(scaledWidth / width, 1);
        ctx.fillStyle = '#FFF';
        var baseline = Math.floor(canvas.height * 0.5);
        ctx.fillText(text, 0, baseline);

        // calc exact height
        var pixels = ctx.getImageData(0, 0, scaledWidth, canvas.height).data;
        var min = -Infinity;
        var max = +Infinity;
        // @TODO: do not use nested loops
        for(var y = 0; y < canvas.height; y++) {
            for(var x = 0; x < scaledWidth; x++) {
                if(pixels[(y * scaledWidth + x) * 4]) {
                    min = y;
                    break;
                }
            }
            if(min != -Infinity) break;
        }
        // @TODO: do not use nested loops
        for(var y = canvas.height - 1; y >= 0; y--) {
            for(var x = 0; x < scaledWidth; x++) {
                if(pixels[(y * scaledWidth + x) * 4]) {
                    max = y;
                    break;
                }
            }
            if(max != Infinity) break;
        }

        return {
            width: width,
            height: max - min,
            baseline: baseline - min
        };
    }

    return {
        showControlPanel: showControlPanel,
        fontMetrics: fontMetrics
    };
})();
