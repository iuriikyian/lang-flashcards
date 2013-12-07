define(['KeepDeck', 'jasmine'], function(KeepDeck){
	describe('KeepDeck', function(){
		it('if no cards put in the deck, there is nothing to keep', function(){
			var kd = new KeepDeck({});
			expect(kd.getCardsToKeep().length).toEqual(0);
		});
		it('put cards without reviews', function(){
			var kd = new KeepDeck({});
			kd._getCurrentDate = function(){ return new Date(2015, 04, 16);}
			kd.putCards([{},{}]);
			var keepCards = kd.getCardsToKeep();
			expect(keepCards.length).toEqual(2);
			expect(keepCards[0].reviews).toEqual(1);
			expect(keepCards[0].nextReview).toEqual('2015-05-17');
			expect(keepCards[1].reviews).toEqual(1);
			expect(keepCards[1].nextReview).toEqual('2015-05-17');
		});
		it('put cards with reviews', function(){
			var kd = new KeepDeck({});
			kd._getCurrentDate = function(){ return new Date(2015, 04, 16);}
			kd.putCards([{},{reviews : 1},{reviews : 2},{reviews : 3}]);
			var keepCards = kd.getCardsToKeep();
			expect(keepCards.length).toEqual(3);
			expect(keepCards[0].reviews).toEqual(1);
			expect(keepCards[0].nextReview).toEqual('2015-05-17');
			expect(keepCards[1].reviews).toEqual(2);
			expect(keepCards[1].nextReview).toEqual('2015-05-19');
			expect(keepCards[2].reviews).toEqual(3);
			expect(keepCards[2].nextReview).toEqual('2015-05-22');
		});
		it('get today cards from kept cards', function(){
			var kd = new KeepDeck({
				cards : [
				    { reviewDate : '2015-04-10'},
				    { reviewDate : '2015-05-16'},
				    { reviewDate : '2015-05-17'},
				    { reviewDate : '2015-05-23'}
				]
			});
			kd._getCurrentDate = function(){ return new Date(2015, 04, 16);}
			var todayCards = kd.getTodayCards();
			expect(todayCards.length).toEqual(2);
			expect(todayCards[0].reviewDate).toEqual('2015-04-10');
			expect(todayCards[1].reviewDate).toEqual('2015-05-16');
			var keepCards = kd.getCardsToKeep();
			expect(keepCards.length).toEqual(2);
			expect(keepCards[0].reviewDate).toEqual('2015-05-17');
			expect(keepCards[1].reviewDate).toEqual('2015-05-23');
		})
	});
});