define(['underscore', 'zepto', 'backbone', 'underscore.deferred'], function(_, $, Backbone){
	
	var SRV_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec';
	var SERVER_URL =  SRV_URL + '?path=';
	var BACKUP_URL = SRV_URL + '?backup=';
	
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
		
		this.fetchAvailableBackups = function(deviceId){
			var dfd = new _.Deferred();
			$.ajax({
				url : BACKUP_URL + deviceId,
				dataType : 'json',
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
		
		this.fetchBackup = function(deviceId, backupName){
			var dfd = new _.Deferred();
			$.ajax({
				url : BACKUP_URL + deviceId + '/' + backupName,
				dataType : 'json',
				success : function(data, status){
					console.log(data);
					dfd.resolve(data.data);
				},
				error : function(xhr, errType, error){
					dfd.reject(error);
				}
			});
			return dfd.promise();
		};
		
		this.saveBackup = function(deviceId, backupName, backupData){
			//TODO: does it work on the device?
			var dfd = new _.Deferred();
			$.ajax({
				type : 'POST',
				contentType : 'application/json',
				url : BACKUP_URL + deviceId + '/' + backupName,
				dataType : 'json',
				data : backupData,
				success : function(data, status){
					console.log(data);
					dfd.resolve(data.success);
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