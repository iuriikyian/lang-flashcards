define(['underscore', 'zepto', 'backbone'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var DeckInfoDialog = Backbone.View.extend({
		template : _.template($('#deckInfoTemplate').html()),
		events : {
			'click .title .close' : '_onClose'
		},
		
		initialize : function(options){
			this.info = options.info;
			this.overlay = options.overlay;
		},
		
		_onClose : function(evt){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		render : function(){
			//$(this.el).off();
			$(this.el).empty();
			$(this.el).append(this.template(this.info));
			var me = this;
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.on('click', function(){
					me._onClose();
				});
			this.$el.removeClass(HIDDEN_CLASS);
		}
	});
	
	return DeckInfoDialog;
});