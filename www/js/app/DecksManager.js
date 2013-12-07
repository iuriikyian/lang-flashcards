define(['underscore', 'Deck', 'KeepDeck'], function(_, Deck, KeepDeck){
	var DEFAULT_LANG = 'default';
	var TODAY_DECK_NAME = 'today';
	var SEPARATOR = '-';
	var DECK_CARDS_PREFIX = 'deck-cards' + SEPARATOR;
	var DECK_META_PREFIX = 'deck-meta' + SEPARATOR;
	var KEPT_CARDS_PREFIX = 'keep-cards' + SEPARATOR;
	var CURRENT_LANG_KEY = 'current-lang';
	
	//var storage = TestStorage; // for testing
	
	var DecksManager = function(storage){

		this.getLangs = function(){
			var keysCount = storage.getKeysCount();
			var langs = {};
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key.indexOf(DECK_CARDS_PREFIX) === 0){
					var langPlusName = key.substr(DECK_CARDS_PREFIX.length);
					var separatorPos = langPlusName.indexOf(SEPARATOR);
					var lang = langPlusName.substr(0, separatorPos);
					langs[lang] = lang;
				}
			}
			var res = _.keys(langs);
			if(res.length === 0){
				res.push(DEFAULT_LANG);
			}
			return res;
		};

		this.getDeckNames = function(lang){
			if(!lang){
				throw new Error('lang is not provided');
			}
			var prefix = [DECK_CARDS_PREFIX, lang, SEPARATOR].join('');
			var keysCount = storage.getKeysCount();
			var names = [];
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key.indexOf(prefix) === 0){
					var name = key.substr(prefix.length);
					if(name !== TODAY_DECK_NAME){
						names.push(name);
					}
				}
			}
			return names;
		};
		
		this._getDeckCardsKey = function(lang, name){
			return [DECK_CARDS_PREFIX, lang, SEPARATOR, name].join('');
		};

		this._getDeckMetaKey = function(lang, name){
			return [DECK_META_PREFIX, lang, SEPARATOR, name].join('');
		};
		
		this.getDeck = function(lang, deckName){
			if(!lang){
				throw new Error('lang is not provided');
			}
			if(deckName === TODAY_DECK_NAME){
				return this.getTodayDeck(lang);
			}
			var keysCount = storage.getKeysCount();
			var cardsKey = this._getDeckCardsKey(lang, deckName);
			var metaKey = this._getDeckMetaKey(lang, deckName);
			var cards;
			var meta;
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key === cardsKey){
					cards = storage.getItem(key);
					continue;
				}
				if(key === metaKey){
					meta = storage.getItem(key);
					continue;
				}
				if(cards && meta){
					break;
				}
			}
			if(cards){
				var deck = new Deck({
					lang : lang,
					name : deckName,
					cards : cards,
					meta : meta
				});
				return deck;
			}
			return null;
		};
		
		this.createDeck = function(lang, deckName){
			var cardsKey = this._getDeckCardsKey(lang, deckName);
			storage.setItem(cardsKey, []);
		};
		
		this.removeDeck = function(lang, deckName){
			var cardsKey = this._getDeckCardsKey(lang, deckName);
			var metaKey = this._getDeckMetaKey(lang, deckName);
			storage.removeItem(metaKey);
			storage.removeItem(cardsKey);
		};
		// saves only deck navigation state
		this.saveDeckState = function(deck){
			if(!deck){
				return;
			}
			var metaKey = this._getDeckMetaKey(deck.lang, deck.name);
			storage.setItem(metaKey, deck.getMeta());
		};

		this.saveDeckCards = function(deck){
			var cardsKey = this._getDeckCardsKey(deck.lang, deck.name);
			storage.setItem(cardsKey, deck.getCards());
		};
		
		// saves deck navigation state and cards (usefull after deck content changes)
		this.saveDeckStateWithCards = function(deck){
			this.saveDeckState(deck);
			this.saveDeckCards(deck);
		};
		
		this.getTodayDeck = function(lang){
			var cards = storage.getItem(this._getDeckCardsKey(lang, 'today'));
			if(!cards){
				cards = [];
			}
			var meta = storage.getItem(this._getDeckMetaKey(lang, 'today'));
			var deck = new Deck({
				lang : lang,
				name : 'today',
				cards : cards,
				meta : meta
			});
			var newCards = this._getNewTodayCards(lang);
			if(newCards.length > 0){
				_.each(newCards, function(card){
					deck.cards.push(card);
				});
				storage.setItem(this._getDeckCardsKey(lang, 'today'), deck.cards);
			}
			return deck;
		};
		
		this._getKeedDeckKey = function(lang){
			return KEPT_CARDS_PREFIX + lang;
		},
		
		this.keepCards = function(lang, cards){
			if(cards && cards.length > 0){
				var key = this._getKeedDeckKey(lang);
				var keepCards = storage.getItem(key);
				if(!keepCards){
					keepCards = [];
				}
				var keepDeck = new KeepDeck({
					cards : keepCards
				});
				keepDeck.putCards(cards);
				storage.setItem(key, keepDeck.getCardsToKeep());
			}
		};
		
		this._getNewTodayCards = function(lang){
			var key = this._getKeedDeckKey(lang);
			var cards = storage.getItem(key);
			if(cards){
				var keepDeck = new KeepDeck({
					cards : cards
				});
				var newCards = keepDeck.getTodayCards();
				if(newCards.length){
					storage.setItem(key, keepDeck.getCardsToKeep());
					return newCards;
				}
			}
			return [];
		};
		
		this.getCurrentLang = function(){
			return storage.getItem(CURRENT_LANG_KEY) || DEFAULT_LANG;
		};
		
		this.setCurrentLang = function(lang){
			var oldLang = this.getCurrentLang();
			if(oldLang !== lang){
				this._createTodayDeckIfNotExists(oldLang); // to keep track of languages
			}
			storage.setItem(CURRENT_LANG_KEY, lang);
			this._createTodayDeckIfNotExists(lang);
		};
		
		this._createTodayDeckIfNotExists = function(lang){
			var key = this._getDeckCardsKey(lang, TODAY_DECK_NAME);
			var data = storage.getItem(key);
			if(!data){
				var todayDeck = this.getDeck(lang, TODAY_DECK_NAME);
				this.saveDeckCards(todayDeck);
			}
		};
		
		this.createBackup = function(){
			var res = {};
			var keysCount = storage.getKeysCount();
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key.indexOf(DECK_CARDS_PREFIX) === 0){
					res[key] = storage.getItem(key);
					continue;
				}
				if(key.indexOf(DECK_META_PREFIX) === 0){
					res[key] = storage.getItem(key);
					continue;
				}
				if(key.indexOf(KEPT_CARDS_PREFIX) === 0){
					res[key] = storage.getItem(key);
					continue;
				}
				
				if(key === CURRENT_LANG_KEY){
					res[key] = storage.getItem(key);
					continue;
				}
			}
			return JSON.stringify(res);
		};
		this.restoreFromBackup = function(backup){
			try{
				var data = JSON.parse(backup);
				this._cleanupDecksData();
				_.each(_.keys(data), function(key){
					storage.setItem(key, data[key]);
				});
			}catch(e){
				console.log(e);
			}
		};
		this._cleanupDecksData = function(){
			var keysToRemove = [CURRENT_LANG_KEY];
			var keysCount = storage.getKeysCount();
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key.indexOf(DECK_CARDS_PREFIX) === 0){
					keysToRemove.push(key);
					continue;
				}
				if(key.indexOf(DECK_META_PREFIX) === 0){
					keysToRemove.push(key);
					continue;
				}
				if(key.indexOf(KEPT_CARDS_PREFIX) === 0){
					keysToRemove.push(key);
					continue;
				}
			}
			_.each(keysToRemove, function(key){
				storage.removeItem(key);
			});
		};
	};
	
	return DecksManager;
});