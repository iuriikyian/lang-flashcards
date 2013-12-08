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
require(['underscore', 'zepto', 'DecksManager', 'MainRouter',
         //'in-memory/Storage', 'in-memory/testData',
         'local/Storage'], 
		function(_, $, DecksManager, MainRouter, Storage){//, testData){
	
	var App = function(){
		this.initialize = function(){
			console.log('initialize start');
	    	this.lang = 'english';
	    	//this.decksManager = new DecksManager(new InMemoryStorage(testData));
	    	this.decksManager = new DecksManager(new Storage());
	        this.router = new MainRouter({
	        	decksManager : this.decksManager
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
		};
		
		this.onBackbutton = function(){
			console.log('onBackbutton start');
			this.router.onBackbutton();
			console.log('onBackbutton end');
		};
	};
	
	var app = new App();
	app.initialize();
});
