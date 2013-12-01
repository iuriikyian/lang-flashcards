define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var CreateItemDialog = Backbone.View.extend({
		template : _.template($('#createItemTemplate').html()),
		
		initialize : function(options){
			this.overlay = options.overlay;
			this.title = options.title;
		},
		
		_initTouchEvents : function(){
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
			this.$('.commands .create').hammer().on('tap', _.bind(this._onCreate, this));
		},		
		
		_onClose : function(evt){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		close : function(){
			this._onClose();
		},
		
		_onCreate : function(evt){
			var name = this.$('input.new-item-name').val();
			if(name){
				this.trigger('create', name);
			}
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				title : this.title
			}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		}
	});
	
	return CreateItemDialog;
});