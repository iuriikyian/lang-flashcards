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
		it('deck can be removed', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			var lang = dm.getCurrentLang();
			dm.createDeck(lang, 'deck1');
			dm.createDeck(lang, 'deck2');
			var deckNames = dm.getDeckNames(lang);
			expect(deckNames.length).toEqual(2);
			dm.removeDeck(lang, 'deck1');
			deckNames = dm.getDeckNames(lang);
			expect(deckNames.length).toEqual(1);
		});
		it('content of decks can be backuped and restored', function(){
			var testData = {};
			var storage = new InMemoryStorage(testData);
			var dm = new DecksManager(storage);
			
			// 1. prepare data
			var lang = dm.getCurrentLang();
			var deckName = 'a-deck-1';
			dm.createDeck(lang, deckName);
			var deck = dm.getDeck(lang, deckName);
			deck.insertCards([{id:'card1'},{id:'card2'}]);
			deck.gotoNext();
			dm.saveDeckStateWithCards(deck);
			var lang2 = 'testlang';
			dm.setCurrentLang(lang2);
			var deck2Name = 'b-deck-1';
			dm.createDeck(lang2, deck2Name);
			var deck2 = dm.getDeck(lang2, deck2Name);
			deck2.insertCards([{id:'2card1'},{id:'2card2'},{id:'2card3'}]);
			deck2.gotoNext();
			deck2.gotoNext();
			dm.saveDeckStateWithCards(deck2);
			var today2 = dm.getTodayDeck(lang2);
			today2.insertCards([{id:'tcard1'},{id:'tcard2'}]);
			today2.flipCard();
			today2.gotoNext();
			today2.toggleCardSelection();
			dm.saveDeckStateWithCards(today2);
			
			// 2. backup data
			var backupData = dm.createBackup();
			//console.log('backup created');
			//console.dir(backupData);
			
			// 3. create changed data state
			dm.createDeck(lang2, 'test');
			today2.removeSelectedCards();
			dm.setCurrentLang('new-lang');
			// 4. restore data from backup
			dm.restoreFromBackup(backupData);
			
			
			// 5. check that all is restored to the backup point
			var _check_restore_result = function(decksManager){
				var dm = decksManager;
				var langs = dm.getLangs(); 
				expect(langs.length).toEqual(2);
				expect(_.contains(langs, lang)).toBe(true);
				expect(_.contains(langs, lang2)).toBe(true);
				expect(dm.getCurrentLang()).toEqual(lang2);
				expect(dm.getDeckNames(lang).length).toEqual(1);
				var d = dm.getDeck(lang, deckName);
				expect(d).toNotBe(null);
				expect(d.cardsCount()).toEqual(2);
				
				expect(dm.getDeckNames(lang2).length).toEqual(1);
				d = dm.getDeck(lang2, deck2Name);
				expect(d).toNotBe(null);
				expect(d.cardsCount()).toEqual(3);
				
				var t = dm.getTodayDeck(lang2);
				expect(t.cardsCount()).toEqual(2);
				expect(t.getCurrentCardSideInfo().flipped).toBe(false);
				expect(t.getCurrentCardSideInfo().selected).toBe(true);
				t.gotoNext();
				expect(t.getCurrentCardSideInfo().flipped).toBe(true);
				expect(t.getCurrentCardSideInfo().selected).toBe(false);
				t.gotoNext();
			}
			_check_restore_result(dm);
			// 6 restore from scratch
			testData = {};
			storage = new InMemoryStorage(testData);
			dm = new DecksManager(storage);
			dm.restoreFromBackup(backupData);
			
			// 7. check that all is restored to the backup point
			_check_restore_result(dm);
		});
	});
});