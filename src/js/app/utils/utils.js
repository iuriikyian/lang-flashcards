var _ = require('underscore'),
    templates = require('../templates');

module.exports = {
	template : function(templateName){
		console.log('loading template: ' + templateName);
		return _.template(templates[templateName]);
	}
};