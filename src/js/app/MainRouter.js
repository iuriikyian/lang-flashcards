define(['underscore', 'zepto', 'backbone', 'utils/date',
        'DecksManager', 'CardsServerAgent', 'ViewsFactory',
        'ServicesFactory'
        ], 
function(_, $, Backbone, DateUtils,
        DecksManager, CardsServerAgent, ViewsFactory,
        ServicesFactory){

	function getDeviceId(){
		if(_.isUndefined(window.device)){
			return '4129036ec2073b7c'; //'test-4';
		}
		return window.device.uuid;
	}

    var OVERLAY_SELECTOR = '#overlay';
	
	var MainRouter = Backbone.Router.extend({
		
		initialize : function(options){
            this.servicesFactory = new ServicesFactory({});
            this.viewsFactory = new ViewsFactory({
                isDevice : options.isDevice
            });
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
	    	var lang = this.decksManager.getCurrentLang();
            var view = this.viewsFactory.createView('decks-list', {
                decks : this.decksManager.getDeckNames(lang),
                lang : lang
            });
	    	this.view = view;
	    	$('body').append(view.render().el);
	    	view.on('show:menu', _.bind(function(){
	    		console.log('Event:show:menu');
	    		this.showDecksViewMenu();
	    	}, this));
	    	view.on('show:today-deck', _.bind(function(){
	    		console.log('Event:show:today-deck');
                view.remove();
                delete this.view;
	    		this.onShowDeckCards('today');
	    	}, this));
	    	view.on('show:deck', _.bind(function(deckName){
	    		console.log('Event:show:deck:' + deckName);
                view.remove();
                delete this.view;
	    		this.onShowDeckCards(deckName);
	    	}, this));
		},
		
		onShowDeckCards : function(deckName){
			this.decksManager.setCurrentDeck(deckName);
	    	var lang = this.decksManager.getCurrentLang();
	    	var deck = this.decksManager.getDeck(lang, deckName);
            var view = this.viewsFactory.createView('card-view', {
                card : deck.getCurrentCardSideInfo()
            });
    		this.view = view;
            $('body').append(view.render().el);
	    	view.on('save-deck-state', _.bind(function(){
	    		this.decksManager.saveDeckState(deck);
	    	}, this));
	    	view.on('home', _.bind(function(){
	    		this.decksManager.saveDeckState(deck);
	    		console.log('Event:home');
                view.remove();
                delete this.view;
	    		this.onShowDecksList();
	    	}, this));
	    	view.on('show:menu', _.bind(function(){
	    		console.log('Event:show:menu');
	    		this.showCardViewMenu(deck, deckName === 'today');
	    	}, this));
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
    			    { id : 'restore', name : 'restore'},
                    { id : 'test-fs', name : 'test fs' }
    			]
    		});

    		$('body').append(menu.render().el);
            menu.afterRender();
    		var lang = this.decksManager.getCurrentLang();
    		menu.on('selected', _.bind(function(menuId){
    			console.log('Event:menu:selected:' + menuId);
                var dialog;
    			switch(menuId){
    				case 'lang':
    					var langs = this.decksManager.getLangs();
                        dialog = this.viewsFactory.createView('select-lang', {
                            items : langs,
                            canCreate : true,
                            actionName : 'switch',
                        });
                        $('body').append(dialog.render().el);
    					dialog.on('selected', _.bind(function(lang){
    						console.log('Event:selected:lang:' + lang);
    						this.decksManager.setCurrentLang(lang);
    						this.onShowDecksList();
    					}, this));
    					dialog.on('create', _.bind(function(lang){
    						console.log('Event:create:lang:' + lang);
    						this.decksManager.setCurrentLang(lang);
    						var deck = this.decksManager.getTodayDeck(lang);
    						this.decksManager.saveDeckCards(deck);
    						this.onShowDecksList();
    					}, this));
    					break;
    				case 'create-deck':
                        dialog = this.viewsFactory.createView('create-deck', {});
                        $('body').append(dialog.render().el);
    					dialog.on('create', _.bind(function(deckName){
    						console.log('Event:create:' + deckName);
    						var decks = this.decksManager.getDeckNames(lang);
    						if(_.indexOf(decks, deckName) !== -1){
    							alert('Deck with name "' + deckName + '" already exists');
    							return;
    						}
    						this.decksManager.createDeck(lang, deckName);
							this.onShowDecksList();
    					}, this));
    					break;
    				case 'remove-decks':
    					var deckNames = this.decksManager.getDeckNames(lang);
                        dialog = this.viewsFactory.createView('select-decks', {
                            items : deckNames,
                            multipleSelect : true,
                            actionName : 'remove',
                        });
                        $('body').append(dialog.render().el);
    					dialog.on('selected', _.bind(function(deckNames){
    						console.log('Event:selected');
    						console.log(deckNames);
    						_.each(deckNames, function(deckName){
    							this.decksManager.removeDeck(lang, deckName);
    						}, this);
    						this.onShowDecksList();
    					}, this));
    					break;
    				case 'backup':
                        dialog = this.viewsFactory.createView('create-backup', {
                            defaultName : DateUtils.datetime2ISO(new Date())
                        });
                        $('body').append(dialog.render().el);
    					dialog.on('create', _.bind(function(backupName){
    						var data = this.decksManager.createBackup();
    						var saving = this.cardsServerAgent.saveBackup(getDeviceId(), backupName, data);
    						saving.done(function(success){
    							dialog.showSuccess();
    						});
    						saving.fail(function(err){
    							dialog.showError(err);
    							alert(err);
    						});
    					}, this));
    					break;
    				case 'restore':
                        dialog = this.viewsFactory.createView('restore-backup', {});
                        $('body').append(dialog.render().el);
    					dialog.on('restore', _.bind(function(backupName){
    						var backupFetching = this.cardsServerAgent.fetchBackup(getDeviceId(), backupName);
    						backupFetching.done(_.bind(function(data){
    							console.log(data);
    							this.decksManager.restoreFromBackup(data);
        						this.onShowDecksList();
    						}, this));
    						backupFetching.fail(function(err){
    							dialog.showError(err);
    							alert(err);
    						});
    					}, this));
    					var backupNamesFetching = this.cardsServerAgent.fetchAvailableBackups(getDeviceId());
    					backupNamesFetching.done(_.bind(function(names){
    						dialog.showBackups(names);
    					}, this));
    					backupNamesFetching.fail(_.bind(function(err){
    						dialog.showError(err);
    					}, this));
    					break;
                    case 'test-fs':
                        var fsSrv = this.servicesFactory.get('file-system');
                        var listing = fsSrv.list('/My Documents');
                        //var listing = fsSrv.list('/');
                        listing.done(function(data){
                            console.log(JSON.stringify(data));
                        });
                        listing.fail(function(err){
                            console.log(JSON.stringify(err));    
                        });
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
                menus.push({ id : 'import-from-file', name : 'from file', order : 80});
			}else{
				menus.push({ id : 'sel2today', name : 'sel->today', order : 45});
			}
			menus.sort(function(a, b){return a.order > b.order ? 1 : (a.order < b.order ? -1 : 0); });
				
            var menu = this.viewsFactory.createView('menu', {
    			menus : menus,
    		});
            $('body').append(menu.render().el);
            menu.afterRender();
    		var lang = this.decksManager.getCurrentLang();
    		var me = this, cards;
    		menu.on('selected', _.bind(function(itemId){
                var dialog;
    			switch(itemId){
    				case 'mode':
                        dialog = this.viewsFactory.createView('review-mode', {
                            mode : deck.mode
                        });
                        $('body').append(dialog.render().el);
    					dialog.on('mode-selected', function(mode){
    						deck.setMode(mode);
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
    						var todayDeck = this.decksManager.getDeck(lang, 'today');
    						todayDeck.insertCards(cards);
    						this.decksManager.saveDeckStateWithCards(deck);
    						this.decksManager.saveDeckCards(todayDeck);
    					}
    					break;
    				case 'sel2deck': // from today deck
    					var deckNames = this.decksManager.getDeckNames(lang);
                        dialog = this.viewsFactory.createView('select-target-deck', {
                            items : deckNames,
                            actionName : 'move'
                        });
                        $('body').append(dialog.render().el);
    					dialog.on('selected', _.bind(function(deckName){
    						var targetDeck = this.decksManager.getDeck(lang, deckName);
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
    								this.decksManager.saveDeckCards(targetDeck);
    								this.decksManager.saveDeckStateWithCards(deck);
    							}else{
    								alert('nothing moved');
    							}
    						}else{
    							alert('target deck is not found');
    						}
    					}, this));
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
                        dialog = this.viewsFactory.createView('deck-info', {
                            info : deck.getDeckInfo()
                        });
    					$('body').append(dialog.render().el);
    					break;
    				case 'delete-card':
    					deck.deleteCurrentCard();
    					this.decksManager.saveDeckStateWithCards(deck);
    					break;
    				case 'import-from-web': // from 'today deck view
    					this.onShowLoadCards1(deck);
    					break;
                    case 'import-from-file':
                        var fileSysteService = this.servicesFactory.get('file-system');
                        dialog = this.viewsFactory.createView('select-file', {
                            fileService : fileSysteService
                        });
                        var rendering = dialog.render();
                        rendering.done(function(){
                            $('body').append(dialog.el);
                        });
                        rendering.fail(function(err){
                            console.log(JSON.stringify(err));
                        });
                        dialog.on('selected', _.bind(function(filePath){
                            alert('load cards from file: ' + filePath);
                            var fileLoading = fileSysteService.load(filePath);
                            fileLoading.done(_.bind(function(content){
                                var parser = this.servicesFactory.get('cards-text-parser');
                                var cards = parser.parse(content);
                                deck.insertCards(cards);
                                this.decksManager.saveDeckCards(deck);
                            }, this));
                            fileLoading.fail(function(err){
                                console.log(JSON.stringify(err));
                                alert('Fail to load selected file');    
                            });
                        }, this));
                        break;
    			}
    			console.log('Event:menu:click:' + itemId);
    		}, this));
	    },
	    
	    onShowLoadCards1 : function(targetDeck){
            var dialog = this.viewsFactory.createView('load-cards-1', {});
            $('body').append(dialog.render().el);
	    	var lang = this.decksManager.getCurrentLang();
	    	var fetching = this.cardsServerAgent.fetchLanguages();
	    	fetching.done(function(langs){
	    		dialog.showLanguages(langs);
	    	});
	    	fetching.fail(function(err){
	    		alert(err);
	    	});
	    	dialog.on('load-decks', _.bind(function(lang){
	    		this.onShowLoadCards2(lang, targetDeck, function(){
                    dialog.close();    
                });
	    	}, this));
	    },
		
	    onShowLoadCards2 : function(fromLang, targetDeck, onLoaded){
	    	var fetching = this.cardsServerAgent.fetchDecks(fromLang);
	    	fetching.done(_.bind(function(decks){
                onLoaded();
                var dialog = this.viewsFactory.createView('load-cards-2', {
                    lang : fromLang,
                    decks : decks,
                });
                $('body').append(dialog.render().el);
		    	dialog.on('load-cards', _.bind(function(lang, deckName){
		    		var cardsFetching = this.cardsServerAgent.fetchCards(lang, deckName);
		    		cardsFetching.done(_.bind(function(cards){
		    			var lang = this.decksManager.getCurrentLang();
			    		targetDeck.insertCards(cards);
			    		this.decksManager.saveDeckCards(targetDeck);
                        dialog.close();
		    		}, this));
		    		cardsFetching.fail(function(err){
		    			alert(err);
		    		});
		    	}, this));
	    	}, this));
	    	fetching.fail(function(err){
	    		alert(err);
	    	});
	    }
	});
	
	return MainRouter;
});