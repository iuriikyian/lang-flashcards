require.config({});

var appConfig = {
	isBrowser : false
};

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
                app.initialize();
                console.log('app initialized');
            });
		}, false);
		console.log('deviceready listener added');
	});
});