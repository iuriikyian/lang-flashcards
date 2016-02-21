var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	utils = require('../../utils/utils');

var HIDDEN_CLASS = 'hidden';

module.exports = Backbone.View.extend({

	initialize : function(options){
		this.tapEvent = options.tapEvent;
		this.singleTapEvent = options.singleTapEvent;
	},

	_onClose : function(evt){
		this.close();
		this.trigger('close', {});
	},

	close : function(){
		this.remove();
		this.trigger('closed');
	},

	_base_render : function(model){
		$(this.el).append(this.template(model));
		utils.hammerOn(this.$('.overlay'), 'tap',_.bind(this._onClose, this));
		utils.hammerOn(this.$('.header .close'), 'tap', _.bind(this._onClose, this));
	}
});