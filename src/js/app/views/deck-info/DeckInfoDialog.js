define(['underscore', 'zepto', 'BaseDialog', 'utils/utils'], 
		function(_, $, BaseDialog, utils){
	
	var DeckInfoDialog = BaseDialog.extend({
		template : utils.template('deck-info'),

		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.info = options.info;
		},
		
		render : function(){
			this._base_render(this.info);
			return this;
		}
	});
	
	return DeckInfoDialog;
});