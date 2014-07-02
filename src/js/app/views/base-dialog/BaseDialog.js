define(['underscore', 'zepto', 'backbone', 'zepto.touch'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var BaseDialog = Backbone.View.extend({
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
			//this.$el.addClass(HIDDEN_CLASS);
			//$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		_base_render : function(model){
			$(this.el).append(this.template(model));
			this.$('.overlay').on(this.tapEvent, _.bind(this._onClose, this));
			this.$('.header .close').on(this.tapEvent, _.bind(this._onClose, this));
		}
	});
	
	return BaseDialog;
});