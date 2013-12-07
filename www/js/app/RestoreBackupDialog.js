define(['underscore', 'zepto', 'BaseDialog'], 
function(_, $, BaseDialog){
	var HIDDEN_CLASS = 'hidden';
	
	var RestoreBackupDialog = BaseDialog.extend({
		template : _.template($('#restoreBackupTemplate').html()),
		buttonTemplate : _.template($('#backupButtonTemplate').html()),
		
		initialize : function(options){
//			this.lang = options.lang;
		},
		
		render : function(){
			this._base_render({
				lang : this.lang
			});
			var me = this;
			this.$('.commands .restore').hammer().on('tap', function(evt){
				var $selected = me.$('.backups .backups-list .button .fa-check-square-o');
				if($selected.length == 0){
					return; // nothing selected
				}
				var selectedBackup = $selected.attr('data-target');
				if(selectedBackup){
					me.$('.commands .restore .loading').addClass('loading-active');
					me.trigger('restore', selectedBackup);
				}
			});
		},
		
		showError : function(message){
			this.$('.errors').append(message);
			this.$('.errors').removeClass(HIDDEN_CLASS);
		},
		
		showBackups : function(backups){
			var parts = [];
			_.each(backups, function(backup){
				parts.push(this.buttonTemplate({item : backup}));
			}, this);
			this.$('.loading-info').addClass(HIDDEN_CLASS);
			var me = this;
			this.$('.backups .backups-list').empty().append(parts.join(''));
			this.$('.backups .backups-list .button').hammer().on('tap', function(evt){
					console.log(evt);
					me.$('.backups .backups-list .button .checkbox').removeClass('fa-check-square-o').addClass('fa-square-o');
					$(evt.currentTarget).find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
					
//					var $buttons = me.$('.backups .backups-list .button');
//					$(evt.target).find('.loading').addClass('loading-active');
					var selected = $(evt.target).attr('data-target');
				});
			this.$('.backups').removeClass(HIDDEN_CLASS);
		}
	});
	
	return RestoreBackupDialog;
});