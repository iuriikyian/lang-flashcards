require.config({

    baseUrl: 'js/app',

    paths  : {
    	app                     : 'index',
        zepto                   : '../lib/zepto',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone'
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
        }
    },
    map    : {
        '*': {
            jquery: 'zepto',
            $: 'zepto',
            _: 'underscore'
        }
    }
});

/**
 * Run the App!
 */
require(['app']);
