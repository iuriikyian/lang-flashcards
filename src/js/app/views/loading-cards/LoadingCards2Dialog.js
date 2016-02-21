var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

module.exports = BaseDialog.extend({
	template : utils.template('import-from-web-decks'),
	buttonTemplate : utils.template('button'),

	initialize : function(options){
		BaseDialog.prototype.initialize.call(this, options);
		this.lang = options.lang;
		this.decks = options.decks;
	},

	_initTouchEvents : function(){
		utils.hammerOn(this.$('.decks .decks-list .button'), 'tap', _.bind(function(evt){
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
