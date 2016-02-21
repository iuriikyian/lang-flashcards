var _ = require('underscore'),
	Hammer = require('hammerjs'),
    templates = require('../templates');

module.exports = {
	template : function(templateName){
		console.log('loading template: ' + templateName);
		return _.template(templates[templateName]);
	},
	hammerOn : function($nodes, eventName, handler){
		$nodes.each(function(){
			var h = new Hammer(this, {});
			h.on(eventName, handler);
		});
	}
};