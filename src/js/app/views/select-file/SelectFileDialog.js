define(['underscore', 'zepto', 'BaseDialog', 'utils/utils', 'zepto.touch'], 
		function(_, $, BaseDialog, utils){
	var HIDDEN_CLASS = 'hidden';
	
	var SelectItemDialog = BaseDialog.extend({
		template : utils.template('select-file'),
		fileListTemplate : utils.template('file-list'),
		
		initialize : function(options){
			BaseDialog.prototype.initialize.call(this, options);
			this.fileService = options.fileService;
			this.currentDir = options.currentDir || '/';
		},
		
		_initTouchEvents : function(){
			this.$('.content .commands .select').on(this.tapEvent, _.bind(this._onSelectCommand, this));
			this._initItemEvents();
		},

		_initItemEvents : function(){
			this.$('.list .file').on(this.singleTapEvent, _.bind(this._onSelectFile, this));
			this.$('.list .dir').on(this.singleTapEvent, _.bind(this._onSelectDir, this));
		},

		_offItemEvents : function(){
			this.$('.list .file').off();
			this.$('.list .dir').off();
		},

		_onSelectCommand : function(){
			console.log('select command');
			var currentFile = this._getCurrentFile();
			if(currentFile){
				var currentDir = this._getCurrentDir();
				if(currentDir !== '/'){
					currentDir = currentDir + '/';
				}
				this.trigger('selected', currentDir + currentFile);
				this.close();
			}
			
		},

		_onSelectFile : function(evt){
			var $target = $(evt.currentTarget);
			var fileName = $target.attr('data-file');
			console.log('select file:' + fileName);
			this.$('.list .file .fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o');
			$('.marker', $target).removeClass('fa-square-o').addClass('fa-check-square-o');
		},

		_getCurrentDir : function(){
			return this.$('.current-dir').attr('data-dir');
		},

		_getCurrentFile : function(){
			var $file = this.$('.list .file .fa-check-square-o');
			if($file.length > 0){
				return $file.parent().attr('data-file');
			}
		},
				
		_onSelectDir : function(evt){
			var $target = $(evt.currentTarget);
			var dirName = $target.attr('data-dir');
			console.log('select dir: ' + dirName);
			if($target.hasClass('parent')){
				this.currentDir = dirName;
			}else{
				var currentDir = this._getCurrentDir();
				if(currentDir !== '/'){
					currentDir = currentDir + '/';	
				}
				this.currentDir = currentDir + dirName;
			}
			console.log('currentDir: ' + this.currentDir);
			this._offItemEvents();
			var rendering = this._renderContent();
			rendering.done(_.bind(function(content){
				this.$('.content .list').empty().append(content);
				this._initItemEvents();
			}, this));
		},

		render : function(){
			var dfd = new _.Deferred();
			var contentRendering = this._renderContent();
			contentRendering.done(_.bind(function(content){
				this._base_render({
					title : 'select file',
					content : content
				});
				this._initTouchEvents();
				dfd.resolve(this);
			}, this));
			contentRendering.fail(function(err){
				this._base_render({
					title : 'select file',
					content : ''
				});
				this._initTouchEvents();
				dfd.resolve(this);
				alert(err.message);
			});
			return dfd.promise();
		},

		_renderContent : function(){
			var dfd = new _.Deferred();
			var gettingList = this.fileService.list(this.currentDir);
			gettingList.done(_.bind(function(dirData){
				dfd.resolve(this.fileListTemplate(dirData));
			}, this));
			gettingList.fail(function(err){
				dfd.reject(err);
			});
			return dfd.promise();
		}
	});
	
	return SelectItemDialog;
});