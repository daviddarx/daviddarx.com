/**/

import { TweenMax } from 'gsap';
import * as PIXI from 'pixi.js';

import Global from './general.js';
const global = new Global();
global.init();

const devicePixelRatioCustom = (window.devicePixelRatio!=1 && global.windowSize.width<=1440) ? window.devicePixelRatio : 1; 


const settings = {
	dmapsURL:['s2_dm_filter/dm_grain.jpg'],
	dmapsParamaters:[
		{
			spriteInitScale: (devicePixelRatioCustom==1) ? 0.3 : 0.3,
			minFilterScale:(devicePixelRatioCustom==1) ? 6 : 3, 
			maxFilterScale:(devicePixelRatioCustom==1) ? 30 : 20,  
			filterPosIncrementX:0.03, 
			filterPosIncrementY:0.03
		}
	],
	pointsAnimationDurationMin:1,  
	pointsAnimationDurationRandom:1.75, //0.5
	pointsAnimationEase:Back.easeInOut, 
	pointsLifeRandomAnimationAdded:0.05,
	pointsLifeRandomAnimationRandomAdded:0.15,
	pointsAnimationTimeoutDurationRatioToTotal:0.5, 
	
	mouseMoveTimeoutDuration:2000,
	mousePosAutoAnimationDuration:2, 
	mousePosAutoAnimationEase:Expo.easeInOut, 
	
	filterDMTimeoutDurationMinDuration:8000, 
	filterDMTimeoutDurationMaxDuration:15000, 
	filterDMTimeoutDuration:0.5, 
	filterDMTimeoutEase:Expo.easeInOut, 
	
	clickGraphicsSizeToWindowW:0.07, 
	clickGraphicsAdditionalMaxScale:3, 
	clickGraphicsRotationInit:-405, 
	clickGraphicsRotation:45, 
	clickGraphicsAnimationDuration:0.5, 
	clickGraphicsAnimationEase:Expo.easeOut,
	
	clickGraphicsMouseDownAnimationDuration:1, 
	clickGraphicsMouseDownAnimationEase:Expo.easeInOut, 
	clickGraphicsMouseDownAnimationDelay:1, 
	clickGraphicsMouseDownAnimationAdditionalRotation:90,
	
	clickGraphicsMouseDownAnimationOutDuration:2, 
	clickGraphicsMouseDownAnimationOutEase:Expo.easeOut, 
	clickGraphicsMouseDownAnimationOutAdditionalRotation:90,
	
	changeStyleIntervalDuration:10000, 
	
	mobileBreakPointForDMScale:560, 
	mobileDMScaleRatio:0.5  , 
};

const trianglesRep = [
	{
		p1:{
			life:0.05,
			lifeB1:undefined, 
			position:undefined, 
			targetedLife:undefined
		}, 
		p2:{
			life:0.2,
			lifeB1:undefined, 
			position:undefined, 
			addionalCornerPoint:undefined, 
			targetedLife:undefined
		}
	}
];

const currentStyle = {
	fillColor:0x000000, 
	lineColor:0xffffff 
};

let app;
let linesTexture;
let linesTextureSprite;
let linesGraphics;
let frameGraphics;
let clickGraphics;

let filterDMTimeout;
let changeStyleInterval;
let mouseMoveTimeout;

const dmapsRep = [];

let currentDmapID = 0;
let currentTriangle; 

const mousePos = {
	x:0, 
	y:0
};
const mousePosInStage = {
	x:mousePos.x, 
	y:mousePos.y
};

let isClickGraphicsDisplayed=false;
let isMouseDown=false;
let isMouseDownDrawing=false;
let higherTrianglePoint;
let lowerTrianglePoint;



const setScene = () => {
	let displacementSprite, displacementFilter; 
	
	app = new PIXI.Application(global.stageSettings.width, global.stageSettings.height, { antialias: false, resolution:devicePixelRatioCustom });
	app.renderer.resolution=devicePixelRatioCustom;
	
	global.domRefs.$stageContainer.appendChild(app.view);
	global.domRefs.$stageContainer.style.cursor='pointer';
	
	linesTexture = PIXI.RenderTexture.create( global.stageSettings.width*5, global.stageSettings.height*4, PIXI.settings.SCALE_MODE, devicePixelRatioCustom);
	linesTextureSprite = new PIXI.Sprite(linesTexture);
	app.stage.addChild(linesTextureSprite);
	
	app.loader.add('first-filter', settings.dmapsURL[currentDmapID]);
	app.loader.load(firstImagesLoadCompleteListener);
	
	linesGraphics = new PIXI.Graphics();
	app.stage.addChild(linesGraphics);
	
	frameGraphics = new PIXI.Graphics();
	app.stage.addChild(frameGraphics);
	drawFrame();
	
	clickGraphics = new PIXI.Graphics();
	clickGraphics.props={
		scale:0, 
		rotation:settings.clickGraphicsRotationInit
	};
	app.stage.addChild(clickGraphics);
	
	for(let i=0; i<settings.dmapsURL.length; i++){
		
		displacementSprite = PIXI.Sprite.from(settings.dmapsURL[i]);
		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;
		displacementSprite.scale.y = settings.dmapsParamaters[i].spriteInitScale;
		displacementSprite.scale.x = settings.dmapsParamaters[i].spriteInitScale;
		
		displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);			
		displacementFilter.scale.x=(global.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[i].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[i].minFilterScale;
		displacementFilter.scale.y=displacementFilter.scale.x;
		
		dmapsRep.push({
			sprite:displacementSprite, 
			filter:displacementFilter
		});	       	
	}
	
	app.stage.addChild(dmapsRep[currentDmapID].sprite);
	app.stage.filters = [dmapsRep[currentDmapID].filter];
	tickerListener();
	
	app.ticker.autoStart = true;
	app.ticker.add(tickerListener);
	
	currentTriangle=trianglesRep[0];
	currentTriangle.p1.lifeB1=currentTriangle.p1.life%1;
	currentTriangle.p2.lifeB1=currentTriangle.p2.life%1;
	
	animateTriangles();
	mouseMoveTimeoutListener();
	
	filterDMTimeout=setTimeout(filterDMTimeoutListener, settings.filterDMTimeoutDurationMinDuration+Math.random()*(settings.filterDMTimeoutDurationMaxDuration-settings.filterDMTimeoutDurationMinDuration));
	changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
	
	launchClickGraphics(false);

	resizeListener();
};

const firstImagesLoadCompleteListener = () => {
	global.setStageAsLoaded();
};

const tickerListener = () => {	            
	dmapsRep[currentDmapID].sprite.x += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementX;
	dmapsRep[currentDmapID].sprite.y += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementY;
	
	drawLines();
	
	if(isClickGraphicsDisplayed==true){
		drawClickGraphics();
	}
	
	app.renderer.render(app.stage);
};

const resizeListener = () => {
	app.renderer.resize(global.stageSettings.width, global.stageSettings.height);
	linesTexture.baseTexture.resize(global.stageSettings.width, global.stageSettings.height);
	app.view.style.width=global.stageSettings.width+'px';
	app.view.style.height=global.stageSettings.height+'px';
	drawFrame();
	dmapsRep[currentDmapID].filter.scale.x=(global.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[currentDmapID].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[currentDmapID].minFilterScale;
	dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x;
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
	
	if(mousePosInStage.positionTween){mousePosInStage.positionTween.kill();}
	if(mouseMoveTimeout){ clearTimeout(mouseMoveTimeout); }
	mouseMoveTimeout=setTimeout(mouseMoveTimeoutListener, settings.mouseMoveTimeoutDuration);
	
	if(changeStyleInterval){ clearInterval(changeStyleInterval);}
	changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
};

const mouseDownListener = () => {
	isMouseDown=true;
	global.domRefs.$stageContainer.style.cursor='none';
	
	if(changeStyleInterval){ clearInterval(changeStyleInterval);}
	changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
	changeStyle();
};
const mouseUpListener = () => {
	isMouseDown=false;
	if(isMouseDownDrawing==true){
		launchClickGraphicsAnimationOut();
	}
	isMouseDownDrawing=false;
};

const mouseMoveTimeoutListener = () => {
	mousePosInStage.positionTween=TweenMax.to(mousePosInStage, settings.mousePosAutoAnimationDuration, {x:Math.random()*global.stageSettings.width, y:Math.random()*global.stageSettings.height, ease:settings.mousePosAutoAnimationEase, onComplete:mouseMoveTimeoutListener});
};

const drawFrame = () => {
	frameGraphics.clear();
	frameGraphics.lineStyle(4, 0xffffff, 1);
	frameGraphics.moveTo(0, 0);
	frameGraphics.lineTo(global.stageSettings.width, 0);
	frameGraphics.lineTo(global.stageSettings.width, global.stageSettings.height);
	frameGraphics.lineTo(0, global.stageSettings.height);
	frameGraphics.lineTo(0, 0);
	frameGraphics.endFill();
};

const drawClickGraphics = () => {
	clickGraphics.clear();
	clickGraphics.lineStyle(1, currentStyle.fillColor, 1);
	clickGraphics.beginFill(currentStyle.lineColor);
	clickGraphics.drawRect(settings.clickGraphicsSizeToWindowW*global.stageSettings.width*-0.5*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*global.stageSettings.width*-0.5*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*global.stageSettings.width*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*global.stageSettings.width*clickGraphics.props.scale);
	clickGraphics.rotation=global.radians(clickGraphics.props.rotation);
	clickGraphics.x=mousePosInStage.x;
	clickGraphics.y=mousePosInStage.y;
	clickGraphics.endFill();
	app.renderer.render(clickGraphics, linesTexture, false);
	clickGraphics.clear();
};

const launchClickGraphics = () => {
	isClickGraphicsDisplayed=true;
	clickGraphics.props={
		scale:0, 
		rotation:settings.clickGraphicsRotationInit
	};
	if(clickGraphics.tween){ clickGraphics.tween.kill(); }
	clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsAnimationDuration, { scale:1+Math.random()*settings.clickGraphicsAdditionalMaxScale, rotation:settings.clickGraphicsRotation, ease:settings.clickGraphicsAnimationEase, onComplete:clickGraphicsAnimationCompleteListener});
};

const launchClickGraphicsOnMouseDown = () => {
	if(clickGraphics.tween){ clickGraphics.tween.kill(); }
	clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsMouseDownAnimationDuration, { 
		scale:1+Math.random()*settings.clickGraphicsAdditionalMaxScale, 
		rotation:clickGraphics.props.rotation+settings.clickGraphicsMouseDownAnimationAdditionalRotation,
		ease:settings.clickGraphicsMouseDownAnimationEase,
		delay:settings.clickGraphicsMouseDownAnimationDelay, 
		onComplete:launchClickGraphicsOnMouseDown
	});
};

const launchClickGraphicsAnimationOut = () => {
	if(clickGraphics.tween){ clickGraphics.tween.kill(); }
	clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsMouseDownAnimationOutDuration, { 
		scale:0.1, 
		rotation:clickGraphics.props.rotation+settings.clickGraphicsMouseDownAnimationOutAdditionalRotation,
		ease:settings.clickGraphicsMouseDownAnimationOutEase,
		onComplete:clickGraphicsAnimationCompleteListener
	});
};

const clickGraphicsAnimationCompleteListener = () => {
	if(isMouseDown==false){
		isClickGraphicsDisplayed=false;
	}else{
		launchClickGraphicsOnMouseDown();
		isMouseDownDrawing=true;
	}
};

const getPointPosition = (life) => {
	let position={
		x:undefined, 
		y:undefined
	};
	
	if(life<0.25){
		position.x=global.stageSettings.width*life*4;
		position.y=0;
	}else if(life<0.5){
		position.x=global.stageSettings.width;
		position.y=global.stageSettings.height*(life-0.25)/0.25;
	}else if(life<0.75){
		position.x=global.stageSettings.width-global.stageSettings.width*(life-0.5)/0.25; 
		position.y=global.stageSettings.height;
	}else{
		position.x=0;
		position.y=global.stageSettings.height-global.stageSettings.height*(life-0.75)/0.25;
	}
	
	return position;
};

const updateTriangle = (triangle) => {
	triangle.p1.position=getPointPosition(triangle.p1.lifeB1);
	triangle.p2.position=getPointPosition(triangle.p2.lifeB1);
};

const drawLines = () => {

	currentTriangle=trianglesRep[0];
	
	updateTriangle(currentTriangle);
	
	if(currentTriangle.p1.lifeB1>currentTriangle.p2.lifeB1){
		higherTrianglePoint=currentTriangle.p1;
		lowerTrianglePoint=currentTriangle.p2;
	}else{
		higherTrianglePoint=currentTriangle.p2;
		lowerTrianglePoint=currentTriangle.p1;
	}
	
	currentTriangle.cornerPoint1=undefined;
	currentTriangle.cornerPoint2=undefined;
	currentTriangle.cornerPoint3=undefined;
	currentTriangle.cornerPoint4=undefined;
	
	if(lowerTrianglePoint.position.y==0){
		if(higherTrianglePoint.position.x==global.stageSettings.width){
			currentTriangle.cornerPoint1=getPointPosition(0.25);
		}
	}else if(lowerTrianglePoint.position.x==global.stageSettings.width){
		if(higherTrianglePoint.position.y==global.stageSettings.height){
			currentTriangle.cornerPoint1=getPointPosition(0.5);
		}
	}else if(lowerTrianglePoint.position.y==global.stageSettings.height){
		if(higherTrianglePoint.position.x==0){
			currentTriangle.cornerPoint1=getPointPosition(0.75);
		}
	}
	if(higherTrianglePoint.position.x==0){
		if(lowerTrianglePoint.position.y==0){
			currentTriangle.cornerPoint1=getPointPosition(0);
		}
	}
	
	linesGraphics.clear();
	linesGraphics.beginFill(currentStyle.fillColor);
	linesGraphics.lineStyle(1, currentStyle.lineColor, 1);
	
	linesGraphics.moveTo(mousePosInStage.x, mousePosInStage.y);
	linesGraphics.lineTo(lowerTrianglePoint.position.x, lowerTrianglePoint.position.y);
	if(currentTriangle.cornerPoint1!=undefined){
		linesGraphics.lineTo(currentTriangle.cornerPoint1.x, currentTriangle.cornerPoint1.y);
	}
	if(currentTriangle.cornerPoint2!=undefined){
		linesGraphics.lineTo(currentTriangle.cornerPoint2.x, currentTriangle.cornerPoint2.y);
	}
	linesGraphics.lineTo(higherTrianglePoint.position.x, higherTrianglePoint.position.y);
	linesGraphics.lineTo(mousePosInStage.x, mousePosInStage.y);
	linesGraphics.endFill();
	
	app.renderer.render(linesGraphics, linesTexture, false);
};

const animateTriangles = () => {
	let p1Duration, p2Duration;
	
	currentTriangle=trianglesRep[0];
	
	currentTriangle.p1.targetedLife=currentTriangle.p1.life+settings.pointsLifeRandomAnimationAdded+Math.random()*settings.pointsLifeRandomAnimationRandomAdded;
	currentTriangle.p2.targetedLife=currentTriangle.p1.targetedLife+0.25;
	
	p1Duration=settings.pointsAnimationDurationMin+Math.random()*settings.pointsAnimationDurationRandom;
	p2Duration=settings.pointsAnimationDurationMin+Math.random()*settings.pointsAnimationDurationRandom;
	
	TweenMax.to(currentTriangle.p1, p1Duration, { life:currentTriangle.p1.targetedLife, ease:settings.pointsAnimationEase, onUpdate:pointLifeUpdateListener, onUpdateParams:[currentTriangle.p1]});
	TweenMax.to(currentTriangle.p2, p2Duration, { life:currentTriangle.p2.targetedLife, ease:settings.pointsAnimationEase, onUpdate:pointLifeUpdateListener, onUpdateParams:[currentTriangle.p2], delay:p1Duration});
	
	setTimeout(animateTriangles, (p1Duration+p2Duration)*settings.pointsAnimationTimeoutDurationRatioToTotal*1000);
};

const pointLifeUpdateListener = (t) => {
	t.lifeB1=t.life%1;
};

const changeStyle = () => {
	if(currentStyle.fillColor==0x000000){
		currentStyle.fillColor=0xffffff;
		currentStyle.lineColor=0x000000;
	}else{
		currentStyle.fillColor=0x000000;
		currentStyle.lineColor=0xffffff;
	}
	
	launchClickGraphics();
};

const filterDMTimeoutListener = () => {
	clearTimeout(filterDMTimeout);
	filterDMTimeout=setTimeout(filterDMTimeoutListener, settings.filterDMTimeoutDurationMinDuration+Math.random()*(settings.filterDMTimeoutDurationMaxDuration-settings.filterDMTimeoutDurationMinDuration));
	
	TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.filterDMTimeoutDuration, {x:settings.dmapsParamaters[currentDmapID].maxFilterScale, y:settings.dmapsParamaters[currentDmapID].maxFilterScale, ease:settings.filterDMTimeoutEase, onUpdate:filterDMTimeoutListenerUpdateListener, onComplete:filterDMTimeoutListenerCompleteListener}).yoyo(true).repeat(1);
};
const filterDMTimeoutListenerUpdateListener = () => {
	dmapsRep[currentDmapID].filter.scale.x=(global.windowSize.width<settings.mobileBreakPointForDMScale) ? Math.random()*settings.dmapsParamaters[currentDmapID].maxFilterScale*settings.mobileDMScaleRatio : Math.random()*settings.dmapsParamaters[currentDmapID].maxFilterScale;
	dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x;
	
};
const filterDMTimeoutListenerCompleteListener = () => {
	dmapsRep[currentDmapID].filter.scale.x=(global.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[currentDmapID].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[currentDmapID].minFilterScale;
	dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x;
};





global.domRefs.$stageContainer.addEventListener('mousedown', mouseDownListener);
global.domRefs.$stageContainer.addEventListener('touchstart', mouseDownListener);

global.domRefs.$stageContainer.addEventListener('mouseup', mouseUpListener);
global.domRefs.$stageContainer.addEventListener('touchend', mouseUpListener);

global.externalResizeListener = resizeListener;

setScene();

window.addEventListener('mousemove', mouseMoveListener);




