define(['underscore', 'zepto', 'BaseDialog'], 
		function(_, $, BaseDialog){
	
	var CreateItemDialog = BaseDialog.extend({
		template : _.template($('#createItemTemplate').html()),
		
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
			this.$('.commands .create').hammer().on('tap', _.bind(this._onCreate, this));
		}
	});
	
	return CreateItemDialog;
});