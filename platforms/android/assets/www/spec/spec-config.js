require.config({

    baseUrl: 'js/app',

    paths  : {
    	app                     : '../js/app',
    	spec                    : '../../spec',
        zepto                   : '../lib/zepto',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone',
        hammer                  : '../lib/hammer',
        'zepto.hammer'          : '../lib/zepto.hammer',
        jasmine                 : '../../spec/lib/jasmine-1.2.0/jasmine',
        'jasmine-html'          : '../../spec/lib/jasmine-1.2.0/jasmine-html'        
        	
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


require(['zepto', 'spec/KeepDeck', 'spec/Deck', 'spec/DecksManager', 'spec/utils/date', 'jasmine-html'], function($){
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