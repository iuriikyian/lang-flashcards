define(['underscore', 'Deck', 'testStorage'], function(_, Deck, TestStorage){
	var SEPARATOR = '-';
	var DECK_CARDS_PREFIX = 'deck-cards' + SEPARATOR;
	var DECK_META_PREFIX = 'deck-meta' + SEPARATOR;
	var TODAY_CARDS_PREFIX = 'today-cards' + SEPARATOR;
	var TODAY_META_PREFIX = 'today-meta' + SEPARATOR;
	
	//var storage = localStorage;
	var storage = TestStorage; // for testing
	
	var DecksManager = function(){

		this.getLangs = function(){
			var keysCount = storage.length;
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
			return _.keys(langs);
		};

		this.getDeckNames = function(lang){
			var prefix = [DECK_CARDS_PREFIX, lang, SEPARATOR].join('');
			var keysCount = storage.length;
			var names = [];
			for(var i = 0; i < keysCount ; ++i){
				var key = storage.key(i);
				if(key.indexOf(prefix) === 0){
					var name = key.substr(prefix.length);
					names.push(name);
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
			if(deckName === 'today'){
				return this.getTodayDeck(lang);
			}
			var keysCount = storage.length;
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
		
		// saves only deck navigation state
		this.saveDeckState = function(deck){
			if(!deck){
				return;
			}
			var metaKey = this._getDeckMetaKey(deck.lang, deck.name);
			storage.setItem(metaKey, deck.getMeta());
			//TODO: use JSON stringify for real storage
		};

		this.saveDeckCards = function(deck){
			var cardsKey = this._getDeckCardsKey(deck.lang, deck.name);
			storage.setItem(cardsKey, deck.getCards());
			//TODO: use JSON stringify for real storage
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
			return deck;
		};
	};
	
	return DecksManager;
});