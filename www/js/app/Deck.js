define(['underscore', 'backbone'], function(_, Backbone){
	
	var Deck = function(options){
		this.lang = options.lang || '';
		this.name = options.name || '';
		this.cards = options.cards || [];
		this.currentIndex = (options.meta && options.meta.currentIndex) || 0;
		this.selectedCards = (options.meta && options.meta.selectedCards) || {};
		this.flippedCards = (options.meta && options.meta.flippedCards) || {};
		this.mode = (options.meta && options.meta.mode) || 'plain';

		_.extend(this, Backbone.Events);
		
		this.getMeta = function(){
			return {
				currentIndex : this.currentIndex,
				selectedCards : this.selectedCards,
				flippedCards : this.flippedCards,
				mode : this.mode
			};
		};
		
		this.getCards = function(){
			return this.cards;
		};
		
		this.cardsCount = function(){
			return this.cards.length();
		};
		
		this.setMode = function(newMode){
			this.mode = newMode;
			this.trigger('changed');
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
		this._correctCurrentIndex = function(){
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
		
		this._adjustCardSide = function(){
			switch(this.mode){
				case 'front':
					if(this.flippedCards[this.currentIndex]){
						delete this.flippedCards[this.currentIndex];
					}
					break;
				case 'back':
					if(!this.flippedCards[this.currentIndex]){
						this.flippedCards[this.currentIndex] = true;
					}
					break;
				case 'random':
					var flipped = Math.random() >= 0.5;
					if(flipped){
						this.flippedCards[this.currentIndex] = true;
					}else{
						if(this.flippedCards[this.currentIndex]){
							delete this.flippedCards[this.currentIndex];
						}
					}
					break;
			}
		};
		// --- cards side access --- begin
		this.gotoNext = function(){
			if(this.cards.length === 0){
				return;
			}
			this.currentIndex += 1;
			if(this.currentIndex >= this.cards.length){
				this.currentIndex = 0;
			}
			this._adjustCardSide();
			this.trigger('changed');
		};
		
		this.gotoPrev = function(){
			if(this.cards.length === 0){
				return;
			}
			this.currentIndex -= 1;
			if(this.currentIndex < 0){
				this.currentIndex = this.cards.length - 1;
			}
			this._adjustCardSide();
			this.trigger('changed');
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
			this.trigger('changed');
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
			this.trigger('changed');
		};
		
		this.clearSelection = function(){
			this.selectedCards = {};
			this.trigger('changed');
		};

		this.invertSelection = function(){
			var newSelection = {};
			var me = this;
			_.each(this.cards, function(card, idx){
				if(!this.selectedCards[idx]){
					newSelection[idx] = true;
				}
			}, this);
			this.selectedCards = newSelection;
			this.trigger('changed');
		};
		
		// returns removed
		this.removeSelectedCards = function(){
			var removed = [];
			var kept = [];
			var newFlippedCards = {};
			_.each(this.cards, function(card, idx){
				if(this.selectedCards[idx]){
					removed.push(card);
				}else{
					kept.push(card);
					if(this.flippedCards[idx]){
						newFlippedCards[kept.length - 1] = true;
					}
				}
			}, this);
			this.selectedCards = {};
			this.flippedCards = newFlippedCards;
			this.cards = kept;
			this._correctCurrentIndex();
			this.trigger('changed');
			return removed;
		};
		
		this.insertCards = function(cards){
			if(!cards){
				return;
			}
			_.each(cards, function(card){
				this.cards.push(card);
			}, this);
			this.trigger('changed');
		};
		
		this.deleteCurrentCard = function(){
			if(this.cards.length === 0){
				return;
			}
			if(this.flippedCards[this.currentIndex]){
				delete this.flippedCards[this.currentIndex];
			}
			if(this.selectedCards[this.currentIndex]){
				delete this.selectedCards[this.currentIndex];
			}
			this.cards.splice(this.currentIndex, 1);
			this._correctCurrentIndex();
			this.trigger('changed');
		};
		
		this.shuffle = function(){
			var i, j, k, temp;
			// Shuffle the stack 'n' times.
			var SHUFFLE_CICLES_COUNT = 3;
			for (i = 0; i < SHUFFLE_CICLES_COUNT; i++){
				for (j = 0; j < this.cards.length; j++) {
					k = Math.floor(Math.random() * this.cards.length);
					temp = this.cards[j];
					this.cards[j] = this.cards[k];
					this.cards[k] = temp;
				}
			}			
			this.trigger('changed');
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
			}else{
				return {
					deckName : this.name,
					deckSize : 0
				};
			}
		};
		
		this.getDeckInfo = function(){
			return {
				name : this.name,
				lang : this.lang,
				cardsCount : this.cards.length,
				cardsSelected : _.keys(this.selectedCards).length
			};
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
