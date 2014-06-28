define(['underscore', 'templates'], function(_, templates){
	return {
		template : function(templateName){
			return _.template(templates[templateName]);
		}
	};
});