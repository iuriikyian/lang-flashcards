define(['underscore', 'zepto', 'backbone', 'settings', 'utils/utils', 'zepto.touch'], 
	function(_, $, Backbone, settings, utils){
	
	var CardView = Backbone.View.extend({
		className : 'body',
		template : utils.template('card-view'),
		name : 'card-view',
		
		initialize : function(options){
			this.card = options.card;
		},
		
		_initTouchEvents : function(){
			this.$('.content').on(settings.tapEvent, _.bind(this._onContentClick, this));
			var $header = this.$('.header'); 
			$header.find('.home-button').on(settings.tapEvent, _.bind(this._onHome, this));
			$header.find('.menu-button').on(settings.tapEvent, _.bind(this._onShowMenu, this));			
			this.$('.content .selected').on(settings.tapEvent, _.bind(this._onToggleSelected, this));
			this.$('.content').swipeLeft(_.bind(this._onShowNext, this));
			this.$('.content').swipeRight(_.bind(this._onShowPrev, this));
			this.$('.content').swipeUp(_.bind(this._onFlip, this));
			this.$('.content').swipeDown(_.bind(this._onFlip, this));
		},
		
		willBeClosed : function(){
			this.trigger('save-deck-state', {});
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				card : this.card,
				showBackButton : settings.showBackButton
			}));
			var height = $(window).height();
			var headerHeight = this.$('.header').height();
			var contentHeight = height - headerHeight;
			var $content = this.$('.content'); 
			var $cardSide = this.$('.content .card-side');
			var linesHeight = $cardSide.height();
			$content.height(contentHeight);
			$cardSide.css({
				'padding-top' : ((contentHeight - linesHeight) / 2) + 'px' 
			});
			this._initTouchEvents();
			return this;
		},
		setCard : function(card){
			this.card = card;
		},
		_onHome : function(){
			this.trigger('home', {});
		},
		_onShowMenu : function(){
			this.trigger('show:menu', {});
		},
		_onShowPrev : function(){
			this.trigger('card:show-prev');
		},
		_onShowNext : function(){
			this.trigger('card:show-next');
		},
		_onFlip : function(){
			this.trigger('card:flip');
		},
		_onContentClick : function(evt){
			if($(evt.target).hasClass('selected')){
				return;
			}
			var width = $(window).width();
			var xPos = evt.pageX;
			if(xPos > width * 0.8){
				return this._onShowNext();
			}
			if(xPos < width * 0.2){
				return this._onShowPrev();
			}
			return this._onFlip();
		},
		_onToggleSelected : function(evt){
			evt.preventDefault();
			var $selected = this.$('.content .selected');
			$selected.toggleClass('fa-square-o');
			$selected.toggleClass('fa-check-square-o');
			this.trigger('card:toggle-select', $selected.hasClass('fa-check-square-o'));
		}
	});
	return CardView;
});