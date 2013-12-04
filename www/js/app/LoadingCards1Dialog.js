define(['underscore', 'zepto', 'BaseDialog'], 
function(_, $, BaseDialog){
	var HIDDEN_CLASS = 'hidden';
	
	var LoadingCards1Dialog = BaseDialog.extend({
		template : _.template($('#importFromWebLangsTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
		},
		
		render : function(){
			this._base_render({
				lang : this.lang
			});
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