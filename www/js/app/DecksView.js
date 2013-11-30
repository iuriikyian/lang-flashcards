define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], function(_, $, Backbone){
	var TEMPLATE_ID = 'decksList';
	var EDIT_MODE_CLASS = 'edit-mode';
	
	var DecksView = Backbone.View.extend({
		template : _.template($('#decksList').html()),
		deckItemTemplate : _.template($('#deckItem').html()),
		
		initialize : function(options){
			this.decks = options.decks || [];
			this.lang = options.lang;
		},
		
		_initTouchEvents : function(){
			this.$('.header .menu-button').hammer().on('tap', _.bind(this._onShowMenu, this));
			var $content = this.$('.content'); 
			$content.find('.today-button').hammer().on('tap', _.bind(this._onShowTodayDeck, this));
			$content.find('.edit').hammer().on('tap', _.bind(this._onEdit, this));
			$content.find('.cancel-edit').hammer().on('tap', _.bind(this._onCancelEdit, this));
			$content.find('.deck-button').hammer().on('tap', _.bind(this._onShowDeck, this));
			$content.find('.add-deck').hammer().on('tap', _.bind(this._onAddDeck, this));
			$content.find('.remove-deck').hammer().on('tap', _.bind(this._onRemoveDeck, this));
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				title: 'flashcards (' + this.lang + ')',
				decks : this.decks,
			}));
			this._initTouchEvents();
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
		
		_onEdit : function(){
			this.$('.content').addClass(EDIT_MODE_CLASS);
			this.$('.content .today-button').addClass('disabled');
			this.$('.content .deck-button').addClass('disabled');
			this.$('.header .menu-button').addClass('disabled');
		},
		
		_onCancelEdit : function(){
			this.$('.content').removeClass(EDIT_MODE_CLASS);
			this.$('.content .today-button').removeClass('disabled');
			this.$('.content .deck-button').removeClass('disabled');
			this.$('.header .menu-button').removeClass('disabled');
		},
		
		_onShowDeck : function(evt){
			if(this.$('.content').hasClass(EDIT_MODE_CLASS)){
				return;
			}
			this.trigger('show:deck', $(evt.target).attr('data-target'));
		},
		
		_onRemoveDeck : function(evt){
			var deck2remove = $(evt.target).attr('data-target');
			this.decks = _.filter(this.decks, function(deck){ return deck !== deck2remove;});
			this.trigger('deck:remove', deck2remove);
		},
		
		_onAddDeck : function(){
//			console.log(this);
			var $editor = this.$('.content .new-deck-editor .editor .new-deck-name');
//			console.log($editor);
			var name = $editor.val();
//			console.log(name);
			if(!name){ //TODO: add disabling button on empty value
				return;
			}
			console.log(this.decks);
			console.log(name);
			var existing = _.find(this.decks, function(deck){ return deck == name;});
			console.log(existing);
			if(existing){
				alert('A deck with name "' + name + '" already exists.');
				return;
			}
			this._onCancelEdit();
			this.trigger('deck:create', name);
		}
	});
	
	return DecksView;
});