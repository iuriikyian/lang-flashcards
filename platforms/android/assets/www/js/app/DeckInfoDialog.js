define(['underscore', 'zepto', 'BaseDialog'], 
		function(_, $, BaseDialog){
	
	var DeckInfoDialog = BaseDialog.extend({
		template : _.template($('#deckInfoTemplate').html()),

		initialize : function(options){
			this.info = options.info;
		},
		
		render : function(){
			this._base_render(this.info);
		}
	});
	
	return DeckInfoDialog;
});