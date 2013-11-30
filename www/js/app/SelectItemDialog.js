define(['underscore', 'zepto', 'backbone', 'zepto.hammer'], 
		function(_, $, Backbone){
	var HIDDEN_CLASS = 'hidden';
	
	var SelectItemDialog = Backbone.View.extend({
		template : _.template($('#selectItemTemplate').html()),
		
		initialize : function(options){
			this.title = options.title;
			this.items = options.items;
			this.canCreate = options.canCreate || false;
			this.actionName = options.actionName || 'select';
			this.overlay = options.overlay;
		},
		
		_initTouchEvents : function(){
			this.$('.title .close').hammer().on('tap', _.bind(this._onClose, this));
			this.$('.variant').hammer().on('tap', _.bind(this._onSelectVariant, this));
			this.$('.commands .select').hammer().on('tap', _.bind(this._onSelect, this));
		},		
		
		_onSelectVariant : function(evt){
			this.$('.variant .checkbox').removeClass('fa-check-square-o').addClass('fa-square-o');
			$(evt.currentTarget).find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
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
			if(variant){
				this._onClose();
				this.trigger('selected', variant);
			}else{
				variant = $selected.parent().find('.new-item').val();
				if(!variant){
					return; // nothing entered
				}
				this._onClose();
				this.trigger('create', variant);
			}
		},
		
		render : function(){
			$(this.el).empty();
			$(this.el).append(this.template({
				title : this.title,
				items : this.items,
				actionName : this.actionName,
				canCreate : this.canCreate
			}));
			$(this.overlay)
				.removeClass(HIDDEN_CLASS)
				.hammer().on('tap', _.bind(this._onClose, this));
			this.$el.removeClass(HIDDEN_CLASS);
			this._initTouchEvents();
		}
	});
	
	return SelectItemDialog;
});