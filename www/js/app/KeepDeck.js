define(['underscore', 'backbone'], function(_, Backbone){
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
				if(card.reviews < REVIEW_INTERVALS.length){
					card.nextReview = this._nextReviewDate(card.reviews);
					this.cards.push(card);
				}
			}, this);
		};
		
		this.getTodayCards = function(){
			var todayDate = this._date2ISO(new Date());
			var todayCards = [];
			var keptCards = [];
			_.each(this.cards, function(card){
				if(card.reviewDate < todayDate){
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
		
		this._nextReviewDate = function(daysInterval){
			var reviewDate = new Date();
			reviewDate.setDate(reviewDate.getDate() + daysInterval);
			return this._date2ISO(reviewDate); 
		};
		
		this._date2ISO = function(date){
			function padWith0(str){
				return str[1] ? str : "0" + str[0]; // padding
			};
			if(date){
				var mm = padWith0((date.getMonth() + 1).toString()); // getMonth() is zero-based
				var dd = padWith0(date.getDate().toString());
				return [date.getFullYear().toString(), mm, dd].join('-');
			}
			return '';
		};
	};
	
	return KeepDeck;
});
