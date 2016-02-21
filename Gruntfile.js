var _ = require('underscore'),
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
 		phonegap : 'node_modules/.bin/phonegap',
        appDir : '<%= pkg.name %>',
        generatedAppDir : 'temp-app',
        androidRes : 'platforms/android/res',

		clean : {
			dev: [
				'src/css/index.css',
				'src/sass/',
				'src/js/app/templates.js'
			],
			www: ['www/'],
			css: ['src/css/index.css'],
			browser:[ 'platforms/browser', 'plugins/browser.json'],
			ios:[ 'platforms/ios', 'plugins/ios.json'],
            android:[ 'platforms/android', 'plugins/android.json'],
            'phonegap-generated' : [
                '.cordova',
                'hooks',
                'platforms',
                'plugins'
            ],
            'phonegap-generated-app' : [ '<%= generatedAppDir %>']
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
            	browserifyOptions : {
            		debug : true
            	},
                src : ['src/js/app/index.js'],
                dest: 'www/js/index.js'
            }
        },

	    exec : {
            'create-app' : {
                cwd: '.',
                command: '<%= phonegap %> create <%= generatedAppDir %> <%= pkg.bundle %> <%= appName %>'
            },
            'add-platform-ios' : {
                cwd : '.',
                command : '<%= phonegap %> platform add ios'
            },
            'add-platform-android' : {
                cwd : '.',
                command : '<%= phonegap %> platform add android'
            },
            'add-platform-browser' : { // for testing
                cwd : '.',
                command : '<%=phonegap %> platform add browser'
            },
            'build-ios' : {
                cwd: '.',
                command: '<%= phonegap %> build ios'
            },
            'build-android' : {
                cwd: '.',
                command: '<%= phonegap %> build android'
            },
            'build-browser' : {
                cwd : '.',
                command: '<%= phonegap %> build browser'
            },
            'serve-browser' : {
                cwd : '.',
                command: '<%= phonegap %> run browser'
            },
            'plugin-console' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-console@1.0.1'
            },
            'plugin-file' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-file@3.0.0'
            },
            'plugin-network-information' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-network-information@1.0.1'
            },
            'plugin-whitelist' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-whitelist@1.0.0'
            },
            'plugin-dialogs' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-dialogs@1.1.1'
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
    						"img/*.gif",
                            "res/*.png",
    						'index.html'
    					],
                        dest: "www/"
                     }
                ]
            },
            'phonegap-generated' : {
                files: [
                    {
                        expand: true,
                        cwd: '<%= generatedAppDir %>',
                        src : [
                            'plugins/**/*',
                            'hooks/**/*',
                            'platforms/**/*'
                        ],
                        dest: '.'
                    }
                ]
            },
            'to-android-icons' : {
                files: [
                    {
                        src: 'src/res/icon/android/icon-48-mdpi.png',
                        dest: '<%= androidRes %>/drawable/icon.png'
                    },
                    {
                        src: 'src/res/icon/android/icon-36-ldpi.png',
                        dest: '<%= androidRes %>/drawable-ldpi/icon.png'
                    },
                    {
                        src: 'src/res/icon/android/icon-48-mdpi.png',
                        dest: '<%= androidRes %>/drawable-mdpi/icon.png'
                    },
                    {
                        src: 'src/res/icon/android/icon-96-xhdpi.png',
                        dest: '<%= androidRes %>/drawable-xhdpi/icon.png'
                    },
                    {
                        src: 'src/res/icon/android/icon-72-hdpi.png',
                        dest: '<%= androidRes %>/drawable-hdpi/icon.png'
                    },
                    {
                        src: 'src/res/icon/android/icon-144-xxhdpi.png',
                        dest: '<%= androidRes %>/drawable-xxhdpi/icon.png'
                    }
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

	grunt.registerTask('default', 'default build task', ['build-dev']);

	grunt.registerTask('build', 'build for browser',  [
		'clean', 
		'resources-collector', 
		'compass', 
		'jshint',
		'browserify',
		'copy:to-www'
	]);

	grunt.registerTask('build-dev', 'default build task',  ['clean', 'resources-collector', 'compass', 'jshint']);
	grunt.registerTask('build-www', 'collect/build resources for www', ['build-dev', 'requirejs', 'copy:to-www']);
	grunt.registerTask('build-android', 'build android app', ['build-www', 'exec:build-android']);
	grunt.registerTask('build-android-release', 'build android app release', ['build-www', 'exec:build-android', 'exec:build-android-release']);

	grunt.registerTask('clean-all', 'clean all generated files', ['clean', 'exec:clean-android']);

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
		grunt.file.write(cfg['dest-template'], 'module.exports = ' + JSON.stringify(templates) + ';');

		var scssFileParts = ['/*!!!generated!!!*/'];
		_.each(scssFiles, function(scssFile){
			scssFileParts.push('@import "' + scssFile + '";');
		});
		grunt.file.write(cfg['dest-scss'] + cfg['dest-scss-index'], scssFileParts.join('\n'));
	});

	grunt.registerTask('clean-build', [
        // 'clean:project',
        // 'clean:fonts',
        // 'clean:img',
        // 'clean:res',
        'clean:css',
        // 'clean:jst',
        'clean:www'
    ]);

	grunt.registerTask('install-plugins-browser', [
        'exec:plugin-console',
        'exec:plugin-network-information',
        'exec:plugin-file',
        'exec:plugin-dialogs'
    ]);

    grunt.registerTask('install-plugins-android', [
        'exec:plugin-whitelist',
        'exec:plugin-network-information',
        'exec:plugin-file',
        'exec:plugin-dialogs'
    ]);

	grunt.registerTask('build-browser',
        'create phonegap app for browser',
        [
            'clean:browser',
            'clean:phonegap-generated-app',
            'clean:phonegap-generated',
            'exec:create-app',
            'copy:phonegap-generated',
            'clean:phonegap-generated-app',
            'clean-build',
            // 'copy:sass-browser',
            'build',
            'exec:add-platform-browser',
            'install-plugins-browser'
            // 'patch-file:browser-inappbrowser-plugin',
            // 'patch-file:browser-inappbrowser'
        ]
    );

    grunt.registerTask('build-android',
        'create phonegap app for android',
        [
            'clean:android',
            'clean:phonegap-generated-app',
            'clean:phonegap-generated',
            'exec:create-app',
            'copy:phonegap-generated',
            'clean:phonegap-generated-app',
            'clean-build',
            'build',
            'exec:add-platform-android',
            'install-plugins-android',
            'copy:to-android-icons',
            'exec:build-android',
            'copy:to-android-icons' // to prevent changes in buid
        ]
    );

    grunt.registerTask(
        'serve-browser',
        'run app in web browser',
        [
            'exec:serve-browser'
        ]
    );
};