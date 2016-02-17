var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

module.exports = BaseDialog.extend({
	template : utils.template('review-mode'),

	initialize : function(options){
		BaseDialog.prototype.initialize.call(this, options);
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
		return this;
	}
});