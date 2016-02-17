var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	utils = require('../../utils/utils');

var SRV_URL = 'https://script.google.com/macros/s/AKfycbxeEg8kcHw0tJ1qC8HE5Y47QOao05DV1H7NxGOjxX26hdPVezw/exec';
var SERVER_URL =  SRV_URL + '?path=';
var BACKUP_URL = SRV_URL + '?backup=';

module.exports = function(options){

	_.extend(this, Backbone.Events);

	this.fetchLanguages = function(){
		var dfd = $.Deferred();
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
		var dfd = $.Deferred();
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
		var dfd = $.Deferred();
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
		var dfd = $.Deferred();
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
		var dfd = $.Deferred();
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
		var dfd = $.Deferred();
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
