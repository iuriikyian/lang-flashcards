define(["DecksManager", "in-memory/Storage", "jasmine"], function(DecksManager, InMemoryStorage){
	describe('DecksManager', function(){
		it('access defaults on first start', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			expect(dm.getCurrentLang()).toEqual('default');
			var langs = dm.getLangs();
			expect(langs.length).toEqual(1);
			expect(langs[0]).toEqual('default');
			expect(dm.getDeck(langs[0], 'today')).toBeDefined();
			expect(dm.getDeckNames(langs[0]).length).toEqual(0);
		});
		it('can add new language', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			var langs = dm.getLangs();
			expect(langs.length).toEqual(1);
			dm.setCurrentLang('test');
			expect(dm.getCurrentLang()).toEqual('test');
			langs = dm.getLangs();
			expect(langs.length).toEqual(2);
		});
		it('deck can be created', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			var lang = dm.getCurrentLang();
			dm.createDeck(lang, 'test');
			var deck = dm.getDeck(lang, 'test');
			expect(deck).toBeDefined();
			deck = dm.getDeck(lang, 'notExistent');
			expect(deck).toBe(null);
			expect(_.keys(testData).length).toEqual(1);
		});
		it('can get list of deck names for a lang', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			var lang = dm.getCurrentLang();
			dm.createDeck(lang, 'test1');
			dm.createDeck(lang, 'test2');
			dm.createDeck(lang, 'test3');
			var deckNames = dm.getDeckNames(lang);
			expect(deckNames.length).toEqual(3);
			expect(_.contains(deckNames, 'test1')).toBe(true);
			expect(_.contains(deckNames, 'test2')).toBe(true);
			expect(_.contains(deckNames, 'test3')).toBe(true);
		});
		it('cannot get deck names without providing the language', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			expect(dm.getDeckNames).toThrow();
		});
	});
});