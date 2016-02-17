var Menu = require('./views/menu/Menu'),
	DeckInfoDialog = require('./views/deck-info/DeckInfoDialog'),
	SelectItemDialog = require('./views/select-item/SelectItemDialog'),
	CreateItemDialog = require('./views/create-item/CreateItemDialog'),
	CreateBackupDialog = require('./views/create-backup/CreateBackupDialog'),
	RestoreBackupDialog = require('./views/restore-backup/RestoreBackupDialog'),
	ReviewModeDialog = require('./views/review-mode/ReviewModeDialog'),
	LoadingCards1Dialog = require('./views/loading-cards/LoadingCards1Dialog'),
	LoadingCards2Dialog = require('./views/loading-cards/LoadingCards2Dialog'),
	CardView = require('./views/card-view/CardView'),
	DecksView = require('./views/decks-list/DecksView'),
	SelectFileDialog = require('./views/select-file/SelectFileDialog');

module.exports = {
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
	},
	'select-file' : {
		view : SelectFileDialog
	}
};