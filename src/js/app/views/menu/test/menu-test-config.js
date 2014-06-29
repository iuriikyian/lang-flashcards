require.config({

    baseUrl: '../../..',

    paths  : {
    	//common                  : '../../common',
        //templates               : '../../../templates',
        zepto                   : '../lib/zepto',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone',
        'zepto.touch'           : '../lib/zepto.touch'
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

function run_test($){
    require(['zepto', 'views/menu/Menu'], function($, Menu){
        $('.btn-menu').click(function(){
            var menu = new Menu({
                menus : [
                    { id : 'lang', name : 'change lang'},
                    { id : 'create-deck', name : 'create deck'},
                    { id : 'remove-decks', name : 'delete decks'},
                    { id : 'backup', name : 'backup'},
                    { id : 'restore', name : 'restore'}
                ],
                tapEvent : 'click'
            });
            $('body').append(menu.render().el);
            menu.on('selected', function(itemId){
                console.log('selected: ' + itemId);
            });
            menu.on('closed', function(){
                console.log('menu closed');
            });
        });
    });
}
/**
 * Run the App!
 */

console.log('start of app loading');
require(['zepto'], function($){
	$(function(){
		console.log('document loaded');
		if(appConfig.isBrowser){ // web testing
            run_test($);
			//require(['app']);
		}
		document.addEventListener('deviceready', function(){
			console.log('Event:deviceready');
			require(['app']);
		}, false);
		console.log('deviceready listener added');
	});
});