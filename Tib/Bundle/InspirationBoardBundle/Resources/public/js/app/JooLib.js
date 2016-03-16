/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

JooLib = {
	initStage : function(id, width, height) {
		var stage = new Kinetic.Stage(id, width, height);
		var layer = new Kinetic.Layer();
		stage.add(layer);
		var image = [];
		var appData = {};
		appData.ObjStack = [];

		stage.on('mousedown touchstart', function(e) {
			if(e.which == 1) {
				var arr = stageObj.image;
				var count = 0;
				for(var i = 0; i < arr.length; i++) {
					if(appData.isShift) {
						if(arr[i].isDown) {
							arr[i].showAnchor();
							arr[i].isSelected = true;
							var found = false;
							for(var j = 0; j < stageObj.appData.ObjStack.length; j++) {
								var obj = stageObj.appData.ObjStack[j];
								if(obj.id == arr[i].id) {
									found = true;
								}
							}
							if(!found)
								stageObj.appData.ObjStack.push(arr[i]);
						} else {
							if(!arr[i].isSelected)
								arr[i].hideAnchor();
						}
					} else {
						if(arr[i].isDown) {
							arr[i].showAnchor();
							arr[i].isSelected = true;

							stageObj.appData.ObjStack = [];
							stageObj.appData.ObjStack[0] = arr[i];
						} else {
							count++;
							arr[i].hideAnchor();
							arr[i].isSelected = false;
							if(count == arr.length)
								stageObj.appData.ObjStack = [];
						}
						// JooLib.hideGroupButton();
					}
				}
			}
		})
		$(document).bind('keydown', function(e) {
			if(e.keyCode == 16)
				appData.isShift = true;
		})
		$(document).bind('keyup', function(e) {
			if(e.keyCode == 16)
				appData.isShift = false;
		})
		
		app.stageOffset = $('#' + stageId).offset();
		stage.draw();
		stageObj = {
			stage : stage,
			layer : layer,
			image : image,
			appData : appData,
			text: [],
			obj : {}
		}
		JooUtils.registerDelete();
	},
	getStageOffset : function() {
		return app.stageOffset;
	},
	addNewImage : function(imgsrc, x, y, callback, width, height, rotate) {
		var image = new Image();
		image.src = imgsrc;
		image.onload = function() {
			var wid = width ? width : image.width;
			var heg = height ? height : image.height;

			var img = new JooImage({
				x : x,
				y : y,
				image : image,
				width : wid,
				height : heg,
				name : "image"
			})
			img.addToLayer(stageObj.layer);
			if(rotate) {
				img.doRotate(rotate);
			}
			img.group.getLayer().draw();
			stageObj.obj[img.id] = img;
			if (callback) {
				callback(img);
			}
			
		}
	},
	initGroupButton : function(stageId) {
		var id = "joo-button-" + jooCounter;
		var str = '<div id="' + id + '" class="group-button ab-button" onmousedown="JooLib.groupIt(event)">Group</div>';
		$('#' + stageId).append(str);
		jooCounter++;
		return $('#' + id);
	},
	initUnGroupButton : function(stageId) {
		var id = "joo-button-" + jooCounter;
		var str = '<div id="' + id + '" class="group-button ab-button" onmousedown="JooLib.unGroupIt(event)">Un-group</div>';
		$('#' + stageId).append(str);
		jooCounter++;
		return $('#' + id);
	},
	initTextField : function(stageId) {
		var id = "joo-textfield-" + jooCounter;
		var str = '<div id="' + id + '" class="input-text-wrapper">';
		str += '</div>';
		$('#' + stageId).append(str);
		jooCounter++;
		return $('#' + id);
	},
	proccessShiftStack : function() {
		var stack = stageObj.appData.ObjStack;
	},
	groupIt : function(e) {
		if(e)
			e.stopPropagation();
		var selected = JooUtils.getSelected();
		var objs = stageObj.appData.ObjStack;
		var center = JooUtils.findGroupBorder(objs);
		
		var newObj = new JooGroup({
			x : center.x,
			y : center.y,
			width : center.width,
			height : center.height
		})

		newObj.addToLayer(stageObj.layer);
		for(var i=0; i<objs.length; i++){
			if(objs[i].name == "image"){
				obj =  objs[i].kImage;
				label = "img-";
				obj.setPosition(objs[i].center.x - center.x - objs[i].width / 2, objs[i].center.y - center.y - objs[i].height / 2);
				obj.setCenterOffset(obj.width / 2, obj.height / 2);
			} else if(objs[i].name == "text"){
				obj =  objs[i].kText;
				label = "text-";
				obj.setPosition(objs[i].center.x - center.x, objs[i].center.y - center.y);
				
			}
			obj.setRotation(objs[i].rotate);
			obj.name = label + i;
			newObj.addObj(obj);		
			objs[i].removeLayer();
			delete stageObj.obj[objs[i].id];
			delete obj;
		}
		stageObj.obj[newObj.id] = newObj;
		newObj.group.getLayer().draw();
		stageObj.appData.ObjStack = [];
		newObj.ObjCount = objs.length;
		stageObj.appData.selectedGroup = newObj;
	},
	unGroupIt : function() {
		var obj = stageObj.appData.selectedGroup;
		var type, x;
		var rotate = obj.rotate;
		for(var i=0; i<obj.ObjCount;i++){
			var a = obj.group.getChild('img-'+i);
			type = "image";
			if(!a){
				a = obj.group.getChild('text-'+i);
				type = "text";
			}
			if(a){
				if(type == "image"){
					x = obj.revertCoordinate(a.x + a.width / 2, a.y + a.height / 2);
					
					(function(a) {
						JooLib.addNewImage(a.image.src, x.x, x.y, function(img) {
							img.kImage.setCenterOffset(img.kImage.width / 2, img.kImage.height / 2);
							img.doRotate(rotate + a.getRotation());
							img.group.getLayer().draw();
						}, a.width, a.height);	
					})(a);
							
				}else if(type == "text"){
					x = obj.revertCoordinate(a.x, a.y);
					var text = JooLib.addText({
						x: x.x,
						y: x.y,
						text: a.text,
						fontSize: a.fontSize,
						color: a.color,
						fontFamily: a.fontFamily	
					});
					console.log(a.getRotation());
					text.doRotate(rotate + a.getRotation());
				}
			}
		}
		obj.removeLayer();
		delete obj;
		stageObj.stage.draw();
		stageObj.appData.ObjStack = [];
	},
	revertCoord : function(x, y, center, rotate) {
		var deltaX = center.x;
		var deltaY = center.y;
		var x0 = x;
		var y0 = y;
		var temp = 0;

		if(Math.sin(rotate) == 0 && Math.cos(rotate) == 1) {
		} else if(Math.sin(rotate) == 0 && Math.cos(rotate) == -1) {
			x0 = -x0;
			y0 = -y0;
		} else if(Math.sin(rotate) == 1 && Math.cos(rotate) == 0) {
			temp = x0;
			x0 = y0;
			y0 = -temp;
		} else if(Math.sin(rotate) == -1 && Math.cos(rotate) == 0) {
			temp = x0;
			x0 = -y0;
			y0 = temp;
		} else {
			var temp1 = x0;
			var temp2 = y0;
			x0 = Math.cos(rotate) * temp1 - Math.sin(rotate) * temp2;
			y0 = Math.sin(rotate) * temp1 + Math.cos(rotate) * temp2;
		}
		var data = {};
		data.x = x0 + deltaX;
		data.y = y0 + deltaY;
		return data;
	},
	getSelectedItems : function() {
		var ret = [];
		var obj = stageObj.appData.ObjStack;
		for(var i = 0; i < obj.length; i++) {
			ret.push(obj[i].toData());
		}
		JooLib.addToStage(ret[0]);
		return ret;
	},
	groupSelectedItems : function() {
		JooLib.groupIt();
	},
	unGroupSelection : function() {
		JooLib.unGroupIt();
	},
	getAllItems : function() {
		var ret = [];
		for(var i in stageObj.obj) {
			ret.push(stageObj.obj[i].toData());
		}
		return ret;
	},
	addToStage : function(obj) {
		switch(obj.type) {
			case 'image':
				var position = obj.position;
				var img = JooLib.addNewImage(obj.url, position.x, position.y, function(img) {
					img.doRotate(position.rotate);
					if(obj.id)
						img.id = obj.id;
					img.group.getLayer().draw();
				}, obj.width, obj.height)
				break;
			case 'group':
				var objects = obj.obj;
				var ret = [];
				stageObj.appData.ObjStack = [];
				for(var i = 0; i < objects.length; i++) {
					var item = objects[i];
					JooLib.addNewImage(item.url, item.position.x, item.position.y, function(img) {
						if(obj.id)
							img.id = obj.id;
						img.group.getLayer().draw();
						ret.push(img);
						stageObj.appData.ObjStack.push(img);
						if(ret.length == objects.length) {
							JooLib.groupIt();
						}
					}, item.width, item.height, item.position.rotate)
				}
		}
	},
	saveCurrentStage : function() {
		if(!window.currentId) {
			JooLib.saveCurrentStageAs();
		} else {
			var items = this.getAllItems();
			var jsonStr = JSON.stringify(items);
			JooUtils.saveToServer(jsonStr, window.currentId);
		}
	},
	saveCurrentStageAs : function() {
		var con = confirm('Do you want to save as new design?');
		if(con) {
			var items = this.getAllItems();
			try {
				var jsonStr = JSON.stringify(items);
				JooUtils.saveToServer(jsonStr);
			} catch(ex) {
				console.log(ex);
			}
		}
	},
	loadStage : function() {
		var id = prompt("Please enter the design id", "1");
		JooUtils.loadFromServer(id, function(data) {
			try {
				var jsonData = JSON.parse(data);
				if(jsonData.result == 'success') {
					var designData = JSON.parse(jsonData.data['data']);
					for(var i = 0; i < designData.length; i++) {
						JooLib.addToStage(designData[i]);
					}
				} else {
					alert('No design have that id');
				}
			} catch(ex) {
				console.log(ex);
			}
		})
	},
	removeObject : function(obj) {
		var removeObj = [];
		if(obj) {
			removeObj.push(obj);
		} else {
			removeObj = JooUtils.getSelectedObjects();
		}
		if(removeObj) {
			for(var i = 0; i < removeObj.length; i++) {
				removeObj[i].removeLayer();
				delete stageObj.obj[removeObj[i].id];
			}
		}
	},
	clearStage : function() {

	},
	setBackgroundImage : function(imgsrc) {
		if(stageObj.backgroundObj) {
			var image = new Image();
			image.src = imgsrc;
			image.onload = function() {
				stageObj.backgroundObj.kImage.setImage(image);
				stageObj.backgroundObj.group.getLayer().draw();
			}
			return;
		}
		JooLib.addNewImage(imgsrc, AppConfig.STAGE.FRAME.width / 2, AppConfig.STAGE.FRAME.height / 2, function(img) {
			img.setInteract(false);
			img.group.moveToBottom();
			img.group.getLayer().draw();
			stageObj.backgroundObj = img;
		}, undefined, undefined, 0);
	},
	setFrameImage : function(frameimg) {
		if(stageObj.frameObj) {
			var image = new Image();
			image.src = frameimg;
			image.onload = function() {
				stageObj.frameObj.kImage.setImage(image);
				stageObj.frameObj.group.getLayer().draw();
			}
			return;
		}
		JooLib.addNewImage(frameimg, 0, 0, function(img) {
			img.setInteract(false);
			img.group.y = img.height / 2;
			img.group.x = img.width / 2;
			stageObj.frameObj = img;
			img.group.moveToBottom();
			if(stageObj.backgroundObj){
				stageObj.backgroundObj.group.moveToBottom();
			}
			img.group.getLayer().draw();
			stageObj.backgroundObj.group.getLayer().draw();
		}, undefined, undefined, 0);
	},
	addText: function(options){;
		var text = new JooText({
			x: options.x ? options.x : 100,
			y: options.y ? options.y : 100,
			text: options.text ? options.text : "Default text",
			fontSize: options.fontSize ? options.fontSize : 32,
			color: options.color ? options.color : "#FFFFFF",
			fontFamily: options.fontFamily ? options.fontFamily : "Calibri"
		})
		text.addToLayer(stageObj.layer);
		return text;
	},
	updateText: function(options){
		var objs = stageObj.appData.ObjStack;
		var obj;
		for(var i=0; i< objs.length; i++){
			if(objs[i].name == 'text'){
				obj = objs[i];
				break;
			}
		}
		if(obj){
			if(options.text)
				obj.kText.setText(options.text);
			if(options.color)
				obj.kText.setTextFill(options.color);
			if(options.fontFamily)
				obj.kText.setFontFamily(options.fontFamily);
			if(options.fontSize)
				obj.kText.setFontSize(options.fontSize);
				
			obj.draw();
		}
		return;
	}
}

JooUtils = {
	getSelected : function() {
		var obj = stageObj.appData.ObjStack;
		return obj;
	},
	loadFromServer : function(id, callback) {
		$.ajax({
			url : AppConfig.API.LOAD,
			type : "GET",
			data : {
				id : id
			},
			success : function(data) {
				window.currentId = id;
				if(callback) {
					callback(data);
				}
			},
			error : function() {
				alert('Save error');
			}
		});
	},
	getSelectedObjects : function() {
		var obj = stageObj.appData.ObjStack;
		return obj;
	},
	saveToServer : function(data, id) {
		var sendData = {
			id : id,
			data : data
		}
		$.ajax({
			url : AppConfig.API.SAVE,
			type : "POST",
			data : sendData,
			success : function(data) {
				try {
					var jsonData = JSON.parse(data);
					if(jsonData.result == 'success') {
						var id = jsonData.content['id'];
						alert("Saved id " + id);
						window.currentId = id;
					} else {
						alert(jsonData.message);
					}
				} catch(ex) {
					console.log(ex);
				}
			},
			error : function() {
				alert('Save error');
			}
		});
	},
	registerDelete : function() {
		$(document).bind('keydown', function(e) {
			switch(e.keyCode) {
				// Delete
				case 8:
				case 46:
					var selected = JooUtils.getSelectedObjects();
					if (selected.length > 0) {
						JooLib.removeObject();
						return false;
					}
					break;
			}
		})
	},
	findGroupBorder : function(objs) {
		var center = {};
		var len = objs.length;
		var left, right;
		// Width - left - right
		if(objs != undefined && objs.length > 0) {
			objs.sort(function(a, b){
				var ar = a.center.x + a.width / 2;
				var br = b.center.x + b.width / 2;
				return ar < br;
			})
			right = objs[0].center.x + objs[0].width/2;
			objs.sort(function(a, b){
				var ar = a.center.x - a.width / 2;
				var br = b.center.x - b.width / 2;
				return ar > br;
			})
			left = objs[0].center.x - objs[0].width/2;
			center.x = (right + left) / 2;
			center.width = right - left;
			
			// Height - top - bottom
			objs.sort(function(a, b){
				var ar = a.center.y + a.height / 2;
				var br = b.center.y + b.height / 2;
				return ar < br;
			})
			right = objs[0].center.y + objs[0].height/2;
			objs.sort(function(a, b){
				var ar = a.center.y - a.height / 2;
				var br = b.center.y - b.height / 2;
				return ar > br;
			})
			left = objs[0].center.y - objs[0].height/2;
			center.y = (right + left) / 2;
			center.height = right - left;
			
			return center;
		}
		return;
	}
}