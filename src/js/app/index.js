/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

require('jquery-hammerjs');

var _ = require('underscore'),
	DecksManager = require('./DecksManager'),
	MainRouter = require('./MainRouter'),
    Storage = require('./local/Storage');

var App = function(){
	this.initialize = function(){
		console.log('initialize start');
    	this.lang = 'english';
    	//this.decksManager = new DecksManager(new InMemoryStorage(testData));
    	this.decksManager = new DecksManager(new Storage());
    	var isDevice = _.isUndefined(window.device) === false;
    	console.log('isDevice: ' + isDevice.toString());
        this.router = new MainRouter({
        	decksManager : this.decksManager,
        	isDevice : isDevice
        });
        this.bindEvents();
        this.router.onStart();
        console.log('initialize end');
	};

	this.bindEvents = function(){
		console.log('installing backbutton handler');
		var me = this;
        document.addEventListener('backbutton', function(evt){
        	console.log('backbutton event called');
        	me.onBackbutton(evt);
        	console.log('backbutton event end');
        }, true);
		console.log('backbutton handler installed');
		window.addEventListener('resize', function(evt){
			me.onResize();
		});
	};

	this.onBackbutton = function(){
		console.log('onBackbutton start');
		this.router.onBackbutton();
		console.log('onBackbutton end');
	};

	this.onResize = function(){
		this.router.onResize();
	};
};

var nop = function(){};

var appConfig = {
	isBrowser : true,
    _console : {
        log : nop,
        info : nop,
        debug : nop,
        warn : nop,
        error : nop,
        dir : nop
    }
};

if(appConfig.console){
    window.console = appConfig.console;
}

/**
 * Run the App!
 */
document.addEventListener('deviceready', function(){
	console.log('Event:deviceready');
    var app = new App();
    console.log('app initialized');
    app.initialize();
}, false);
console.log('deviceready listener added');