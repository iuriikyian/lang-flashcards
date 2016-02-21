var _ = require('underscore'),
	$ = require('jquery'),
	BaseDialog = require('../base-dialog/BaseDialog'),
	utils = require('../../utils/utils');

var HIDDEN_CLASS = 'hidden';

module.exports = BaseDialog.extend({
	template : utils.template('import-from-web-langs'),
	buttonTemplate : utils.template('button'),

	initialize : function(options){
		BaseDialog.prototype.initialize.call(this, options);
		this.lang = options.lang;
	},

	render : function(){
		this._base_render({
			lang : this.lang
		});
		return this;
	},

	showLanguages : function(languages){
		var parts = [];
		_.each(languages, function(lang){
			parts.push(this.buttonTemplate({item : lang}));
		}, this);
		this.$('.loading').addClass(HIDDEN_CLASS);
		this.$('.languages .langs-list').empty().append(parts.join(''));
		utils.hammerOn(this.$('.languages .langs-list .button'), 'tap', _.bind(function(evt){
			console.log(evt);
			$(evt.target).find('.loading').addClass('loading-active');
			var selectedLang = $(evt.target).attr('data-target');
			this.trigger('load-decks', selectedLang);
		}, this));
		this.$('.languages').removeClass(HIDDEN_CLASS);
	}
});