var ctx;

var maxFPS = 60;
var ts = 0;

var mouseOver = false;

var padW = 5;
var padH = 60;
var padM = 10;

var score;
var topScore = 0;

var lPadY;
var lPadSpeed

var rPadY;
var rPadSpeed;

var ballR = 5;
var ballX;
var ballLeft;
var ballSpeed;

var mouseY;

var flgGameOver;

function initVars() {
	score = 0;
	lPadY = (480-padH)/2;
	lPadSpeed = 0;
	rPadY = (480-padH)/2;
	rPadSpeed = 0;
	ballX = 640 - padM - padW - ballR;
	ballLeft = true;
	ballSpeed = 3;
	flgGameOver = false;
}

function drawPad(right, y) {
	var x;
	if (right) {
		x = 640 - padM - padW;
	}
	else {
		x = padM;
	}
	
	ctx.fillRect(x, y, padW, padH);
}

function bounceToLeft() {
	if (mouseY >= rPadY && mouseY <= rPadY+padH) {
		score++;
		if (score > topScore) {
			topScore = score;
		}
		
		var to = Math.round((480-padH)*Math.random());
		rPadSpeed = (to - rPadY) / framesUntilImpact();
		lPadSpeed = 0;
		ballSpeed++;
	}
	else {
		gameOver();
	}
}

function bounceToRight() {
	if (mouseY >= lPadY && mouseY <= lPadY+padH) {
		score++;
		if (score > topScore) {
			topScore = score;
		}
	
		var to = Math.round((480-padH)*Math.random());
		lPadSpeed = (to - lPadY) / framesUntilImpact();
		rPadSpeed = 0;
		ballSpeed++;
	}
	else {
		gameOver();
	}
}

function animateLPad() {
	lPadY += lPadSpeed;
	drawPad(false, lPadY);
}

function animateRPad() {
	rPadY += rPadSpeed;
	drawPad(true, rPadY);
}

function animateBall() {
	var ballY;
	if (mouseY > 480 - ballR) {
		ballY = 480 - ballR;
	}
	else if (mouseY < ballR) {
		ballY = ballR;
	}
	else {
		ballY = mouseY;
	}
	
	if (ballLeft) {
		ballX -= ballSpeed;
		if (ballX <= padM + padW + ballR) {
			ballX = padM + padW + ballR;
			ballLeft = false;
			bounceToRight();
		}
	}
	else {
		ballX += ballSpeed;
		if (ballX >= 640 - padM - padW - ballR) {
			ballX = 640 - padM - padW - ballR;
			ballLeft = true;
			bounceToLeft();
		}
	}
	
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballR, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
}

function framesUntilImpact() {
	return (640 - 2*padM - 2*padW - ballR) / ballSpeed;
}

function title() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, 640, 480);
	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.font = "32px Verdana";
	ctx.fillText("Pongy in the Middle", 640/2, 64);
	ctx.fillText("a game by Leon Byford", 640/2, 128);
	ctx.fillText("Click to start", 640/2, 192);
	
	initVars();
	flgGameOver = true;
}


function gameOver() {
	flgGameOver = true;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, 640, 480);
	ctx.fillStyle = "#fff";
	ctx.font = "32px Verdana";
	ctx.textAlign = "left";
	ctx.fillText("Score: " + score, 0, 32);
	ctx.textAlign = "right";
	ctx.fillText("Top: " + topScore, 640, 32);
	ctx.textAlign = "center";
	ctx.fillText("Game Over", 640/2, 96);
	ctx.fillText("Click to try again", 640/2, 160);
}

function step(time) {
	if (time - ts > 1000 / maxFPS && !flgGameOver) {
		ts = time;
		
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, 640, 480);
	
		ctx.fillStyle = "#fff";
	
		ctx.font = "32px Verdana";
		ctx.textAlign = "left";
		ctx.fillText("Score: " + score, 0, 32);
		ctx.textAlign = "right";
		ctx.fillText("Top: " + topScore, 640, 32);
	
		animateLPad();
		animateRPad();
	
		animateBall();
	}
	
	if (mouseOver) {
		requestAnimationFrame(step);
	}
}

$("#p").on("mouseenter", function() {
	if (!mouseOver) {
		mouseOver = true;
		requestAnimationFrame(step);
	}
});

$("#p").on("mouseleave", function() {
	mouseOver = false;
});

$("#p").on("mousemove", function(e) {
	mouseY = e.clientY - $(this).offset().top;
});

$("#p").on("click", function() {
	if (flgGameOver) {
		initVars();
	}
});

$("body").on("keypress", function(e) {
	if (e.key == "f") {
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if (!fullscreenElement) {
			var elem = $("body")[0];
			if (elem.requestFullscreen) {
				elem.requestFullScreen();
			}
			else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
			else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			}
			else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			}
		}
		else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
			else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}
			else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}
});

$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function() {
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	if (fullscreenElement) {
		if ($("body").width() < $("body").height()) {
			$("#p").width($("body").width());
			$("#p").height($("#p").width()/4*3);
		}
		else {
			$("#p").height($("body").height());
			$("#p").width($("#p").height()/3*4);
		}
	}
	else {
		$("#p").width(640);
		$("#p").height(480);
	}
});

$(document).ready(function() {
	ctx = $("#p")[0].getContext("2d");
	title();
});
