require.config({

    baseUrl: '../../..',

    paths  : {
    	//common                  : '../../common',
        //templates               : '../../../templates',
        zepto                   : '../lib/zepto',
        underscore              : '../lib/underscore',
        'underscore.deferred'   : '../lib/underscore.deferred',
        backbone				: '../lib/backbone',
        'zepto.touch'           : '../lib/zepto.touch',
        'BaseDialog'            : 'views/base-dialog/BaseDialog'
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

    var TestFileService = function(){
        var SEPARATOR = '/',
            testData = {
            '' : {
                a : {
                    a2 : {
                        e : 'ccccc',
                        f : 'rrrr'
                    },
                    b2 : 'sdfsdf',
                    c2 : 'asdad'
                },
                b : 'sdd',
                c : 'eeee'
            }
        };

        this.list = function(dirPath){
            var pathParts = dirPath.split(SEPARATOR);
            if(pathParts[pathParts.length - 1] === ''){
                pathParts.pop();
            }
            var dirData = testData;
            var selectedDir;
            _.each(pathParts, function(dirName, idx){
                if(idx === pathParts.length - 1){
                    selectedDir = dirData[dirName];
                }else{
                    dirData = dirData[dirName];
                }
            });
            if(selectedDir){
                var res = [];
                _.each(selectedDir, function(value, key){
                    if(_.isObject(value)){
                        res.push({
                            name : key,
                            isDir : true
                        });
                    }else{
                        res.push({
                            name : key,
                            isDir : false
                        });
                    }
                });
                var data = {
                    dir : dirPath,
                    list : res
                };
                if(dirPath !== SEPARATOR){ // not root
                    var parts = dirPath.split(SEPARATOR);
                    console.log(parts);
                    parts.shift(); // remove leading slash
                    parts.pop(); // remove last dir
                    data.parentDir = SEPARATOR + parts.join(SEPARATOR);
                }else{
                    data.parentDir = null;
                }
                console.dir(data);
                return data;
            }
        };
    };

    require(['zepto', 'views/select-file/SelectFileDialog'], function($, SelectFileDialog){

        var fileService = new TestFileService();
        var dlg = new SelectFileDialog({
            fileService : fileService,
            tapEvent : 'click'
        });
        $('body').append(dlg.render().el);
        dlg.on('selected', function(itemPath){
            console.log('selected: ' + itemPath);
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