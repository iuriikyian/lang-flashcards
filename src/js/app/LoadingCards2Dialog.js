define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
function(_, $, BaseDialog, utils){

	var LoadingCards2Dialog = BaseDialog.extend({
		template : utils.template('import-from-web-decks'),
		buttonTemplate : utils.template('button'),
		
		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.lang = options.lang;
			this.decks = options.decks;
		},
		
		_initTouchEvents : function(){
			this.$('.decks .decks-list .button').on(this.tapEvent, _.bind(function(evt){
				console.log(evt);
				$(evt.target).find('.loading').addClass('loading-active');
				var selectedDeck = $(evt.target).attr('data-target');
				this.trigger('load-cards', this.lang, selectedDeck);
			},this));
		},
		
		render : function(){
			this._base_render({
				lang : this.lang,
				decks : this.decks
			});
			this._initTouchEvents();
			return this;
		}
	});
	
	return LoadingCards2Dialog;
});