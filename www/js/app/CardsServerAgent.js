define(['underscore', 'zepto', 'backbone', 'underscore.deferred'], function(_, $, Backbone){
	
	var SERVER_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec?path=';
	
	var Agent = function(options){
		
		_.extend(this, Backbone.Events);
		
		this.fetchLanguages = function(){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		};
		
		this.fetchDecks = function(lang){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL + lang,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		};
		
		this.fetchCards = function(lang, deck){
			var dfd = new _.Deferred();
			$.ajax({
				url : SERVER_URL + lang + '/' + deck,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		};
	};
	return Agent;
});