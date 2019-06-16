/*

	- boucles dans render: avec i et il
		-for(var i=0, il=this.spheresRep.length; i<il; i++) {
*/

(function(){

	var stage, stageContainer, 
	settings, i, devicePixelRatioCustom, mouseMoveTimeout, 
	mousePos, mousePosInStage, mouseDistToCenterX, mouseDistToCenterY, 
	hasClass, addClass, removeClass, setScene, mouseDownListener, mouseUpListener, mouseMoveListener, mouseMoveTimeoutListener;

	devicePixelRatioCustom = (window.devicePixelRatio!=1 && window.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

	settings={

		mouseMoveTimeoutDuration:2000,
		mousePosAutoAnimationDuration:2, 
		mousePosAutoAnimationEase:Expo.easeInOut, 
	};
	
	mousePos = {
		x:0, 
		y:0
	};
	mousePosInStage = {
		x:mousePos.x, 
		y:mousePos.y
	};

	stage=document.getElementById("stage");
	stageContainer=document.getElementById("stage__container");



	setScene = function(){
		addClass(stage, "loaded");
		mouseMoveTimeoutListener();
	};

	
	resizeListener = function(){
		console.log("resize");
	};

	mouseMoveListener = function ( event ) {
		mousePos.x=mousePosInStage.x=event.pageX-window.stageSettings.posX;
		mousePos.y=mousePosInStage.y=event.pageY-window.stageSettings.posY;
		
		if(mousePos.x<0){
			mousePosInStage.x=0;
		}else if(mousePos.x>window.stageSettings.width){
			mousePosInStage.x=window.stageSettings.width;
		}
		if(mousePos.y<0){
			mousePosInStage.y=0;
		}else if(mousePos.y>window.stageSettings.height){
			mousePosInStage.y=window.stageSettings.height;
		}

		mouseDistToCenterX=mousePos.x- window.stageSettings.width*0.5;
		mouseDistToCenterY=mousePos.y- window.stageSettings.height*0.5;

		if(mousePosInStage.positionTween){mousePosInStage.positionTween.kill();}
		if(mouseMoveTimeout){ clearTimeout(mouseMoveTimeout); }
		mouseMoveTimeout=setTimeout(mouseMoveTimeoutListener, settings.mouseMoveTimeoutDuration);
	};

	mouseMoveTimeoutListener=function(){
		console.log("mouse  move timeout listener");
	};

	mouseDownListener = function(){
		console.log("click body");
	};

	mouseUpListener = function(){
		console.log("release body");
	};

	

	Math.radians = function(degrees) {
		return degrees * Math.PI / 180;
	};
	Math.degrees = function(radians) {
		return radians * 180 / Math.PI;
	};

	hasClass = function(el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
	};
	addClass = function(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!hasClass(el, className)) el.className += ' ' + className;
	};
	removeClass = function(el, className) {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
	};
	
	document.body.addEventListener("mousedown", mouseDownListener);
	document.body.addEventListener("touchstart", mouseDownListener);

	document.body.addEventListener("mouseup", mouseUpListener);
	document.body.addEventListener("touchend", mouseUpListener);

	resizeListener();
	window.addEventListener('resize', resizeListener);

	setScene();

	window.addEventListener("mousemove", mouseMoveListener);
})();


