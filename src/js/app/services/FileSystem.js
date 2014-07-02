define(['underscore'], function(_){

	var SEPARATOR = '/';

	var FileSystemService = function(){

		this.list = function(dirPath){
			var dfd = new _.Deferred();
			var gettingFS = this._getFileSystem();
			gettingFS.done(_.bind(function(fileSystem){
				console.log('fs root url: ' + fileSystem.root.toURL());
				var gettingDir = this._getDir(dirPath, fileSystem);
				gettingDir.done(_.bind(function(dirEntry){
					var listCreation = this._createDirList(dirPath, dirEntry);
					listCreation.done(function(data){
						dfd.resolve(data);	
					});
					listCreation.fail(function(err){
						dfd.reject(err);
					});
				}, this));
				gettingDir.fail(function(err){
					dfd.reject(err);
				});
			}, this));
			gettingFS.fail(function(err){
				dfd.reject(err);
			});
			return dfd.promise();
		};

		this.load = function(filePath){
			var dfd = new _.Deferred();
			var gettingFS = this._getFileSystem();
			gettingFS.done(_.bind(function(fileSystem){
				var gettingFile = this._getFile(filePath, fileSystem);
				gettingFile.done(function(fileEntry){
					fileEntry.file(function(file){
						var reader = new window.FileReader();
						reader.onloadend = function(e) {
							console.log(JSON.stringify(e));
							console.log(JSON.stringify(this.result));
							dfd.resolve(this.result);
						};
						reader.readAsText(file);
					});
				});
				gettingFile.fail(function(err){
					dfd.reject(err);
				});
			}, this));
			gettingFS.fail(function(err){
				dfd.reject(err);
			});
			return dfd.promise();
		};

		this._createDirList = function(dirPath, dirEntry){
			console.log('dir entry full path: ' + dirEntry.fullPath);
			var dfd = new _.Deferred();

			var entries = [];
			var dirReader = dirEntry.createReader();

			var readEntries = function(){
				dirReader.readEntries(function(results){
					if(!results.length){
						var parentDir = null;
						if(dirPath !== SEPARATOR){ // not root
	                        var parts = dirPath.split(SEPARATOR);
	                        console.log(parts);
	                        parts.shift(); // remove leading slash
	                        parts.pop(); // remove last dir
                        	parentDir = SEPARATOR + parts.join(SEPARATOR);
	                    }
						return dfd.resolve({
							parentDir : parentDir,
							dir : dirPath,
							list : entries
						});
					}
					_.each(results, function(entry){
						entries.push({
							isDir : entry.isDirectory,
							name : entry.name
						});
					});
					readEntries();
				}, function(err){
					dfd.reject(err);
				});
			};

			readEntries();

			return dfd.promise();
		};

		this._getDir = function(dirPath, fileSystem){
			var dfd = new _.Deferred();
			console.log('dirPath: ' + dirPath);
			if(dirPath === SEPARATOR){
				dfd.resolve(fileSystem.root);
			}else{
				dirPath = dirPath.substr(1); // skip leading slash
				fileSystem.root.getDirectory(dirPath, {},
					function(dirEntry){
						dfd.resolve(dirEntry);
					},
					function(err){
						console.log('fail get dir: ' + dirPath);
						dfd.reject(err);
					});
			}
			return dfd.promise();
		};

		this._getFile = function(filePath, fileSystem){
			var dfd = new _.Deferred();
			console.log('filePath: ' + filePath);
			filePath = filePath.substr(1); // skip leading slash
			fileSystem.root.getFile(filePath, {},
				function(fileEntry){
					dfd.resolve(fileEntry);
				},
				function(err){
					console.log('fail get file: ' + filePath);
					dfd.reject(err);
				}
			);
			return dfd.promise();
		};

		/*this._getDir = function(dirPath, fileSystem){
			var dfd = new _.Deferred();
			var dirPathParts = dirPath.split(SEPARATOR);
			dirPathParts.shift(); // strip root dir
			var level = 0;

			var _getChildDir = function(parentDirEntry, directoryName, cb){
				parentDirEntry.getDirectory(
					directoryName, 
					{create: false}, 
					function(directoryEntry) {
						console.debug('dir resolved: ' + directoryName);
						cb(null, directoryEntry);
					}, 
					function(error) {
						console.error('dir rejected: ' + directoryName);
						cb({message: 'could not find directory', error: error});
					}
				);
			};

			var _dirHandler = function(error, dirEntry){
				if(error){
					return dfd.reject(error);
				}
				level += 1;
				if(level < dirPathParts.length){
					_getChildDir(dirEntry, dirPathParts[level], _dirHandler);
				}else{
					dfd.resolve(dirEntry);
				}
			};

			_getChildDir(fileSystem.root, dirPathParts[level], _dirHandler);

			return dfd.promise();
		};*/

		this._getFileSystem = function() {
			console.log("getting fs");
			var dfd = new _.Deferred();

			window.requestFileSystem(window.PERSISTENT, 0, function(fileSystem) {
				console.log("fs resolved");
				dfd.resolve(fileSystem);
			}, function(error) {
				console.log("fs rejected");
				dfd.reject({message: "Failed to get file system", error: error});
			});

			return dfd.promise();
		};
	};
	return FileSystemService;
});