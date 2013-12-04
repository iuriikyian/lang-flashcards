define(['underscore', 'zepto', 'backbone',
        'DecksManager', 'DecksView', 'Menu', 'CardsServerAgent',
        'CardView', 'LoadingCards1Dialog', 'LoadingCards2Dialog',
        'SelectItemDialog', 'CreateItemDialog', 'ReviewModeDialog', 'DeckInfoDialog'
        ], function(_, $, Backbone, 
        		DecksManager, DecksView, Menu, CardsServerAgent,
        		CardView, LoadingCards1Dialog, LoadingCards2Dialog,
        		SelectItemDialog, CreateItemDialog, ReviewModeDialog, DeckInfoDialog){
	var MainRouter = Backbone.Router.extend({
		routes : {
			"" : "onShowDecksList"//,
//			"cards/:deck" : "onShowDeckCards"
		},
		
		initialize : function(options){
			this.decksManager = options.decksManager;
			this.cardsServerAgent = new CardsServerAgent();
		},
		
		onStart : function(){
			this.onShowDecksList();
		},
		
		onNavigateBack : function(){
			window.history.back();
		},
		
		onShowDecksList : function(){
	    	var me = this;
	    	this._destroyCurrentView();
	    	var lang = this.decksManager.getCurrentLang();
	    	var view = new DecksView({
	    		el : '.body',
	    		decks : this.decksManager.getDeckNames(lang),
	    		lang : lang
	    	});
	    	this.view = view;
	    	view.render();
	    	view.on('show:menu', function(){
	    		console.log('Event:show:menu');
	    		me.showDecksViewMenu();
	    	});
	    	view.on('show:today-deck', function(){
	    		console.log('Event:show:today-deck');
	    		me.onShowDeckCards('today');
	    		//me.navigate('cards/today', {trigger:true});
	    	});
	    	view.on('show:deck', function(deckName){
	    		console.log('Event:show:deck:' + deckName);
	    		me.onShowDeckCards(deckName);
	    		//me.navigate(['cards', deckName].join('/'), {trigger:true});
	    	});
		},
		
		onShowDeckCards : function(deckName){
	    	this._destroyCurrentView();
	    	var lang = this.decksManager.getCurrentLang();
	    	var deck = this.decksManager.getDeck(lang, deckName);
    		var view = new CardView({
    			el : '.body',
    			card : deck.getCurrentCardSideInfo()
    		});
    		this.view = view;
	    	view.render();
	    	var me = this;
	    	view.on('home', function(){
	    		me.decksManager.saveDeckState(deck);
	    		console.log('Event:home');
	    		me.onShowDecksList();
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
		
	    showDecksViewMenu : function(){
    		this._destroyMenu();
    		var menu = new Menu({
			    el : '#menu',
			    overlay : '#menu-overlay',
    			menus : [
    			    { id : 'lang', name : 'change lang'},
    			    { id : 'create-deck', name : 'create deck'},
    			    { id : 'remove-decks', name : 'delete decks'}
    			]
    		});
    		menu.render();
    		var lang = this.decksManager.getCurrentLang();
    		var me = this;
    		menu.on('menu:click', function(menuId){
    			console.log('Event:menu:click:' + menuId);
    			switch(menuId){
    				case 'lang':
    					var langs = me.decksManager.getLangs();
    					me._destroyDialog();
    					me.dialog = new SelectItemDialog({
	   						el : '#dialog',
							overlay : '#menu-overlay',
							title : 'Select lang',
    						items : langs,
    						canCreate : true,
    						actionName : 'switch'
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('selected', function(lang){
    						console.log('Event:selected:lang:' + lang);
    						me.decksManager.setCurrentLang(lang);
    						me.onShowDecksList();
    					});
    					me.dialog.on('create', function(lang){
    						console.log('Event:create:lang:' + lang);
    						me.decksManager.setCurrentLang(lang);
    						var deck = me.decksManager.getTodayDeck(lang);
    						me.decksManager.saveDeckCards(deck);
    						me.onShowDecksList();
    					});
    					break;
    				case 'create-deck':
    					me._destroyDialog();
    					me.dialog = new CreateItemDialog({
	   						el : '#dialog',
							overlay : '#menu-overlay',
							title : 'Create Deck'
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('create', function(deckName){
    						console.log('Event:create:' + deckName);
    						var decks = me.decksManager.getDeckNames(lang);
    						if(_.indexOf(decks, deckName) !== -1){
    							alert('Deck with name "' + deckName + '" already exists');
    							return;
    						}
    						me.decksManager.createDeck(lang, deckName);
    						me.dialog.close();
							me.onShowDecksList();
    					});
    					break;
    				case 'remove-decks':
    					var deckNames = me.decksManager.getDeckNames(lang);
    					me._destroyDialog();
    					me.dialog = new SelectItemDialog({
	   						el : '#dialog',
							overlay : '#menu-overlay',
							title : 'Select Decks',
    						items : deckNames,
    						multipleSelect : true,
    						actionName : 'remove'
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('selected', function(deckNames){
    						console.log('Event:selected');
    						console.log(deckNames);
    						_.each(deckNames, function(deckName){
    							me.decksManager.removeDeck(lang, deckName);
    						});
    						me.onShowDecksList();
    					});
    					break;
    			}
    		});
    		this.menu = menu;
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
    		var lang = this.decksManager.getCurrentLang();
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
    						var todayDeck = me.decksManager.getDeck(lang, 'today');
    						todayDeck.insertCards(cards);
    						me.decksManager.saveDeckStateWithCards(deck);
    						me.decksManager.saveDeckCards(todayDeck);
    					}
    					break;
    				case 'sel2deck': // from today deck
    					var deckNames = me.decksManager.getDeckNames(lang);
    					me._destroyDialog();
    					me.dialog = new SelectItemDialog({
	   						el : '#dialog',
							overlay : '#menu-overlay',
							title : 'Select target Deck for cards',
    						items : deckNames,
    						actionName : 'move'
    					});
    					me._destroyMenu();
    					me.dialog.render();
    					me.dialog.on('selected', function(deckName){
    						var targetDeck = me.decksManager.getDeck(lang, deckName);
    						if(targetDeck){
    							var cards = deck.removeSelectedCards();
    							if(cards.length > 0){
    								// strip reviews counts for cards moved into study decks
    								_.each(cards, function(card){
    									if(!_.isUndefined(card.reviews)){
    										delete card.reviews;
    									}
    								});
    								//console.log(cards);
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
    				case 'sel2keep': // from today-deck
    					var cards = deck.removeSelectedCards();
    					console.log('cards to keep:');
    					console.log(cards);
    					if(cards.length){
    						me.decksManager.keepCards(cards);
    						me.decksManager.saveDeckStateWithCards(deck);
    					}
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
    				case 'import-from-web': // from 'today deck view
    					me.onShowLoadCards1(deck);
    					break;
    			}
    			console.log('Event:menu:click:' + itemId);
    		});
    		this.menu = menu;
	    },
	    
	    onShowLoadCards1 : function(targetDeck){
	    	var me = this;
	    	me._destroyMenu();
	    	var dialog = new LoadingCards1Dialog({
					el : '#dialog',
					overlay : '#menu-overlay'
	    	});
	    	this.dialog = dialog;
	    	dialog.render();
	    	var lang = this.decksManager.getCurrentLang();
	    	var fetching = this.cardsServerAgent.fetchLanguages();
	    	fetching.done(function(langs){
	    		dialog.showLanguages(langs);
	    	});
	    	fetching.fail(function(err){
	    		alert(err);
	    	});
	    	dialog.on('close', function(){
	    		me._destroyDialog();
	    	});
	    	dialog.on('load-decks', function(lang){
	    		me.onShowLoadCards2(lang, targetDeck);
	    	});
	    },
		
	    onShowLoadCards2 : function(fromLang, targetDeck){
	    	var me = this;
	    	var fetching = this.cardsServerAgent.fetchDecks(fromLang);
	    	fetching.done(function(decks){
	    		me._destroyDialog();
		    	var dialog = new LoadingCards2Dialog({
					el : '#dialog',
					overlay : '#menu-overlay',
		    		lang : fromLang,
		    		decks : decks
		    	});
		    	me.dialog = dialog;
		    	dialog.render();
		    	dialog.on('close', function(){
		    		me._destroyDialog();
		    	});
		    	dialog.on('load-cards', function(lang, deckName){
		    		var cardsFetching = me.cardsServerAgent.fetchCards(lang, deckName);
		    		cardsFetching.done(function(cards){
		    			var lang = me.decksManager.getCurrentLang();
			    		targetDeck.insertCards(cards);
			    		me.decksManager.saveDeckCards(targetDeck);
			    		me.dialog.close();
		    		});
		    		cardsFetching.fail(function(err){
		    			alert(err);
		    		});
		    	});
	    	});
	    	fetching.fail(function(err){
	    		alert(err);
	    	});
	    },
	    
	    _destroyCurrentView : function(){
	    	if(!_.isUndefined(this.view)){
	    		this.view.undelegateEvents();
	    		delete this.view;
	    	}
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
	    }
		
	});
	
	return MainRouter;
});