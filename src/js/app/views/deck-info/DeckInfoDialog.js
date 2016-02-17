var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

module.exports = BaseDialog.extend({
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