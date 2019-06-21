
import { TweenMax } from "gsap";
import * as PIXI from 'pixi.js';

import Global from './general.js';
const global = new Global();
global.init();

console.log(global.stageSettings);


/*
var stage, stageContainer, app, ticker, linesGraphics, linesTexture, linesTextureSprite, frameGraphics, clickGraphics, 
i, settings, mousePos, mousePosInStage, dmapsRep, currentDmapID, trianglesRep, mouseDistToCenterX, mouseDistToCenterY, stagePerimeter, currentStyle, currentTriangle, higherTrianglePoint, lowerTrianglePoint, mouseMoveTimeout, filterDMTimeout, changeStyleInterval, isClickGraphicsDisplayed, isMouseDown, isMouseDownDrawing, devicePixelRatioCustom, 
hasClass, addClass, removeClass, setScene, firstImagesLoadCompleteListener, tickerListener, resizeListener, mouseDownListener, mouseUpListener, mouseMoveListener, drawLines, getPointPosition, updateTriangle, pointLifeUpdateListener, animateTriangles, changeStyle, mouseMoveTimeoutListener, filterDMTimeoutListener, filterDMTimeoutListenerUpdateListener, filterDMTimeoutListenerCompleteListener, drawFrame, drawClickGraphics, launchClickGraphics, launchClickGraphicsOnMouseDown, launchClickGraphicsAnimationOut, clickGraphicsAnimationCompleteListener;

devicePixelRatioCustom = (window.devicePixelRatio!=1 && window.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

settings={
	dmapsURL:Array('s2_dm_filter/dm_grain.jpg'),
	dmapsParamaters:Array(
		{
			spriteInitScale: (devicePixelRatioCustom==1) ? 0.6 : 0.6,
			minFilterScale:(devicePixelRatioCustom==1) ? 4 : 2, 
			maxFilterScale:(devicePixelRatioCustom==1) ? 20 : 15,  
			filterPosIncrementX:0.03, 
			filterPosIncrementY:0.03
		}
		),
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
		mobileDMScaleRatio:0.5, 
	};
	
	trianglesRep=Array(
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
		);
		
		currentStyle={
			fillColor:0x000000, 
			lineColor:0xffffff, 
		};
		
		dmapsRep = Array();
		currentDmapID = 0; 
		
		mousePos = {
			x:0, 
			y:0
		};
		mousePosInStage = {
			x:mousePos.x, 
			y:mousePos.y
		};
		
		isClickGraphicsDisplayed=false;
		isMouseDown=false;
		isMouseDownDrawing=false;
		
		stage=document.getElementById("stage");
		stageContainer=document.getElementById('stage__container');
		
		
		
		setScene = function(){
			var loader, displacementSprite, displacementFilter; 
			
			app = new PIXI.Application(window.stageSettings.width, window.stageSettings.height, { antialias: false, resolution:devicePixelRatioCustom });
			app.view.style.width=window.stageSettings.width+"px";
			app.view.style.height=window.stageSettings.height+"px";
			
			stageContainer.appendChild(app.view);
			stageContainer.style.cursor="pointer";
			
			linesTexture = PIXI.RenderTexture.create( window.stageSettings.width, window.stageSettings.height, PIXI.settings.SCALE_MODE, devicePixelRatioCustom);
			linesTextureSprite = new PIXI.Sprite(linesTexture);
			app.stage.addChild(linesTextureSprite);
			
			loader = new PIXI.loaders.Loader();
			loader.add('first-filter', settings.dmapsURL[currentDmapID]);
			loader.load(firstImagesLoadCompleteListener);
			
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
			
			for(i=0; i<settings.dmapsURL.length; i++){
				
				displacementSprite = PIXI.Sprite.fromImage(settings.dmapsURL[i]);
				displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;
				displacementSprite.scale.y = settings.dmapsParamaters[i].spriteInitScale;
				displacementSprite.scale.x = settings.dmapsParamaters[i].spriteInitScale;
				
				displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);			
				displacementFilter.scale.x=(window.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[i].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[i].minFilterScale;
				displacementFilter.scale.y=displacementFilter.scale.x*window.stageSettings.width/window.stageSettings.height;
				
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
			
			currentTriangle=trianglesRep[0];
			currentTriangle.p1.lifeB1=currentTriangle.p1.life%1;
			currentTriangle.p2.lifeB1=currentTriangle.p2.life%1;
			
			animateTriangles();
			mouseMoveTimeoutListener();
			
			filterDMTimeout=setTimeout(filterDMTimeoutListener, settings.filterDMTimeoutDurationMinDuration+Math.random()*(settings.filterDMTimeoutDurationMaxDuration-settings.filterDMTimeoutDurationMinDuration));
			changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
			
			launchClickGraphics(false);
		};
		
		firstImagesLoadCompleteListener = function () {
			addClass(stage, "loaded");
		};
		
		tickerListener = function (delta) {	            
			dmapsRep[currentDmapID].sprite.x += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementX;
			dmapsRep[currentDmapID].sprite.y += 10 * settings.dmapsParamaters[currentDmapID].filterPosIncrementY;
			
			drawLines();
			
			if(isClickGraphicsDisplayed==true){
				drawClickGraphics();
			}
			
			app.renderer.render(app.stage);
		};
		
		resizeListener = function(){
			
			stagePerimeter=window.stageSettings.width*2+window.stageSettings.height*2;
			
			if(app){
				app.renderer.resize(window.stageSettings.width, window.stageSettings.height);
				linesTexture.baseTexture.resize(window.stageSettings.width, window.stageSettings.height);
				app.view.style.width=window.stageSettings.width+"px";
				app.view.style.height=window.stageSettings.height+"px";
				drawFrame();
				dmapsRep[currentDmapID].filter.scale.x=(window.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[currentDmapID].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[currentDmapID].minFilterScale;
				dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x*window.stageSettings.width/window.stageSettings.height;
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
			
			mouseDistToCenterX=mousePos.x- window.stageSettings.width*0.5;
			mouseDistToCenterY=mousePos.y- window.stageSettings.height*0.5;
			
			if(mousePosInStage.positionTween){mousePosInStage.positionTween.kill();}
			if(mouseMoveTimeout){ clearTimeout(mouseMoveTimeout); }
			mouseMoveTimeout=setTimeout(mouseMoveTimeoutListener, settings.mouseMoveTimeoutDuration);
			
			if(changeStyleInterval){ clearInterval(changeStyleInterval);}
			changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
		};
		
		mouseDownListener = function(){
			isMouseDown=true;
			stageContainer.style.cursor="none";
			
			if(changeStyleInterval){ clearInterval(changeStyleInterval);}
			changeStyleInterval=setInterval(changeStyle, settings.changeStyleIntervalDuration);
			changeStyle();
		};
		mouseUpListener = function(){
			isMouseDown=false;
			if(isMouseDownDrawing==true){
				launchClickGraphicsAnimationOut();
			}
			isMouseDownDrawing=false;
		};
		
		mouseMoveTimeoutListener=function(){
			mousePosInStage.positionTween=TweenMax.to(mousePosInStage, settings.mousePosAutoAnimationDuration, {x:Math.random()*window.stageSettings.width, y:Math.random()*window.stageSettings.height, ease:settings.mousePosAutoAnimationEase, onComplete:mouseMoveTimeoutListener});
		};
		
		drawFrame = function(){
			frameGraphics.clear();
			frameGraphics.lineStyle(4, 0xffffff, 1);
			frameGraphics.moveTo(0, 0);
			frameGraphics.lineTo(window.stageSettings.width, 0);
			frameGraphics.lineTo(window.stageSettings.width, window.stageSettings.height);
			frameGraphics.lineTo(0, window.stageSettings.height);
			frameGraphics.lineTo(0, 0);
			frameGraphics.endFill();
		};
		
		drawClickGraphics = function(){
			clickGraphics.clear();
			clickGraphics.lineStyle(1, currentStyle.fillColor, 1);
			clickGraphics.beginFill(currentStyle.lineColor);
			clickGraphics.drawRect(settings.clickGraphicsSizeToWindowW*window.stageSettings.width*-0.5*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*window.stageSettings.width*-0.5*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*window.stageSettings.width*clickGraphics.props.scale, settings.clickGraphicsSizeToWindowW*window.stageSettings.width*clickGraphics.props.scale);
			clickGraphics.rotation=Math.radians(clickGraphics.props.rotation);
			clickGraphics.x=mousePosInStage.x;
			clickGraphics.y=mousePosInStage.y;
			clickGraphics.endFill();
			app.renderer.render(clickGraphics, linesTexture, false);
			clickGraphics.clear();
		};
		
		launchClickGraphics = function(){
			isClickGraphicsDisplayed=true;
			clickGraphics.props={
				scale:0, 
				rotation:settings.clickGraphicsRotationInit
			};
			if(clickGraphics.tween){ clickGraphics.tween.kill(); }
			clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsAnimationDuration, { scale:1+Math.random()*settings.clickGraphicsAdditionalMaxScale, rotation:settings.clickGraphicsRotation, ease:settings.clickGraphicsAnimationEase, onComplete:clickGraphicsAnimationCompleteListener});
		};
		
		launchClickGraphicsOnMouseDown = function(){
			if(clickGraphics.tween){ clickGraphics.tween.kill(); }
			clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsMouseDownAnimationDuration, { 
				scale:1+Math.random()*settings.clickGraphicsAdditionalMaxScale, 
				rotation:clickGraphics.props.rotation+settings.clickGraphicsMouseDownAnimationAdditionalRotation,
				ease:settings.clickGraphicsMouseDownAnimationEase,
				delay:settings.clickGraphicsMouseDownAnimationDelay, 
				onComplete:launchClickGraphicsOnMouseDown
			});
		};
		
		launchClickGraphicsAnimationOut = function(){
			if(clickGraphics.tween){ clickGraphics.tween.kill(); }
			clickGraphics.tween=TweenMax.to(clickGraphics.props, settings.clickGraphicsMouseDownAnimationOutDuration, { 
				scale:0.1, 
				rotation:clickGraphics.props.rotation+settings.clickGraphicsMouseDownAnimationOutAdditionalRotation,
				ease:settings.clickGraphicsMouseDownAnimationOutEase,
				onComplete:clickGraphicsAnimationCompleteListener
			});
		};
		
		clickGraphicsAnimationCompleteListener = function(){
			if(isMouseDown==false){
				isClickGraphicsDisplayed=false;
			}else{
				launchClickGraphicsOnMouseDown();
				isMouseDownDrawing=true;
			}
		};
		
		getPointPosition = function(life){
			var position={
				x:undefined, 
				y:undefined
			};
			
			if(life<0.25){
				position.x=window.stageSettings.width*life*4;
				position.y=0;
			}else if(life<0.5){
				position.x=window.stageSettings.width;
				position.y=window.stageSettings.height*(life-0.25)/0.25;
			}else if(life<0.75){
				position.x=window.stageSettings.width-window.stageSettings.width*(life-0.5)/0.25; 
				position.y=window.stageSettings.height;
			}else{
				position.x=0;
				position.y=window.stageSettings.height-window.stageSettings.height*(life-0.75)/0.25;
			}
			
			return position;
		};
		
		updateTriangle = function(triangle){
			triangle.p1.position=getPointPosition(triangle.p1.lifeB1);
			triangle.p2.position=getPointPosition(triangle.p2.lifeB1);
		};
		
		drawLines=function(){
			
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
				if(higherTrianglePoint.position.x==window.stageSettings.width){
					currentTriangle.cornerPoint1=getPointPosition(0.25);
				}
			}else if(lowerTrianglePoint.position.x==window.stageSettings.width){
				if(higherTrianglePoint.position.y==window.stageSettings.height){
					currentTriangle.cornerPoint1=getPointPosition(0.5);
				}
			}else if(lowerTrianglePoint.position.y==window.stageSettings.height){
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
		
		animateTriangles = function(){
			var p1Duration, p2Duration;
			
			currentTriangle=trianglesRep[0];
			
			currentTriangle.p1.targetedLife=currentTriangle.p1.life+settings.pointsLifeRandomAnimationAdded+Math.random()*settings.pointsLifeRandomAnimationRandomAdded;
			currentTriangle.p2.targetedLife=currentTriangle.p1.targetedLife+0.25;
			
			p1Duration=settings.pointsAnimationDurationMin+Math.random()*settings.pointsAnimationDurationRandom;
			p2Duration=settings.pointsAnimationDurationMin+Math.random()*settings.pointsAnimationDurationRandom;
			
			TweenMax.to(currentTriangle.p1, p1Duration, { life:currentTriangle.p1.targetedLife, ease:settings.pointsAnimationEase, onUpdate:pointLifeUpdateListener});
			TweenMax.to(currentTriangle.p2, p2Duration, { life:currentTriangle.p2.targetedLife, ease:settings.pointsAnimationEase, onUpdate:pointLifeUpdateListener, delay:p1Duration});
			
			setTimeout(animateTriangles, (p1Duration+p2Duration)*settings.pointsAnimationTimeoutDurationRatioToTotal*1000);
		};
		
		pointLifeUpdateListener = function(){
			this.target.lifeB1=this.target.life%1;
		};
		
		changeStyle = function(){
			if(currentStyle.fillColor==0x000000){
				currentStyle.fillColor=0xffffff;
				currentStyle.lineColor=0x000000;
			}else{
				currentStyle.fillColor=0x000000;
				currentStyle.lineColor=0xffffff;
			}
			
			launchClickGraphics();
		};
		
		filterDMTimeoutListener = function(){
			filterDMTimeout=setTimeout(filterDMTimeoutListener, settings.filterDMTimeoutDurationMinDuration+Math.random()*(settings.filterDMTimeoutDurationMaxDuration-settings.filterDMTimeoutDurationMinDuration));
			
			TweenMax.to(dmapsRep[currentDmapID].filter.scale, settings.filterDMTimeoutDuration, {x:settings.dmapsParamaters[currentDmapID].maxFilterScale, y:settings.dmapsParamaters[currentDmapID].maxFilterScale, ease:settings.filterDMTimeoutEase, onUpdate:filterDMTimeoutListenerUpdateListener, onComplete:filterDMTimeoutListenerCompleteListener}).yoyo(true).repeat(1);
		};
		filterDMTimeoutListenerUpdateListener = function(){
			dmapsRep[currentDmapID].filter.scale.x=(window.windowSize.width<settings.mobileBreakPointForDMScale) ? Math.random()*settings.dmapsParamaters[currentDmapID].maxFilterScale*settings.mobileDMScaleRatio : Math.random()*settings.dmapsParamaters[currentDmapID].maxFilterScale;
			dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x*window.stageSettings.width/window.stageSettings.height;
			
		};
		filterDMTimeoutListenerCompleteListener = function(){
			dmapsRep[currentDmapID].filter.scale.x=(window.windowSize.width<settings.mobileBreakPointForDMScale) ? settings.dmapsParamaters[currentDmapID].minFilterScale*settings.mobileDMScaleRatio : settings.dmapsParamaters[currentDmapID].minFilterScale;
			dmapsRep[currentDmapID].filter.scale.y=dmapsRep[currentDmapID].filter.scale.x*window.stageSettings.width/window.stageSettings.height;
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
		
		
		
		stageContainer.addEventListener("mousedown", mouseDownListener);
		stageContainer.addEventListener("touchstart", mouseDownListener);
		
		stageContainer.addEventListener("mouseup", mouseUpListener);
		stageContainer.addEventListener("touchend", mouseUpListener);
		
		resizeListener();
		window.addEventListener('resize', resizeListener);
		
		setScene();
		
		window.addEventListener("mousemove", mouseMoveListener);
		*/
		
		
		
		