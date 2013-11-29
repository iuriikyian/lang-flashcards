define(['underscore'], function(_){
	var storage = localStorage;
	return {
		length : storage.length,
		key : function(idx){
			return storage.key(idx);
		},
		getItem : function(key){
			var res = storage.getItem(key);
			if(res){
				return JSON.parse(res);
			}
			return null;
		},
		setItem : function(key, value){
			storage.setItem(key, JSON.stringify(value));
		},
		removeItem : storage.removeItem
	};
});