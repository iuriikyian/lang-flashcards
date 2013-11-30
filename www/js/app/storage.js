define(['underscore'], function(_){
	var storage = localStorage;
	return {
		getKeysCount : function(){
			return storage.length;
		},
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
		removeItem : function(key){
			try{ // to catch exception throw on Android for not existent key
				storage.removeItem(key);
			}catch(err){
				//do nothing
			}
		}
	};
});