define(['underscore', 'zepto', 'BaseDialog'], 
function(_, $, BaseDialog){

	var LoadingCards2Dialog = BaseDialog.extend({
		template : _.template($('#importFromWebDecksTemplate').html()),
		buttonTemplate : _.template($('#buttonTemplate').html()),
		
		initialize : function(options){
			this.lang = options.lang;
			this.decks = options.decks;
		},
		
		_initTouchEvents : function(){
			var me = this;
			this.$('.decks .decks-list .button').hammer().on('click', function(evt){
				console.log(evt);
				$(evt.target).find('.loading').addClass('loading-active');
				var selectedDeck = $(evt.target).attr('data-target');
				me.trigger('load-cards', me.lang, selectedDeck);
			});
		},
		
		render : function(){
			this._base_render({
				lang : this.lang,
				decks : this.decks
			});
			this._initTouchEvents();
		}
	});
	
	return LoadingCards2Dialog;
});