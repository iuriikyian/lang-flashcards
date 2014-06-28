define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'settings', 'zepto.touch'], 
		function(_, $, BaseDialog, utils, settings){
	
	var CreateItemDialog = BaseDialog.extend({
		template : utils.template('create-item'),
		
		initialize : function(options){
			this.title = options.title;
		},
		
		_onCreate : function(evt){
			var name = this.$('input.new-item-name').val();
			if(name){
				this.trigger('create', name);
			}
		},
		
		render : function(){
			this._base_render({
				title : this.title
			});
			this.$('.commands .create').on(settings.tapEvent, _.bind(this._onCreate, this));
		}
	});
	
	return CreateItemDialog;
});