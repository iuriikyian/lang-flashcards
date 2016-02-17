var _ = require('underscore');

var CARDS_SEPARATOR = '==',
	SIDES_SEPARATOR = '--',
	NOTE_MARK = 'n:',
	MARK_LENGTH = 2;

var _createEmptyCard = function(){
	return {
		'side-1-top' : [],
		'side-1' : [],
		'side-1-bottom' : [],
		'side-2-top' : [],
		'side-2' : [],
		'side-2-bottom' : []
	};
};

var _isEmptyCard = function(card){
	return card['side-1'].length === 0 &&
		card['side-1-top'].length === 0 &&
		card['side-1-bottom'].length === 0 &&
		card['side-2'].length === 0 &&
		card['side-2-top'].length === 0 &&
		card['side-2-bottom'].length === 0;
};

module.exports = {
	parse : function(cardsText){
		if(!cardsText){
			console.log('WARNING: empty cards text! No cards data to parse');
			return [];
		}
		var cards = [];
		var lines = cardsText.split('\n');
		var currentCard = _createEmptyCard();
		var beforeFirstSeparator = true;
		var isFrontSide = true;
		_.each(lines, function(line){
			var marker = line.substr(0, MARK_LENGTH);
			if(beforeFirstSeparator){ // skip everything before first cards separator
				if(marker !== CARDS_SEPARATOR){
					return;
				}
				beforeFirstSeparator = false;
				return;
			}
			if(marker === CARDS_SEPARATOR){
				if(!_isEmptyCard(currentCard)){
					cards.push(currentCard);
					currentCard = _createEmptyCard();
					isFrontSide = true;
				}
				return;
			}
			if(marker === SIDES_SEPARATOR){
				isFrontSide = false;
				return;
			}
			var key = isFrontSide ? 'side-1' : 'side-2';
			if(marker === NOTE_MARK){
				if(currentCard[key].length > 0){
					currentCard[key + '-bottom'].push(line.substr(MARK_LENGTH));
				}else{
					currentCard[key + '-top'].push(line.substr(MARK_LENGTH));
				}
				return;
			}
			currentCard[key].push(line);
		});
		if(!_isEmptyCard(currentCard)){
			cards.push(currentCard);
		}
		return cards;
	}
};