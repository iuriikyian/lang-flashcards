define(['underscore', 'zepto', 'backbone', 'underscore.deferred'], 
function(_, $, Backbone){
	
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	LoadingCardsView = Backbone.View.extend({
		template : _.template($('#importFromWebTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		events : {
			'click .header .back-button' : '_onBack'
		},
		
		initialize : function(options){
			this.lang = options.lang;
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				lang : this.lang
			}));
		},
		
		_onBack : function(){
			this.trigger('back', {});
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
			this.$('.languages .langs-list')
				.empty()
				.append(parts.join(''))
				.on('click', function(evt){
					console.log(evt);
					var selectedLang = $(evt.target).attr('data-target');
					me.queryDecks(selectedLang);
				});
			this.$('.languages').removeClass('hidden');
		},
		
		queryDecks : function(lang){
			var querying = this._queryDecks(lang);
			var me = this;
			querying.done(function(decks){
				me._showDecks(lang, decks);
			});
			querying.fail(function(err){
				alert(err);
			});
		},
		
		_showDecks : function(lang, decks){
			var parts = [];
			_.each(decks, function(deck){
				parts.push(this.buttonTemplate({item : deck}));
			}, this);
			this.$('.languages').addClass('hidden');
			var me = this;
			this.$('.decks .decks-list')
				.empty()
				.append(parts.join(''))
				.on('click', function(evt){
					console.log(evt);
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
				me.trigger('cards-loaded', cards);
			});
			loading.fail(function(err){
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
		}
	});
	
	return LoadingCardsView;
});