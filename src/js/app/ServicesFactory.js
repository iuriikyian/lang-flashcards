define(['services/FileSystem', 'services/FileParser'], function(FileSystemService, CardDataParser){
	return function(options){
		this.services = {};
		this.set = function(serviceName, service){
			this.services[serviceName] = service;
		};
		this.get = function(serviceName){
			var service;
			switch(serviceName){
				case 'file-system':
					service = new FileSystemService({});
					break;
				case 'cards-text-parser':
					service = CardDataParser;
					break;
			}
			return service;
		};
	};
});