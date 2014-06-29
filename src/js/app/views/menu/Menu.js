define(['underscore', 'zepto', 'backbone', 'utils/utils', 'zepto.touch'], 
		function(_, $, Backbone, utils){
	
	var Menu = Backbone.View.extend({
		className : 'menu-view',
		template : utils.template('menu'),
		
		initialize : function(options){
			this.menus = options.menus;
			this.tapEvent = options.tapEvent || 'tap';
		},
		
		_onMenuClick : function(evt){
			var menuId = $(evt.target).attr('data-target');
			this.trigger('selected', menuId);
			this.remove();
		},
		
		_onClose : function(){
			this.trigger('selected');
			this.remove();
		},
		
		render : function(){
			$(this.el).append(this.template({
				menus : this.menus,
			}));
			this.$('.overlay').on(this.tapEvent, _.bind(this._onClose, this));
			this.$('.menu .menu-item').on(this.tapEvent, _.bind(this._onMenuClick, this));
			//var pos = this.$el.position();
			var height = $(window).height();
			var maxHeight = height; // - pos.top;
			this.$el.css({
				'max-height' : '' + maxHeight + 'px'
			});
			return this;
		}
	});
	
	return Menu;
});