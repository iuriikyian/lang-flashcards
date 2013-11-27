define(['underscore', 'zepto', 'backbone'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var ReviewModeDialog = Backbone.View.extend({
		template : _.template($('#reviewModeTemplate').html()),
		events : {
			'click .option' : '_onSelectMode',
			'click .title .close' : '_onClose'
		},
		
		initialize : function(options){
			this.mode = options.mode;
			this.overlay = options.overlay;
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
			var me = this;
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.on('click', function(){
					me._onClose();
				});
			this.$el.removeClass(HIDDEN_CLASS);
		}
	});
	
	return ReviewModeDialog;
});