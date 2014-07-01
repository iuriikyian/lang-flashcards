define(['views/menu/Menu', 'views/deck-info/DeckInfoDialog', 
	'views/select-item/SelectItemDialog', 'views/create-item/CreateItemDialog',
	'views/create-backup/CreateBackupDialog', 'views/restore-backup/RestoreBackupDialog', 
	'views/review-mode/ReviewModeDialog',
	'views/loading-cards/LoadingCards1Dialog', 'views/loading-cards/LoadingCards2Dialog',
	'views/card-view/CardView', 'views/decks-list/DecksView'],
	function(Menu, DeckInfoDialog, SelectItemDialog, CreateItemDialog,
		CreateBackupDialog, RestoreBackupDialog, ReviewModeDialog,
		LoadingCards1Dialog, LoadingCards2Dialog,
		CardView, DecksView){

	return {
		menu : {
			view : Menu
		},
		'deck-info' : {
			view : DeckInfoDialog
		},
		'select-lang' : {
			view : SelectItemDialog,
			options : {
				title : 'Select lang'
    		}
		},
		'create-deck' : {
			view : CreateItemDialog,
			options : {
				title : 'Create Deck'
			}
		},
		'select-decks' : {
			view : SelectItemDialog,
			options : {
				title : 'Select Decks'
			}
		},
		'create-backup' : {
			view : CreateBackupDialog
		},
		'restore-backup' : {
			view : RestoreBackupDialog
		},
		'review-mode' : {
			view : ReviewModeDialog
		},
		'select-target-deck' : {
			view : SelectItemDialog,
			options : {
				title : 'Select target Deck for cards'
			}
		},
		'load-cards-1' : {
			view : LoadingCards1Dialog
		},
		'load-cards-2' : {
			view : LoadingCards2Dialog
		},
		'decks-list' : {
			view : DecksView
		},
		'card-view' : {
			view : CardView
		}
	};
});