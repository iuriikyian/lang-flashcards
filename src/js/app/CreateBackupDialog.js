define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
		function(_, $, BaseDialog, utils){
	
	var CreateBackupDialog = BaseDialog.extend({
		template : utils.template('create-backup'),
		
		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.defaultName = options.defaultName;
		},
		
		_onCreate : function(evt){
			this.$('.errors').removeClass('hidden');
			var name = this.$('input.new-item-name').val();
			if(name){
				this.$('.commands .create .loading').addClass('loading-active');
				this.trigger('create', name);
			}else{
				this.showError('Name cannot be empty');
			}
		},
		
		render : function(){
			this._base_render({
				defaultName : this.defaultName
			});
			this.$('.commands .create').on(this.tapEvent, _.bind(this._onCreate, this));
		},
		
		showError : function(message){
			this.$('.errors').append(message);
			this.$('.errors').removeClass('hidden');
		},
		
		showSuccess : function(){
			var name = this.$('input.new-item-name').val();
			this.$('.editor').addClass('hidden');
			this.$('.commands').addClass('hidden');
			this.$('.result .backup-name').text(name);
			this.$('.result').removeClass('hidden');
		}
	});
	
	return CreateBackupDialog;
});