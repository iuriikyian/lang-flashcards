define(['underscore', 'zepto', 'BaseDialog', 'utils/utils'], 
		function(_, $, BaseDialog, utils){
	
	var CreateItemDialog = BaseDialog.extend({
		template : utils.template('create-item'), //_.template($('#createItemTemplate').html()),
		
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