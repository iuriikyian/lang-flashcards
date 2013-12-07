define(['underscore', 'Deck', 'jasmine'], function(_, Deck){
	describe('Deck', function(){
		it('create empty deck with default options', function(){
			var d = new Deck({});
			expect(d.cardsCount()).toEqual(0);
			expect(d.mode).toEqual('plain');
			expect(d.name).toEqual('');
			expect(d.lang).toEqual('');
			expect(d.currentIndex).toEqual(0);
			expect(_.keys(d.selectedCards).length).toEqual(0);
			expect(_.keys(d.flippedCards).length).toEqual(0);
		});
		it('current card for empty deck is null', function(){
			var d = new Deck({});
			expect(d.getCurrentCard()).toBeNull();
		});
		it('mode changing set new mode and trigger changed event', function(){
			var d = new Deck({});
			var eventFired = false;
			d.on('changed', function(){
				eventFired = true;
			});
			runs(function(){
				d.setMode('back');
			});
			waitsFor(function(){
				return eventFired;
			}, 'wait for chaned event', 100);
			runs(function(){
				expect(d.mode).toEqual('back');
			});
		});
		it('current card can be selected and deselected', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'}]});
			var meta = d.getMeta();
			expect(_.keys(meta.selectedCards).length).toEqual(0);
			var cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(false);
			d.toggleCardSelection();
			expect(_.keys(meta.selectedCards).length).toEqual(1);
			cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(true);
			d.toggleCardSelection();
			expect(_.keys(meta.selectedCards).length).toEqual(0);
			cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(false);
		});
		it('current card can be fliped', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'}]});
			var meta = d.getMeta();
			expect(_.keys(meta.flippedCards).length).toEqual(0);
			var cs = d.getCurrentCardSideInfo();
			expect(cs.flipped).toBe(false);
			d.flipCard();
			expect(_.keys(meta.flippedCards).length).toEqual(1);
			cs = d.getCurrentCardSideInfo();
			expect(cs.flipped).toBe(true);
			d.flipCard();
			expect(_.keys(meta.flippedCards).length).toEqual(0);
			cs = d.getCurrentCardSideInfo();
			expect(cs.flipped).toBe(false);
		});
		it('cyclic forward navigation with change notification', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'}]});
			expect(d.currentIndex).toEqual(0);
			
			var eventsCount = 0;
			d.on('changed', function(){
				eventsCount += 1;
			});
			
			runs(function(){
				d.gotoNext();
			});
			waitsFor(function(){
				return eventsCount === 1;
			}, 100);
			runs(function(){
				expect(d.currentIndex).toEqual(1);
			});
			
			runs(function(){
				d.gotoNext();
			});
			waitsFor(function(){
				return eventsCount === 2;
			}, 100);
			runs(function(){
				expect(d.currentIndex).toEqual(0);
			});
		});
		it('cyclic backward navigation with change notification', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'}]});
			d.currentIndex = 1;
			
			var eventsCount = 0;
			d.on('changed', function(){
				eventsCount += 1;
			});
			
			runs(function(){
				d.gotoPrev();
			});
			waitsFor(function(){
				return eventsCount === 1;
			}, 100);
			runs(function(){
				expect(d.currentIndex).toEqual(0);
			});
			
			runs(function(){
				d.gotoPrev();
			});
			waitsFor(function(){
				return eventsCount === 2;
			}, 100);
			runs(function(){
				expect(d.currentIndex).toEqual(1);
			});
		});
		it('selection can be cleared', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'}]});
			d.toggleCardSelection();
			d.gotoNext();
			d.toggleCardSelection();
			expect(_.keys(d.selectedCards).length).toEqual(2);
			d.clearSelection();
			expect(_.keys(d.selectedCards).length).toEqual(0);
		});
		it('selection can be inverted', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'},{id : 'card3'}]});
			d.toggleCardSelection();
			d.gotoNext();
			d.gotoNext();
			d.toggleCardSelection();
			expect(_.keys(d.selectedCards).length).toEqual(2);
			d.invertSelection();
			expect(_.keys(d.selectedCards).length).toEqual(1);
			d.gotoNext();
			var cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(false);
			d.gotoNext();
			cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(true);
			d.gotoNext();
			cs = d.getCurrentCardSideInfo();
			expect(cs.selected).toBe(false);
		});
		it('removing selected cards', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'},{id : 'card3'}]});
			d.toggleCardSelection();
			d.gotoNext();
			d.gotoNext();
			d.toggleCardSelection();
			var cards = d.removeSelectedCards();
			expect(cards.length).toEqual(2);
			expect(cards[0].id).toEqual('card1');
			expect(cards[1].id).toEqual('card3');
			expect(d.cardsCount()).toEqual(1);
			expect(_.keys(d.selectedCards).length).toEqual(0);
		});
		it('can delete current card with changed event', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'},{id : 'card3'}]});
			var changed = false;
			d.on('changed', function(){
				changed = true;
			});
			d.gotoNext();
			
			runs(function(){
				d.deleteCurrentCard();
			});
			
			waitsFor(function(){
				return changed;
			}, 'changed event should happen', 100);
			
			runs(function(){
				expect(d.cardsCount()).toEqual(2);
				expect(d.cards[0].id).toEqual('card1');
				expect(d.cards[1].id).toEqual('card3');
			});
		});
		it('cards can be inserted into deck with changed event', function(){
			var d = new Deck({cards: [{id : 'card1'}]});
			var changed = false;
			d.on('changed', function(){
				changed = true;
			});
			
			runs(function(){
				d.insertCards([{id : 'card2'},{id : 'card3'}]);
			});
			
			waitsFor(function(){
				return changed;
			}, 'changed event should happen', 100);
			
			runs(function(){
				expect(d.cardsCount()).toEqual(3);
				expect(d.cards[1].id).toEqual('card2');
				expect(d.cards[2].id).toEqual('card3');
			});
		});
		xit('flip and selected state is not changed after cards shuffling', function(){
			var d = new Deck({cards: [{id : 'card1'},{id : 'card2'},{id : 'card3'}]});
			//TBD
		});
	});
});