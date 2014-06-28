define(['underscore', 'zepto', 'BaseDialog'], 
		function(_, $, BaseDialog){
	
	var ReviewModeDialog = BaseDialog.extend({
		template : _.template($('#reviewModeTemplate').html()),

		initialize : function(options){
			this.mode = options.mode;
		},
		
		_onSelectMode : function(evt){
			var mode = $(evt.currentTarget).find('.state').attr('data-mode');
			this.close();
			this.trigger('mode-selected', mode);
		},
		
		render : function(){
			this._base_render({mode : this.mode});
			this.$('.option').hammer().on('tap', _.bind(this._onSelectMode, this));
		}
	});
	
	return ReviewModeDialog;
});