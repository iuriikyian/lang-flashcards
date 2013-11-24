define(['underscore', 'zepto', 'backbone'], function(_, $, Backbone){
	var TEMPLATE_ID = 'decksList';
	var EDIT_MODE_CLASS = 'edit-mode';
	
	var DecksView = Backbone.View.extend({
		template : _.template($('#decksList').html()),
		deckItemTemplate : _.template($('#deckItem').html()),
		events : {
			'click .header .menu-button' : '_onShowMenu',
			'click .content .today-button' : '_onShowTodayDeck',
			'click .content .edit' : '_onEdit',
			'click .content .cancel-edit' : '_onCancelEdit',
			'click .content .deck-button' : '_onShowDeck',
			'click .content .add-deck' : '_onAddDeck',
			'click .content .remove-deck' : '_onRemoveDeck'
		},
		
		initialize : function(options){
			this.decks = options.decks;
		},
		
		render : function(){
			$(this.el).append(this.template({
				title: 'flashcards',
				decks : this.decks,
			}));
		},
		
		_onShowMenu : function(){
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
		},
		
		_onCancelEdit : function(){
			this.$('.content').removeClass(EDIT_MODE_CLASS);
			this.$('.content .today-button').removeClass('disabled');
			this.$('.content .deck-button').removeClass('disabled');
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
			this.$('.deck[data-target="' + deck2remove + '"]').remove();
			this.trigger('deck:removed', deck2remove);
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
			this.decks.push(name);
			this.$('.decks-list').append(this.deckItemTemplate({
				deck: name
			}));
			this.trigger('deck:created', name);
		}
	});
	
	return DecksView;
});