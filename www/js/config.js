require.config({});

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