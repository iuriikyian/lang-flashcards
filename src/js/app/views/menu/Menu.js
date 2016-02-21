var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	utils = require('../../utils/utils');

module.exports = Backbone.View.extend({
	className : 'menu-view',
	template : utils.template('menu'),

	initialize : function(options){
		this.menus = options.menus;
		this.tapEvent = options.tapEvent || 'tap';
	},

	_onMenuClick : function(evt){
		var menuId = $(evt.target).attr('data-target');
		this.trigger('selected', menuId);
		this.close();
	},

	_onClose : function(){
		this.trigger('selected');
		this.close();
	},

	close : function(){
		this.remove();
		this.trigger('closed');
	},

	render : function(){
		$(this.el).append(this.template({
			menus : this.menus,
		}));
		utils.hammerOn(this.$('.overlay'), 'tap', _.bind(this._onClose, this));
		utils.hammerOn(this.$('.menu .menu-item'), 'tap', _.bind(this._onMenuClick, this));
		return this;
	},

	afterRender : function(){
		var $menu = this.$('.menu');
		var pos = $menu.position();
		var height = $(window).height();
		var maxHeight = height - pos.top;
		$menu.css({
			'max-height' : '' + maxHeight + 'px'
		});
	}
});