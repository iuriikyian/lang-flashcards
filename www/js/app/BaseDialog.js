define(['underscore', 'zepto', 'backbone', 'zepto.touch'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	//var OVERLAY_SELECTOR = '#menu-overlay';
	
	var BaseDialog = Backbone.View.extend({
		
		initialize : function(options){
			this.overlay = options.overlay; //'#menu-overlay';
			this.tapEvent = options.tapEvent;
		},
		
		_onClose : function(evt){
			this.close();
			this.trigger('close', {});
		},
		
		close : function(){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		_base_render : function(model){
			$(this.el).empty();
			$(this.el).append(this.template(model));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.on(this.tapEvent, _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this.$('.header .close').on(this.tapEvent, _.bind(this._onClose, this));
		}
	});
	
	return BaseDialog;
});