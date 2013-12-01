define(['underscore', 'zepto', 'backbone', 'underscore.deferred', 'zepto.hammer'], 
function(_, $, Backbone){
	
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	LoadingCards2View = Backbone.View.extend({
		template : _.template($('#importFromWebDecksTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
			this.decks = options.decks;
		},
		
		_initTouchEvents : function(){
			var me = this;
			this.$('.header .back-button').hammer().on('tap', _.bind(this._onBack, this));
			this.$('.decks .decks-list .button').hammer().on('click', function(evt){
				console.log(evt);
				$(evt.target).find('.loading').addClass('loading-active');
				var selectedDeck = $(evt.target).attr('data-target');
				me.trigger('load-cards', me.lang, selectedDeck);
			});
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				lang : this.lang,
				decks : this.decks
			}));
			this._initTouchEvents();
		},
		
		_onBack : function(){
			this.trigger('back', {});
		}
});
	
	return LoadingCards2View;
});