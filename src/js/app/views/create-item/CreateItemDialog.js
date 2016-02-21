var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

module.exports = BaseDialog.extend({
	template : utils.template('create-item'),

	initialize : function(options){
		BaseDialog.prototype.initialize.call(this, options);
		this.title = options.title;
	},

	_onCreate : function(evt){
		var name = this.$('input.new-item-name').val();
		if(name){
			this.trigger('create', name);
			this.close();
		}
	},

	render : function(){
		this._base_render({
			title : this.title
		});
		utils.hammerOn(this.$('.commands .create'), 'tap', _.bind(this._onCreate, this));
		return this;
	}
});