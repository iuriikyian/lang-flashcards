define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var ReviewModeDialog = Backbone.View.extend({
		template : _.template($('#reviewModeTemplate').html()),

		initialize : function(options){
			this.mode = options.mode;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.option').hammer().on('tap', _.bind(this._onSelectMode, this));
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
		},		
		
		_onSelectMode : function(evt){
			var mode = $(evt.currentTarget).find('.state').attr('data-mode');
			this._onClose();
			this.trigger('mode-selected', mode);
		},
		
		_onClose : function(evt){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		render : function(){
			//$(this.el).off();
			$(this.el).empty();
			$(this.el).append(this.template({mode : this.mode}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		}
	});
	
	return ReviewModeDialog;
});