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
require(['underscore', 'zepto', 'DecksManager', 
         'DecksView', 'CardView', 'Deck',
         'Menu', 'DeckInfoDialog', 'ReviewModeDialog',
         'SelectItemDialog', 'TestDeckData'], 
		function(_, $, DecksManager, 
				DecksView, CardView, Deck, 
				Menu, DeckInfoDialog, ReviewModeDialog, 
				SelectItemDialog, testDeckData){
	var app = {
	    // Application Constructor
	    initialize: function() {
	    	this.lang = 'english';
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
	    
	    // empty name means 'today' deck
	    showCardView : function(deckName){
	    	this._destroyCurrentView();
	    	var deck = this.decksManager.getDeck(this.lang, deckName);
    		//var deck = new Deck(testDeckData);
    		var view = new CardView({
    			el : '.body',
    			card : deck.getCurrentCardSideInfo()
    		});
    		this.view = view;
	    	view.render();
	    	var me = this;
	    	view.on('back', function(){
	    		me.decksManager.saveDeckState(deck);
	    		me.showDecksView();
	    		console.log('Event:back');
	    	});
	    	view.on('show:menu', function(){
	    		console.log('Event:show:menu');
	    		me.showCardViewMenu(deck, deckName === 'today');
	    	});
	    	view.on('card:show-next', function(){
	    		deck.gotoNext();
	    		console.log('Event:card:show-next');
	    	});
	    	view.on('card:show-prev', function(){
	    		deck.gotoPrev();
	    		console.log('Event:card:show-prev');
	    	});
	    	view.on('card:flip', function(){
	    		deck.flipCard();
	    		console.log('Event:card:flip');
	    	});
	    	view.on('card:toggle-select', function(newValue){
	    		deck.selectCard(newValue);
	    		console.log('Event:card:toggle-select');
	    	});
	    	deck.on('changed', function(){
	    		console.log('Event: deck:change');
	    		view.setCard(deck.getCurrentCardSideInfo());
		    	view.render();
	    	});
	    	
	    },
	    
	    showDecksView : function(){
	    	var me = this;
	    	this._destroyCurrentView();
	    	var view = new DecksView({
	    		el : '.body',
	    		decks : this.decksManager.getDeckNames(this.lang)
	    	});
	    	this.view = view;
	    	view.render();
	    	view.on('show:menu', function(){
	    		console.log('Event:show:menu');
	    		me.showDecksViewMenu();
	    	});
	    	view.on('show:today-deck', function(){
	    		console.log('Event:show:today-deck');
	    		me.showCardView('today');
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
	    
	    showDecksViewMenu : function(){
    		this._destroyMenu();
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
    		this.menu = menu;
	    },
	    
	    _destroyMenu : function(){
    		if(! _.isUndefined(this.menu)){
    			this.menu.off();
    			delete this.menu;
    		}
	    },
	    
	    _destroyDialog : function(){
    		if(! _.isUndefined(this.dialog)){
    			this.dialog.off();
    			delete this.dialog;
    		}
	    },
	    
	    showCardViewMenu : function(deck, isTodayDeck){
			var menus = [
			    { id : 'mode', name : 'review mode', order : 10},
			    { id : 'shuffle', name : 'shuffle', order : 20},
			    { id : 'sel-invert', name : 'sel invert', order : 30},
			    { id : 'sel-clear', name : 'sel clear', order : 40},
			    { id : 'deck-info', name : 'deck info', order : 50},
			    { id : 'delete-card', name : 'delete card', order : 60}
			];
			if(isTodayDeck){
				menus.push({ id : 'sel2deck', name : 'sel->deck', order : 45});
				menus.push({ id : 'sel2keep', name : 'sel->keep', order : 48});
				menus.push({ id : 'import-from-web', name : 'from web', order : 70});
			}else{
				menus.push({ id : 'sel2today', name : 'sel->today', order : 45});
			}
			menus.sort(function(a, b){return a.order > b.order ? 1 : (a.order < b.order ? -1 : 0); });
				
	    	this._destroyMenu();
    		var menu = new Menu({
			    el : '#menu',
			    overlay : '#menu-overlay',
    			menus : menus
    		});
    		menu.render();
    		var me = this;
    		menu.on('menu:click', function(itemId){
    			switch(itemId){
    				case 'mode':
    					me._destroyDialog();
    					me.dialog = new ReviewModeDialog({
	   						 el : '#dialog',
							 overlay : '#menu-overlay',
    						mode : deck.mode
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('mode-selected', function(mode){
    						deck.setMode(mode);
    						me._destroyDialog();
    					});
    					break;
    				case 'shuffle':
    					deck.shuffle();
    					break;
    				case 'sel-invert':
    					deck.invertSelection();
    					break;
    				case 'sel-clear':
    					deck.clearSelection();
    					break;
    				case 'sel2today':
    					var cards = deck.removeSelectedCards();
    					if(cards.length > 0){
    						var todayDeck = me.decksManager.getDeck(me.lang, 'today');
    						todayDeck.insertCards(cards);
    						me.decksManager.saveDeckStateWithCards(deck);
    						me.decksManager.saveDeckCards(todayDeck);
    					}
    					break;
    				case 'sel2deck':
    					var deckNames = me.decksManager.getDeckNames(me.lang);
    					me._destroyDialog();
    					me.dialog = new SelectItemDialog({
	   						el : '#dialog',
							overlay : '#menu-overlay',
							title : 'Select target Deck',
    						items : deckNames
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('selected', function(deckName){
    						var targetDeck = me.decksManager.getDeck(me.lang, deckName);
    						if(targetDeck){
    							var cards = deck.removeSelectedCards();
    							if(cards.length > 0){
    								targetDeck.insertCards(cards);
    								me.decksManager.saveDeckCards(targetDeck);
    								me.decksManager.saveDeckStateWithCards(deck);
    							}else{
    								alert('nothing moved');
    							}
    						}else{
    							alert('target deck is not found');
    						}
    						me._destroyDialog();
    					});
    					break;
    				case 'deck-info':
    					me.dialog = new DeckInfoDialog({
    						 el : '#dialog',
    						 overlay : '#menu-overlay',
    						 info : deck.getDeckInfo()
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					break;
    				case 'delete-card':
    					deck.deleteCurrentCard();
    					me.decksManager.saveDeckStateWithCards(deck);
    					break;
    			}
    			console.log('Event:menu:click:' + itemId);
    		});
    		this.menu = menu;
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
