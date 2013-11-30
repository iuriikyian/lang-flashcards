define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var Menu = Backbone.View.extend({
		template : _.template($('#menuTemplate').html()),
		
		initialize : function(options){
			this.menus = options.menus;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.menu .menu-item').hammer().on('tap', _.bind(this._onMenuClick, this));
		},		
		
		_onMenuClick : function(evt){
			var menuId = $(evt.target).attr('data-target');
			this._hideMenu();
			this.trigger('menu:click', menuId);
		},
		
		_hideMenu : function(){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		render : function(){
			//$(this.el).off();
			$(this.el).empty();
			$(this.el).append(this.template({
				menus : this.menus,
			}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._hideMenu, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		}
	});
	
	return Menu;
});