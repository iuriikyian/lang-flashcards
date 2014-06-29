define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
		function(_, $, BaseDialog, utils){
	
	var CreateItemDialog = BaseDialog.extend({
		template : utils.template('create-item'),
		
		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.title = options.title;
		},
		
		_onCreate : function(evt){
			var name = this.$('input.new-item-name').val();
			if(name){
				this.trigger('create', name);
				this.remove();
			}
		},
		
		render : function(){
			this._base_render({
				title : this.title
			});
			this.$('.commands .create').on(this.tapEvent, _.bind(this._onCreate, this));
			return this;
		}
	});
	
	return CreateItemDialog;
});