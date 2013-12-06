require.config({

    baseUrl: 'js/app',

    paths  : {
    	app                     : 'index',
        zepto                   : '../lib/zepto',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone',
        hammer                  : '../lib/hammer',
        'zepto.hammer'          : '../lib/zepto.hammer'
    },

    shim   : {
        'zepto': {
            exports: '$'
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
        
        hammer: {
            exports: 'Hammer'
        },

        'zepto.hammer': {
            deps: ['zepto', 'hammer']
        }

    },
    map    : {
        '*': {
            jquery: 'zepto',
            $: 'zepto',
            _: 'underscore',
            "$.hammer": 'zepto.hammer'
        }
    }
});

var appConfig = {
	isBrowser : true
}

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