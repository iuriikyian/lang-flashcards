define(['underscore', 'zepto', 'backbone'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var Menu = Backbone.View.extend({
		template : _.template($('#menuTemplate').html()),
		events : {
			'click .menu .menu-item' : '_onMenuClick'
		},
		
		initialize : function(options){
			this.menus = options.menus;
			this.overlay = options.overlay;
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
			var me = this;
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.on('click', function(){
					me._hideMenu();
				});
			this.$el.removeClass(HIDDEN_CLASS);
		}
	});
	
	return Menu;
});