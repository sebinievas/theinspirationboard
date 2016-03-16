/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

JooGroup = function(params){
    this.init = function(params){
        this.id = "joo-group-"+jooCounter;
        jooCounter++;
        this.imgsrc = params.image;
        this.width = params.width;
        this.height = params.height;
        this.hwRatio = this.height/this.width;
        this.name = "group";
        this.rotate = 0;
        this.center = {
            x: params.x, 
            y: params.y
        }
        this.isDown = false;
        this.group = this.initGroup(params.x, params.y);
    }
    this.doRotate = function(theta){
        this.rotate = theta;
        this.group.setRotation(this.rotate);
    }
    this.initGroup = function(x,y){
        var _self = this;
        var group = new Kinetic.Group({
            x: x,
            y: y,
            draggable: true
        })
        group.on('click', function(e){
            
            })
        group.on("dragstart", function(e){
            this.moveToTop();
            _self.startMove = {
                x:e.clientX,
                y:e.clientY
            }
            if(stageObj.frame){
	            stageObj.frame.group.moveToTop();
				stageObj.frame.group.getLayer().draw();
			}
        })
        group.on('mousedown', function(e){
            _self.isDown = true;
            // JooLib.showUnGroupButton();
            stageObj.appData.selectedGroup = _self;
        })
        group.on('mouseup', function(e){
            _self.isDown = false;
        })
        group.on("dragmove",function(e){
            _self.center.x += e.clientX - _self.startMove.x;
            _self.center.y += e.clientY - _self.startMove.y;
            _self.startMove = {
                x:e.clientX,
                y:e.clientY
            };
            // _self.group.x = _self.center.x;
            // _self.group.y = _self.center.y;
        })
        return group;
    }
    this.initAnchor = function(){
        this.topLeft = this.addAnchor(-this.width/2, -this.height/2, "topLeft", undefined);
        this.topRight = this.addAnchor(this.width/2, -this.height/2, "topRight", undefined);
        this.bottomRight = this.addAnchor(this.width/2, this.height/2, "bottomRight", undefined);
        this.bottomLeft = this.addAnchor(-this.width/2, this.height/2, "bottomLeft", undefined);
        this.rotateAnchor = this.addAnchor(0,-this.height/2 -50, "rotate", undefined, AppConfig.ROTATE_ICON);
    }
    this.showAnchor = function(){
        this.topLeft.show();
        this.topRight.show();
        this.bottomRight.show();
        this.bottomLeft.show();
        this.rotateAnchor.show();
        this.group.getLayer().draw();
    }
    this.hideAnchor = function(){
        this.topLeft.hide();
        this.topRight.hide();
        this.bottomRight.hide();
        this.bottomLeft.hide();
        this.rotateAnchor.hide();
        this.group.getLayer().draw();
    }
    this.addToLayer = function(layer){
        layer.add(this.group);
        this.initAnchor();
//        this.hideAnchor();
        stageObj.image.push(this);
    }
    this.removeLayer = function(){
        this.group.getLayer().remove(this.group);
        this.group.getLayer().draw();
    }
    this.addAnchor = function(x,y,name, color, imagesrc){
        color = !color ? AppConfig.ANCHOR_COLOR : color;
        var _self = this;
        var anchor = new Kinetic.Circle({
            x: 0,
            y: 0,
            stroke: "transparent",
            strokeWidth: 0,
            radius: 10,
            draggable: false
        })
        var group = new Kinetic.Group({
            x: x,
            y: y,
            name: name
        })
        var view;
        if(!imagesrc){
            view = new Kinetic.Rect({
                x: 0,
                y: 0,
                stroke: "transparent",
                fill: color,
                strokeWidth: 0,
                width: AppConfig.ANCHOR_WIDTH,
                height: AppConfig.ANCHOR_WIDTH,
                name: "view",
                draggable: false
            })
            this.addViewEffect(view);
            group.add(view);
        }else{
            var image = new Image();
            image.src = imagesrc;
            image.onload = function(){
                var wid = image.width;
                var heg = image.height;
                view = new Kinetic.Image({
                    x: 0,
                    y: 0,
                    image: image,
                    width: wid,
                    height: heg,
                    name: "view"
                })
                _self.addViewEffect(view);
                group.add(view);
                group.getLayer().draw();
            }
        }
        
        group.on("mousedown", function(){
            anchor.setRadius(200);
            this.moveToTop();
            
            _self.group.draggable(false);
            _self.isDraggable = true;
            var mousePos = _self.group.getStage().getMousePosition();
            _self.startX = mousePos.x;
            _self.startY = mousePos.y;
            var center = _self.center;
            _self.alpha0 = Math.atan((mousePos.y - center.y)/(mousePos.x - center.x));
        })
        this.group.getStage().on("mouseup", function(){
            anchor.setRadius(10);
            _self.group.draggable(true);
            _self.isDraggable = false;
        })
        group.on("mousemove", function(){
            if(_self.isDraggable){
                var mousePos = _self.group.getStage().getMousePosition();
                _self.endX = mousePos.x;
                _self.endY = mousePos.y;
                _self.update(this);
            }
        })
        group.add(anchor);
        this.group.add(group);
        return group;
    }
    this.addViewEffect = function(view){
        view.on("mouseover", function(){
            document.body.style.cursor = "pointer";
            this.getLayer().draw();
        })
        view.on("mouseout", function(){
            document.body.style.cursor = "default";
            this.getLayer().draw();
        })
    }
    this.getMouse = function(){
        var mousePos = this.group.getStage().getMousePosition();
        return this.convertCoord(mousePos.x,mousePos.y);
    }
    this.update = function(activeAnchor){
        if(activeAnchor.name == 'rotate'){
            this.rotateByMouse();
            this.group.getStage().draw();
            return;
        }
        
        var imgs = [];
        var xtemp = {};
        var types = [];
        xtemp['old'] = {width: this.width, height: this.height};
        for(var i=0; i< this.ObjCount; i++){
        	imgs[i] = this.group.getChild("img-"+i);
        	types[i] = "image";
        	if(!imgs[i]){
        		imgs[i] = this.group.getChild("text-"+i);
        		types[i] = "text";
        	}
        	if(imgs){
        		xtemp[i] = {};
	        	xtemp[i].width = imgs[i].width;
	        	xtemp[i].height = imgs[i].height;	
        	}
        }
        
        var start = this.convertCoord(this.startX,this.startY);
        var end  = this.convertCoord(this.endX,this.endY);
        var deltax = end.x - start.x;
        var deltay = end.y - start.y;
        this.startX = this.endX;
        this.startY = this.endY;

        switch (activeAnchor.name) {
            case "topLeft":
            	if(this.width - deltax >= 30)
                	this.width -= deltax;
               	if(this.height - deltax >= 30)
                	this.height -= deltay;
                if(stageObj.appData.isShift == undefined || !stageObj.appData.isShift){
                    this.height = this.width * this.hwRatio;
                    deltay = xtemp['old'].height - this.height;
                }
                break;
            case "topRight":
            	if(this.width + deltax >= 30)
                	this.width 	+= deltax;
                if(this.height - deltay >= 30)
                	this.height	-= deltay;
                if(stageObj.appData.isShift == undefined || !stageObj.appData.isShift){
                    this.height = this.width * this.hwRatio;
                    deltay = xtemp['old'].height - this.height;
                }
                break;
            case "bottomRight":
            	if(this.width + deltax >= 30)
                	this.width 	+= deltax;
                if(this.height - deltay >= 30)
                	this.height	-= deltay;
                if(stageObj.appData.isShift == undefined || !stageObj.appData.isShift){
                    this.height = this.width * this.hwRatio;
                    deltay = - xtemp['old'].height + this.height;
                }
                break;
            case "bottomLeft":
            	if(this.width - deltax >= 30)
                	this.width 	-= deltax;
                if(this.height + deltay >= 30)
                	this.height	+= deltay;
                if(stageObj.appData.isShift == undefined || !stageObj.appData.isShift){
                    this.height = this.width * this.hwRatio;
                    deltay = - xtemp['old'].height + this.height;
                }
                break;
        }
        if(stageObj.appData.isShift){
            this.hwRatio = this.height/this.width;
        }
        
        var x = Math.cos(this.rotate)*deltax/2 - Math.sin(this.rotate)*deltay/2;
        var y = Math.sin(this.rotate)*deltax/2 + Math.cos(this.rotate)*deltay/2;
        
        var ratioW = this.width/xtemp['old'].width;
        var ratioH = this.height/xtemp['old'].height;
        
        for(var i=0; i<this.ObjCount; i++){
        	if(imgs[i]){
        		if(types[i] == "image"){
	        		imgs[i].width = ratioW * imgs[i].width;
		        	imgs[i].height = ratioH * imgs[i].height;
		        	imgs[i].x = (imgs[i].x + xtemp[i].width/2) * ratioW - imgs[i].width/2;
	        		imgs[i].y = (imgs[i].y + xtemp[i].height/2) * ratioH - imgs[i].height/2;
	        	}else if(types[i] == "text"){
	        		
	        		var size = imgs[i].getTextSize();
	        		imgs[i].width = ratioW * size.width;
		        	imgs[i].height = ratioH * size.height;
	        	}
	        }
        }
        this.center.x += x;
        this.center.y += y;
        
        // temp
        x = this.width/2;
        y = this.height/2;
        
        this.topLeft.x = -x -AppConfig.ANCHOR_WIDTH;
        this.topLeft.y = -y -AppConfig.ANCHOR_WIDTH;
        this.topRight.x = x;
        this.topRight.y = - y - AppConfig.ANCHOR_WIDTH;
        this.bottomLeft.x = - x -AppConfig.ANCHOR_WIDTH;
        this.bottomLeft.y = y;
        this.bottomRight.x = x;
        this.bottomRight.y = y;
        this.rotateAnchor.x = 0;
        
        
        this.rotateAnchor.x = 0;
        this.rotateAnchor.y = (this.topLeft.y + this.bottomRight.y)/2 - this.height/2 - 50;
        
        this.group.x = this.center.x;
        this.group.y = this.center.y;
        this.group.getStage().draw();
    }
    
    this.rotateByMouse = function(){
        var center = this.center;
        var centerX = center.x;
        var centerY = center.y;
        var startX = this.startX;
        var alpha0 = this.alpha0;
        var x = this.endX;
        var y = this.endY;
        
        var alpha1 = Math.atan((y - centerY) / (x - centerX));
        if(((x >= centerX) && (centerX >= startX)) || ((x <= centerX) && (centerX <= startX))) {
            if(y < centerY) {
                if(x == startX) {
                    alpha0 = alpha1;
                } else if(centerX == startX) {
                    alpha0 = x > centerX ? -Math.PI / 2 : Math.PI / 2;
                } else if(x == centerX) {
                    alpha1 = startX > centerX ? -Math.PI / 2 : Math.PI / 2;
                } else {
                    alpha0 = alpha0 - Math.PI;
                }
            } else {
                if(x == startX) {
                    alpha0 = alpha1;
                } else if(centerX == startX) {
                    alpha0 = x > centerX ? Math.PI / 2 : -Math.PI / 2;
                } else if(x == centerX) {
                    alpha1 = startX > centerX ? Math.PI / 2 : -Math.PI / 2;
                } else {
                    alpha0 = alpha0 - Math.PI;
                }
            }
        }
        this.rotate += -alpha0 + alpha1;
        this.doRotate(this.rotate);
        this.alpha0 = alpha1;
        this.startX = x;
    }
    this.convertCoord = function(x, y) {
        var center = this.center;
        var x0 = x - center.x;
        var y0 = y - center.y;
        
        var temp;
        var sin = Math.sin(this.rotate);
        var cos = Math.cos(this.rotate);
        if(sin == 0 && cos == 1) {
        } else if(sin == 0 && cos == -1) {
            x0 = -x0;
            y0 = -y0;
        } else if(sin == 1 && cos == 0) {
            temp = x0;
            x0 = y0;
            y0 = -temp;
        } else if(sin == -1 && cos == 0) {
            temp = x0;
            x0 = -y0;
            y0 = temp;
        } else {
            temp = y0;
            var temp1 = x0;
            x0 =  sin * (temp + 1 / Math.tan(this.rotate) * temp1);
            y0 = cos * (temp + 1 / Math.tan(this.rotate + Math.PI / 2) * temp1);
        }
        return {
            x:x0, 
            y: y0
        }
    }
    
    this.revertCoordinate = function(x,y){
        var deltaX = this.center.x;
        var deltaY = this.center.y;
        var x0 = x;
        var y0 = y;
        var temp = 0;

        if(Math.sin(this.rotate) == 0 && Math.cos(this.rotate) == 1){
        }	
        else if(Math.sin(this.rotate) == 0 && Math.cos(this.rotate) == -1){
            x0 = -x0;
            y0 = -y0;
        }
        else if(Math.sin(this.rotate) == 1 && Math.cos(this.rotate) == 0){
            temp = x0;
            x0 = y0;
            y0 = -temp;
        }
        else if(Math.sin(this.rotate) == -1 && Math.cos(this.rotate) == 0){
            temp = x0;
            x0 = -y0;
            y0 = temp;	
        }
        else{
            var temp1 = x0;
            var temp2 = y0;
            x0 = Math.cos(this.rotate)*temp1 - Math.sin(this.rotate)*temp2;
            y0 = Math.sin(this.rotate)*temp1 + Math.cos(this.rotate)*temp2;
        }
        var data = {};
        data.x = x0 + deltaX;
        data.y = y0 + deltaY;
        return data;
    }
    this.addObj = function(obj){
        this.group.add(obj);
    }
    this.removeObj = function(obj){
        this.group.remove(obj);
    }
    this.toData = function(){
    	var imgs = [];
    	var x = [];
    	var objs = [];
    	for(var i=0; i < this.ObjCount; i++){
    		var img = this.group.getChild("img-" + i);
    		var pos = this.revertCoordinate(imgs[i].x + imgs[i].width/2, imgs[i].y + imgs[i].height/2);
    		objs.push({
    			url: img.image.src,
    			position: {
    				x: pos.x,
    				y: pos.y,
    				rotate: img.getRotation()
    			},
    			width: img.width,
    			height: img.height
    		})
    	}
        
        return {
            id: this.id,
            type: 'group',
            position: {
                x: this.center.x,
                y: this.center.y,
                rotate: this.rotate
            },
            width: this.width,
            height: this.height,
            obj: objs
        }
    }
    this.init(params);
}
