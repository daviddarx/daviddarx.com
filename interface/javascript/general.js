 import "babel-polyfill";
 import Stats from 'stats.js'

	let i;


	const animationsIDRep = Array("animation-01", "animation-02", "animation-03");

	const breakPointsDefinitions = Array(
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
	const removeClass = function(el, className) {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
	};

	const stageResizer = function(){
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
		logo.style.left=window.logoSettings.posX+"px";
		logo.style.top=window.logoSettings.posY+"px";

		logoImg[0].style.height=window.logoSettings.height+"px";
		logoImg[1].style.height=window.logoSettings.height+"px";

		window.stageSettings.width=Math.round(window.stageSettings.width);
		window.stageSettings.height=Math.round(window.stageSettings.height);

		stageContainer.style.left=window.stageSettings.posX+"px";
		stageContainer.style.top=window.stageSettings.posY+"px";
		stageContainer.style.width=window.stageSettings.width+"px";
		stageContainer.style.height=window.stageSettings.height+"px";

		pagination.style.right=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";

		for(i=0; i<paginationItems.length; i++){
			paginationItems[i].style.width=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";
			paginationItems[i].style.height=(window.windowSize.width - window.stageSettings.posX - window.stageSettings.width)+"px";
		};
	};

	const paginationClickListener = function(){
		window.location.hash=this.getAttribute("href").split("#")[1];
		removeClass(stage,"loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;		
	};	

	const logoClickListener = function(){
		window.location.hash=(window.currentStageID<animationsIDRep.length)?window.currentStageID+1:1;
		removeClass(stage, "loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;
	};

	const hashArray = window.location.hash.split("#");
	window.currentStageID = (hashArray.length>1) ? parseInt(hashArray[1]) : Math.floor(Math.random()*animationsIDRep.length+1);

	const logo=document.getElementById("stage__logo");
	const logoImg=logo.getElementsByTagName("img");
	const stage=document.getElementById("stage");
	const stageContainer=document.getElementById("stage__container");
	const pagination=document.getElementById("pagination");
	if(animationsIDRep.length>1){
		for(i=0; i<animationsIDRep.length; i++){
			pagination.innerHTML+='<a href="#'+(i+1)+'" class="pagination__item">'+(i+1)+'</a>';
		}
	}
	const paginationItems=document.getElementsByClassName("pagination__item");
	for(i=0; i<paginationItems.length; i++){
		paginationItems[i].addEventListener("click", paginationClickListener);
		paginationItems[i].addEventListener("touchstart", paginationClickListener);
	};
	const logoLink=logo.getElementsByTagName("a");		
	let loadAnimationDuration=window.getComputedStyle ? getComputedStyle(stageContainer, null) : stageContainer.currentStyle;
	loadAnimationDuration=parseInt(loadAnimationDuration.transitionDuration.split("s")[0])*1000;

	window.addEventListener('resize', stageResizer);
	stageResizer();

	addClass(stage, "loadedStart");
	
	if(animationsIDRep.length>1){
		paginationItems[window.currentStageID-1].classList.add("active");
	}
	async function loadScript(){
		if(window.currentStageID==1){
			const stageScript = import("./bw_stage_01.js").then((stageScript) => {});
		}else if(window.currentStageID==2){
			const stageScript = import("./bw_stage_02.js").then((stageScript) => {});
		}else if(window.currentStageID==3){
			const stageScript = import("./bw_stage_03.js").then((stageScript) => {});
		}
	};
	loadScript();

	document.body.classList.add(animationsIDRep[window.currentStageID-1]);

	const stats=new Stats();
	document.body.appendChild(stats.dom);
	requestAnimationFrame(function loop(){
		stats.update();
		requestAnimationFrame(loop)
		}
	);



