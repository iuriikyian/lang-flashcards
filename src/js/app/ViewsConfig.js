define(['views/menu/Menu', 'DeckInfoDialog', 'SelectItemDialog', 'CreateItemDialog',
	'CreateBackupDialog', 'RestoreBackupDialog', 'ReviewModeDialog',
	'LoadingCards1Dialog', 'LoadingCards2Dialog'],
	function(Menu, DeckInfoDialog, SelectItemDialog, CreateItemDialog,
		CreateBackupDialog, RestoreBackupDialog, ReviewModeDialog,
		LoadingCards1Dialog, LoadingCards2Dialog){

	var OVERLAY_SELECTOR = '#overlay',
		DIALOG_SELECTOR = '#dialog',
		TAP_EVENT = 'click',
		DEFAULT_DIALOG_OPTIONS = {
			el : DIALOG_SELECTOR,
			overlay : OVERLAY_SELECTOR,
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
				el : DIALOG_SELECTOR,
				title : 'Select lang',
	            overlay : OVERLAY_SELECTOR,
	            tapEvent : TAP_EVENT
    		}
		},
		'create-deck' : {
			view : CreateItemDialog,
			options : {
				el : DIALOG_SELECTOR,
				title : 'Create Deck',
				tapEvent : TAP_EVENT,
				overlay : OVERLAY_SELECTOR
			}
		},
		'select-decks' : {
			view : SelectItemDialog,
			options : {
				el : DIALOG_SELECTOR,
				title : 'Select Decks',
				tapEvent : TAP_EVENT,
				overlay : OVERLAY_SELECTOR				
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
				el : DIALOG_SELECTOR,
				title : 'Select target Deck for cards',
				overlay : OVERLAY_SELECTOR,
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