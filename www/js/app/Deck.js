define(['underscore'], function(_){
	var Deck = function(options){
		this.name = options.lang || '';
		this.name = options.name || '';
		this.cards = options.cards || [];
		this.currentIndex = (options.meta && options.meta.currentIndex) || 0;
		this.selectedCards = (options.meta && options.meta.selectedCards) || {};
		this.flippedCards = (options.meta && options.meta.flippedCards) || {};
		
		this.getMeta = function(){
			return {
				currentINdex : this.currentIndex,
				selectedCards : this.selectedCards,
				flippedCards : this.flippedCards
			};
		};
		
		this.cardsCount = function(){
			return this.cards.length();
		};
		
		// --- cards access --- begin
		this.getCurrentCard = function(){
			if(this.cards.length === 0){
				return null;
			}
			this._normalizeCurrentIndex();
			return this.cards[this.currentIndex];
		};
		
		this.getNextCard = function(){
			if(this.cards.length === 0){
				return null;
			}
			this.currentIndex += 1;
			if(this.currentIndex > this.cards.length){
				this.currentIndex = 0;
			}
			return this.cards[this.currentIndex];
		};

		this.getPrevCard = function(){
			if(this.cards.length === 0){
				return null;
			}
			this.currentIndex -= 1;
			if(this.currentIndex < 0){
				this.currentIndex = this.cards.length - 1;
			}
			return this.cards[this.currentIndex];
		};
		// --- cards access --- end
		// --- cards side access --- begin
		this.gotoNext = function(){
			if(this.cards.length === 0){
				return;
			}
			this.currentIndex += 1;
			if(this.currentIndex >= this.cards.length){
				this.currentIndex = 0;
			}
		};
		
		this.gotoPrev = function(){
			if(this.cards.length === 0){
				return;
			}
			this.currentIndex -= 1;
			if(this.currentIndex < 0){
				this.currentIndex = this.cards.length - 1;
			}
		};
		
		this.flipCard = function(){
			if(this.cards.length === 0){
				return;
			}
			if(this.flippedCards[this.currentIndex]){
				delete this.flippedCards[this.currentIndex];
			}else{
				this.flippedCards[this.currentIndex] = true;
			}
		};
		
		this.selectCard = function(){
			if(this.cards.length === 0){
				return;
			}
			if(this.selectedCards[this.currentIndex]){
				delete this.selectedCards[this.currentIndex];
			}else{
				this.selectedCards[this.currentIndex] = true;
			}
		};
		
		this.getCurrentCardSideInfo = function(){
			var card = this.getCurrentCard();
			if(card){
				var res = {
					deckName : this.name,
					deckSize : this.cards.length,
					index : this.currentIndex,
					selected : ! _.isUndefined(this.selectedCards[this.currentIndex]),
					flipped : ! _.isUndefined(this.flippedCards[this.currentIndex])
				};
				var prefix = res.flipped ? 'side-2' : 'side-1';
				var top = card[prefix + '-top']; 
				if(top){
					res.top = top;
				}
				var text = card[prefix]; 
				if(text){
					res.text = text;
				}
				var bottom = card['-bottom']; 
				if(bottom){
					res.bottom = bottom;
				}
				console.log(res);
				return res;
			}
			return null;
		};
		//--- cards side access --- end
		this._normalizeCurrentIndex = function(){
			if(this.cards.length === 0){
				return;
			}
			if(this.currentIndex < 0){
				this.currentIndex = 0;
			}else{
				if(this.currentIndex >= this.cards.length){
					this.currentIndex = this.cards.length - 1;
				}
			}
		};
	};
	
	return Deck;
});
