define(['underscore', 'backbone', 'utils/date'], function(_, Backbone, DateUtils){
	var REVIEW_INTERVALS = [1, 3, 6];
	var KeepDeck = function(options){
		
		this.cards = options.cards || [];
		
		this.putCards = function(cards){
			_.each(cards, function(card){
				if(_.isUndefined(card.reviews)){
					card.reviews = 1;
				}else{
					card.reviews += 1;
				}
				if(card.reviews <= REVIEW_INTERVALS.length){
					card.nextReview = this._nextReviewDate(REVIEW_INTERVALS[card.reviews - 1]);
					this.cards.push(card);
				}
			}, this);
		};
		
		this.getTodayCards = function(){
			var todayDate = DateUtils.date2ISO(this._getCurrentDate());
			var todayCards = [];
			var keptCards = [];
			_.each(this.cards, function(card){
				if(card.reviewDate <= todayDate){
					todayCards.push(card);
				}else{
					keptCards.push(card);
				}
			});
			this.cards = keptCards;
			return todayCards;
		};
		
		this.getCardsToKeep = function(){
			return this.cards;
		};
		
		this._getCurrentDate = function(){
			//for redefinition in tests
			return new Date();
		};
		
		this._nextReviewDate = function(daysInterval){
			var reviewDate = this._getCurrentDate();
			reviewDate.setDate(reviewDate.getDate() + daysInterval);
			return DateUtils.date2ISO(reviewDate); 
		};
	};
	
	return KeepDeck;
});
