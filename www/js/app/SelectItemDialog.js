define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'settings', 'zepto.touch'], 
		function(_, $, BaseDialog, utils, settings){
	var HIDDEN_CLASS = 'hidden';
	
	var SelectItemDialog = BaseDialog.extend({
		template : utils.template('select-item'),
		
		initialize : function(options){
			this.title = options.title;
			this.items = options.items;
			this.canCreate = options.canCreate || false;
			this.actionName = options.actionName || 'select';
			this.multipleSelect = options.multipleSelect;
		},
		
		_initTouchEvents : function(){
			this.$('.variant').on(settings.tapEvent, _.bind(this._onSelectVariant, this));
			this.$('.commands .select').on(settings.tapEvent, _.bind(this._onSelect, this));
		},		
		
		_onSelectVariant : function(evt){
			if(this.multipleSelect){
				$(evt.currentTarget).find('.checkbox').toggleClass('fa-square-o').toggleClass('fa-check-square-o');
			}else{
				this.$('.variant .checkbox').removeClass('fa-check-square-o').addClass('fa-square-o');
				$(evt.currentTarget).find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
			}
		},
		
		_onSelect : function(evt){
			var $selected = this.$('.variant .fa-check-square-o');
			if($selected.length === 0){
				return; // nothing selected
			}
			if(this.multipleSelect){
				var items = [];
				$selected.each(function(idx, item){
					items.push($(item).attr('data-target'));
				});
				if(items.length){
					this.close();
					this.trigger('selected', items);
				}
			}else{
				var variant = $selected.attr('data-target');
				if(variant){
					this.close();
					this.trigger('selected', variant);
				}else{
					variant = $selected.parent().find('.new-item').val();
					if(!variant){
						return; // nothing entered
					}
					this.close();
					this.trigger('create', variant);
				}
			}
		},
		
		render : function(){
			this._base_render({
				title : this.title,
				items : this.items,
				actionName : this.actionName,
				canCreate : this.canCreate
			});
			this._initTouchEvents();
		}
	});
	
	return SelectItemDialog;
});