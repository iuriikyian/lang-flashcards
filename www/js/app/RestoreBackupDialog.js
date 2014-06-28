define(['underscore', 'zepto', 'utils/utils', 'BaseDialog', 'settings', 'zepto.touch'], 
function(_, $, utils, BaseDialog, settings){
	var HIDDEN_CLASS = 'hidden';
	
	var RestoreBackupDialog = BaseDialog.extend({
		template : utils.template('restore-backup'),
		buttonTemplate : utils.template('backup-button'),
		
		initialize : function(options){
//			this.lang = options.lang;
		},
		
		render : function(){
			this._base_render({
				lang : this.lang
			});
			this.$('.commands .restore').on(settings.tapEvent, _.bind(function(evt){
				var $selected = this.$('.backups .backups-list .button .fa-check-square-o');
				if($selected.length === 0){
					return; // nothing selected
				}
				var selectedBackup = $selected.attr('data-target');
				if(selectedBackup){
					this.$('.commands .restore .loading').addClass('loading-active');
					this.trigger('restore', selectedBackup);
				}
			}, this));
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
			this.$('.backups .backups-list').empty().append(parts.join(''));
			this.$('.backups .backups-list .button').on(settings.tapEvent, _.bind(function(evt){
				console.log(evt);
				this.$('.backups .backups-list .button .checkbox').removeClass('fa-check-square-o').addClass('fa-square-o');
				$(evt.currentTarget).find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
					
//				var $buttons = this.$('.backups .backups-list .button');
//				$(evt.target).find('.loading').addClass('loading-active');
				var selected = $(evt.target).attr('data-target');
			}, this));
			this.$('.backups').removeClass(HIDDEN_CLASS);
		}
	});
	
	return RestoreBackupDialog;
});