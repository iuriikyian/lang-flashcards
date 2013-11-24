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
require(['underscore', 'zepto', 'DecksManager', 'DecksView', 'CardView', 'Deck', 'Menu', 'TestDeckData'], 
		function(_, $, DecksManager, DecksView, CardView, Deck, Menu, testDeckData){
	var app = {
	    // Application Constructor
	    initialize: function() {
	    	this.decksManager = new DecksManager();
	        this.bindEvents();
	        
	    },
	    // Bind Event Listeners
	    //
	    // Bind any events that are required on startup. Common events are:
	    // 'load', 'deviceready', 'offline', and 'online'.
	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	        var me = this;
	        $(function(){
	        	me.onStartup();
	        });
	    },
	    // deviceready Event Handler
	    //
	    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	    // function, we must explicity call 'app.receivedEvent(...);'
	    onDeviceReady: function() {
	        app.receivedEvent('deviceready');
	    },
	    // for in browser testing
	    onDocumentReady: function(){
	    	app.receivedEvent('deviceready');
	    },
	    
	    _destroyCurrentView : function(){
	    	if(!_.isUndefined(this.view)){
	    		this.view.off();
	    		delete this.view;
	    	}
	    },
	    
	    showCardView : function(deckName){
	    	this._destroyCurrentView();
	    	var deck = this.decksManager.getDeck('english', deckName);
    		//var deck = new Deck(testDeckData);
    		var v = new CardView({
    			el : '.body',
    			card : deck.getCurrentCardSideInfo()
    		});
    		this.view = v;
	    	v.render();
	    	var me = this;
	    	v.on('back', function(){
	    		me.showDecksView();
	    		console.log('Event:back');
	    	});
	    	v.on('card:show-next', function(){
	    		deck.gotoNext();
	    		v.setCard(deck.getCurrentCardSideInfo());
		    	v.render();
	    		console.log('Event:card:show-next');
	    	});
	    	v.on('card:show-prev', function(){
	    		deck.gotoPrev();
	    		v.setCard(deck.getCurrentCardSideInfo());
		    	v.render();
	    		console.log('Event:card:show-prev');
	    	});
	    	v.on('card:flip', function(){
	    		deck.flipCard();
	    		v.setCard(deck.getCurrentCardSideInfo());
		    	v.render();
	    		console.log('Event:card:flip');
	    	});
	    	v.on('card:toggle-select', function(newValue){
	    		deck.selectCard(newValue);
	    		console.log('Event:card:toggle-select');
	    	});
	    	
	    },
	    
	    showDecksView : function(){
	    	var me = this;
	    	this._destroyCurrentView();
	    	var view = new DecksView({
	    		el : '.body',
	    		decks : this.decksManager.getDeckNames('english')
	    	});
	    	this.view = view;
	    	view.render();
	    	view.on('show:menu', function(){
	    		if(! _.isUndefined(me.menu)){
	    			me.menu.off();
	    			delete me.menu;
	    		}
	    		console.log('Event:show:menu');
	    		var menu = new Menu({
    			    el : '#menu',
    			    overlay : '#menu-overlay',
	    			menus : [
	    			    { id : 1, name : 'test'},
	    			    { id : 2, name : 'other'}
	    			]
	    		});
	    		menu.render();
	    		menu.on('menu:click', function(itemId){
	    			console.log('Event:menu:click:' + itemId);
	    		});
	    		me.menu = menu;
	    	});
	    	view.on('show:today-deck', function(){
	    		console.log('Event:show:today-deck');
	    	});
	    	view.on('show:deck', function(deckName){
	    		console.log('Event:show:deck:' + deckName);
	    		me.showCardView(deckName);
	    	});
	    	view.on('deck:created', function(deckName){
	    		console.log('Event:deck:created:' + deckName);
	    	});
	    	view.on('deck:removed', function(deckName){
	    		console.log('Event:deck:removed:' + deckName);
	    	});
	    },
	    
	    onStartup: function(){
	    	this.showDecksView();
	    },
	    
	    // Update DOM on a Received Event
	    receivedEvent: function(id) {
	        var parentElement = document.getElementById(id);
	        var listeningElement = parentElement.querySelector('.listening');
	        var receivedElement = parentElement.querySelector('.received');

	        listeningElement.setAttribute('style', 'display:none;');
	        receivedElement.setAttribute('style', 'display:block;');

	        console.log('Received Event: ' + id);
	    }
	};
	app.initialize();
});
