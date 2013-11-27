define(['underscore', 'zepto', 'backbone'], function(_, $, Backbone){
	
	var CardView = Backbone.View.extend({
		template : _.template($('#cardView').html()),
		
		events : {
			'click .content' : '_onContentClick',
			'click .header .back-button' : '_onBack',
			'click .header .menu-button' : '_onShowMenu',			
			'click .header .title .selected' : '_onToggleSelected'
		},
		initialize : function(options){
			this.card = options.card;
		},
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				card : this.card,
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
			
		},
		setCard : function(card){
			this.card = card;
		},
		_onBack : function(){
			this.trigger('back', {});
		},
		_onShowMenu : function(){
			this.trigger('show:menu', {});
		},
		
		_onContentClick : function(evt){
			var width = $(window).width();
			if(evt.clientX > width * 0.9){
				return this.trigger('card:show-next');
			}
			if(evt.clientX < width * 0.1){
				return this.trigger('card:show-prev');
			}
			return this.trigger('card:flip');
		},
		_onToggleSelected : function(){
			var $selected = this.$('.header .title .selected');
			$selected.toggleClass('fa-square-o');
			$selected.toggleClass('fa-check-square-o');
			this.trigger('card:toggle-select', $selected.hasClass('fa-check-square-o'));
		}
	});
	return CardView;
});