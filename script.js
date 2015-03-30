var docCookies;

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

function getDocCookies(x) {
	docCookies = x;
}

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
	$("canvas").css("cursor", "none");
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
		$("#sfx-ping")[0].play();
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
		$("#sfx-pong")[0].play();
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
	
	var logo = new Image();
	logo.src = "img/logo.png";
	$(logo).on("load", function() {
		ctx.drawImage(logo, 57, 10);
		ctx.fillStyle = "#fff";
		ctx.textAlign = "center";
		ctx.font = "16px Verdana";
		ctx.fillText("v1.0.2", 640/2, 240);
		ctx.fillText("©2015 Visual Archives Limited / Leon Byford", 640/2, 432);
		ctx.fillText("http://ldjb.uk/pongy", 640/2, 464);
		ctx.font = "32px Verdana";
		ctx.fillText("Click to start", 640/2, 352);
	});
	
	initVars();
	flgGameOver = true;
	$("canvas").css("cursor", "pointer");
}


function gameOver() {
	$("#sfx-lose")[0].play();
	flgGameOver = true;
	$("canvas").css("cursor", "pointer");
	ctx.fillStyle = "#fff";
	ctx.textAlign = "center";
	ctx.font = "32px Verdana";
	ctx.fillText("Game Over", 640/2, 240);
	ctx.font = "16px Verdana";
	ctx.fillText("Click to try again", 640/2, 272);
	
	if (score == topScore) {
		docCookies.setItem("topScore", score, Infinity);
	}
}

function step(time) {
	if (time - ts > 1000 / maxFPS && !flgGameOver) {
		ts = time;
		
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, 640, 480);
	
		ctx.fillStyle = "#fff";
	
		ctx.font = "32px Verdana";
		ctx.textAlign = "left";
		ctx.fillText("Score: " + score, padM, 32);
		ctx.textAlign = "right";
		ctx.fillText("Top: " + topScore, 640 - padM, 32);
	
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
		$("#sfx-start")[0].play();
		initVars();
	}
});

$("body").on("keypress", function(e) {
	if (e.which == 70 || e.which == 102) {
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
		if ($(window).width() < $(window).height()) {
			$("#p").width($(window).width());
			$("#p").height($("#p").width()/4*3);
		}
		else {
			$("#p").height($(window).height());
			$("#p").width($("#p").height()/3*4);
		}
	}
	else {
		$("#p").width(640);
		$("#p").height(480);
	}
});

function cookiesInit() {
	if (docCookies.hasItem("topScore")) {
		topScore = docCookies.getItem("topScore");
	}
}

$(document).ready(function() {
	$.getScript("lib/cookies.js", cookiesInit);
	ctx = $("#p")[0].getContext("2d");
	title();
});
