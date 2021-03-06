define(['underscore', 'ViewsConfig'], function(_, viewsCofig){
	return function(config){
		this.isDevice = config.isDevice;
		this.createView = function(viewName, options){
			var config = viewsCofig[viewName];
			var View = config.view;
			var opts = _.defaults(options, config.options || {});
			opts.tapEvent = this.isDevice ? 'touchstart' : 'click';
			opts.singleTapEvent = this.isDevice ? 'tap' : 'click';
			return new View(opts);
		};

		this.destroyView = function(view){
			//view.close();
			view.off();
			view.$el.empty();
		};
	};
});