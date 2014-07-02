define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
		function(_, $, BaseDialog, utils){
	var HIDDEN_CLASS = 'hidden';
	
	var SelectItemDialog = BaseDialog.extend({
		template : utils.template('select-item'),
		
		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.title = options.title;
			this.items = options.items;
			this.canCreate = options.canCreate || false;
			this.actionName = options.actionName || 'select';
			this.multipleSelect = options.multipleSelect;
		},
		
		_initTouchEvents : function(){
			this.$('.variant').on(this.tapEvent, _.bind(this._onSelectVariant, this));
			this.$('.commands .select').on(this.tapEvent, _.bind(this._onSelect, this));
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
					this.trigger('selected', items);
					this.close();
				}
			}else{
				var variant = $selected.attr('data-target');
				if(variant){
					this.trigger('selected', variant);
					this.close();
				}else{
					variant = $selected.parent().find('.new-item').val();
					if(!variant){
						return; // nothing entered
					}
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
			return this;
		}
	});
	
	return SelectItemDialog;
});