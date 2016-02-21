var _ = require('underscore'),
	$ = require('jquery'),
	Hammer = require('hammerjs'),
	Backbone = require('backbone'),
	utils = require('../../utils/utils');

var TEMPLATE_ID = 'decksList';
var EDIT_MODE_CLASS = 'edit-mode';

module.exports = Backbone.View.extend({
	className : 'body',
	template : utils.template('decks-list'),
	name : 'decks-view',

	initialize : function(options){
		this.decks = options.decks || [];
		this.lang = options.lang;
		this.tapEvent = options.tapEvent;
	},

	_initTouchEvents : function(){
		utils.hammerOn(this.$('.header .menu-button'), 'tap', _.bind(this._onShowMenu, this));
		var $content = this.$('.content');
		utils.hammerOn($content.find('.today-button'), 'tap', _.bind(this._onShowTodayDeck, this));
		utils.hammerOn($content.find('.deck-button'), 'tap', _.bind(this._onShowDeck, this));
	},

	render : function(){
		$(this.el).empty();
		$(this.el).append(this.template({
			title: 'flashcards (' + this.lang + ')',
			decks : this.decks,
		}));
		this._initTouchEvents();
		this.updateContentHeight();
		return this;
	},

	updateContentHeight : function(){
		var $content = this.$('.content');
		var pos = $content.position();
		var height = $(window).height();
		var contentHeight = height - pos.top;
		$content.css({
			'height' : '' + contentHeight + 'px'
		});
	},

	_onShowMenu : function(){
		if(this.$('.content').hasClass(EDIT_MODE_CLASS)){
			return;
		}
		this.trigger('show:menu', {});
	},

	_onShowTodayDeck : function(){
		if(this.$('.content').hasClass(EDIT_MODE_CLASS)){
			return;
		}
		this.trigger('show:today-deck', {});
	},

	_onShowDeck : function(evt){
		if(this.$('.content').hasClass(EDIT_MODE_CLASS)){
			return;
		}
		this.trigger('show:deck', $(evt.target).attr('data-target'));
	}
});