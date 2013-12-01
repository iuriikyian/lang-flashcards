define(['underscore', 'zepto', 'backbone', 'underscore.deferred', 'zepto.hammer'], 
function(_, $, Backbone){
	
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	LoadingCards1View = Backbone.View.extend({
		template : _.template($('#importFromWebLangsTemplate').html()),
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
			this.trigger('back', {});
		},
		
/*		queryLanguages : function(){
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
*/		
		showLanguages : function(languages){
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
					me.trigger('load-decks', selectedLang);
					//me.queryDecks(selectedLang);
				});
			this.$('.languages').removeClass('hidden');
		}
	});
	
	return LoadingCards1View;
});