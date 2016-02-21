var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	utils = require('../../utils/utils');

module.exports = Backbone.View.extend({
	className : 'body',
	template : utils.template('card-view'),
	name : 'card-view',

	initialize : function(options){
		this.card = options.card;
	},

	_initTouchEvents : function(){
		utils.hammerOn(this.$('.content'), 'tap', _.bind(this._onContentClick, this));
		var $header = this.$('.header');
		utils.hammerOn($header.find('.home-button'), 'tap', _.bind(this._onHome, this));
		utils.hammerOn($header.find('.menu-button'), 'tap', _.bind(this._onShowMenu, this));
		utils.hammerOn(this.$('.content .selected'), 'tap', _.bind(this._onToggleSelected, this));
	},

	willBeClosed : function(){
		this.trigger('save-deck-state', {});
	},

	render : function(){
		$(this.el).empty();
		$(this.el).append(this.template({
			card : this.card
		}));
		this._initTouchEvents();
		return this;
	},
	setCard : function(card){
		this.card = card;
	},
	_onHome : function(){
		this.trigger('home', {});
	},
	_onShowMenu : function(){
		this.trigger('show:menu', {});
	},
	_onShowPrev : function(){
		this.trigger('card:show-prev');
	},
	_onShowNext : function(){
		this.trigger('card:show-next');
	},
	_onFlip : function(){
		this.trigger('card:flip');
	},
	_onContentClick : function(evt){
		console.log('_onContentClick' );
		if($(evt.target).hasClass('selected')){
			return;
		}
		var width = $(window).width();
		// to handle browser usage and touchstart event usage on device
		var xPos = _.isUndefined(evt.pointers) ? evt.pageX : evt.pointers[0].pageX;
		console.log('width: ' + width + ', xPos: ' + xPos);
		if(xPos > width * 0.8){
			return this._onShowNext();
		}
		if(xPos < width * 0.2){
			return this._onShowPrev();
		}
		return this._onFlip();
	},
	_onToggleSelected : function(evt){
		evt.preventDefault();
		var $selected = this.$('.content .selected');
		$selected.toggleClass('fa-square-o');
		$selected.toggleClass('fa-check-square-o');
		this.trigger('card:toggle-select', $selected.hasClass('fa-check-square-o'));
	}
});