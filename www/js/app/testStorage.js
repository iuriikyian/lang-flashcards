define(['underscore'], function(_){
	var testData = {
		'deck-cards-english-deck1' : [
		       {
		    	   'side-1' : ['card-1'],
		    	   'side-2' : ['card-1(2)']
		       },
		       {
		    	   'side-1-top' : ['card-2-top'],
		    	   'side-1' : ['card-2'],
		    	   'side-2' : ['card-2(2)'],
		       		'side-2-bottom' : ['bottom-2(2)']
		       },
		       {
		    	   'side-1' : ['card-3'],
		    	   'side-2' : ['card-3(2)']
		       }
		 ],
		 'deck-meta-english-deck1' : {
			 currentIndex : 1,
			 flippedCards : {
				 1 : true
			 },
			 selectedCards : {
				 2 : true
			 }
		 },
		 'deck-cards-english-deck2' : [
   		       {
   		    	   'side-1' : ['card-1-2'],
   		    	   'side-2' : ['card-1-2(2)']
   		       },
   		       {
   		    	   'side-1-top' : ['card-2-2-top'],
   		    	   'side-1' : ['card-2-2'],
   		    	   'side-2' : ['card-2-2(2)'],
   		       		'side-2-bottom' : ['bottom-2-2(2)']
   		       }
   		 ],
   		 'deck-meta-english-deck2' : {
   			 currentIndex : 1,
   			 flippedCards : {
   				 1 : true
   			 },
   			 selectedCards : {}
   		 }
	};
	return {
		length : 4,
		key : function(idx){
			return _.keys(testData)[idx];
		},
		getItem : function(key){
			return testData[key];
		}
	};
});