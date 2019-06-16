(function(){

	var stage, stageContainer, app, imagesContainer, imagesColorMatrix, ticker,
	i, settings, imagesRep, imagesNegativeRep, dmapsRep, currentImageID, currentDmapID, isImageAnimated, mouseDistToCenterX, mouseDistToCenterY, imageTargetPosition, linesOverlay, mouseMoveLineOverlay, imageFilters, filterTimeOut, changePictureTimeout, mouseMoveTimeout, mousePos, mousePosInStage, devicePixelRatioCustom,  mouseMoveLinePointsArray, isStageNegativ, currentImage, 
	hasClass, addClass, removeClass, setScene, firstImagesLoadCompleteListener, tickerListener, resizeListener, mouseMoveListener, changePicture, changeDMap, drawRandomLines, filterTimeOutListener, filterTimeoutTweenProgressListener, drawMouseMoveLine, mouseMoveTimeoutListener, updateMouseMoveLinePoints, animateMouseMoveLineWidth, pictureChangeAnimationMiddleListener, pictureChangeAnimationCompleteListener, changeNegativeMode;

	devicePixelRatioCustom = (window.devicePixelRatio!=1 && window.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

	settings={
		imagesBW:2880, 
		imagesBH:1600, 
		filterSize:2048, 
		imagesURL:Array('images/s1_dm_backgrounds/01.jpg', 'images/s1_dm_backgrounds/02.jpg', 'images/s1_dm_backgrounds/03.jpg', 'images/s1_dm_backgrounds/04.jpg', 'images/s1_dm_backgrounds/05.jpg', 'images/s1_dm_backgrounds/06.jpg'), 
		imagesNegativeURL:Array('images/s1_dm_backgrounds/01_neg.jpg', 'images/s1_dm_backgrounds/02_neg.jpg', 'images/s1_dm_backgrounds/03_neg.jpg', 'images/s1_dm_backgrounds/04_neg.jpg', 'images/s1_dm_backgrounds/05_neg.jpg', 'images/s1_dm_backgrounds/06_neg.jpg'),
		dmapsURL:Array('images/s1_dm_filters/01.jpg', 'images/s1_dm_filters/02.jpg', 'images/s1_dm_filters/03.jpg', 'images/s1_dm_filters/04.jpg', 'images/s1_dm_filters/05.jpg', 'images/s1_dm_filters/06.jpg'),
		dmapsParamaters:Array(
			{
				spriteInitScale:0.5, 
				minFilterScale:100, 
				maxFilterScale:300, 
				filterPosIncrementX:0.06, 
				filterPosIncrementY:0.06
			},
			{
				spriteInitScale:0.9, 
				minFilterScale:300, 
				maxFilterScale:600, 
				filterPosIncrementX:0.06, 
				filterPosIncrementY:0.06
			}, 
			{
				spriteInitScale:0.5, 
				minFilterScale:100, 
				maxFilterScale:300, 
				filterPosIncrementX:0.03, 
				filterPosIncrementY:0.03
			},
			{
				spriteInitScale:0.6, 
				minFilterScale:20, 
				maxFilterScale:60, 
				filterPosIncrementX:0.03, 
				filterPosIncrementY:0.03
			}, 
			{
				spriteInitScale:1, 
				minFilterScale:100, 
				maxFilterScale:300, 
				filterPosIncrementX:0.03, 
				filterPosIncrementY:0.03
			},
			{
				spriteInitScale:1, 
				minFilterScale:100, 
				maxFilterScale:300, 
				filterPosIncrementX:0.03, 
				filterPosIncrementY:0.03
			}
		),

		mouseMoveDecalMaxRatio:0.1, 
		mouseMoveDecalEaseRatio:0.1,

		imagesChangeFilterAnimationOutDuration:1,
		imagesChangeFilterAnimationOutEase:Expo.easeInOut, 
		imagesChangeImageAnimationOutDuration:2,
		imagesChangeImageAnimationOutEase:Expo.easeIn,
		imagesChangeLinesAnimationOutDuration:0.5, 
		imagesChangeLinesAnimationOutDelay:2, 
		imagesChangeLinesAnimationOutEase:Expo.easeIn, 

		imagesChangeFilterAnimationInDuration:1.5,
		imagesChangeFilterAnimationInDelay:0.5,
		imagesChangeFilterAnimationInEase:Expo.easeInOut, 
		imagesChangeImageAnimationInDuration:2,
		imagesChangeImageAnimationInDelay:0.5, 
		imagesChangeImageAnimationInEase:Quad.easeOut, 
		imagesChangeLinesAnimationInDuration:1, 
		imagesChangeLinesAnimationInEase:Expo.easeOut, 

		imagesFilterTimeOutMinDuration:7000,
		imagesFilterTimeOutMaxDuration:15000, 
		imagesFilterAnimationInDuration:1, 
		imagesFilterAnimationInEase:Expo.easeOut, 
		imagesFilterContrastMax:0.24, 

		changePictureTimeoutDuration: 20000,

		linesOverlayColor:0xffffff,
		linesOverlayColorNegative:0x000000, 

		mouseMoveLineColor:0xffffff, 
		mouseMoveLineColorNegative:0x000000, 
		mouseMoveLineWidth:0.4, 
		mouseMoveLinePointRandomRotationMax:1, 
		mouseMoveLinePointsMax:100, 
		mouseMoveLineWidthAnimationDurationMax:3, 
		mouseMoveLineWidthAnimationEase:Expo.easeInOut,

		mouseMoveTimeoutDuration:2000,
		mousePosAutoAnimationDurationMin:1,
		mousePosAutoAnimationDurationRandomMax:3, 
		mousePosAutoAnimationEase:Expo.easeInOut, 

		areDMFiltersRandomAtImageChange:false, 

		mobileBreakPointForDMScale:560, 
		mobileDMScaleRatio:0.5, 
	};

	imagesRep = Array();
	imagesNegativeRep = Array();
	dmapsRep = Array();
	currentImageID = Math.floor(Math.random()*settings.imagesURL.length);
	currentDmapID = currentImageID; //Math.floor(Math.random()*settings.dmapsURL.length);;
	isImageAnimated=false;
	isStageNegativ=false;
	

	mouseMoveLinePointsArray=Array();

	imageFilters={
		contrast:0
	};

	mousePos = {
		x:window.stageSettings.width*0.5, 
		y:window.stageSettings.height*0.5
	};
	mousePosInStage = {
		x:mousePos.x, 
		y:mousePos.y
	};

	imageTargetPosition={
		x:mousePos.x, 
		y:mousePos.y
	};

	stage=document.getElementById("stage");
	stageContainer=document.getElementById("stage__container");



	setScene = function(){
		
		var loader, image, imageTexture, displacementSprite, displacementFilter;

		app = new PIXI.Application(window.stageSettings.width, window.stageSettings.height, { antialias: false, resolution:devicePixelRatioCustom });
		app.view.style.width=window.stageSettings.width+"px";
		app.view.style.height=window.stageSettings.height+"px";
		
		stageContainer.appendChild(app.view);
		stageContainer.style.cursor="pointer";

		loader = new PIXI.loaders.Loader();
		loader.add('first-image', settings.imagesURL[currentImageID]);
		loader.add('first-image-neg', settings.imagesNegativeURL[currentImageID]);
		loader.add('first-filter', settings.dmapsURL[currentDmapID]);
		loader.load(firstImagesLoadCompleteListener);

		imagesContainer = new PIXI.Container();
		imagesColorMatrix = new PIXI.filters.ColorMatrixFilter();
		imagesContainer.filters = [imagesColorMatrix];

		for(i=0; i<settings.imagesURL.length; i++){
			imageTexture = PIXI.Texture.fromImage(settings.imagesURL[i]);
	        image = new PIXI.Sprite(imageTexture);
	        image.anchor.set(0.5);
	        imagesContainer.addChild(image);
	        if(i!=currentImageID){ 	image.alpha=0; }
	        imagesRep.push(image);

			imageTexture = PIXI.Texture.fromImage(settings.imagesNegativeURL[i]);
	        image = new PIXI.Sprite(imageTexture);
	        image.anchor.set(0.5);
	        imagesContainer.addChild(image);
	        image.alpha=0;
	        imagesNegativeRep.push(image);
		}
        app.stage.addChild(imagesContainer);

		currentImage=imagesRep[currentImageID];

		linesOverlay = new PIXI.Graphics();
		app.stage.addChild(linesOverlay);
		drawRandomLines();

		mouseMoveLineOverlay = new PIXI.Graphics();
		mouseMoveLineOverlay.props={
			mouseMoveLineWidthCurrent:0
		};
		app.stage.addChild(mouseMoveLineOverlay);
		animateMouseMoveLineWidth();
		 
       	for(i=0; i<settings.dmapsURL.length; i++){
    
			if(window.windowSize.width<settings.mobileBreakPointForDMScale){
				settings.dmapsParamaters[i].spriteInitScale=settings.dmapsParamaters[i].spriteInitScale*settings.mobileDMScaleRatio;
				settings.dmapsParamaters[i].minFilterScale=settings.dmapsParamaters[i].minFilterScale*settings.mobileDMScaleRatio;
				settings.dmapsParamaters[i].maxFilterScale=settings.dmapsParamaters[i].maxFilterScale*settings.mobileDMScaleRatio;
			}

	        displacementSprite = PIXI.Sprite.fromImage(settings.dmapsURL[i]);
			displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;   
			
			displacementSprite.scale.x=displacementSprite.scale.y=settings.dmapsParamaters[i].spriteInitScale;
			displacementSprite.x= (displacementSprite.scale.x*settings.filterSize - window.stageSettings.width) * -0.5;
			displacementSprite.y= (displacementSprite.scale.y*settings.filterSize - window.stageSettings.height) * -0.5;
			
			displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
			displacementFilter.scale.x=displacementFilter.scale.y=settings.dmapsParamaters[i].minFilterScale;

   		    dmapsRep.push({
				sprite:displacementSprite, 
				filter:displacementFilter
			});	       	
	    }

        app.stage.addChild(dmapsRep[currentDmapID].sprite);
	    app.stage.filters = [dmapsRep[currentDmapID].filter];
		tickerListener();

		ticker = new PIXI.ticker.Ticker();
		ticker.autoStart = true;
		ticker.add(tickerListener);

		filterTimeOut=setTimeout(filterTimeOutListener, settings.imagesFilterTimeOutMinDuration+Math.random()*(settings.imagesFilterTimeOutMaxDuration-settings.imagesFilterTimeOutMinDuration));

		changePictureTimeout=setTimeout(changePicture, settings.changePictureTimeoutDuration);
		mouseMoveTimeoutListener();
	};

	firstImagesLoadCompleteListener = function () {
    	addClass(stage, "loaded");
	};

	tickerListener = function (delta) {
	            
	    dmapsRep[currentDmapID].sprite.x += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementX;
		dmapsRep[currentDmapID].sprite.y += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementY;

		currentImage.x+=(imageTargetPosition.x-currentImage.x)*settings.mouseMoveDecalEaseRatio;
		currentImage.y+=(imageTargetPosition.y-currentImage.y)*settings.mouseMoveDecalEaseRatio;

		updateMouseMoveLinePoints();

	    app.renderer.render(app.stage);
	};

	resizeListener = function(){
		var image, imageNegativ;
		
	  	app.renderer.resize(window.stageSettings.width, window.stageSettings.height);
		app.view.style.width=window.stageSettings.width+"px";
		app.view.style.height=window.stageSettings.height+"px";

	  	for(i=0; i<imagesRep.length; i++){
	  		image=imagesRep[i];

	  		image.x = app.renderer.width / 2;
			image.y = app.renderer.height / 2;

			if(window.stageSettings.width/window.stageSettings.height >= settings.imagesBW/settings.imagesBH){
				image.width = window.stageSettings.width * (1+settings.mouseMoveDecalMaxRatio);
				image.height = settings.imagesBH * (image.width/settings.imagesBW);
			}else{
				image.height = window.stageSettings.height * (1+settings.mouseMoveDecalMaxRatio);
				image.width = settings.imagesBW * (image.height/settings.imagesBH);
			}

			imageNegativ=imagesNegativeRep[i];
	  		imageNegativ.x = image.x;
			imageNegativ.y = image.y;
			imageNegativ.width = image.width;
			imageNegativ.height = image.height;
		}
		for(i=0; i<settings.dmapsURL.length; i++){
			dmapsRep[i].sprite.scale.x = dmapsRep[i].sprite.scale.y = settings.dmapsParamaters[i].spriteInitScale;    
			dmapsRep[i].sprite.x= (dmapsRep[i].sprite.scale.x*settings.filterSize - window.stageSettings.width) * -0.5;
			dmapsRep[i].sprite.y= (dmapsRep[i].sprite.scale.y*settings.filterSize - window.stageSettings.height) * -0.5;	
	    }  
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

		mouseDistToCenterX=mousePosInStage.x- window.stageSettings.width*0.5;
		mouseDistToCenterY=mousePosInStage.y- window.stageSettings.height*0.5;

		if(mousePosInStage.positionTween!=undefined){
			mousePosInStage.positionTween.kill();
			mousePosInStage.positionTween=undefined;
			mouseMoveLineOverlay.clear();
			mouseMoveLinePointsArray=Array();
		}

		imageTargetPosition.x = window.stageSettings.width*0.5 - (mouseDistToCenterX/window.stageSettings.width/0.5) * window.stageSettings.width * (settings.mouseMoveDecalMaxRatio*0.5); 
		imageTargetPosition.y = window.stageSettings.height*0.5 - (mouseDistToCenterY/window.stageSettings.height/0.5) * window.stageSettings.height * (settings.mouseMoveDecalMaxRatio*0.5); 

		if(mouseMoveTimeout){ clearTimeout(mouseMoveTimeout); }
		mouseMoveTimeout=setTimeout(mouseMoveTimeoutListener, settings.mouseMoveTimeoutDuration);
	};

	mouseMoveTimeoutListener=function(){
		mousePosInStage.positionTween=TweenMax.to(mousePosInStage, settings.mousePosAutoAnimationDurationMin+Math.random()*settings.mousePosAutoAnimationDurationRandomMax, {x:Math.random()*window.stageSettings.width, y:Math.random()*window.stageSettings.height, ease:settings.mousePosAutoAnimationEase, onComplete:mouseMoveTimeoutListener, onUpdate:updateMouseMoveLinePoints});
	};

	updateMouseMoveLinePoints = function(){
		mouseMoveLinePointsArray.push({
			x:mousePosInStage.x+Math.random()*settings.mouseMoveLinePointRandomRotationMax, 
			y:mousePosInStage.y+Math.random()*settings.mouseMoveLinePointRandomRotationMax, 
			width:mouseMoveLineOverlay.props.mouseMoveLineWidthCurrent
		});
		if(mouseMoveLinePointsArray.length>settings.mouseMoveLinePointsMax){
			mouseMoveLinePointsArray.shift();
		}
		drawMouseMoveLine();
	};

	animateMouseMoveLineWidth = function(){
		TweenMax.to(mouseMoveLineOverlay.props, Math.random()*settings.mouseMoveLineWidthAnimationDurationMax, { mouseMoveLineWidthCurrent: (mouseMoveLineOverlay.props.mouseMoveLineWidthCurrent==0) ? settings.mouseMoveLineWidth : 0 , ease:settings.mouseMoveLineWidthAnimationEase, onComplete:animateMouseMoveLineWidth });			
	};

	changeNegativeMode = function(){
		var oldImage;

		if(isImageAnimated==true){
			settings.currentImagesTweenDMap.kill();
			settings.currentImagesTweenImage.kill();		
			settings.currentImagesTweenLinesOverlay.kill();		
			settings.currentImagesTweenMouseMoveLinesOverlay.kill();

			settings.currentImagesTweenDMap.target.x = settings.currentImagesTweenDMap.vars.x;
			settings.currentImagesTweenDMap.target.y = settings.currentImagesTweenDMap.vars.y;
			settings.currentImagesTweenImage.target.alpha = settings.currentImagesTweenImage.vars.alpha;
			settings.currentImagesTweenLinesOverlay.target.alpha = settings.currentImagesTweenLinesOverlay.vars.alpha;
			settings.currentImagesTweenMouseMoveLinesOverlay.target.alpha = settings.currentImagesTweenMouseMoveLinesOverlay.vars.alpha;

			if(settings.currentImagesTweenAnimationType=="out"){
				changeDMap(settings.areDMFiltersRandomAtImageChange);
			}

			if(isStageNegativ==true){
				currentImage=imagesNegativeRep[currentImageID];
			}else{
				currentImage=imagesRep[currentImageID];
			}

			settings.currentImagesTweenAnimationType="in"; 
			dmapsRep[currentDmapID].filter.scale.x = dmapsRep[currentDmapID].filter.scale.y = settings.dmapsParamaters[currentDmapID].minFilterScale; 
			currentImage.alpha = 1;
			linesOverlay.alpha = 1;
			mouseMoveLineOverlay.alpha = 1; 

			isImageAnimated=false;
		}
		
		oldImage=currentImage;

		if(isStageNegativ==false){
			isStageNegativ=true;
			currentImage=imagesNegativeRep[currentImageID];
		}else{
			isStageNegativ=false;
			currentImage=imagesRep[currentImageID];
		}

		oldImage.alpha=0;
		currentImage.x=oldImage.x;
		currentImage.y=oldImage.y;
		currentImage.alpha=1;

		drawRandomLines();
	};

	changePicture = function(){
		var newImageID;

		if(isImageAnimated==false){

			clearTimeout(changePictureTimeout);
			changePictureTimeout=setTimeout(changePicture, settings.changePictureTimeoutDuration);

			newImageID=(currentImageID+1<imagesRep.length) ? currentImageID+1: 0; 

			isImageAnimated=true;

			settings.currentImagesTweenAnimationType="out"; 
			settings.currentImagesTweenDMap = TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.imagesChangeFilterAnimationOutDuration, { x: settings.dmapsParamaters[currentDmapID].maxFilterScale, y: settings.dmapsParamaters[currentDmapID].maxFilterScale, ease:settings.imagesChangeFilterAnimationOutEase});
			settings.currentImagesTweenImage = TweenMax.to(currentImage, settings.imagesChangeImageAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeImageAnimationOutEase});			
			settings.currentImagesTweenLinesOverlay = TweenMax.to(linesOverlay, settings.imagesChangeLinesAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeLinesAnimationOutEase, delay:settings.imagesChangeLinesAnimationOutDelay, onComplete:pictureChangeAnimationMiddleListener});			
			settings.currentImagesTweenMouseMoveLinesOverlay = TweenMax.to(mouseMoveLineOverlay, settings.imagesChangeImageAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeImageAnimationOutEase});			

			currentImageID=newImageID;
		}
	};

	pictureChangeAnimationMiddleListener=function(){
		changeDMap(settings.areDMFiltersRandomAtImageChange);
		
		if(isStageNegativ==true){
			currentImage=imagesNegativeRep[currentImageID];
		}else{
			currentImage=imagesRep[currentImageID];
		}

		settings.currentImagesTweenAnimationType="in"; 
		settings.currentImagesTweenDMap = TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.imagesChangeFilterAnimationInDuration, { x: settings.dmapsParamaters[currentDmapID].minFilterScale, y: settings.dmapsParamaters[currentDmapID].minFilterScale, delay:settings.imagesChangeFilterAnimationInDelay, ease:settings.imagesChangeFilterAnimationInEase});
		settings.currentImagesTweenImage = TweenMax.to(currentImage, settings.imagesChangeImageAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeImageAnimationInEase, delay:settings.imagesChangeImageAnimationInDelay, onComplete:pictureChangeAnimationCompleteListener});
		settings.currentImagesTweenLinesOverlay = TweenMax.to(linesOverlay, settings.imagesChangeLinesAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeLinesAnimationInEase});
		settings.currentImagesTweenMouseMoveLinesOverlay = TweenMax.to(mouseMoveLineOverlay, settings.imagesChangeImageAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeImageAnimationInEase, delay:settings.imagesChangeImageAnimationInDelay});

		mouseMoveLineOverlay.clear();
		mouseMoveLinePointsArray=Array();

		drawRandomLines();
	};

	pictureChangeAnimationCompleteListener=function(){
		isImageAnimated=false;
	};

	changeDMap = function(random){
		app.stage.removeChild(dmapsRep[currentDmapID].sprite);

		if(random==true){
			currentDmapID = Math.floor(Math.random()*dmapsRep.length);
		}else{
			currentDmapID = (currentDmapID+1<dmapsRep.length) ? currentDmapID+1: 0; 
		}

		dmapsRep[currentDmapID].filter.scale.x=dmapsRep[currentDmapID].filter.scale.y=settings.dmapsParamaters[currentDmapID].maxFilterScale;
		app.stage.addChild(dmapsRep[currentDmapID].sprite);
	    app.stage.filters = [dmapsRep[currentDmapID].filter];
	};

	drawRandomLines=function(){
		linesOverlay.clear();
		linesOverlay.lineStyle(1, (isStageNegativ==true) ? settings.linesOverlayColorNegative : settings.linesOverlayColor, 1);
	    linesOverlay.moveTo(Math.random() * window.stageSettings.width, 0);
	    linesOverlay.bezierCurveTo(
	        Math.random() * window.stageSettings.width, Math.random() * window.stageSettings.height,
	        Math.random() * window.stageSettings.width, Math.random() * window.stageSettings.height,
	        Math.random() * window.stageSettings.width, window.stageSettings.height
	    );

	    linesOverlay.moveTo(Math.random() * window.stageSettings.width, window.stageSettings.height);
	    linesOverlay.bezierCurveTo(
	        Math.random() * window.stageSettings.width, Math.random() * window.stageSettings.height,
	        Math.random() * window.stageSettings.width, Math.random() * window.stageSettings.height,
	        Math.random() * window.stageSettings.width, 0
	    );
	};

	drawMouseMoveLine = function(){	
		mouseMoveLineOverlay.clear();
		mouseMoveLineOverlay.moveTo(mouseMoveLinePointsArray[0].x, mouseMoveLinePointsArray[0].y);

		for(i=0; i<mouseMoveLinePointsArray.length; i++){
			mouseMoveLineOverlay.lineStyle(mouseMoveLinePointsArray[i].width*i/100*window.stageSettings.width, (isStageNegativ==true) ? settings.mouseMoveLineColorNegative : settings.mouseMoveLineColor, 1);
			mouseMoveLineOverlay.lineTo(mouseMoveLinePointsArray[i].x, mouseMoveLinePointsArray[i].y);
		}
	};

	filterTimeOutListener = function(){
		filterTimeOut=setTimeout(filterTimeOutListener, settings.imagesFilterTimeOutMinDuration+Math.random()*(settings.imagesFilterTimeOutMaxDuration-settings.imagesFilterTimeOutMinDuration));

		imageFilters.contrast=0;
		TweenMax.to(imageFilters, settings.imagesFilterAnimationInDuration , { contrast: 1, ease:settings.imagesFilterAnimationInEase, onUpdate:filterTimeoutTweenProgressListener});
	};
	filterTimeoutTweenProgressListener = function(){
		imagesColorMatrix.reset();
		imagesColorMatrix.contrast((imageFilters.contrast==1) ? 0: Math.random()*settings.imagesFilterContrastMax , true);
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



	stageContainer.addEventListener("click", changeNegativeMode);
	stageContainer.addEventListener("touchstart", changeNegativeMode);

	setScene();

	window.addEventListener("mousemove", mouseMoveListener);
	window.addEventListener('resize', resizeListener);
	resizeListener();
})();


