var _ = require('underscore');

module.exports = function(data){
	this.getKeysCount = function(){
		return _.keys(data).length;
	};
	this.key = function(idx){
		return _.keys(data)[idx];
	};
	this.getItem = function(key){
		return data[key];
	};
	this.setItem = function(key, value){
		data[key] = value;
	};
	this.removeItem = function(key){
		delete data[key];
	};
};