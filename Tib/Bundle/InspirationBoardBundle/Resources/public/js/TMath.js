var Kien = function() {
    var thisObj = this;
    
    this.Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    
    this.LineProp = function(a,b,c) {
        this.a = a;
        this.b = b;
        this.c = c;
    };
    
    this.Circle = function(center, radius) {
        this.center = center;
        this.radius = radius;
    };


    this.Seg = function(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    };

    this.Rect = function(topLeft, width, height, radius) {
        this.topLeft = topLeft;
        this.radius = radius;
        this.width= width;
        this.height = height;
    };

    this.Line = function(point1, point2) {
        if(point1.x == point2.x) {
            return new thisObj.LineProp(1, 0 , point1.x);
        } else if(point1.y == point2.y) {
            return new thisObj.LineProp(0,1,point1.y);
        } else {
            var a = (point2.y - point1.y)/(point1.x - point2.x);
            var c = a*point1.x + point1.y;
            return new thisObj.LineProp(a,1,c);
        }
    };
    
    this.LineIntersection = function(line1, line2) {
        if(line1.b*line2.a - line2.b*line1.a != 0) {
            var y = (line1.c*line2.a - line2.c*line1.a)/(line1.b*line2.a - line2.b*line1.a);
            if(line1.a != 0) {
                var x = (line1.c - line1.b*y)/line1.a;
            } else {
                var x = (line2.c - line2.b*y)/line2.a;
            }
            return new thisObj.Point(x,y);
        } else if(line1.c == line2.c) {
            return 'all';
        } else {
            return 'none';
        }
    };
    
    this.LineCircleIntesection = function(line, circle) {
        var c = (0-line.b)*circle.center.x + line.a*circle.center.y;

        var vuonggoc = new thisObj.LineProp(0-line.b,line.a, c);
        var giao = thisObj.LineIntersection(line, vuonggoc);
        var distance = thisObj.PointDistance(circle.center, giao);
        if(distance > circle.radius) {
            return 'none';
        } else if(distance == circle.radius) {
            return giao;
        } else {
            if(line.a == 0) {
                var y = line.c/line.b;
                var x1 = Math.pow((circle.center.radius),2) - Math.pow((y - circle.center.y),2) + circle.center.x;
                var x2 = 0- Math.pow((circle.center.radius),2) + Math.pow((y - circle.center.y),2) + circle.center.x;
                var ret = new Array();
                ret.push(new thisObj.Point(x1,y), new thisObj.Point(x2,y));
                return ret;
            } else if(line.b == 0) {
                var x = line.c/line.a;
                var y1 = Math.pow((circle.center.radius),2) - Math.pow((x - circle.center.x),2) + circle.center.y;
                var y2 = 0- Math.pow((circle.center.radius),2) + Math.pow((x - circle.center.x),2) + circle.center.y;
                var ret = new Array();
                ret.push(new thisObj.Point(x,y1), new thisObj.Point(x,y2));
                return ret;
            } else {
                var m = (line.a*line.a + line.b*line.b);
                var n = ( 0 - 2*line.b*line.b*circle.center.x - 2*line.a*line.c + 2*line.a*line.b*circle.center.y);
                var k = Math.pow(line.b*circle.center.x,2) + line.c*line.c - 2*line.b*line.c*circle.center.y + Math.pow((line.b*circle.center.y),2) - Math.pow(circle.radius*line.b,2);
                var X = thisObj.quadricSolve(m,n,k);
                if(X == 'all' || X=='none') {
                } else if(X.length == 1) {
                    var x = X;
                    var y = (k - m*x)/n;
                    return new Point(x,y);
                } else {
                    var x1 = X[0];
                    var x2 = X[1];
                    var y1 = (line.c - line.a*x1)/line.b;
                    var y2 = (line.c - line.a*x2)/line.b;

                    var ret = new Array();
                    ret.push(new thisObj.Point(x1,y1));
                    ret.push(new thisObj.Point(x2,y2));
                    return ret;
                }

            }
        }
    };
    
    this.LineRectIntersection = function(seg, rect) {
        var pos = new Array();
        pos[0] = new thisObj.Point(rect.topLeft.x, rect.topLeft.y + rect.radius);
        pos[1] = new thisObj.Point(rect.topLeft.x, rect.topLeft.y - rect.radius + rect.height);
        pos[2] = new thisObj.Point(rect.topLeft.x + rect.radius, rect.topLeft.y);
        pos[3] = new thisObj.Point(rect.topLeft.x - rect.radius + rect.width, rect.topLeft.y);
        pos[4] = new thisObj.Point(rect.topLeft.x + rect.width, rect.topLeft.y+rect.radius);
        pos[5] = new thisObj.Point(rect.topLeft.x + rect.width, rect.topLeft.y-rect.radius+rect.height);
        pos[6] = new thisObj.Point(rect.topLeft.x + rect.radius, rect.topLeft.y + rect.height);
        pos[7] = new thisObj.Point(rect.topLeft.x - rect.radius + rect.width, rect.topLeft.y + rect.height);

        var leftLine = new thisObj.Line(pos[0], pos[1]);
        var topLine = new thisObj.Line(pos[2], pos[3]);
        var rightLine = new thisObj.Line(pos[4], pos[5]);
        var bottomLine = new thisObj.Line(pos[6], pos[7]);
        var giao = new Array();
        var line = new thisObj.Line(seg.point1, seg.point2);
        giao[0] = thisObj.LineIntersection(line, leftLine);
        giao[1] = thisObj.LineIntersection(line, topLine);
        giao[2] = thisObj.LineIntersection(line, rightLine);
        giao[3] = thisObj.LineIntersection(line, bottomLine);
        var giao_1 = new Array();
		
        for(var i=0;i<4;i++) {
            if(thisObj.isInline(new thisObj.Point(Math.round(giao[i].x), Math.round(giao[i].y)), pos[2*i], pos[2*i+1]) && thisObj.isInline(new thisObj.Point(Math.round(giao[i].x), Math.round(giao[i].y)),seg.point1, seg.point2)) {
                giao_1.push(giao[i]);
            }
        }
		
        if(giao_1.length != 0) {
            return giao_1[0];
        } else {
            var circles = new Array();
            var centers = new Array();
            var giaos = new Array();
            centers[0] = new thisObj.Point(rect.topLeft.x + rect.radius, rect.topLeft.y+rect.radius);
            centers[1] = new thisObj.Point(rect.topLeft.x - rect.radius + rect.width, rect.topLeft.y+rect.radius);
            centers[2] = new thisObj.Point(rect.topLeft.x - rect.radius + rect.width, rect.topLeft.y-rect.radius+rect.height);
            centers[3] = new thisObj.Point(rect.topLeft.x + rect.radius, rect.topLeft.y-rect.radius+rect.height);
            for(var i =0;i<4;i++) {
                circles[i] = new thisObj.Circle(centers[i],rect.radius);
                giaos[i] = thisObj.LineCircleIntesection(line, circles[i]);
                if(giaos[i]!='none') {
                    for(var j=0;j<giaos[i].length;j++) {
                        if(thisObj.inCircleLine(giaos[i][j],circles[i].center,i)) {
                            if(thisObj.isInline(giaos[i][j], seg.point1, seg.point2)) {
                                return giaos[i][j];
                            }
                        }
                    }
                }
            }

        }
    };
    this.isInline = function(point, p1,p2) {
        if( 
            ( (point.x <= p1.x && point.x >= p2.x) || (point.x <= p2.x && point.x >= p1.x) ) 
            && 
            ( (point.y <= p1.y && point.y >= p2.y) || (point.y <= p2.y && point.y >= p1.y) )  
            ) {
            return true;
        } else {
            return false;
        }
    };
    this.inCircleLine = function(point, center,visiblePart) {
        var xLarge = point.x >= center.x?true:false;
        var yLarge = point.y >= center.y?true:false;
        if(xLarge&&yLarge) {
            if(visiblePart == 2) {
                return true
            } else {
                return false;
            }
        } else if(xLarge&&!yLarge) {
            if(visiblePart == 1) {
                return true
            } else {
                return false;
            }
        } else if(!xLarge&&yLarge) {
            if(visiblePart == 3) {
                return true
            } else {
                return false;
            }
        } else if(!xLarge&&!yLarge) {
            if(visiblePart == 0) {
                return true
            } else {
                return false;
            }
        }
    };
    this.quadricSolve = function(a,b,c) {
        if(a==0) {
            if(b==0) {
                var ret = c==0?'all':'none';
                return ret;
            } else {
                return 0 - c/b;
            }
        } else {
            var delta = b*b - 4*a*c;
            //console.log("delta "+delta);
            if(delta < 0) {
                return 'none';
            } else if(delta ==0) {
                return 0-b/(2*a);
            } else {
                var x1 = (0-b + Math.sqrt(delta))/(2*a);
                var x2 = (0-b - Math.sqrt(delta))/(2*a);
                return new Array(x1,x2);
            }
        }
    };
    this.PointDistance = function(point1, point2) {
        return Math.sqrt(Math.pow((point1.x - point2.x),2) + Math.pow((point1.y - point2.y),2));
    };
}
