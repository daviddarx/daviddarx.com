import { TweenMax } from 'gsap';
import * as PIXI from 'pixi.js';

import Global from './general.js';
const global = new Global();
global.init();

const devicePixelRatioCustom = (window.devicePixelRatio!=1 && global.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

const settings={
	imagesBW:2880, 
	imagesBH:1600, 
	filterSize:2048, 
	imagesFolder:'s1_dm_backgrounds/', 
	imagesURL:['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg'], 
	imagesNegativeURL:['01_neg.jpg', '02_neg.jpg', '03_neg.jpg', '04_neg.jpg', '05_neg.jpg', '06_neg.jpg'],
	dmapsURL:['s1_dm_filters/01.jpg', 's1_dm_filters/02.jpg', 's1_dm_filters/03.jpg', 's1_dm_filters/04.jpg', 's1_dm_filters/05.jpg', 's1_dm_filters/06.jpg'],
	dmapsParamaters:[
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
	], 
	
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

let app;

let changePictureTimeout;
let mouseMoveTimeout;
let filterTimeOut;

let mouseDistToCenterX;
let mouseDistToCenterY;

let mouseMoveLineOverlay;
let linesOverlay;
let imagesColorMatrix;

const imagesRep = [];
const imagesNegativeRep = [];
const dmapsRep = [];

let currentImage;
let currentImageID = Math.floor(Math.random()*settings.imagesURL.length);
let currentDmapID = currentImageID; //Math.floor(Math.random()*settings.dmapsURL.length);;
let isImageAnimated=false;
let isStageNegativ=false;


let mouseMoveLinePointsArray=[];

const imageFilters={
	contrast:0
};

const mousePos = {
	x:global.stageSettings.width*0.5, 
	y:global.stageSettings.height*0.5
};
const mousePosInStage = {
	x:mousePos.x, 
	y:mousePos.y
};

const imageTargetPosition = {
	x:mousePos.x, 
	y:mousePos.y
};




const setScene = () => {

	app = new PIXI.Application(global.stageSettings.width, global.stageSettings.height, { antialias: false, resolution:devicePixelRatioCustom });
	app.view.style.width=global.stageSettings.width+'px';
	app.view.style.height=global.stageSettings.height+'px';
	
	global.domRefs.$stageContainer.appendChild(app.view);
	global.domRefs.$stageContainer.style.cursor='pointer';
	
	const loader = new PIXI.loaders.Loader();
	loader.add('first-image', settings.imagesFolder+settings.imagesURL[currentImageID]);
	loader.add('first-image-neg', settings.imagesFolder+settings.imagesNegativeURL[currentImageID]);
	loader.add('first-filter', settings.dmapsURL[currentDmapID]);
	loader.load(firstImagesLoadCompleteListener);
	
	const imagesContainer = new PIXI.Container();
	imagesColorMatrix = new PIXI.filters.ColorMatrixFilter();
	imagesContainer.filters = [imagesColorMatrix];
	
	for(let i=0; i<settings.imagesURL.length; i++){
		let imageTexture = PIXI.Texture.fromImage(settings.imagesFolder+settings.imagesURL[i]);
		let image = new PIXI.Sprite(imageTexture);
		image.anchor.set(0.5);
		imagesContainer.addChild(image);
		if(i!=currentImageID){ 	image.alpha=0; }
		imagesRep.push(image);
		
		imageTexture = PIXI.Texture.fromImage(settings.imagesFolder+settings.imagesNegativeURL[i]);
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
	
	for(let i=0; i<settings.dmapsURL.length; i++){
		
		if(global.windowSize.width<settings.mobileBreakPointForDMScale){
			settings.dmapsParamaters[i].spriteInitScale=settings.dmapsParamaters[i].spriteInitScale*settings.mobileDMScaleRatio;
			settings.dmapsParamaters[i].minFilterScale=settings.dmapsParamaters[i].minFilterScale*settings.mobileDMScaleRatio;
			settings.dmapsParamaters[i].maxFilterScale=settings.dmapsParamaters[i].maxFilterScale*settings.mobileDMScaleRatio;
		}
		
		let displacementSprite = PIXI.Sprite.fromImage(settings.dmapsURL[i]);
		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;   
		
		displacementSprite.scale.x=displacementSprite.scale.y=settings.dmapsParamaters[i].spriteInitScale;
		displacementSprite.x= (displacementSprite.scale.x*settings.filterSize - global.stageSettings.width) * -0.5;
		displacementSprite.y= (displacementSprite.scale.y*settings.filterSize - global.stageSettings.height) * -0.5;
		
		let displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.scale.x=displacementFilter.scale.y=settings.dmapsParamaters[i].minFilterScale;
		
		dmapsRep.push({
			sprite:displacementSprite, 
			filter:displacementFilter
		});	       	
	}
	
	app.stage.addChild(dmapsRep[currentDmapID].sprite);
	app.stage.filters = [dmapsRep[currentDmapID].filter];
	tickerListener();
	
	const ticker = new PIXI.ticker.Ticker();
	ticker.autoStart = true;
	ticker.add(tickerListener);
	
	filterTimeOut=setTimeout(filterTimeOutListener, settings.imagesFilterTimeOutMinDuration+Math.random()*(settings.imagesFilterTimeOutMaxDuration-settings.imagesFilterTimeOutMinDuration));
	
	changePictureTimeout=setTimeout(changePicture, settings.changePictureTimeoutDuration);
	mouseMoveTimeoutListener();
};

const firstImagesLoadCompleteListener = () => {
	global.setStageAsLoaded();
};

const tickerListener = () => {
	
	dmapsRep[currentDmapID].sprite.x += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementX;
	dmapsRep[currentDmapID].sprite.y += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementY;
	
	currentImage.x+=(imageTargetPosition.x-currentImage.x)*settings.mouseMoveDecalEaseRatio;
	currentImage.y+=(imageTargetPosition.y-currentImage.y)*settings.mouseMoveDecalEaseRatio;
	
	updateMouseMoveLinePoints();
	
	app.renderer.render(app.stage);
};

const resizeListener = () => {
	let image, imageNegativ;
	
	app.renderer.resize(global.stageSettings.width, global.stageSettings.height);
	app.view.style.width=global.stageSettings.width+'px';
	app.view.style.height=global.stageSettings.height+'px';
	
	for(let i=0; i<imagesRep.length; i++){
		image=imagesRep[i];
		
		image.x = app.renderer.width / 2;
		image.y = app.renderer.height / 2;
		
		if(global.stageSettings.width/global.stageSettings.height >= settings.imagesBW/settings.imagesBH){
			image.width = global.stageSettings.width * (1+settings.mouseMoveDecalMaxRatio);
			image.height = settings.imagesBH * (image.width/settings.imagesBW);
		}else{
			image.height = global.stageSettings.height * (1+settings.mouseMoveDecalMaxRatio);
			image.width = settings.imagesBW * (image.height/settings.imagesBH);
		}
		
		imageNegativ=imagesNegativeRep[i];
		imageNegativ.x = image.x;
		imageNegativ.y = image.y;
		imageNegativ.width = image.width;
		imageNegativ.height = image.height;
	}
	for(let i=0; i<settings.dmapsURL.length; i++){
		dmapsRep[i].sprite.scale.x = dmapsRep[i].sprite.scale.y = settings.dmapsParamaters[i].spriteInitScale;    
		dmapsRep[i].sprite.x= (dmapsRep[i].sprite.scale.x*settings.filterSize - global.stageSettings.width) * -0.5;
		dmapsRep[i].sprite.y= (dmapsRep[i].sprite.scale.y*settings.filterSize - global.stageSettings.height) * -0.5;	
	}  
};

const mouseMoveListener = (e) => {
	mousePos.x=mousePosInStage.x=e.pageX-global.stageSettings.posX;
	mousePos.y=mousePosInStage.y=e.pageY-global.stageSettings.posY;
	
	if(mousePos.x<0){
		mousePosInStage.x=0;
	}else if(mousePos.x>global.stageSettings.width){
		mousePosInStage.x=global.stageSettings.width;
	}
	if(mousePos.y<0){
		mousePosInStage.y=0;
	}else if(mousePos.y>global.stageSettings.height){
		mousePosInStage.y=global.stageSettings.height;
	}
	
	mouseDistToCenterX=mousePosInStage.x- global.stageSettings.width*0.5;
	mouseDistToCenterY=mousePosInStage.y- global.stageSettings.height*0.5;
	
	if(mousePosInStage.positionTween!=undefined){
		mousePosInStage.positionTween.kill();
		mousePosInStage.positionTween=undefined;
		mouseMoveLineOverlay.clear();
		mouseMoveLinePointsArray=[];
	}
	
	imageTargetPosition.x = global.stageSettings.width*0.5 - (mouseDistToCenterX/global.stageSettings.width/0.5) * global.stageSettings.width * (settings.mouseMoveDecalMaxRatio*0.5); 
	imageTargetPosition.y = global.stageSettings.height*0.5 - (mouseDistToCenterY/global.stageSettings.height/0.5) * global.stageSettings.height * (settings.mouseMoveDecalMaxRatio*0.5); 
	
	if(mouseMoveTimeout){ clearTimeout(mouseMoveTimeout); }
	mouseMoveTimeout=setTimeout(mouseMoveTimeoutListener, settings.mouseMoveTimeoutDuration);
};

const mouseMoveTimeoutListener = () => {
	mousePosInStage.positionTween=TweenMax.to(mousePosInStage, settings.mousePosAutoAnimationDurationMin+Math.random()*settings.mousePosAutoAnimationDurationRandomMax, {x:Math.random()*global.stageSettings.width, y:Math.random()*global.stageSettings.height, ease:settings.mousePosAutoAnimationEase, onComplete:mouseMoveTimeoutListener, onUpdate:updateMouseMoveLinePoints});
};

const updateMouseMoveLinePoints = () => { 
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

const animateMouseMoveLineWidth = () => {
	TweenMax.to(mouseMoveLineOverlay.props, Math.random()*settings.mouseMoveLineWidthAnimationDurationMax, { mouseMoveLineWidthCurrent: (mouseMoveLineOverlay.props.mouseMoveLineWidthCurrent==0) ? settings.mouseMoveLineWidth : 0 , ease:settings.mouseMoveLineWidthAnimationEase, onComplete:animateMouseMoveLineWidth });			
};

const changeNegativeMode = () => {
	let oldImage;
	
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
		
		if(settings.currentImagesTweenAnimationType=='out'){
			changeDMap(settings.areDMFiltersRandomAtImageChange);
		}
		
		if(isStageNegativ==true){
			currentImage=imagesNegativeRep[currentImageID];
		}else{
			currentImage=imagesRep[currentImageID];
		}
		
		settings.currentImagesTweenAnimationType='in'; 
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

const changePicture = () => {
	let newImageID;
	
	if(isImageAnimated==false){
		
		clearTimeout(changePictureTimeout);
		changePictureTimeout=setTimeout(changePicture, settings.changePictureTimeoutDuration);
		
		newImageID=(currentImageID+1<imagesRep.length) ? currentImageID+1: 0; 
		
		isImageAnimated=true;
		
		settings.currentImagesTweenAnimationType='out'; 
		settings.currentImagesTweenDMap = TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.imagesChangeFilterAnimationOutDuration, { x: settings.dmapsParamaters[currentDmapID].maxFilterScale, y: settings.dmapsParamaters[currentDmapID].maxFilterScale, ease:settings.imagesChangeFilterAnimationOutEase});
		settings.currentImagesTweenImage = TweenMax.to(currentImage, settings.imagesChangeImageAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeImageAnimationOutEase});			
		settings.currentImagesTweenLinesOverlay = TweenMax.to(linesOverlay, settings.imagesChangeLinesAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeLinesAnimationOutEase, delay:settings.imagesChangeLinesAnimationOutDelay, onComplete:pictureChangeAnimationMiddleListener});			
		settings.currentImagesTweenMouseMoveLinesOverlay = TweenMax.to(mouseMoveLineOverlay, settings.imagesChangeImageAnimationOutDuration, { alpha: 0 , ease:settings.imagesChangeImageAnimationOutEase});			
		
		currentImageID=newImageID;
	}
};

const pictureChangeAnimationMiddleListener = () => {
	changeDMap(settings.areDMFiltersRandomAtImageChange);
	
	if(isStageNegativ==true){
		currentImage=imagesNegativeRep[currentImageID];
	}else{
		currentImage=imagesRep[currentImageID];
	}
	
	settings.currentImagesTweenAnimationType='in'; 
	settings.currentImagesTweenDMap = TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.imagesChangeFilterAnimationInDuration, { x: settings.dmapsParamaters[currentDmapID].minFilterScale, y: settings.dmapsParamaters[currentDmapID].minFilterScale, delay:settings.imagesChangeFilterAnimationInDelay, ease:settings.imagesChangeFilterAnimationInEase});
	settings.currentImagesTweenImage = TweenMax.to(currentImage, settings.imagesChangeImageAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeImageAnimationInEase, delay:settings.imagesChangeImageAnimationInDelay, onComplete:pictureChangeAnimationCompleteListener});
	settings.currentImagesTweenLinesOverlay = TweenMax.to(linesOverlay, settings.imagesChangeLinesAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeLinesAnimationInEase});
	settings.currentImagesTweenMouseMoveLinesOverlay = TweenMax.to(mouseMoveLineOverlay, settings.imagesChangeImageAnimationInDuration, { alpha: 1 , ease:settings.imagesChangeImageAnimationInEase, delay:settings.imagesChangeImageAnimationInDelay});
	
	mouseMoveLineOverlay.clear();
	mouseMoveLinePointsArray=[];
	
	drawRandomLines();
};

const pictureChangeAnimationCompleteListener = () => {
	isImageAnimated=false;
};

const changeDMap = (random) => {
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

const drawMouseMoveLine = () => {	
	mouseMoveLineOverlay.clear();
	mouseMoveLineOverlay.moveTo(mouseMoveLinePointsArray[0].x, mouseMoveLinePointsArray[0].y);
	
	for(let i=0; i<mouseMoveLinePointsArray.length; i++){
		mouseMoveLineOverlay.lineStyle(mouseMoveLinePointsArray[i].width*i/100*global.stageSettings.width, (isStageNegativ==true) ? settings.mouseMoveLineColorNegative : settings.mouseMoveLineColor, 1);
		mouseMoveLineOverlay.lineTo(mouseMoveLinePointsArray[i].x, mouseMoveLinePointsArray[i].y);
	}
};

const drawRandomLines = () => {
	linesOverlay.clear();
	linesOverlay.lineStyle(1, (isStageNegativ==true) ? settings.linesOverlayColorNegative : settings.linesOverlayColor, 1);
	linesOverlay.moveTo(Math.random() * global.stageSettings.width, 0);
	
	linesOverlay.bezierCurveTo(Math.random() * global.stageSettings.width, Math.random() * global.stageSettings.height, Math.random() * global.stageSettings.width, Math.random() * global.stageSettings.height, Math.random() * global.stageSettings.width, global.stageSettings.height);
	linesOverlay.moveTo(Math.random() * global.stageSettings.width, global.stageSettings.height);
	linesOverlay.bezierCurveTo(Math.random() * global.stageSettings.width, Math.random() * global.stageSettings.height, Math.random() * global.stageSettings.width, Math.random() * global.stageSettings.height, Math.random() * global.stageSettings.width, 0);
}

const filterTimeOutListener = () => {
	clearTimeout(filterTimeOut);
	filterTimeOut=setTimeout(filterTimeOutListener, settings.imagesFilterTimeOutMinDuration+Math.random()*(settings.imagesFilterTimeOutMaxDuration-settings.imagesFilterTimeOutMinDuration));
	
	imageFilters.contrast=0;
	TweenMax.to(imageFilters, settings.imagesFilterAnimationInDuration , { contrast: 1, ease:settings.imagesFilterAnimationInEase, onUpdate:filterTimeoutTweenProgressListener});
};
const filterTimeoutTweenProgressListener = () => {
	imagesColorMatrix.reset();
	imagesColorMatrix.contrast((imageFilters.contrast==1) ? 0: Math.random()*settings.imagesFilterContrastMax , true);
};

global.domRefs.$stageContainer.addEventListener('click', changeNegativeMode);
global.domRefs.$stageContainer.addEventListener('touchstart', changeNegativeMode);

setScene();

window.addEventListener('mousemove', mouseMoveListener);

global.externalResizeListener = resizeListener;
resizeListener();
