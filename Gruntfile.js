var _ = require('underscore'),
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean : {
			dev: ['www/css/index.css']
		},

		compass : {
			dev : {
				options : {
	                sassDir: 'www/sass',
	                cssDir: 'www/css',
	                outputStyle: 'expanded',
	                relativeAssets: true,
	                imagesDir: 'www/img',
	                fontsDir: 'www/fonts'
				}
			}
		},

        jshint: { //TODO: review
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                globals: {
                    exports: true,
                    zepto: true,
                    $: true,
                    _: true,
                    //document
                    window: false,
                    document: false,
                    navigator: false,
                    alert: false,
                    // require.js
                    define: false,
                    // plug-ins
                    gaPlugin: false,
                    JREngage: false,
                    ExtractZipFile : false,
                    LocalFileSystem : false,
                    google : false
                },
            },
            src: 'www/js/app/**/*js'
        },

		'http-server': {

	        dev: {

	            // the server root directory
	            root: 'www',

	            port: 8282,
	            // port: function() { return 8282; }

	            host: "127.0.0.1",

	            cache: 0,
	            showDir : true,
	            autoIndex: true,
	            defaultExt: "html",

	            // run in parallel with other tasks
	            runInBackground: false//true|false

	        }
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-http-server');

	grunt.registerTask('default', 'default build task', ['clean', 'compass', 'collect-templates', 'jshint']);
	grunt.registerTask('serve', 'http server', ['http-server'])

	grunt.registerTask('collect-templates', 'collect templates into templates file', function(){

		var templatesDir = 'src/templates';
		var templatesFile = 'www/js/app/templates.js';
		var templates = {};
		grunt.file.recurse(templatesDir, function(abspath, rootdir, subdir, filename){
            var fileData = grunt.file.read(abspath);
            var key = filename.substr(0, filename.length - 5);
            templates[key] = fileData;
        });
        grunt.file.write(templatesFile, 'define([], function(){ return ' + JSON.stringify(templates) + '; });');
        grunt.log.ok('created ' + templatesFile);
	});
};
