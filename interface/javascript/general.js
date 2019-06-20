 import Stats from 'stats.js'
 
 let i;
 
 const animationsIDRep = new Array("animation-01", "animation-02", "animation-03");
 
 const breakPointsDefinitions = new Array(
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
	);
	
	window.windowSize = {
		width:undefined, 
		height:undefined
	};
	
	window.stageSettings = {
		posX:undefined, 
		posY:undefined,
		width:undefined, 
		height:undefined, 
	};
	
	window.logoSettings = {
		posX:undefined, 
		posY:undefined,
		width:undefined, 
		height:undefined
	};
	
	
	
	
	const hasClass = function(el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
	};
	const addClass = function(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!hasClass(el, className)) el.className += ' ' + className;
	};
	const removeClass = (el, className) => {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
	};
	
	const stageResizer = (domRefs) => {
		window.windowSize.width = (window.innerWidth || screen.width);
		window.windowSize.height = (window.innerHeight || screen.height);
		
		if(window.windowSize.width<=breakPointsDefinitions[1].width){
			
			window.stageSettings.posX = window.windowSize.width * breakPointsDefinitions[2].logoPosX + window.windowSize.width * breakPointsDefinitions[2].logoHeight*0.9 + window.windowSize.width * breakPointsDefinitions[2].stageBorderLeft;
			window.stageSettings.posY = window.windowSize.width * breakPointsDefinitions[2].stageBorderTop;
			window.stageSettings.width = window.windowSize.width - window.stageSettings.posX - window.windowSize.width*breakPointsDefinitions[2].stageBorderRight;
			window.stageSettings.height = window.windowSize.height - window.windowSize.width*breakPointsDefinitions[2].stageBorderTop - window.windowSize.width*breakPointsDefinitions[2].stageBorderBottom;
			
			window.logoSettings.posX = window.windowSize.width * breakPointsDefinitions[2].logoPosX; 
			window.logoSettings.posY = window.windowSize.width * breakPointsDefinitions[2].logoPosY; 
			window.logoSettings.height = window.windowSize.width * breakPointsDefinitions[2].logoHeight; 	
			
		}else if(window.windowSize.width<=breakPointsDefinitions[0].width){
			
			window.stageSettings.posX = window.windowSize.width * breakPointsDefinitions[1].logoPosX + window.windowSize.width * breakPointsDefinitions[1].logoHeight*0.9 + window.windowSize.width * breakPointsDefinitions[1].stageBorderLeft;
			window.stageSettings.posY = window.windowSize.width * breakPointsDefinitions[1].stageBorderTop;
			window.stageSettings.width = window.windowSize.width - window.stageSettings.posX - window.windowSize.width*breakPointsDefinitions[1].stageBorderRight;
			window.stageSettings.height = window.windowSize.height - window.windowSize.width*breakPointsDefinitions[1].stageBorderTop - window.windowSize.width*breakPointsDefinitions[1].stageBorderBottom;
			
			window.logoSettings.posX = window.windowSize.width * breakPointsDefinitions[1].logoPosX; 
			window.logoSettings.posY = window.windowSize.width * breakPointsDefinitions[1].logoPosY; 
			window.logoSettings.height = window.windowSize.width * breakPointsDefinitions[1].logoHeight; 	
			
		}else{
			
			window.stageSettings.posX = window.windowSize.width * breakPointsDefinitions[0].logoPosX + window.windowSize.width * breakPointsDefinitions[0].logoHeight*0.9 + window.windowSize.width * breakPointsDefinitions[0].stageBorderLeft;
			window.stageSettings.posY = window.windowSize.width * breakPointsDefinitions[0].stageBorderTop;
			window.stageSettings.width = window.windowSize.width - window.stageSettings.posX - window.windowSize.width*breakPointsDefinitions[0].stageBorderRight;
			window.stageSettings.height = window.windowSize.height - window.windowSize.width*breakPointsDefinitions[0].stageBorderTop - window.windowSize.width*breakPointsDefinitions[0].stageBorderBottom;
			
			window.logoSettings.posX = window.windowSize.width * breakPointsDefinitions[0].logoPosX; 
			window.logoSettings.posY = window.windowSize.width * breakPointsDefinitions[0].logoPosY; 
			window.logoSettings.height = window.windowSize.width * breakPointsDefinitions[0].logoHeight; 
		}
		domRefs.$logo.style.left=window.logoSettings.posX+"px";
		domRefs.$logo.style.top=window.logoSettings.posY+"px";
		
		domRefs.$logoImg[0].style.height=window.logoSettings.height+"px";
		domRefs.$logoImg[1].style.height=window.logoSettings.height+"px";
		
		window.stageSettings.width=Math.round(window.stageSettings.width);
		window.stageSettings.height=Math.round(window.stageSettings.height);
		
		domRefs.$stageContainer.style.left=window.stageSettings.posX+"px";
		domRefs.$stageContainer.style.top=window.stageSettings.posY+"px";
		domRefs.$stageContainer.style.width=window.stageSettings.width+"px";
		domRefs.$stageContainer.style.height=window.stageSettings.height+"px";
		
		domRefs.$pagination.style.right=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";
		
		for(i=0; i<domRefs.$paginationItems.length; i++){
			domRefs.$paginationItems[i].style.width=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";
			domRefs.$paginationItems[i].style.height=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";
		};
	};
	
	const paginationClickListener = function(domRefs, loadAnimationDuration){
		window.location.hash=this.getAttribute("href").split("#")[1];
		removeClass(domRefs.$stage,"loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;		
	};	
	
	const logoClickListener = function(domRefs, loadAnimationDuration){
		window.location.hash=(window.currentStageID<animationsIDRep.length)?window.currentStageID+1:1;
		removeClass(domRefs.$stage, "loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;
	};
	
	
	const stats=new Stats();
	document.body.appendChild(stats.dom);
	requestAnimationFrame(function loop(){
		stats.update();
		requestAnimationFrame(loop)
	}
	);
	
	const init = function(){
		const hashArray = window.location.hash.split("#");
		window.currentStageID = (hashArray.length>1) ? parseInt(hashArray[1]) : Math.floor(Math.random()*animationsIDRep.length+1);
		
		const $logo = document.querySelector("#stage__logo");

		const domRefs = {
			$logo,
			$logoImg: Array.from($logo.getElementsByTagName("img")),
			$stage: document.querySelector("#stage"),
			$stageContainer: document.querySelector("#stage__container"),
			$pagination: document.querySelector("#pagination"),
			$paginationItems: document.getElementsByClassName("pagination__item"), 
			$logoLink: $logo.getElementsByTagName("a")
		}

		if(animationsIDRep.length>1){
			for(i=0; i<animationsIDRep.length; i++){
				domRefs.$pagination.innerHTML+='<a href="#'+(i+1)+'" class="pagination__item">'+(i+1)+'</a>';
			}
		} 
		for(i=0; i<domRefs.$paginationItems.length; i++){
			domRefs.$paginationItems[i].addEventListener("click", () => paginationClickListener(domRefs, loadAnimationDuration) );
			domRefs.$paginationItems[i].addEventListener("touchstart", () => paginationClickListener(domRefs, loadAnimationDuration));
		};
		let loadAnimationDuration=window.getComputedStyle ? getComputedStyle(domRefs.$stageContainer, null) : domRefs.$stageContainer.currentStyle;
		loadAnimationDuration=parseInt(loadAnimationDuration.transitionDuration.split("s")[0])*1000;
		
		window.addEventListener('resize', () => stageResizer(domRefs) );
		stageResizer(domRefs);
		
		addClass(domRefs.$stage, "loadedStart");
		
		if(animationsIDRep.length>1){
			domRefs.$paginationItems[window.currentStageID-1].classList.add("active");
		}
		
		document.body.classList.add(animationsIDRep[window.currentStageID-1]);

		return domRefs;
	};

	export default init;
	
	
	
	
	