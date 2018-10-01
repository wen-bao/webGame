window.onload = init;

//window.document_width = window.screen.availWidth;
//window.document_height = window.screen.availHeight;
window.document_width = window.innerWidth;
window.document_height = window.innerHeight;

window.content;

window.balls = new Array();
window.ballNum = 1;
window.score = 0;

window.boxs = new Array();
window.bonuss = new Array();

window.CW	= 800;
window.CH 	= 900;

window.mouseX;
window.mouseY;

window.level = 8;

window.run = false;
window.line = false;

window.dead = false;

window.step = 1;

window.bool = new Array();

window.bonusH = 1;

window.d = 30;
window.r = 15;

window.boxd = 50;
window.bonusr = 10;

window.music = false;
window.hadwelcome = false;

function checkbg() {
	var bg = document.getElementById("bg");
	if(!window.dead && window.music) {
		play();
	} else {
		stop();
	}
}

function play(){
	var bg = document.getElementById("bg");
	bg.play();
}

function stop() {
	var bg = document.getElementById("bg");
	bg.pause();
}

window.rating = 0;
window.minscore = 0;

window.interval;

function init() {
	//Log("开始进入游戏");
	initvalue();
	createboxs();
	creatBonus();
	if(!window.hadwelcome) {
		setInterval(GameTick, 1000/450);
		window.hadwelcome = true;
	}
}

function welcome() {
	//window.hadwelcome = true;
	$("#welcome").fadeIn(800);
	$("#welcome .yes").click(function(){
		window.music = true;
		$("#welcome").fadeOut(800);
	});

	$("#welcome .no").click(function(){
		window.music = false;
		$("#welcome").fadeOut(800);
	});
}

function initvalue() {
	if(!hadwelcome) welcome();
	window.level = 8;
	window.dead = false;
	window.run = false;
	balls.splice(0, balls.length);
	bonuss.splice(0, bonuss.length);
	boxs.splice(0, boxs.length);
	window.step = 1;
	window.bonusH = 1;
	window.line = true;
	if(document_width-800 >= 500) {
		$("#info").css("left", (document_width-1300)/4+"px");
		$("#hero").css("left", (document_width-1300)/4+"px");
		showhero();
	} else {
		if(document_height-920 > 150) {
			var tmp = (document_height-1420)*0.4;
			$("#info").css("top", (920+tmp)+"px");
			$("#hero").css({"top":(920+tmp)+"px", "margin-left":300+"px", "height":Math.min(500, (document_height-920))+"px"});
			showhero();
		} else {
			$("#hero").css("display","none");
			heroval();
		}
		
	}
	window.ballNum = 1;
	window.score = 0;
	$("#info .score").text("分数: " + score);
	$("#info .ballNum").text("球个数: "+ballNum);
	for(var i = 0; i < 16; ++i) {
		bool[i] = new Array();
		for(var j = 0; j < 18; ++j) {
			bool[i][j] = false;
		}
	}
	
	var canvas 	= document.getElementById("canvasgame");
	content 	= canvas.getContext("2d");
	var ball 		= addImage("img/00.png");
	balls.push({item:ball, x:400-r, y:900-r, VX:10, VY:-10});
}

function showhero() {
	$.getJSON("hero.json", {ID:"199", Name:"oabnew", random:Math.random()}, function (data){
      var $jsontip = $("#hero");
      var strHtml = "";
      $jsontip.empty();
      window.rating = 0;
      $.each(data, function (infoIndex, info){
        strHtml += "用户：" + info["user"] + "<br>";
        strHtml += "分数：" + info["score"] + "<br>";
        strHtml += "球数：" + info["ballnum"] + "<br>";
        strHtml += "<div class = 'rating'>"+ rating + "</div>";
        strHtml += "<hr>" 
        window.rating ++;
        window.minscore = info["score"];
      }) 
     // Log(rating);
      $jsontip.html(strHtml); 
    });
}
function heroval() {
	$.getJSON("hero.json", {ID:"199", Name:"oabnew", random:Math.random()}, function (data){
      window.rating = 0;
      $.each(data, function (infoIndex, info){
        window.rating ++;
        window.minscore = info["score"];
      }) 
      //Log(rating);
    });
}

function gameOver() {
	//alert("Game Over!");
	dead = true;
	//Log(rating);
	if(rating < 100 || window.score > window.minscore) {
		$("#heroshow").fadeIn(800);
		$("#heroshow .button").click(function() {
			var username = $("#username").val();
			if(username == "") {
				//Log("empty");
				username = "匿名";
			}
        	$.ajax({
				cache:false,
           		type : "POST",  //提交方式
            	url : "./updateJson.php",//路径,www根目录下
            	data : {"user":username, "score":score, "ballnum":ballNum},//数据，这里使用的是Json格式进行传输
            	success : function(result) {//返回数据根据结果进行相应的处理
                	//alert(result);
            	}
        	});
			$("#heroshow").fadeOut(800);
			init();
		});
	} else {
		$("#gameover").fadeIn(800);
		$("#gameover .restart").click(function() {
			$("#gameover").fadeOut(800);
			init();
		});
		
	}
}

function createboxs() {
	for(var i = 0; i < step; ++i) {
    	var j = (Math.round(Math.random()*311)%5+5)%5;
    	var balls = addImage("img/" + (j+1) + ".png");
    	var xx = Math.round(Math.random()*311%r+r)%r;
		if(bool[xx][1]) continue;
		bool[xx][1] = true;
    	var vall = Math.round(Math.random()*ballNum%ballNum);
		if(vall == 0) vall = ballNum;
    	boxs.push({item:balls, x:xx*53, y:53, val:vall});
	}
}

function creatBonus() {
	var bonus = addImage("img/6.png");
	do{
		var xx = Math.random()*CW%CW;
	}while(xx < 0 || xx > CW-40);
	bonuss.push({item:bonus, x:xx, y:bonusH*53});
}

function GameTick() {
	if(dead){
//		clearInterval(window.interval);
		return;
	}

	cleanGame();

	updateboxs();
	updateBalls();
	updateBonuss();
  	if(line && !run) updateLine();
	testBallsAndAims();
	testBallsAndBonus();
	checkbg();
}

function testBallsAndBonus() {
	for(var i = 0; i < balls.length; ++i) {
		for(var j = 0; j < bonuss.length; ++j) {
			if(HitPoint(bonuss[j].x, bonuss[j].y, balls[i].x, balls[i].y)) {
				bonuss.splice(j, 1);
				$("#info .ballNum").text("球个数: "+ballNum);
				var ball = addImage("img/00.png");
				balls.push({item:ball, x:balls[i].x, y:balls[i].y, VX:10, VY:-10});
				break;
			}
		}
	}
}

function testBallsAndAims(){
	for(var j = 0; j < balls.length; ++j) {
		for(var i = 0; i < boxs.length; ++i) {
			if(hitBox(boxs[i].x, boxs[i].y, balls[j].x, balls[j].y)) {
      			boxs[i].val --;
				score ++;
				$("#info .score").text("分数: " + score);
				var tmpx = balls[j].x - balls[j].VX;
				var tmpy = balls[j].y - balls[j].VY;
				if(tmpx > boxs[i].x+boxd) {
					balls[j].x = boxs[i].x + boxd;
					balls[j].VX *= -1;
				}
				
				if(tmpx+d < boxs[i].x) {
					balls[j].x = boxs[i].x - d;
					balls[j].VX *= -1;
				}
				
				if(tmpy > boxs[i].y+boxd) {
					balls[j].y = boxs[i].y + boxd;
					balls[j].VY *= -1;
				}
				
				if(tmpy+d < boxs[i].y) {
					balls[j].y = boxs[i].y - d;
					balls[j].VY *= -1;
				}
      			if(boxs[i].val <= 0) {
					bool[boxs[i].x/53][boxs[i].y/53] = false;
        			boxs.splice(i, 1);
      			}
				//break;
			}
		}
	}
}

function hitBox(x1, y1, x2, y2) {
	if(x2+d >= x1 && x2 <= x1+boxd && y2+d >= y1 && y2 <= y1+boxd) {
		return true;
	}
	return false;
}

function HitPoint(x1, y1, x2, y2) {
	if((x1+bonusr-x2-r)*(x1+bonusr-x2-r)+(y1+bonusr-y2-r)*(y1+bonusr-y2-r) <= (bonusr+r)*(bonusr+r)){
		return true;
	}
	return false;
}

function updateBonuss() {
	for(var i = 0; i < bonuss.length; ++i) {
		var bonus = bonuss[i];
		content.drawImage(bonus.item, bonus.x, bonus.y);
	}
}

function updateboxs() {
	for(var i = 0; i < boxs.length; ++i) {
    	var aims = boxs[i];
		content.drawImage(aims.item, aims.x, aims.y);
    	content.fillStyle="white";
    	content.font = d+"px Arial";
    	content.fillText(aims.val,aims.x+13,aims.y+35);
	}
}

function addboxs() {
	bonusH = 0;
  	for(var i = 0; i < boxs.length; ++i) {
		bool[boxs[i].x/53][boxs[i].y/53] = false;
    	boxs[i].y += 53;
		bool[boxs[i].x/53][boxs[i].y/53] = true;
		var tmp = boxs[i].y/53;
		if(tmp == 16) {
			gameOver();
			break;
		}
		if(tmp > bonusH) bonusH = tmp;
  	}
  	createboxs();
}

function updateBalls() {
	var num = 0;
	for(var i = 0; i < balls.length; ++i) {
  		if(run) {
    		balls[i].x += balls[i].VX;
    		balls[i].y += balls[i].VY;
  		} else {
    		balls[i].x = CW/2-r;
    		balls[i].y = CH-r;
  		}

  		if(balls[i].x <= 0) {
    		balls[i].x = 0;
    		balls[i].VX *= -1;
  		}
  		if(balls[i].x >= CW - r) {
    		balls[i].x = CW - r;
    		balls[i].VX *= -1;
  		}

  		if(balls[i].y <= 0){
			balls[i].y = 0;
    		balls[i].VY *= -1;
  		}

  		if(balls[i].y >= CH) {
			num ++;
  		}

		content.drawImage(balls[i].item, balls[i].x, balls[i].y);
		
	}
	if(run && num == balls.length) {
		ballNum = balls.length;
		run = false;
		step ++;
		addboxs();
		if(bonuss.length == 0) creatBonus();
	}
}

var $gs = $("#canvasgame");

var gl = $gs.offset().left;
var gt = $gs.offset().top;

document.getElementById("canvasgame").addEventListener("touchstart",function(event){
	line = true;
});

document.getElementById("canvasgame").addEventListener("touchmove",function(event){
	if(event.targetTouches.length == 1) event.preventDefault();
	var touch = event.targetTouches[0];
	//$("title").html(e.changedTouches[0].clientY-scroll_start);
	window.mouseX = touch.pageX - gl;
	window.mouseY = touch.pageY - gt;
});

document.getElementById("canvasgame").addEventListener("touchend", function(e){
	ballRun();
	line = false;
});

$gs.mousemove(function(e){
  window.mouseX = e.clientX - gl;
  window.mouseY = e.clientY - gt;
});

$gs.hover(function(){
  	line = true;
	}, function(){
  	line = false
});

function updateLine() {
  content.strokeStyle = 'white';
  // 设置线条的宽度
  content.lineWidth = 1;

  // 绘制直线
  content.beginPath();

  if(window.mouseY == balls[0].y) {
    content.moveTo(balls[0].x+r, balls[0].y+r);
    content.lineTo(balls[0].x+r, balls[0].y+r+CH);
  } else {
  	var x1 = balls[0].x+r, y1 = balls[0].y+r;
  	var x2 = window.mouseX, y2 = window.mouseY;
  	do {
    	var k = (y2-y1)/(x2-x1);
    	if(k > 0) {
			content.moveTo(x1, y1);
			var tmpx = 0, tmpy = k*(0-x1)+y1;
			content.lineTo(tmpx, tmpy);
			x2 = x1, y2 = tmpy + tmpy - y1; 
			x1 = tmpx, y1 = tmpy;
		} else {
			content.moveTo(x1, y1);
			var tmpx = 800, tmpy = k*(800-x1)+y1;
			content.lineTo(tmpx, tmpy);
			x2 = x1, y2 = tmpy + tmpy - y1;
			x1 = tmpx, y1 = tmpy;
		}
	} while(y1 > 0);
  }
  content.closePath();
  content.stroke();
}

$gs.click(function(){
  ballRun();
  
});

function ballRun() {
	if(!run) {
		for(var i = 0; i < balls.length; ++i) {
    		if(window.mouseX == balls[i].x) {
      			balls[i].VY = -2;
      			balls[i].VX = 0;
    		} else {
      			var k = (window.mouseY-balls[i].y-r)/(window.mouseX-balls[i].x-r);
      			//alert(k);
      			if(k > 0) {
        			balls[i].VX = -1*level/k;
        			balls[i].VY = -1*level;
      			} else {
        			balls[i].VX = -1*level/k;
        			balls[i].VY = -1*level;
      			}
    		}
		}
    	run = true;
  	}
}


function cleanGame() {
	content.clearRect(0, 0, CW, CH);
	//Log("清空屏幕");
}

function addImage(imgurl) {
	var img = new Image();
	img.src = imgurl;
	return img;
}

function Log(msg) {
	 console.log(msg);
}

