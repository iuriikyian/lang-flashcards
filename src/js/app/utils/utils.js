define(['underscore', 'templates'], function(_, templates){
	return {
		template : function(templateName){
			console.log('loading template: ' + templateName);
			return _.template(templates[templateName]);
		}
	};
});