require.config({

    baseUrl: 'js/app',

    paths  : {
    	app                     : 'index',
        zepto                   : '../lib/zepto',
        'zepto.touch'           : '../lib/zepto.touch',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone'
    },

    shim   : {
        'zepto': {
            exports: '$'
        },
        'zepto.touch': {
            deps: ['zepto']
        },

        'underscore': {
            exports: '_'
        },

        'underscore.deferred': {
            deps: ['underscore']
        },
        
        backbone : {
        	deps: ['underscore', 'zepto'],
        	exports: 'Backbone'
        },
    },
    map    : {
        '*': {
            jquery: 'zepto',
            $: 'zepto',
            _: 'underscore'
        }
    }
});

var appConfig = {
	isBrowser : true
};

/**
 * Run the App!
 */

console.log('start of app loading');
require(['zepto'], function($){
	$(function(){
		console.log('document loaded');
		if(appConfig.isBrowser){ // web testing
			require(['app']);
		}
		document.addEventListener('deviceready', function(){
			console.log('Event:deviceready');
			require(['app']);
		}, false);
		console.log('deviceready listener added');
	});
});