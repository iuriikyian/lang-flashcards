require.config({

    baseUrl: 'spec',

    paths  : {
    	app                     : '../js/app',
        zepto                   : '../js/lib/zepto',
        underscore              : '../js/lib/underscore',
        'underscore.deferred'   : '../js/lib/underscore.deferred',
        backbone				: '../js/lib/backbone',
        hammer                  : '../js/lib/hammer',
        'zepto.hammer'          : '../js/lib/zepto.hammer',
        jasmine                 : 'lib/jasmine-1.2.0/jasmine',
        'jasmine-html'          : 'lib/jasmine-1.2.0/jasmine-html'        
        	
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
        },
        
        jasmine: {
        	exports: 'jasmine'
        },
        
        'jasmine-html' : {
        	deps: ['jasmine'],
        	exports: 'jasmine'
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

require(['zepto', 'spec-KeepDeck', 'jasmine-html'], function($){
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };
    $(function(){
    	jasmineEnv.execute();
    });
});

/**
 * Run the App!
 */

//console.log('start of app loading');
//require(['zepto'], function($){
//	$(function(){
//		console.log('document loaded');
//		if(false){ // web testing
//			require(['app']);
//		}
//		document.addEventListener('deviceready', function(){
//			console.log('Event:deviceready');
//			require(['app']);
//		}, false);
//		console.log('deviceready listener added');
//	});
//})=