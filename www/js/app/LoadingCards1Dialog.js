define(['underscore', 'zepto', 'backbone', 'underscore.deferred', 'zepto.hammer'], 
function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden'; 
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	var LoadingCards1Dialog = Backbone.View.extend({
		template : _.template($('#importFromWebLangsTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				lang : this.lang
			}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		},
		
		_onClose : function(){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
			this.trigger('close', {});
		},
		
		showLanguages : function(languages){
			var parts = [];
			_.each(languages, function(lang){
				parts.push(this.buttonTemplate({item : lang}));
			}, this);
			this.$('.loading').addClass(HIDDEN_CLASS);
			var me = this;
			this.$('.languages .langs-list').empty().append(parts.join(''));
			this.$('.languages .langs-list .button').hammer().on('tap', function(evt){
					console.log(evt);
					$(evt.target).find('.loading').addClass('loading-active');
					var selectedLang = $(evt.target).attr('data-target');
					me.trigger('load-decks', selectedLang);
				});
			this.$('.languages').removeClass(HIDDEN_CLASS);
		}
	});
	
	return LoadingCards1Dialog;
});