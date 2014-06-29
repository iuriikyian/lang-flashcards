define(['underscore', 'zepto', 'backbone', 'utils/date',
        'DecksManager', 'DecksView', 'CardsServerAgent',
        'CardView', 'ViewsFactory'
        ], function(_, $, Backbone, DateUtils,
        		DecksManager, DecksView, CardsServerAgent,
        		CardView,  ViewsFactory){
	function getDeviceId(){
		if(_.isUndefined(window.device)){
			return '4129036ec2073b7c'; //'test-4';
		}
		return window.device.uuid;
	}

    var TAP_EVENT = 'click';
    var OVERLAY_SELECTOR = '#overlay';
	
	var MainRouter = Backbone.Router.extend({
//		routes : {
//			"" : "onStart"
//		},
		
		initialize : function(options){
            this.viewsFactory = new ViewsFactory();
			this.decksManager = options.decksManager;
			this.cardsServerAgent = new CardsServerAgent();
		},
		
		onStart : function(){
			var deckName = this.decksManager.getCurrentDeck();
			if(deckName){
				if(deckName === 'today'){
					return this.onShowDeckCards(deckName);
				}else{
					var lang = this.decksManager.getCurrentLang();
					var deckNames = this.decksManager.getDeckNames(lang);
					if(_.contains(deckNames, deckName)){
						return this.onShowDeckCards(deckName);
					}
				}
			}
			this.onShowDecksList();
		},
		
		onBackbutton : function(evt){
			console.log('back button handler called');
			if(! _.isUndefined(this.dialog)){
				this._destroyDialog();
				return;
			}

			if(this.view.name === 'card-view'){
				this.view.willBeClosed();
				this.onShowDecksList();
				return;
			}
			navigator.app.exitApp();
		},
		
		onResize : function(){
			if(this.view){
				this.view.render();
			}
		},
		
		onShowDecksList : function(){
			this.decksManager.setCurrentDeck('');
	    	var me = this;
	    	this._destroyCurrentView();
	    	var lang = this.decksManager.getCurrentLang();
	    	var view = new DecksView({
	    		el : '.body',
	    		decks : this.decksManager.getDeckNames(lang),
	    		lang : lang,
                tapEvent : TAP_EVENT
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
			this.decksManager.setCurrentDeck(deckName);
	    	this._destroyCurrentView();
	    	var lang = this.decksManager.getCurrentLang();
	    	var deck = this.decksManager.getDeck(lang, deckName);
    		var view = new CardView({
    			el : '.body',
    			card : deck.getCurrentCardSideInfo(),
                tapEvent : TAP_EVENT
    		});
    		this.view = view;
	    	view.render();
	    	var me = this;
	    	view.on('save-deck-state', function(){
	    		me.decksManager.saveDeckState(deck);
	    	});
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
	    	view.on('card:toggle-select', function(){
	    		deck.toggleCardSelection();
	    		console.log('Event:card:toggle-select');
	    	});
	    	deck.on('changed', function(){
	    		console.log('Event: deck:change');
	    		view.setCard(deck.getCurrentCardSideInfo());
		    	view.render();
	    	});
		},
		
	    showDecksViewMenu : function(){
            var menu = this.viewsFactory.createView('menu', {
    			menus : [
    			    { id : 'lang', name : 'change lang'},
    			    { id : 'create-deck', name : 'create deck'},
    			    { id : 'remove-decks', name : 'delete decks'},
    			    { id : 'backup', name : 'backup'},
    			    { id : 'restore', name : 'restore'}
    			]
    		});

    		$('body').append(menu.render().el);
    		var lang = this.decksManager.getCurrentLang();
    		var me = this;
    		menu.on('selected', _.bind(function(menuId){
    			console.log('Event:menu:selected:' + menuId);
    			switch(menuId){
    				case 'lang':
    					var langs = this.decksManager.getLangs();
                        this.dialog = this.viewsFactory.createView('select-lang', {
                            items : langs,
                            canCreate : true,
                            actionName : 'switch',
                        });
    					this.dialog.render();
    					this.dialog.on('selected', function(lang){
    						console.log('Event:selected:lang:' + lang);
    						me.decksManager.setCurrentLang(lang);
    						me._destroyDialog();
    						me.onShowDecksList();
    					});
    					this.dialog.on('create', function(lang){
    						console.log('Event:create:lang:' + lang);
    						me.decksManager.setCurrentLang(lang);
    						var deck = me.decksManager.getTodayDeck(lang);
    						me.decksManager.saveDeckCards(deck);
    						me._destroyDialog();
    						me.onShowDecksList();
    					});
                        this.dialog.on('close', _.bind(function(){
                            this._destroyDialog();
                        }, this));
    					break;
    				case 'create-deck':
                        this.dialog = this.viewsFactory.createView('create-deck', {});
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('create', function(deckName){
    						console.log('Event:create:' + deckName);
    						var decks = me.decksManager.getDeckNames(lang);
    						if(_.indexOf(decks, deckName) !== -1){
    							alert('Deck with name "' + deckName + '" already exists');
    							return;
    						}
    						me.decksManager.createDeck(lang, deckName);
    						me._destroyDialog();
							me.onShowDecksList();
    					});
    					break;
    				case 'remove-decks':
    					var deckNames = this.decksManager.getDeckNames(lang);
                        this.dialog = this.viewsFactory.createView('select-decks', {
                            items : deckNames,
                            multipleSelect : true,
                            actionName : 'remove',
                        });
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('selected', function(deckNames){
    						console.log('Event:selected');
    						console.log(deckNames);
    						_.each(deckNames, function(deckName){
    							me.decksManager.removeDeck(lang, deckName);
    						});
    						me._destroyDialog();
    						me.onShowDecksList();
    					});
    					break;
    				case 'backup':
                        this.dialog = this.viewsFactory.createView('create-backup', {
                            defaultName : DateUtils.datetime2ISO(new Date())
                        });
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('create', function(backupName){
    						var data = me.decksManager.createBackup();
    						var saving = me.cardsServerAgent.saveBackup(getDeviceId(), backupName, data);
    						saving.done(function(success){
    							me.dialog.showSuccess();
    						});
    						saving.fail(function(err){
    							me.dialog.showError(err);
    							alert(err);
    						});
    					});
    					break;
    				case 'restore':
                        this.dialog = this.viewsFactory.createView('restore-backup', {});
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('restore', function(backupName){
    						var backupFetching = me.cardsServerAgent.fetchBackup(getDeviceId(), backupName);
    						backupFetching.done(function(data){
    							console.log(data);
    							me.decksManager.restoreFromBackup(data);
        						me._destroyDialog();
        						me.onShowDecksList();
    						});
    						backupFetching.fail(function(err){
    							me.dialog.showError(err);
    							alert(err);
    						});
    					});
    					var backupNamesFetching = me.cardsServerAgent.fetchAvailableBackups(getDeviceId());
    					backupNamesFetching.done(_.bind(function(names){
    						this.dialog.showBackups(names);
    					}, this));
    					backupNamesFetching.fail(_.bind(function(err){
    						this.dialog.showError(err);
    					}, this));
    					break;
    			}
    		}, this));
	    },
		
	    showCardViewMenu : function(deck, isTodayDeck){
	    	var modeMenuName = 'review mode (' + deck.getModeSign() + ')';
			var menus = [
			    { id : 'mode', name : modeMenuName, order : 10},
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
				
            var menu = this.viewsFactory.createView('menu', {
    			menus : menus,
    		});
            $('body').append(menu.render().el);
    		var lang = this.decksManager.getCurrentLang();
    		var me = this, cards;
    		menu.on('selected', _.bind(function(itemId){
    			switch(itemId){
    				case 'mode':
                        this.dialog = this.viewsFactory.createView('review-mode', {
                            mode : deck.mode
                        });
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('mode-selected', function(mode){
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
    					cards = deck.removeSelectedCards();
    					if(cards.length > 0){
    						var todayDeck = me.decksManager.getDeck(lang, 'today');
    						todayDeck.insertCards(cards);
    						me.decksManager.saveDeckStateWithCards(deck);
    						me.decksManager.saveDeckCards(todayDeck);
    					}
    					break;
    				case 'sel2deck': // from today deck
    					var deckNames = this.decksManager.getDeckNames(lang);
                        this.dialog = this.viewsFactory.createView('select-target-deck', {
                            items : deckNames,
                            actionName : 'move'
                        });
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					this.dialog.on('selected', function(deckName){
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
    					cards = deck.removeSelectedCards();
    					console.log('cards to keep:');
    					console.log(cards);
    					if(cards.length){
    						this.decksManager.keepCards(lang, cards);
    						this.decksManager.saveDeckStateWithCards(deck);
    					}
    					break;
    				case 'deck-info':
                        this.dialog = this.viewsFactory.createView('deck-info', {
                            info : deck.getDeckInfo()
                        });
    					this.dialog.render();
    					this.dialog.on('close', function(){
    						me._destroyDialog();
    					});
    					break;
    				case 'delete-card':
    					deck.deleteCurrentCard();
    					this.decksManager.saveDeckStateWithCards(deck);
    					break;
    				case 'import-from-web': // from 'today deck view
    					this.onShowLoadCards1(deck);
    					break;
    			}
    			console.log('Event:menu:click:' + itemId);
    		}, this));
	    },
	    
	    onShowLoadCards1 : function(targetDeck){
	    	var me = this;
            var dialog = this.viewsFactory.createView('load-cards-1', {});
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
	    	fetching.done(_.bind(function(decks){
	    		this._destroyDialog();
                var dialog = this.viewsFactory.createView('load-cards-2', {
                    lang : fromLang,
                    decks : decks,
                });
		    	this.dialog = dialog;
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
			    		me._destroyDialog();
		    		});
		    		cardsFetching.fail(function(err){
		    			alert(err);
		    		});
		    	});
	    	}, this));
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
	    
	    _destroyDialog : function(){
    		if(! _.isUndefined(this.dialog)){
                this.viewsFactory.destroyView(this.dialog);                
    			delete this.dialog;
    		}
	    }
		
	});
	
	return MainRouter;
});