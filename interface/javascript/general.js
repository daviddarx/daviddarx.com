/*
 
- faire backup de version actuellement sur daviddarx pour comparer perfs
-- check sur daviddar.com si le landing sur index.html fonctionne. 
-- check dist sur daviddarx si probleme de load listener des images pour scene1, commne sur netlify


- mettre le tout sur netlify? check probleme la bas des loading listener
-- changer DNS -> rediriger daviddar.com (a-record)
-- ensuite faire branch developpement. 

*/

import './add_stats.js';

const globalSettings = {
	urlBase : 'stage-', 
	animationsIDs : ['animation-01', 'animation-02', 'animation-03'], 
	breakPointsDefinitions : [
		{
			width:1440, 
			stageBorderLeft:0.05, 
			stageBorderRight:0.05, 
			stageBorderTop:0.05, 
			stageBorderBottom:0.05, 
			logoPosX:0.05, 
			logoPosY:0.05, 
			logoHeight:0.02
		}, 
		{
			width:768, 
			stageBorderLeft:0.05, 
			stageBorderRight:0.05, 
			stageBorderTop:0.05, 
			stageBorderBottom:0.05, 
			logoPosX:0.05, 
			logoPosY:0.05, 
			logoHeight:0.03
		}, 
		{
			width:0, 
			stageBorderLeft:0.06, 
			stageBorderRight:0.06, 
			stageBorderTop:0.06, 
			stageBorderBottom:0.06, 
			logoPosX:0.06, 
			logoPosY:0.06, 
			logoHeight:0.07
		}
	]
};



const Global = function(){
	
	this.url = undefined;
	this.stageID = undefined;
	
	this.domRefs = { };
	
	this.stageAnimationOutDuration = undefined;
	
	this.windowSize = {
		width:undefined, 
		height:undefined
	};
	this.stageSettings = {
		posX:undefined, 
		posY:undefined,
		width:undefined, 
		height:undefined
	};
	this.logoSettings = {
		posX:undefined, 
		posY:undefined,
		width:undefined, 
		height:undefined
	};

	this.externalResizeListener = undefined;
	
	this.init = () => {
		this.url = window.location.pathname;
		this.stageID = parseInt(this.url.substring(this.url.lastIndexOf('/')+1).split('.html')[0].split(globalSettings.urlBase)[1]);
		
		this.domRefs.$logo = document.querySelector('.stage__logo');
		this.domRefs.$logo.addEventListener('click', (e) => this.logoClickListener(e));
		this.domRefs.$logo.addEventListener('touchstart', (e) => this.logoClickListener(e));
		this.domRefs.$logoImg = Array.prototype.slice.call(this.domRefs.$logo.querySelectorAll('img'));
		this.domRefs.$logoLink = this.domRefs.$logo.getElementsByTagName('a');
		
		this.domRefs.$stage = document.querySelector('.stage');
		this.domRefs.$stageContainer = document.querySelector('.stage__container');
		
		this.domRefs.$pagination = document.querySelector('.pagination');
		
		for(let i=0; i<globalSettings.animationsIDs.length; i++){
			const zero = (i<9) ? '0' : ''; 
			const $paginationLink = document.createElement('a');
			$paginationLink.setAttribute('class', 'pagination__item');
			$paginationLink.setAttribute('href', globalSettings.urlBase + zero + (i+1) + '.html');
			$paginationLink.innerHTML += zero + (i+1);
			this.domRefs.$pagination.appendChild($paginationLink);
		}
		
		this.domRefs.$paginationItems = Array.prototype.slice.call(this.domRefs.$pagination.querySelectorAll('a')); 
		this.domRefs.$paginationItems.forEach( (el) => {
			el.addEventListener('click', (e) => this.paginationClickListener(e));
			el.addEventListener('touchstart', (e) => this.paginationClickListener(e));
		});
		this.domRefs.$paginationItems[this.stageID-1].classList.add('active');
		
		this.stageAnimationOutDuration = window.getComputedStyle ? getComputedStyle(this.domRefs.$stageContainer, null) : this.domRefs.$stageContainer.currentStyle;
		this.stageAnimationOutDuration = parseFloat(this.stageAnimationOutDuration.transitionDuration.split('s')[0])*1000;
		window.addEventListener('resize', this.resizeListener);
		this.resizeListener();
		
		this.domRefs.$stage.classList.add('loadedStart');
		
		document.body.classList.add(globalSettings.animationsIDs[this.stageID-1]);
	};
	
	this.paginationClickListener = (e) => {
		this.domRefs.$stage.classList.remove('loaded');
		
		setTimeout(() => {
			window.location.href = e.target.getAttribute('href');
		}, this.stageAnimationOutDuration);
		
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	
	this.logoClickListener = (e) => {
		this.domRefs.$stage.classList.remove('loaded');
		
		setTimeout(() => {	
			window.location.href = this.domRefs.$paginationItems[(this.stageID < globalSettings.animationsIDs.length) ? this.stageID + 1 -1 : 0].getAttribute('href');
			
		}, this.stageAnimationOutDuration);
		
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	
	this.resizeListener = () => {
		this.windowSize.width = (window.innerWidth || screen.width);
		this.windowSize.height = (window.innerHeight || screen.height);
		
		if(this.windowSize.width<=globalSettings.breakPointsDefinitions[1].width){
			
			this.stageSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[2].logoPosX + this.windowSize.width * globalSettings.breakPointsDefinitions[2].logoHeight*0.9 + this.windowSize.width * globalSettings.breakPointsDefinitions[2].stageBorderLeft;
			this.stageSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[2].stageBorderTop;
			this.stageSettings.width = this.windowSize.width - this.stageSettings.posX - this.windowSize.width*globalSettings.breakPointsDefinitions[2].stageBorderRight;
			this.stageSettings.height = this.windowSize.height - this.windowSize.width*globalSettings.breakPointsDefinitions[2].stageBorderTop - this.windowSize.width*globalSettings.breakPointsDefinitions[2].stageBorderBottom;
			
			this.logoSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[2].logoPosX; 
			this.logoSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[2].logoPosY; 
			this.logoSettings.height = this.windowSize.width * globalSettings.breakPointsDefinitions[2].logoHeight; 	
			
		}else if(this.windowSize.width<=globalSettings.breakPointsDefinitions[0].width){
			
			this.stageSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[1].logoPosX + this.windowSize.width * globalSettings.breakPointsDefinitions[1].logoHeight*0.9 + this.windowSize.width * globalSettings.breakPointsDefinitions[1].stageBorderLeft;
			this.stageSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[1].stageBorderTop;
			this.stageSettings.width = this.windowSize.width - this.stageSettings.posX - this.windowSize.width*globalSettings.breakPointsDefinitions[1].stageBorderRight;
			this.stageSettings.height = this.windowSize.height - this.windowSize.width*globalSettings.breakPointsDefinitions[1].stageBorderTop - this.windowSize.width*globalSettings.breakPointsDefinitions[1].stageBorderBottom;
			
			this.logoSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[1].logoPosX; 
			this.logoSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[1].logoPosY; 
			this.logoSettings.height = this.windowSize.width * globalSettings.breakPointsDefinitions[1].logoHeight; 	
			
		}else{
			
			this.stageSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[0].logoPosX + this.windowSize.width * globalSettings.breakPointsDefinitions[0].logoHeight*0.9 + this.windowSize.width * globalSettings.breakPointsDefinitions[0].stageBorderLeft;
			this.stageSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[0].stageBorderTop;
			this.stageSettings.width = this.windowSize.width - this.stageSettings.posX - this.windowSize.width*globalSettings.breakPointsDefinitions[0].stageBorderRight;
			this.stageSettings.height = this.windowSize.height - this.windowSize.width*globalSettings.breakPointsDefinitions[0].stageBorderTop - this.windowSize.width*globalSettings.breakPointsDefinitions[0].stageBorderBottom;
			
			this.logoSettings.posX = this.windowSize.width * globalSettings.breakPointsDefinitions[0].logoPosX; 
			this.logoSettings.posY = this.windowSize.width * globalSettings.breakPointsDefinitions[0].logoPosY; 
			this.logoSettings.height = this.windowSize.width * globalSettings.breakPointsDefinitions[0].logoHeight; 
		}
		
		this.domRefs.$logo.style.left=this.logoSettings.posX+'px';
		this.domRefs.$logo.style.top=this.logoSettings.posY+'px';
		
		this.domRefs.$logoImg[0].style.height=this.logoSettings.height+'px';
		this.domRefs.$logoImg[1].style.height=this.logoSettings.height+'px';
		
		this.stageSettings.width=Math.round(this.stageSettings.width);
		this.stageSettings.height=Math.round(this.stageSettings.height);
		
		this.domRefs.$stageContainer.style.left=this.stageSettings.posX+'px';
		this.domRefs.$stageContainer.style.top=this.stageSettings.posY+'px';
		this.domRefs.$stageContainer.style.width=this.stageSettings.width+'px';
		this.domRefs.$stageContainer.style.height=this.stageSettings.height+'px';
		
		this.domRefs.$pagination.style.right=(this.windowSize.width - this.stageSettings.posX - this.stageSettings.width)+'px';
		
		this.domRefs.$paginationItems.forEach((el) => {
			el.style.width=(this.windowSize.width - this.stageSettings.posX - this.stageSettings.width)+'px';
			el.style.height=(this.windowSize.width - this.stageSettings.posX - this.stageSettings.width)+'px';
		});

		if(this.externalResizeListener != undefined){
			this.externalResizeListener();
		}
	};
	
	this.setStageAsLoaded = () => {
		this.domRefs.$stage.classList.add('loaded');
	};
	
	
	this.radians = (degrees) => {
		return degrees * Math.PI / 180;
	};
	this.degrees = (radians) => {
		return radians * 180 / Math.PI;
	};
};

export default Global;




