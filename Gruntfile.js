var _ = require('underscore'),
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean : {
			dev: [
				'src/css/index.css',
				'src/sass/',
				'src/js/app/templates.js'
			],
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

        browserify : {
            'dev' : {
                src : ['src/js/app/index.js'],
                dest: 'src/index.js'
            }
        },

//         requirejs: {
//             compile: {
//                 options: {
//                     // main file to start to look for its dependencies.
//                     name: 'app',
//                     baseUrl: "src/js/app",
//                     mainConfigFile: "src/js/config.js",
//                     amd: true,
//                     optimize: "none",
// //                    optimize: "uglify",
//                     out: "www/js/<%= pkg.bundle %>.min.js"//,
//                 }
//             }
//         },

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
        	'build-android' : {
        		cmd : '../node_modules/.bin/phonegap build android'
        	},
        	'build-android-release' : {
       			cmd : 'platforms/android/cordova/build --release'
        	},
        	'clean-android' : {
        		cmd : 'platforms/android/cordova/clean'
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
        },
        'resources-collector' : {
        	'dev' : {
        		cwd : 'src/js/app/views/',
        		src : [
        			'common',
        			'base-dialog',
        			'create-backup',
        			'create-item',
        			'deck-info',
        			'loading-cards',
        			'menu',
        			'restore-backup',
        			'review-mode',
        			'select-item',
        			'card-view',
        			'decks-list',
        			'select-file'
        		],
        		'dest-template' : 'src/js/app/templates.js',
        		'dest-scss' : 'src/sass/',
        		'dest-scss-index' : 'index.scss'
        	}
        }

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-http-server');

	grunt.registerTask('default', 'default build task', ['build-dev']);

	grunt.registerTask('build-dev', 'default build task',  ['clean', 'resources-collector', 'compass', 'jshint']);
	grunt.registerTask('build-www', 'collect/build resources for www', ['build-dev', 'requirejs', 'copy:to-www']);
	grunt.registerTask('build-android', 'build android app', ['build-www', 'exec:build-android']);
	grunt.registerTask('build-android-release', 'build android app release', ['build-www', 'exec:build-android', 'exec:build-android-release']);

	grunt.registerTask('clean-all', 'clean all generated files', ['clean', 'exec:clean-android']);

	grunt.registerTask('serve-dev', 'http server', ['http-server:dev']);
	grunt.registerTask('serve-www', 'http server', ['http-server:www']);

	grunt.registerMultiTask("resources-collector", function(){
		var config = grunt.config.get("resources-collector");
		var cfg = config[this.target];
		grunt.log.write('Collecting view template/scss resources for target: ' + this.target);
		var scssFiles = [];
		var templates = {};
		_.each(cfg.src, function(dir){
			grunt.file.recurse(cfg.cwd + dir, function(abspath, rootdir, subdir, filename){
				//grunt.log.writeln(abspath);
				var ext = filename.substr(filename.length - 5);
				if(ext === '.html'){
					if(filename.indexOf('-test') === -1){ // skip view tests
						grunt.log.writeln('template: ' + filename);
						//grunt.file.copy(filePath, cfg['dest-template'] + fileName);
			            var fileData = grunt.file.read(abspath);
			            var key = filename.substr(0, filename.length - 5);
			            templates[key] = fileData;
			        }
				}
				if(ext === '.scss'){
					grunt.log.writeln('scss: ' + filename);
					grunt.file.copy(abspath, cfg['dest-scss'] + filename);
					scssFiles.push(filename.substr(1, filename.length - 6));
				}
			});
		});
		grunt.file.write(cfg['dest-template'], 'define([], function(){ return ' + JSON.stringify(templates) + '; });');

		var scssFileParts = ['/*!!!generated!!!*/'];
		_.each(scssFiles, function(scssFile){
			scssFileParts.push('@import "' + scssFile + '";');
		});
		grunt.file.write(cfg['dest-scss'] + cfg['dest-scss-index'], scssFileParts.join('\n'));
	});
};