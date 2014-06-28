define(['underscore', 'zepto', 'backbone', 'utils/utils', 'zepto.hammer'], 
		function(_, $, Backbone, utils){
	var HIDDEN_CLASS = 'hidden';
	
	var Menu = Backbone.View.extend({
		template : utils.template('menu'),
		
		initialize : function(options){
			this.menus = options.menus;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.menu .menu-item').hammer().on('tap', _.bind(this._onMenuClick, this));
		},		
		
		_onMenuClick : function(evt){
			var menuId = $(evt.target).attr('data-target');
			this.close();
			this.trigger('menu:click', menuId);
		},
		
		close : function(){
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
				.hammer().on('tap', _.bind(this.close, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
			var pos = this.$el.position();
			var height = $(window).height();
			var maxHeight = height - pos.top;
			this.$el.css({
				'max-height' : '' + maxHeight + 'px'
			});
		}
	});
	
	return Menu;
});