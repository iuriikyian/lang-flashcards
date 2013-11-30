define(['underscore', 'zepto', 'backbone', 'underscore.deferred', 'zepto.hammer'], 
function(_, $, Backbone){
	
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	LoadingCardsView = Backbone.View.extend({
		template : _.template($('#importFromWebTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
		},
		
		_initTouchEvents : function(){
			this.$('.header .back-button').hammer().on('tap', _.bind(this._onBack, this));
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				lang : this.lang
			}));
			this._initTouchEvents();
		},
		
		_onBack : function(){
			if( this.$('.decks').hasClass('hidden')){
				this.trigger('back', {});
			}else{
				this.$('.decks').addClass('hidden');
				this.$('.languages').removeClass('hidden');
			}
			
		},
		
		queryLanguages : function(){
			var querying = this._queryLanguages();
			var me = this;
			querying.done(function(data){
				me._showLanguages(data);
			});
			querying.fail(function(err){
				alert(err);
			});
		},
		
		_queryLanguages : function(){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		},
		_showLanguages : function(languages){
			var parts = [];
			_.each(languages, function(lang){
				parts.push(this.buttonTemplate({item : lang}));
			}, this);
			this.$('.loading').addClass('hidden');
			var me = this;
			this.$('.languages .langs-list').empty().append(parts.join(''));
			this.$('.languages .langs-list .button').hammer().on('tap', function(evt){
					console.log(evt);
					$(evt.target).find('.loading').addClass('loading-active');
					var selectedLang = $(evt.target).attr('data-target');
					me.queryDecks(selectedLang);
				});
			this.$('.languages').removeClass('hidden');
		},
		
		queryDecks : function(lang){
			var querying = this._queryDecks(lang);
			var me = this;
			querying.done(function(decks){
				me._removeLoadingIndicator();
				me._showDecks(lang, decks);
			});
			querying.fail(function(err){
				me._removeLoadingIndicator();
				alert(err);
			});
		},
		
		_showDecks : function(lang, decks){
			this.$('.header .title .step').text('2/2');
			this.$('.decks .message .sourceLang').text(lang);
			var parts = [];
			_.each(decks, function(deck){
				parts.push(this.buttonTemplate({item : deck}));
			}, this);
			this.$('.languages').addClass('hidden');
			var me = this;
			this.$('.decks .decks-list').empty().append(parts.join(''));
			this.$('.decks .decks-list .button').hammer().on('click', function(evt){
					console.log(evt);
					$(evt.target).find('.loading').addClass('loading-active');
					var selectedDeck = $(evt.target).attr('data-target');
					me.loadDeck(lang, selectedDeck);
				});
			this.$('.decks').removeClass('hidden');
		},
		
		_queryDecks : function(lang){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL + lang,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		},
		
		loadDeck : function(lang, deckName){
			var loading = this._loadDeck(lang, deckName);
			var me = this;
			loading.done(function(cards){
				me._removeLoadingIndicator();
				me.trigger('cards-loaded', cards);
			});
			loading.fail(function(err){
				me._removeLoadingIndicator();
				alert(err);
			});
		},
		
		_loadDeck : function(lang, deckName){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL + lang + '/' + deckName,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		},
		
		_removeLoadingIndicator : function(){
			this.$('.loading-active').removeClass('loading-active');
		}
	});
	
	return LoadingCardsView;
});