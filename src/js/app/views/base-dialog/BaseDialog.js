var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone');

var HIDDEN_CLASS = 'hidden';

module.exports = Backbone.View.extend({
	//className : 'dialog',

	initialize : function(options){
		//this.overlay = options.overlay;
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
		//this.$el.addClass(HIDDEN_CLASS);
		//$(this.overlay).addClass(HIDDEN_CLASS);
	},

	_base_render : function(model){
		$(this.el).append(this.template(model));
		this.$('.overlay').hammer().on('tap', _.bind(this._onClose, this));
		this.$('.header .close').hammer().on('tap', _.bind(this._onClose, this));
	}
});