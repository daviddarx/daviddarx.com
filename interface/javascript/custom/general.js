 import "babel-polyfill";


	var hasClass, addClass, removeClass, loadJS ,paginationClickListener, logoClickListener, stageJSLoadCompleteListener, stageResizer,  
	pagination, paginationItems, stage, stageContainer, logo, logoImg, logoLink, 
	i, scriptTag, breakPointsDefinitions, hashArray, loadAnimationDuration, scriptsRep, loadedScriptNumber;
			

	scriptsRep = Array(
		Array(
			"./bw_stage_01.js",
			"animation-01"
		), 
		Array(
			"./bw_stage_02.js",
			"animation-02"
		), 
		Array(
			"./bw_stage_03.js",
			"animation-03"
		)
	);

	breakPointsDefinitions = Array(
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

	/*loadJS = function(url, implementationCode, location){
		scriptTag = document.createElement('script');
		scriptTag.src = url;
		scriptTag.onload = implementationCode;
	    location.appendChild(scriptTag);
	};*/

	/*stageJSLoadCompleteListener = function(){
		if(loadedScriptNumber<scriptsRep[window.currentStageID-1].length-1){
			loadJS(scriptsRep[window.currentStageID-1][loadedScriptNumber], stageJSLoadCompleteListener, document.body);
			loadedScriptNumber++;
		}
	};*/

	stageResizer = function(){
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

	paginationClickListener = function(){
		window.location.hash=this.getAttribute("href").split("#")[1];
		removeClass(stage,"loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;		
	};	

	logoClickListener = function(){
		window.location.hash=(window.currentStageID<scriptsRep.length)?window.currentStageID+1:1;
		removeClass(stage, "loaded");
		setTimeout(function(){
			location.reload();
		}, loadAnimationDuration);
		return false;
	};

	hashArray = window.location.hash.split("#");
	window.currentStageID = (hashArray.length>1) ? parseInt(hashArray[1]) : Math.floor(Math.random()*scriptsRep.length+1);

	logo=document.getElementById("stage__logo");
	logoImg=logo.getElementsByTagName("img");
	stage=document.getElementById("stage");
	stageContainer=document.getElementById("stage__container");
	pagination=document.getElementById("pagination");
	if(scriptsRep.length>1){
		for(i=0; i<scriptsRep.length; i++){
			pagination.innerHTML+='<a href="#'+(i+1)+'" class="pagination__item">'+(i+1)+'</a>';
		}
	}
	paginationItems=document.getElementsByClassName("pagination__item");
	for(i=0; i<paginationItems.length; i++){
		paginationItems[i].addEventListener("click", paginationClickListener);
		paginationItems[i].addEventListener("touchstart", paginationClickListener);
	};
	logoLink=logo.getElementsByTagName("a");		
	loadAnimationDuration=window.getComputedStyle ? getComputedStyle(stageContainer, null) : stageContainer.currentStyle;
	loadAnimationDuration=parseInt(loadAnimationDuration.transitionDuration.split("s")[0])*1000;

	window.addEventListener('resize', stageResizer);
	stageResizer();

	addClass(stage, "loadedStart");
	if(scriptsRep.length>1){
		paginationItems[window.currentStageID-1].classList.add("active");
	}
	
	//loadJS(scriptsRep[window.currentStageID-1][0], stageJSLoadCompleteListener, document.body);
	async function loadScript(){
		console.log("./bw_stage_01.js");
		console.log(window.currentStageID);
		console.log(typeof window.currentStageID);

		if(window.currentStageID==1){
			const stageScript = import("./bw_stage_01.js").then((stageScript) => {});
		}else if(window.currentStageID==2){
			const stageScript = import("./bw_stage_02.js").then((stageScript) => {});
		}else if(window.currentStageID==3){
			const stageScript = import("./bw_stage_03.js").then((stageScript) => {});
		}

		document.body.classList.add(scriptsRep[window.currentStageID-1][1]);
	};
	loadScript();
	//import init from "./bw_stage_01.js";//scriptsRep[window.currentStageID-1][0]);
	//init();

	document.body.classList.add(scriptsRep[window.currentStageID-1][1]);
	
	
	loadedScriptNumber=1;



