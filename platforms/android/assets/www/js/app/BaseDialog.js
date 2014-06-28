define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	var OVERLAY_SELECTOR = '#menu-overlay';
	
	var BaseDialog = Backbone.View.extend({
		
		initialize : function(options){
			this.overlay = '#menu-overlay';
		},
		
		_onClose : function(evt){
			this.close();
			this.trigger('close', {});
		},
		
		close : function(){
			this.$el.addClass(HIDDEN_CLASS);
			$(OVERLAY_SELECTOR).addClass(HIDDEN_CLASS);
		},
		
		_base_render : function(model){
			$(this.el).empty();
			$(this.el).append(this.template(model));
			$(OVERLAY_SELECTOR)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this.$('.header .close').hammer().on('tap', _.bind(this._onClose, this));
		}
	});
	
	return BaseDialog;
});