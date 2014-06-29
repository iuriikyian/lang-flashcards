define(['underscore', 'ViewsConfig'], function(_, viewsCofig){
	return function(config){
		this.createView = function(viewName, options){
			var config = viewsCofig[viewName];
			var View = config.view;
			var opts = _.defaults(options, config.options);
			return new View(opts);
		};

		this.destroyView = function(view){
			//view.close();
			view.off();
			view.$el.empty();
		};
	};
});