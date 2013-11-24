define(['underscore'], function(_){
	var SingleDeckManager = function(options){
		this.cards = options.cards;
		this.deck = options.deck;
		
		this.getCurrentCard = function(){
			if(this.cards.length === 0){
				return null;
			}
		};
		
		this.getNextCard = function(){
			
		};
		
		this.getPrevCard = function(){
			
		};
		
		this.flipCard = function(){
			
		};
	};
	return SingleDeckManager;
});