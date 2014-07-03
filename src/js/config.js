require.config({

    baseUrl: 'js/app',

    paths  : {
    	app                     : 'index',
        zepto                   : '../lib/zepto',
        'zepto.touch'           : '../lib/zepto.touch',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone',
        BaseDialog              : 'views/base-dialog/BaseDialog'
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

var nop = function(){};

var appConfig = {
	isBrowser : true,
    _console : {
        log : nop,
        info : nop,
        debug : nop,
        warn : nop,
        error : nop,
        dir : nop
    }
};

if(appConfig.console){
    window.console = appConfig.console;
}

/**
 * Run the App!
 */
console.log('start of app loading');
require(['zepto'], function($){
	$(function(){
		console.log('document loaded');
		if(appConfig.isBrowser){ // web testing
			require(['app'], function(App){
                var app = new App();
                app.initialize();
            });
		}
		document.addEventListener('deviceready', function(){
			console.log('Event:deviceready');
            require(['app'], function(App){
                console.log('app loaded');
                var app = new App();
                console.log('app initialized');
                app.initialize();
            });
		}, false);
		console.log('deviceready listener added');
	});
});