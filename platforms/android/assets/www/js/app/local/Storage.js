define(['underscore'], function(_){
	var storage = localStorage;
	return function(){
		this.getKeysCount = function(){
			return storage.length;
		};
		this.key = function(idx){
			return storage.key(idx);
		};
		this.getItem = function(key){
			var res = storage.getItem(key);
			if(res){
				return JSON.parse(res);
			}
			return null;
		};
		this.setItem = function(key, value){
			storage.setItem(key, JSON.stringify(value));
		};
		this.removeItem = function(key){
			try{ // to catch exception throw on Android for not existent key
				storage.removeItem(key);
			}catch(err){
				//do nothing
			}
		};
	};
});