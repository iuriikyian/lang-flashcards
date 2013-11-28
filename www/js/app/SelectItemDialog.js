define(['underscore', 'zepto', 'backbone'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var SelectItemDialog = Backbone.View.extend({
		template : _.template($('#selectItemTemplate').html()),
		events : {
			'click .title .close' : '_onClose',
			'click .variant' : '_onSelectVariant',
			'click .commands .select' : '_onSelect',
		},
		
		initialize : function(options){
			this.title = options.title;
			this.items = options.items;
			this.overlay = options.overlay;
		},
		
		_onSelectVariant : function(evt){
			this.$('.variant .checkbox').removeClass('fa-check-square-o').addClass('fa-square-o');
			var mode = $(evt.currentTarget).find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
		},
		
		_onClose : function(evt){
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
		},
		
		_onSelect : function(evt){
			var $selected = this.$('.variant .fa-check-square-o');
			if($selected.length == 0){
				return; // nothing selected
			}
			var variant = $selected.attr('data-target');
			this.$el.addClass(HIDDEN_CLASS);
			$(this.overlay).addClass(HIDDEN_CLASS);
			this.trigger('selected', variant);
		},
		
		render : function(){
			//$(this.el).off();
			$(this.el).empty();
			$(this.el).append(this.template({
				title : this.title,
				items : this.items
			}));
			var me = this;
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.on('click', function(){
					me._onClose();
				});
			this.$el.removeClass(HIDDEN_CLASS);
		}
	});
	
	return SelectItemDialog;
});