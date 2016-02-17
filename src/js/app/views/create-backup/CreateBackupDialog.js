var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('./../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

module.exports = BaseDialog.extend({
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
		this.$('.commands .create').hammer().on('tap', _.bind(this._onCreate, this));
		return this;
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