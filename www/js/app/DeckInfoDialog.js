define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var DeckInfoDialog = Backbone.View.extend({
		template : _.template($('#deckInfoTemplate').html()),

		initialize : function(options){
			this.info = options.info;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
		},		
		
		_onClose : function(evt){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template(this.info));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		}
	});
	
	return DeckInfoDialog;
});