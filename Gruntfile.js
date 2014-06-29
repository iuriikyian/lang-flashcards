var _ = require('underscore'),
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean : {
			dev: ['src/css/index.css'],
			www: [
				'www/css/',
				'www/fonts/',
				'www/img/',
				'www/js/<%= pkg.bundle %>.min.js',
				'www/js/require.js'
			],
			android: [
				'platforms/android/assets/www/css/',
				'platforms/android/assets/www/fonts/',
				'platforms/android/assets/www/img/',
				'platforms/android/assets/www/js/',
				'platforms/android/assets/www/index.html'
			]
		},

		compass : {
			dev : {
				options : {
	                sassDir: 'src/sass',
	                cssDir: 'src/css',
	                outputStyle: 'expanded',
	                relativeAssets: true,
	                imagesDir: 'src/img',
	                fontsDir: 'src/fonts'
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
            src: 'src/js/app/**/*js'
        },

        requirejs: {
            compile: {
                options: {
                    // main file to start to look for its dependencies.
                    name: 'app',
                    baseUrl: "src/js/app",
                    mainConfigFile: "src/js/config.js",
                    amd: true,
                    optimize: "none",
//                    optimize: "uglify",
                    out: "www/js/<%= pkg.bundle %>.min.js"//,
                }
            }
        },

		'http-server': {

	        www: {

	            // the server root directory
	            root: 'www',

	            port: 8281,
	            // port: function() { return 8282; }

	            host: "127.0.0.1",

	            cache: 0,
	            showDir : true,
	            autoIndex: true,
	            defaultExt: "html",

	            // run in parallel with other tasks
	            runInBackground: false//true|false

	        },

	        dev: {

	            // the server root directory
	            root: 'src',

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
	    },

	    exec : {
        	'build' : {
       			cmd : '../node_modules/.bin/phonegap build android'
        	}
        },

        copy : {
            'to-www': {
                files: [
                    {
                        expand: true, 
                        cwd: 'src/', 
                        src : [
    						"css/*.css",
    						"fonts/*.ttf",
    						"img/*.png",
    						"img/*.gif"
    					], 
                        dest: "www/"
                     },
                    {
                        //expand: true, 
                        //cwd: 'src/js/lib/', 
                        src : "src/js/lib/require.js",
                        dest: "www/js/require.js"
                     },

                ]
            }
        }

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');	
	grunt.loadNpmTasks('grunt-exec');	
	grunt.loadNpmTasks('grunt-http-server');

	grunt.registerTask('default', 'default build task', ['build-dev']);

	grunt.registerTask('build-dev', 'default build task',  ['clean', 'compass', 'collect-templates', 'jshint']);
	grunt.registerTask('build-www', 'collect/build resources for www', ['build-dev', 'requirejs', 'copy:to-www']);
	grunt.registerTask('build-android', 'build android app', ['build-www', 'exec:build']);

	grunt.registerTask('serve-dev', 'http server', ['http-server:dev']);
	grunt.registerTask('serve-www', 'http server', ['http-server:www']);

	grunt.registerTask('collect-templates', 'collect templates into templates file', function(){

		var templatesDir = 'src/templates';
		var templatesFile = 'src/js/app/templates.js';
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