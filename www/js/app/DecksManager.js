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
		
		this.getDeck = function(lang, deckName){
			if(!deckName){
				return this.getTodayDeck(lang);
			}
			var keysCount = storage.length;
			var cardsKey = [DECK_CARDS_PREFIX, lang, SEPARATOR, deckName].join('');
			var metaKey = [DECK_META_PREFIX, lang, SEPARATOR, deckName].join('');
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
		
		this.getTodayDeck = function(lang){
			var cards = storage.getItem(TODAY_CARDS_PREFIX + lang);
			if(cards){
				var meta = storage.getItem(TODAY_META_PREFIX + lang);
				var deck = new Deck({
					lang : lang,
					name : 'today',
					cards : cards,
					meta : meta
				});
				return deck;
			}
			return null;
		};
	};
	
	return DecksManager;
});