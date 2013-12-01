define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], function(_, $, Backbone){
	var TEMPLATE_ID = 'decksList';
	var EDIT_MODE_CLASS = 'edit-mode';
	
	var DecksView = Backbone.View.extend({
		template : _.template($('#decksList').html()),
		
		initialize : function(options){
			this.decks = options.decks || [];
			this.lang = options.lang;
		},
		
		_initTouchEvents : function(){
			this.$('.header .menu-button').hammer().on('tap', _.bind(this._onShowMenu, this));
			var $content = this.$('.content'); 
			$content.find('.today-button').hammer().on('tap', _.bind(this._onShowTodayDeck, this));
			$content.find('.deck-button').hammer().on('tap', _.bind(this._onShowDeck, this));
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				title: 'flashcards (' + this.lang + ')',
				decks : this.decks,
			}));
			this._initTouchEvents();
			this.updateContentHeight();
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
	
	return DecksView;
});