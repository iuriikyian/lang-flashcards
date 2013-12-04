define(['underscore', 'zepto', 'backbone', 'settings', 'zepto.hammer'], function(_, $, Backbone, settings){
	
	var CardView = Backbone.View.extend({
		template : _.template($('#cardView').html()),
		name : 'card-view',
		
		initialize : function(options){
			this.card = options.card;
		},
		
		_initTouchEvents : function(){
			this.$('.content').hammer().on('tap', _.bind(this._onContentClick, this));
			var $header = this.$('.header'); 
			$header.find('.home-button').hammer().on('tap', _.bind(this._onHome, this));
			$header.find('.menu-button').hammer().on('tap', _.bind(this._onShowMenu, this));			
			this.$('.content .selected').hammer().on('tap', _.bind(this._onToggleSelected, this));
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
		
		_onContentClick : function(evt){
			if($(evt.target).hasClass('selected')){
				return;
			}
			var width = $(window).width();
			var xPos = evt.gesture.center.pageX;
			if(xPos > width * 0.8){
				return this.trigger('card:show-next');
			}
			if(xPos < width * 0.2){
				return this.trigger('card:show-prev');
			}
			return this.trigger('card:flip');
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