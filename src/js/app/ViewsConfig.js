define(['views/menu/Menu', 'views/deck-info/DeckInfoDialog', 
	'views/select-item/SelectItemDialog', 'views/create-item/CreateItemDialog',
	'views/create-backup/CreateBackupDialog', 'views/restore-backup/RestoreBackupDialog', 
	'views/review-mode/ReviewModeDialog',
	'views/loading-cards/LoadingCards1Dialog', 'views/loading-cards/LoadingCards2Dialog'],
	function(Menu, DeckInfoDialog, SelectItemDialog, CreateItemDialog,
		CreateBackupDialog, RestoreBackupDialog, ReviewModeDialog,
		LoadingCards1Dialog, LoadingCards2Dialog){

	var TAP_EVENT = 'click',
		DEFAULT_DIALOG_OPTIONS = {
			tapEvent : TAP_EVENT
		};

	return {
		menu : {
			view : Menu,
			options : {
				tapEvent : TAP_EVENT
			}
		},
		'deck-info' : {
			view : DeckInfoDialog,
			options : DEFAULT_DIALOG_OPTIONS
		},
		'select-lang' : {
			view : SelectItemDialog,
			options : {
				title : 'Select lang',
	            tapEvent : TAP_EVENT
    		}
		},
		'create-deck' : {
			view : CreateItemDialog,
			options : {
				title : 'Create Deck',
				tapEvent : TAP_EVENT
			}
		},
		'select-decks' : {
			view : SelectItemDialog,
			options : {
				title : 'Select Decks',
				tapEvent : TAP_EVENT//,
			}
		},
		'create-backup' : {
			view : CreateBackupDialog,
			options : DEFAULT_DIALOG_OPTIONS
		},
		'restore-backup' : {
			view : RestoreBackupDialog,
			options : DEFAULT_DIALOG_OPTIONS
		},
		'review-mode' : {
			view : ReviewModeDialog,
			options : DEFAULT_DIALOG_OPTIONS
		},
		'select-target-deck' : {
			view : SelectItemDialog,
			options : {
				title : 'Select target Deck for cards',
				tapEvent : TAP_EVENT
			}
		},
		'load-cards-1' : {
			view : LoadingCards1Dialog,
			options : DEFAULT_DIALOG_OPTIONS
		},
		'load-cards-2' : {
			view : LoadingCards2Dialog,
			options : DEFAULT_DIALOG_OPTIONS
		}
	};
});