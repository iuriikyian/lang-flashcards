define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
function(_, $, BaseDialog, utils, settings){
	var HIDDEN_CLASS = 'hidden';
	
	var LoadingCards1Dialog = BaseDialog.extend({
		template : utils.template('import-from-web-langs'),
		buttonTemplate : utils.template('button'),
		
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
			this.$('.languages .langs-list').empty().append(parts.join(''));
			this.$('.languages .langs-list .button').on(settings.tapEvent, _.bind(function(evt){
				console.log(evt);
				$(evt.target).find('.loading').addClass('loading-active');
				var selectedLang = $(evt.target).attr('data-target');
				this.trigger('load-decks', selectedLang);
			}, this));
			this.$('.languages').removeClass(HIDDEN_CLASS);
		}
	});
	
	return LoadingCards1Dialog;
});