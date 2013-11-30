/*
 * Hammer.JS Zepto plugin
 * version 0.1
 * author: Oleg Buss
 * Based on jquery.hammer.js from: https://github.com/EightMedia/hammer.js
 * Licensed under the MIT license.
 */

(function ($) {
    var hammerEvents = ['hold', 'tap', 'doubletap', 'transformstart', 'transform', 'transformend', 'dragstart', 'drag', 'dragend', 'swipe', 'release'];
	
    $.fn.hammer = function (options) {
        return this.each(function () {
            var hammer = new Hammer(this, options);

            var $el = $(this);
            $el.data("hammer", hammer);

            var events = options && options.hammerEvents ? options.hammerEvents : hammerEvents;
			events.forEach(function(event, index){
				hammer['on' + event] = (function (el, eventName) {
                    return function (ev) {
                        el.trigger($.Event(eventName, ev));
                    };
                })($el, event);
			});
        });
    };
}(Zepto));

