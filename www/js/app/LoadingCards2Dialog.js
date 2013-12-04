define(['underscore', 'zepto', 'backbone', 'underscore.deferred', 'zepto.hammer'], 
function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden'; 
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	var LoadingCards2Dialog = Backbone.View.extend({
		template : _.template($('#importFromWebDecksTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
			this.decks = options.decks;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			var me = this;
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
			this.$('.decks .decks-list .button').hammer().on('click', function(evt){
				console.log(evt);
				$(evt.target).find('.loading').addClass('loading-active');
				var selectedDeck = $(evt.target).attr('data-target');
				me.trigger('load-cards', me.lang, selectedDeck);
			});
		},
		
		close : function(){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				lang : this.lang,
				decks : this.decks
			}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		},
		
		_onClose : function(){
			this.close();
			this.trigger('close', {});
		}
	});
	
	return LoadingCards2Dialog;
});