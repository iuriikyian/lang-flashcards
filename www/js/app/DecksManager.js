define(['underscore'], function(_){
	var testData = {
		english : [
		],
			
	};
	
	var DecksManager = function(){
		this.getDeckNames = function(){
			return [
			     'deck-1',
			     'deck-2',
			     'deck-3'
			];
		};
		
		this.getDeck = function(deckName){
			return {
				name : deckName,
				cards : []
			}
		}
	}
	
	return DecksManager;
});