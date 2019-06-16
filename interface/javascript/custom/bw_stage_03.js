
/*

	- utiliser le tutos mouse move avec simple noise pour l'anime 01? 
		- https://css-tricks.com/simulating-mouse-movement/
	- anime 01: 
		- update pixisjs v5 https://medium.com/goodboy-digital/pixijs-v5-lands-5e112d84e510
		- check perfs, si ca joue
		- change image de l'horloge trop blanche au milieu
		- diminuer le temps de changement entre deux images 
		

	
		
	- faire impression 2 ou 3 plexis glass, avec differentes fonts et wireframes. que noir? 





	- fixer css audiobutton negative et playing
	- check que bouton son redevienne bonne icon apres fin de la chanson et relancement automatique

	- finetunings: 		
		- augementer lettersRotationXRatioToCameraPosY dans settings? ca a avoir avec la diffence de position y de la camera pour suivre ll'inclinaison x des lettres

		- augmenter un peu la taille des particules
		- check performances sur autres computers. 
		- optimiser: 
			- resolution des lettres, taille des lettres, nombre max de lettres et meshs, usw. 

		- fine tuning durée text auto 
		- augementer le textAutoLaunchTimeoutFirstCallDuration




	- fonts
		- faire choix defintive, et reoslutions/size definitives
		- ajouter la new york de apple? Dans fonts a la racine
		- remttre fonts random à la fin, car apparemment leur taille diffrentes influence sur la place que prends le tout. 
			- dynamiser la taille, en plus des segments? 

	- texture:
		- finaliser 
		- ajouter du bruit dans la texture: lignes blanches dans ombres, etc -> mais garder les contrastes zonées, juste pour ajouter de la "resolution"
		- faire images finales en png  a cause de compression, comme david a
	
		- retina pour mobile? 

		- retrait des images en trop à la fin. 
		- jshint, tous les js de nouveau
		- tester sur ie pour voir sans jquery? 
		- envoyer à codrops et newsletter animation? 
	
 */

 import { TweenMax } from "gsap";
 import * as THREE from 'three'; 
 import SimplexNoise from "simplex-noise";

 console.log(SimplexNoise);

export default (async function () { 

	var stage, stageContainer, audioButton, audioElement, 
	settings, settingsThree, i, il, devicePixelRatioCustom, 
	settingsThree, ThreeJS, threeJSObject, CameraControler, cameraControlerObject, scene, camera, renderer, createBasicShapes,  
	mousePos, mousePosInStage, mouseDistToCenterX, mouseDistToCenterY, currentLetterPos, fontID, isAudioPlaying, currentAudioWordID, audioElementTimeUpdateInterval, currentLetterPosTargetForCamera, resizeListener, renderStage, test, 
	hasClass, addClass, removeClass, setScene, mouseDownListener, mouseUpListener, keyPressListener, audioButtonMouseDownListener, audioElementTimeUpdateListener, audioElementEndListener;

	devicePixelRatioCustom = (window.devicePixelRatio!=1 && window.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

	settings={
		fontsURLs:[
			{
				font:"s3_fonts/google/Playfair_Display_Bold.json",
				segments:4
			},/* 
			{
				font:"s3_fonts/google/Noto_Serif_Regular.json",
				segments:2
			},
			{
				font:"s3_fonts/google/Aclonica_Regular.json",
				segments:2
			},
			{
				font:"s3_fonts/Regular-Web.json",
				segments:2
			}, 
			{
				font:"s3_fonts/BluuNext-Bold.json",
				segments:5
			}*/
		],
		envMapImagesPath:"s3_cube_texture/_10/", 
		envMapImagesNames:[ 'px.png', 'py.png', 'pz.png', 'nx.png', 'py.png', 'nz.png' ],
		//envMapImagesNames:[ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ], 
		//envMapImagesNames:[ 'px.png', 'py.png', 'pz.png', 'nx.png', 'ny.png', 'nz.png' ],  
	
		lettersGeomSettings:{
			font: undefined,
			size: 120,
			height: 50, //10+Math.random()*20,
			curveSegments: 10,
			bevelEnabled: true,
			bevelThickness: 3, //largeur z
			bevelSize: 1, //largeur x y
			bevelOffset: 0, //boldines
			bevelSegments: 1
		},

		textsSettings:{
			availableCaracters:[".", ", ", "?", "!", "'", ";", "-", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "é", "è", "ê", "à", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			poemNormalText:"Il faut être toujours ivre, tout est là ; c'est l'unique question. Pour ne pas sentir l'horrible fardeau du temps qui brise vos épaules et vous penche vers la terre, il faut vous enivrer sans trêve. Mais de quoi? De vin, de poésie, ou de vertu à votre guise, mais enivrez-vous! Et si quelquefois, sur les marches d'un palais, sur l'herbe verte d'un fossé, vous vous réveillez, l'ivresse déjà diminuée ou disparue, demandez au vent, à la vague, à l'étoile, à l'oiseau, à l'horloge; à tout ce qui fuit, à tout ce qui gémit, à tout ce qui roule, à tout ce qui chante, à tout ce qui parle, demandez quelle heure il est. Et le vent, la vague, l'étoile, l'oiseau, l'horloge, vous répondront, il est l'heure de s'enivrer ; pour ne pas être les esclaves martyrisés du temps, enivrez-vous, enivrez-vous sans cesse de vin, de poésie, de vertu, à votre guise.", 
			poemAudioText:[
				["Il ", 0.01], 
				["faut ", 0.1], 
				["être ", 0.3], 
				["toujours ", 0.6], 
				["ivre, ", 1.0], 
				["tout ", 2.8], 
				["est ", 3.0], 
				["là ; ", 3.2], 
				["c'est ", 4.3], 
				["l'unique ", 4.6], 
				["question. ", 4.9], 
				["Pour ", 7.1],
				["ne ", 7.2],
				["pas ", 7.3],
				["sentir ", 7.4],
				["l'horrible ", 7.9],
				["fardeau ", 8.4],
				["du ", 8.7],
				["temps ", 8.9],
				["qui ", 8.8],
				["brise ", 9.3],
				["vos ", 9.5],
				["épaules ", 9.7],
				["et ", 9.9], 
				["vous ", 10.0], 
				["penche ", 10.2], 
				["vers ", 10.4], 
				["la ", 10.6], 
				["terre ", 10.9],
				["il  ", 12.4],
				["faut ", 12.7],
				["vous ", 12.9],
				["enivrer ", 13.1],
				["sans ", 13.4],
				["trêve. ", 13.7],
				["Mais ", 14.8],
				["de ", 15],
				["quoi ? ", 15.2],
				["De ", 16.8],
				["vin, ", 17.0],
				["de ", 18.3],
				["poésie, ", 18.5],
				["ou ", 20.6],
				["de ", 20.7],
				["vertue ", 20.8],
				["à ", 22.2],
				["votre ", 22.3],
				["guise. ", 22.5],
				["Et ", 24.3],
				["si ", 24.5],
				["quelquefois, ", 24.6],
				["sur ", 24.9],
				["les ", 25.0],
				["marches ", 25.1],
				["d'un ", 25.3],
				["palais, ", 25.5],
				["sur ", 25.7],
				["l'herbe ", 25.9],
				["verte ", 26.5],
				["d'un ", 26.7],
				["fossé, ", 26.8],
				["dans ", 27.7],
				["la ", 27.9],
				["solitude ", 28.1],
				["morne ", 28.5],
				["de ", 28.9],
				["votre ", 29.1],
				["chambre ", 29.2],
				
				["la ", 1000],
			], 
			poemAudioStartTime:0
		}, 

		maxLetterNumber:100, //60
		maxSpiraleBoxesNumber:100, //60
		destroyMeshesIntervalDuration:20000,

		lettersInitRotationMax:90, 
		lettersEndRotationMax:20, 
		lettersDecalYRatioToPrevious:0.25,
		
		lettersScaleNoiseInitValue:0.001, 
		lettersScaleNoiseIncrement:0.1, 
		lettersScaleNoiseMax:0.99, 
		lettersScaleNoiseMaxAudio:0.2, 

		lettersRotationXNoiseInitValue:0.01, 
		lettersRotationXNoiseIncrement:0.1, 
		lettersRotationXNoiseMaxAngle:90, 
		lettersRotationXNoiseMaxAngleAudio:0.0001, 
		lettersRotationXRatioToCameraPosY:200, //50, //200 pour suivre inclinaison des lettres
		
		letterSpaceDistanceRatioToTextSize:0.6, 
		letterApostrophePosYRatioToPreviousHeight:0.75, 
		letterApostrophePosXRatioToWidth:0.25, 
		letterCommaWidthRatioToAdd:1, 
		letterCommaHeightRatioToAdd:0.5, 
		
		lettersAnimationInScaleDuration:0.5,
		lettersAnimationInScaleDurationAudio:0.15,  
		lettersAnimationInSCaleEase:Expo.easeInOut, 
		lettersAnimationInRotationDuration:1, 
		lettersAnimationInRotationDurationAudio:0.3, 
		lettersAnimationInRotationEase:Expo.easeOut, 

		spiraleStartRadius:400, 
		spiraleStartRadiusAudio:1000, 
		spiraleIncrementY:0.3, 
		spiraleRadiusNoiseInitValue:0.5, 
		spiraleRadiusNoiseIncrement:0.05, 
		spiraleRadiusNoiseMaxValueAdded:300, 

		spiraleBoxesWidth:2,
		spiraleBoxesHeight:2, 
		spiraleBoxesDepth:400,
		spiraleBoxesRadiusRatioMin:0.25,
		spiraleBoxesRadiusRatioMax:0.5, 
		spiraleBoxesPosStartRandomMax:200,
		spiraleBoxesPosStartDecalY:300, 
		spiraleBoxesScaleYNoiseAdded:10,
					
		textAutoLaunchTimeoutFirstCallDuration:2000, 
		textAutoLaunchTimeoutDurationMin:200, 
		textAutoLaunchTimeoutDurationRandomAdded:500, 
		textAutoLaunchAfterResetTimeoutDuration:5000, 

		switchMaterialWireframeTimeoutDuration:10000, 
		switchMaterialWireframeTimeoutDurationAddedRandom:5000, 
		switchMaterialWireframeDuration:2000, 
		switchMaterialWireframeDurationAddedRandom:2000, 
		switchMaterialWireframeTransitionDuration:1000, 

		switchStageBackgroundTransitionDuration:1000, 

		particlesNumber:100, 
		particlesW:20, 
		particlesH:10, 
		particlesPositionRange:1000, 

		cameraAutoMoveEaseFactor:0.02, 
		cameraAutoMoveEaseFactorAudio:0.02, 
		cameraAutoMoveLookAtEaseFactor:0.02, 
		cameraAutoMoveLookAtEaseFactorAudio:0.02, 
		cameraRadiusAddedMin:400, 
		cameraRadiusAddedMinAudio:2000, 
		cameraCenteredPosYDecal:1000,
		cameraCenteredEaseFactore:0.02, 
		cameraCenteredRotationYIncrement:0.001,
		cameraCenteredNoiseInitValue:0.001, 
		cameraCenteredNoiseIncrement:0.03, 
		cameraCenteredNoiseMaxPosYDifference:1000, 

		switchCameraTimeoutDuration:7000, //12000, a remettre et finetuner
		switchCameraTimeoutDurationAddedRandom:3000, //8000, 
		switchCameraDuration:2000, 
		switchCameraDurationAddedRandom:3000, 

		audioElementTimeUpIntervalDuration:50
	};

	settingsThree = {
		aspectRatio:1, 
		fieldOfView:60, 
		nearPlane:1, 
		farPlane:100000, 
		cameraPosX:0, 
		cameraPosY:200,
		cameraPosZ:800, 
		rendererBGColor:0x000000, //0x333333,
		rendererBGColorAlt:0xffffff, 
	};
	
	currentLetterPos = {
		x:0, 
		y:0, 
		z:settings.spiraleStartRadius
	}
	currentLetterPosTargetForCamera = {
		x:0, 
		y:0, 
		z:0
	}

	fontID = Math.floor(Math.random() * settings.fontsURLs.length); 

	isAudioPlaying=false;
	currentAudioWordID=0;

	stage=document.getElementById("stage");
	stageContainer=document.getElementById('stage__container');







	ThreeJS = function(){
		this.mesh = undefined;

		this.materials = {
			commonMaterial:undefined, 
			particlesMaterial:undefined
		};

		this.lights = {
		};

		this.textureLoader = undefined;
		this.fontLoader =undefined;

		this.perlinNoiseScale = undefined;
		this.perlinNoiseScaleAskFor = 0; 
		this.perlinNoiseRotationX = undefined;
		this.perlinNoiseRotationXAskFor = 0;
		this.perlinNoiseSpiralRadius = undefined;
		this.perlinNoiseSpiralRadiusAskFor = 0; 
		
		this.letterMeshesRep = [];
		this.letterMeshInstancesRep = [];
		this.meshesToDestroyRep = [];
		this.spiraleBoxesRep = [];

		this.previousLetterMesh = undefined;
		this.lettersCurrentRotationX = 0; 
		
		this.distanceToAddForNewLetter = undefined; 
		this.specialLetterPosYCorrection = undefined; 

		this.destroyMeshesInterval = undefined;

		this.spiraleCurrentRadius = settings.spiraleStartRadius;
		this.spiraleCurrentRadiusEased = settings.spiraleStartRadius;
		this.spiralCurrentAngle = 0; 
		this.spiralCurrentAngleEased = 0;
		this.spiraleCurrentRadiusForCamera = undefined;

		this.spiraleBoxesCurrentRadiusRatioNoiseIndic = 0;
		this.spiraleBoxesCurrentRadiusRatioNoise = 0;
		this.spiraleBoxesCurrentRadiusRatio = 0;

		this.poemNormalTextArray = undefined;
		this.poemNormalTextArrayCurrentPos = 0; 
		this.textAutoLaunchTimeout = undefined;

		this.switchMaterialWireframeTimeout = undefined;
		this.switchMaterialWireframeTweenObject = { value:0 };

		this.particlesContainer = undefined;
		this.particlesGeom = undefined;

		this.isAutoText = undefined;

		this.switchstageBackgroundTweenObject = { value:0 };

		this.lettersAnimationInScaleDurationCurrent = settings.lettersAnimationInScaleDuration;
		this.lettersAnimationInRotationDurationCurrent = settings.lettersAnimationInRotationDuration;
		this.lettersScaleNoiseMaxCurrent = settings.lettersScaleNoiseMax;
		this.lettersRotationXNoiseMaxAngleCurrent = settings.lettersRotationXNoiseMaxAngle;
		this.spiraleStartRadiusCurrent = settings.spiraleStartRadius;
		this.cameraRadiusAddedMinCurrent = settings.cameraRadiusAddedMin;
		this.cameraAutoMoveLookAtEaseFactorCurrent = settings.cameraAutoMoveLookAtEaseFactor;
	
		this.init = function(){
			this.mesh=new THREE.Object3D();

			this.perlinNoiseScale = new SimplexNoise(settings.lettersScaleNoiseInitValue);
			this.perlinNoiseRotationX = new SimplexNoise(settings.lettersRotationXNoiseInitValue);

			this.textureLoader = new THREE.CubeTextureLoader()
			.setPath(settings.envMapImagesPath)
			.load(settings.envMapImagesNames);
			this.materials.commonMaterial= new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: this.textureLoader } );
			this.materials.commonMaterial.side=THREE.FrontSide;
			this.materials.commonMaterial.isWireframe=false;
			this.materials.particlesMaterial=this.materials.commonMaterial.clone();
			this.materials.particlesMaterial.side=THREE.DoubleSide;

			settings.lettersGeomSettings.curveSegments=settings.fontsURLs[fontID].segments;
			this.fontLoader = new THREE.FontLoader();
			this.fontLoader.load( settings.fontsURLs[fontID].font, (font) => {
				this.fontLoaderCompleteListener(font);	
			});

			this.spiraleBoxGeom = new THREE.BoxGeometry( settings.spiraleBoxesWidth, settings.spiraleBoxesHeight, settings.spiraleBoxesDepth, 1, 1, 1 );

			this.updateCurrentLetterPositionOnSpirale(0);

			this.destroyMeshesInterval = setInterval(() =>{
				this.destroyMeshesIntervalListener();
			}, settings.destroyMeshesIntervalDuration);

			this.poemNormalTextArray=settings.textsSettings.poemNormalText.toLowerCase().split("");

			this.textAutoLaunchTimeout = setTimeout(() =>{
				this.launchAutoText(); 
			}, settings.textAutoLaunchTimeoutFirstCallDuration);

			this.isAutoText=true;

			this.switchMaterialWireframeTimeout = setTimeout(() =>{
				this.launchMaterialWireframeSwitch();
			}, settings.switchMaterialWireframeTimeoutDuration+Math.random()*settings.switchMaterialWireframeTimeoutDurationAddedRandom);

			this.particlesContainer = new THREE.Object3D(); 
			scene.add(this.particlesContainer);
			this.particlesGeom = new THREE.PlaneGeometry( settings.particlesW, settings.particlesH, 1, 1 );

			for(i=0; i<settings.particlesNumber; i++){
				this.particlesMeshIndic = new THREE.Mesh( this.particlesGeom, threeJSObject.materials.particlesMaterial );
				this.particlesMeshIndic.position.set(
					Math.random()*settings.particlesPositionRange*2-settings.particlesPositionRange,
					Math.random()*settings.particlesPositionRange*2-settings.particlesPositionRange,
					Math.random()*settings.particlesPositionRange*2-settings.particlesPositionRange
				);
				this.particlesMeshIndic.rotation.set(
					Math.random()*Math.PI*2, 
					Math.random()*Math.PI*2, 
					Math.random()*Math.PI*2
				);
				this.particlesContainer.add(this.particlesMeshIndic);
			};
		}	

		this.fontLoaderCompleteListener = function(font){
			settings.lettersGeomSettings.font=font;
			
			for(i=0; i<settings.textsSettings.availableCaracters.length-1; i++){
				this.createLetterGeom(settings.textsSettings.availableCaracters[i]);
			}			 
		}

		this.calculateSpiraleRadiusForCamera = function(){
			this.spiraleCurrentRadiusForCamera = this.spiraleCurrentRadius + (1- Math.abs(this.lettersCurrentRotationX / Math.radians(this.lettersRotationXNoiseMaxAngleCurrent)) )  * this.cameraRadiusAddedMinCurrent;
			cameraControlerObject.cameraTargetPos.y =  currentLetterPos.y - this.lettersCurrentRotationX*settings.lettersRotationXRatioToCameraPosY;
		}
		this.calculateSpiraleRadiusForCameraAudio = function(){
			this.spiraleCurrentRadiusForCamera = this.spiraleCurrentRadius + this.cameraRadiusAddedMinCurrent;
			cameraControlerObject.cameraTargetPos.y =  currentLetterPos.y;
		}
		this.calculateSpiraleRadiusForCameraCurrent = this.calculateSpiraleRadiusForCamera;

		this.updateCurrentLetterPositionOnSpirale = function(distance){
			this.spiralCurrentAngle -= Math.acos( (Math.pow(this.spiraleCurrentRadius, 2) + Math.pow(this.spiraleCurrentRadius, 2) - Math.pow(distance, 2)) / (2*this.spiraleCurrentRadius*this.spiraleCurrentRadius) );
			currentLetterPos.x = this.spiraleCurrentRadius * Math.cos(this.spiralCurrentAngle);
			currentLetterPos.z = this.spiraleCurrentRadius * Math.sin(this.spiralCurrentAngle);

			if(cameraControlerObject){
				this.calculateSpiraleRadiusForCameraCurrent();
				
				cameraControlerObject.cameraTargetPos.x = this.spiraleCurrentRadiusForCamera * Math.cos(this.spiralCurrentAngle);
				cameraControlerObject.cameraTargetPos.z = this.spiraleCurrentRadiusForCamera * Math.sin(this.spiralCurrentAngle);		
			}
		}

		this.createLetterGeom = function(letterString){
			var geometry = new THREE.TextGeometry(letterString, settings.lettersGeomSettings);
				geometry.computeBoundingBox();
				geometry.center();
			var mesh = new THREE.Mesh(geometry, this.materials.commonMaterial);
			this.letterMeshesRep[letterString.charCodeAt(0)]=mesh;
			return mesh;
		}

		this.addLetter = function(keyCode){
			this.previousLetterMesh=this.letterMeshInstancesRep[this.letterMeshInstancesRep.length-1];
			this.specialLetterPosYCorrection=0;

			this.spiraleCurrentRadius = this.spiraleStartRadiusCurrent + this.perlinNoiseScale.noise2D(this.perlinNoiseSpiralRadiusAskFor, 0) * settings.spiraleRadiusNoiseMaxValueAdded; 
			this.perlinNoiseSpiralRadiusAskFor+=settings.spiraleRadiusNoiseIncrement;

			if(keyCode!=" ".charCodeAt(0)){
				var mesh=this.letterMeshesRep[keyCode].clone();

					mesh.scale.set(0.01, 0.01, 0.01);
					mesh.currentScale = 1 + this.perlinNoiseScale.noise2D(this.perlinNoiseScaleAskFor, 0) * this.lettersScaleNoiseMaxCurrent; 
					this.perlinNoiseScaleAskFor+=settings.lettersScaleNoiseIncrement;

					mesh.rotation.set(
						Math.radians(Math.random()*settings.lettersInitRotationMax), 
						Math.radians(Math.random()*settings.lettersInitRotationMax),
						Math.radians(Math.random()*settings.lettersInitRotationMax)
					);
					mesh.rotation.order = "YXZ";
					mesh.currentRotationX = this.lettersCurrentRotationX = Math.radians( this.perlinNoiseRotationX.noise2D(this.perlinNoiseRotationXAskFor, 0) * this.lettersRotationXNoiseMaxAngleCurrent );
					this.perlinNoiseRotationXAskFor+=settings.lettersRotationXNoiseIncrement;
				 	
				if(this.letterMeshInstancesRep.length!=0){
					this.distanceToAddForNewLetter = mesh.geometry.boundingBox.max.x*mesh.currentScale + this.previousLetterMesh.geometry.boundingBox.max.x*this.previousLetterMesh.currentScale;
					
					currentLetterPos.y += mesh.geometry.boundingBox.max.y*mesh.currentScale * settings.lettersDecalYRatioToPrevious;
					
					if(this.previousLetterMesh.isApostrophe==true){
						this.distanceToAddForNewLetter += mesh.geometry.boundingBox.max.x*mesh.currentScale * settings.letterApostrophePosXRatioToWidth;
					}

					if(keyCode=="'".charCodeAt(0)){
						this.specialLetterPosYCorrection = this.previousLetterMesh.geometry.boundingBox.max.y*this.previousLetterMesh.currentScale * settings.letterApostrophePosYRatioToPreviousHeight;
						mesh.isApostrophe=true;
					}else if(keyCode==",".charCodeAt(0) || keyCode==".".charCodeAt(0)){
						this.specialLetterPosYCorrection =  - this.previousLetterMesh.geometry.boundingBox.max.y*this.previousLetterMesh.currentScale*0.5 - mesh.geometry.boundingBox.max.y*mesh.currentScale*settings.letterCommaHeightRatioToAdd;
						this.distanceToAddForNewLetter+= mesh.geometry.boundingBox.max.x*mesh.currentScale * settings.letterCommaWidthRatioToAdd;
					}
					
					this.updateCurrentLetterPositionOnSpirale(this.distanceToAddForNewLetter);
				}

				mesh.position.set(
					currentLetterPos.x, 
					currentLetterPos.y+this.specialLetterPosYCorrection, 
					currentLetterPos.z
				);

				scene.add(mesh);
				this.letterMeshInstancesRep.push(mesh);

				TweenMax.to(mesh.scale, this.lettersAnimationInScaleDurationCurrent, { 
					x:mesh.currentScale,
					y:mesh.currentScale,
					z:mesh.currentScale, 
					ease:settings.lettersAnimationInScaleEase
				});
				TweenMax.to(mesh.rotation, this.lettersAnimationInRotationDurationCurrent, { 
					x:mesh.currentRotationX, 
					y:Math.atan2(currentLetterPos.x, currentLetterPos.z), 
					z:Math.radians(Math.random()*settings.lettersEndRotationMax), 
					ease:settings.lettersAnimationInRotationEase
				})
			}else{
				if(this.previousLetterMesh!=undefined){
					this.updateCurrentLetterPositionOnSpirale(settings.lettersGeomSettings.size * settings.letterSpaceDistanceRatioToTextSize * this.previousLetterMesh.currentScale);
				}				
			}

			if(this.letterMeshInstancesRep.length>settings.maxLetterNumber){
				this.removeLetter(this.letterMeshInstancesRep[0]);
				this.letterMeshInstancesRep[0]=undefined;
				this.letterMeshInstancesRep.shift();
			}

			this.addSpiralBox();
		}

		this.removeLetter = function(letter){
			scene.remove(letter);
			this.meshesToDestroyRep.push(letter);
		}

		this.addSpiralBox = function(){	
			this.spiraleBoxesCurrentRadiusRatioNoiseIndic+=0.1;
			this.spiraleBoxesCurrentRadiusRatioNoise = this.perlinNoiseScale.noise2D(this.spiraleBoxesCurrentRadiusRatioNoiseIndic, 0); 
			this.spiraleBoxesCurrentRadiusRatio = settings.spiraleBoxesRadiusRatioMin + Math.abs(this.spiraleBoxesCurrentRadiusRatioNoise) * settings.spiraleBoxesRadiusRatioMax;
			
			var plane = new THREE.Mesh( this.spiraleBoxGeom, this.materials.commonMaterial );
				plane.position.set(
					this.spiraleCurrentRadius*this.spiraleBoxesCurrentRadiusRatio * Math.cos(this.spiralCurrentAngle), 
					currentLetterPos.y,
					this.spiraleCurrentRadius*this.spiraleBoxesCurrentRadiusRatio * Math.sin(this.spiralCurrentAngle)
				);
				plane.rotation.set(
					0, 
					Math.atan2( plane.position.x, plane.position.z), 
					0
				);
				plane.scale.z = 0.01 + Math.abs(this.spiraleBoxesCurrentRadiusRatioNoise);
			scene.add(plane);
			
			this.spiraleBoxesRep.push(plane);

			if(this.spiraleBoxesRep.length>settings.maxSpiraleBoxesNumber){
				this.removeCustomMeshTriangle(this.spiraleBoxesRep[0]);
				this.spiraleBoxesRep[0]=undefined;
				this.spiraleBoxesRep.shift();
			}
		}

		this.removeCustomMeshTriangle = function(mesh){
			scene.remove(mesh);
			this.meshesToDestroyRep.push(mesh);
		}

		this.destroyMeshesIntervalListener = function(){

			this.meshesToDestroyRep.forEach((item)=> {
				item.geometry.dispose();
				item.material.dispose();
				item = undefined;
			});

			renderer.renderLists.dispose();
			this.meshesToDestroyRep=[];
		}

		this.keyPress = function(keyCode){
			if(this.letterMeshesRep[keyCode]!=undefined || keyCode==" ".charCodeAt(0)){
				this.killAutoText(true);
				this.addLetter(keyCode);
			}
		}

		this.addAudioWord = function(word){
			this.currentAudioWordLettersArray=word.toLowerCase().split("");
			for(i=0, il=this.currentAudioWordLettersArray.length; i<il; i++) {
				this.addLetter(this.currentAudioWordLettersArray[i].charCodeAt(0));
			}
		}

		this.launchAutoText = function(){
			this.isAutoText=true;
			this.addLetter(this.poemNormalTextArray[this.poemNormalTextArrayCurrentPos].charCodeAt(0));

			this.poemNormalTextArrayCurrentPos=(this.poemNormalTextArrayCurrentPos>this.poemNormalTextArray.length-2) ? 0: this.poemNormalTextArrayCurrentPos+1 ; 
			this.textAutoLaunchTimeout=setTimeout(() =>{
				this.launchAutoText();
			}, settings.textAutoLaunchTimeoutDurationMin + Math.random()*settings.textAutoLaunchTimeoutDurationRandomAdded);
		}

		this.killAutoText = function(relaunchTimeout){
			if(cameraControlerObject.isCameraFollowingLetter==false){
				cameraControlerObject.switchCamera();
			}
			this.isAutoText=false;

			clearTimeout(this.textAutoLaunchTimeout);
			if(relaunchTimeout==true){
				this.textAutoLaunchTimeout=setTimeout(() =>{
					this.launchAutoText();
				}, settings.textAutoLaunchAfterResetTimeoutDuration);
			}
		}

		this.randomizeStageBackground = function(){
			renderer.setClearColor( (Math.random() < 0.5) ? settingsThree.rendererBGColorAlt : settingsThree.rendererBGColor, 1);
		}

		this.setStageBackground = function(){
			if(renderer.isAltClearColor==false){
				renderer.setClearColor( settingsThree.rendererBGColorAlt, 1);
				renderer.isAltClearColor=true;
				addClass(audioButton.getElementsByTagName("a")[0], "negative");
			}else{
				renderer.setClearColor( settingsThree.rendererBGColor, 1);
				renderer.isAltClearColor=false;
				removeClass(audioButton.getElementsByTagName("a")[0], "negative");
			}
		}

		this.switchStageBackground = function(){
			TweenMax.to(this.switchstageBackgroundTweenObject, settings.switchStageBackgroundTransitionDuration/1000, { 
				value:1,  
				onUpdate:()=>{
					this.randomizeStageBackground();
				},
				onComplete:()=>{
					this.setStageBackground();
				},
				ease:settings.lettersAnimationInScaleEase
			});
		}

		this.randomizeMaterialWireframe = function(){
			this.materials.commonMaterial.wireframe=Math.random() < 0.5;
		}

		this.setMaterialWireframe = function(){
			if(this.materials.commonMaterial.isWireframe==false){
				this.materials.commonMaterial.wireframe=true;
				this.materials.commonMaterial.isWireframe=true;
				this.switchMaterialWireframeTimeout = setTimeout(() =>{
					this.launchMaterialWireframeSwitch();
				}, settings.switchMaterialWireframeDuration+Math.random()*settings.switchMaterialWireframeDurationAddedRandom);
			}else{
				this.materials.commonMaterial.wireframe=false;
				this.materials.commonMaterial.isWireframe=false;
				this.switchMaterialWireframeTimeout = setTimeout(() =>{
					this.launchMaterialWireframeSwitch();
				}, settings.switchMaterialWireframeTimeoutDuration+Math.random()*settings.switchMaterialWireframeTimeoutDurationAddedRandom);
			}
		}

		this.launchMaterialWireframeSwitch = function(){
			clearTimeout(this.switchMaterialWireframeTimeout);
			if(isAudioPlaying==false){
				TweenMax.to(this.switchMaterialWireframeTweenObject, settings.switchMaterialWireframeTransitionDuration/1000, { 
					value:1,  
					onUpdate:()=>{
						this.randomizeMaterialWireframe();
					},
					onComplete:()=>{
						this.setMaterialWireframe();
					},
					ease:settings.lettersAnimationInScaleEase
				});
			}else{
				this.switchMaterialWireframeTimeout = setTimeout(() =>{
					this.launchMaterialWireframeSwitch();
				}, settings.switchMaterialWireframeTimeoutDuration+Math.random()*settings.switchMaterialWireframeTimeoutDurationAddedRandom);
			}
		}

		this.render = function(){
			currentLetterPosTargetForCamera.x += ( currentLetterPos.x - currentLetterPosTargetForCamera.x ) * this.cameraAutoMoveLookAtEaseFactorCurrent;
			currentLetterPosTargetForCamera.y += ( currentLetterPos.y - currentLetterPosTargetForCamera.y ) * this.cameraAutoMoveLookAtEaseFactorCurrent;
			currentLetterPosTargetForCamera.z += ( currentLetterPos.z - currentLetterPosTargetForCamera.z ) * this.cameraAutoMoveLookAtEaseFactorCurrent;	
			
			this.particlesContainer.position.y = currentLetterPosTargetForCamera.y;
		}
	}




	CameraControler = function(){
		this.cameraTargetPos = undefined;

		this.isCameraFollowingLetter = true;

		this.cameraTargetPos = {
			x: 0, 
			y: 0, 
			z: 0
		}
		this.cameraCenteredTargetPosY = 0;
		this.cameraCenteredPerlinNoise = undefined;
		this.cameraCenteredPerlinNoiseAskFor = 0; 

		this.switchCameraTimeout = undefined;

		this.cameraAutoMoveEaseFactorCurrent = settings.cameraAutoMoveEaseFactor;

		this.init = function(){
			this.cameraCenteredPerlinNoise = new SimplexNoise(settings.lettersScaleNoiseInitValue);

			this.switchCameraTimeout = setTimeout(() =>{
				this.switchCamera();
			}, settings.switchCameraTimeoutDuration+Math.random()*settings.switchCameraTimeoutDurationAddedRandom);
		}

		this.updateCameraToCurrentLetter = function(){
			if(this.isCameraFollowingLetter == true){
				camera.position.x += ( this.cameraTargetPos.x - camera.position.x ) * this.cameraAutoMoveEaseFactorCurrent;
				camera.position.y += ( this.cameraTargetPos.y - camera.position.y ) * this.cameraAutoMoveEaseFactorCurrent;
				camera.position.z += ( this.cameraTargetPos.z - camera.position.z ) * this.cameraAutoMoveEaseFactorCurrent;
				camera.lookAt( currentLetterPosTargetForCamera.x, currentLetterPosTargetForCamera.y, currentLetterPosTargetForCamera.z );
			}else{
				this.cameraCenteredTargetPosY = currentLetterPos.y - settings.cameraCenteredPosYDecal + (this.cameraCenteredPerlinNoise.noise2D(this.cameraCenteredPerlinNoiseAskFor, 0) * settings.cameraCenteredNoiseMaxPosYDifference);
				this.cameraCenteredPerlinNoiseAskFor+=settings.cameraCenteredNoiseIncrement;
				camera.position.y += (this.cameraCenteredTargetPosY - camera.position.y ) * this.cameraAutoMoveEaseFactorCurrent;
				camera.rotation.y += settings.cameraCenteredRotationYIncrement;
			}
		}

		this.switchCamera = function(){
			clearTimeout(this.switchCameraTimeout);
			if(threeJSObject.isAutoText==true && isAudioPlaying==false){
				if(this.isCameraFollowingLetter==true){
					camera.rotation.order = "YXZ";
					camera.position.set(0, currentLetterPos.y - settings.cameraCenteredPosYDecal + (this.cameraCenteredPerlinNoise.noise2D(this.cameraCenteredPerlinNoiseAskFor, 0) * settings.cameraCenteredNoiseMaxPosYDifference), 0);
					camera.rotation.set(Math.radians(90), 0, 0);
					this.isCameraFollowingLetter = false;
					this.switchCameraTimeout = setTimeout(() =>{
						this.switchCamera();
					}, settings.switchCameraDuration+Math.random()*settings.switchCameraDurationAddedRandom);
				}else{
					camera.rotation.order = "XYZ";
					camera.position.set(this.cameraTargetPos.x, this.cameraTargetPos.y, this.cameraTargetPos.z);
					this.isCameraFollowingLetter = true;
					this.switchCameraTimeout = setTimeout(() =>{
						this.switchCamera();
					}, settings.switchCameraTimeoutDuration+Math.random()*settings.switchCameraTimeoutDurationAddedRandom);
				}
			}else{
				this.switchCameraTimeout = setTimeout(() =>{
					this.switchCamera();
				}, settings.switchCameraTimeoutDuration+Math.random()*settings.switchCameraTimeoutDurationAddedRandom);
			}
		}

		this.udpateOnRender = function(){
			this.updateCameraToCurrentLetter();
		}
	}





	resizeListener = function(){
		renderer.setSize(window.stageSettings.width, window.stageSettings.height);
		camera.aspect = window.stageSettings.width / window.stageSettings.height;
		camera.updateProjectionMatrix();
	};

	mouseDownListener = function(){
		threeJSObject.switchStageBackground();
	};
	mouseUpListener = function(){
	};

	keyPressListener = function(e){
		threeJSObject.keyPress(e.keyCode ? e.keyCode : e.which);
	};

	audioButtonMouseDownListener = function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}

		if(isAudioPlaying==false){
			if(threeJSObject.materials.commonMaterial.isWireframe==true){
				threeJSObject.launchMaterialWireframeSwitch();
			}
			threeJSObject.killAutoText(false);
			audioElement.currentTime = settings.textsSettings.poemAudioStartTime;
			audioElement.play();
			audioElementTimeUpdateInterval=setInterval(audioElementTimeUpdateListener, settings.audioElementTimeUpIntervalDuration); 
			isAudioPlaying=true;

			threeJSObject.lettersAnimationInScaleDurationCurrent = settings.lettersAnimationInScaleDurationAudio;
			threeJSObject.lettersAnimationInRotationDurationCurrent = settings.lettersAnimationInRotationDurationAudio;
			threeJSObject.lettersScaleNoiseMaxCurrent = settings.lettersScaleNoiseMaxAudio;
			threeJSObject.lettersRotationXNoiseMaxAngleCurrent = settings.lettersRotationXNoiseMaxAngleAudio;
			threeJSObject.spiraleStartRadiusCurrent = settings.spiraleStartRadiusAudio;
			threeJSObject.calculateSpiraleRadiusForCameraCurrent = threeJSObject.calculateSpiraleRadiusForCameraAudio;
			threeJSObject.cameraRadiusAddedMinCurrent = settings.cameraRadiusAddedMinAudio;
			threeJSObject.cameraAutoMoveLookAtEaseFactorCurrent = settings.cameraAutoMoveLookAtEaseFactorAudio;
			cameraControlerObject.cameraAutoMoveEaseFactorCurrent = settings.cameraAutoMoveEaseFactorAudio;

			addClass(audioButton.getElementsByTagName("a")[0], "playing");
		}else{
			audioElement.pause();
			clearInterval(audioElementTimeUpdateInterval);
			isAudioPlaying=false;

			threeJSObject.lettersAnimationInScaleDurationCurrent = settings.lettersAnimationInScaleDuration;
			threeJSObject.lettersAnimationInRotationDurationCurrent = settings.lettersAnimationInRotationDuration;
			threeJSObject.lettersScaleNoiseMaxCurrent = settings.lettersScaleNoiseMax;
			threeJSObject.lettersRotationXNoiseMaxAngleCurrent = settings.lettersRotationXNoiseMaxAngle;
			threeJSObject.spiraleStartRadiusCurrent = settings.spiraleStartRadius;
			threeJSObject.calculateSpiraleRadiusForCameraCurrent = threeJSObject.calculateSpiraleRadiusForCamera;
			threeJSObject.cameraRadiusAddedMinCurrent = settings.cameraRadiusAddedMin;
			threeJSObject.cameraAutoMoveLookAtEaseFactorCurrent = settings.cameraAutoMoveLookAtEaseFactor;
			cameraControlerObject.cameraAutoMoveEaseFactorCurrent = settings.cameraAutoMoveEaseFactor;

			threeJSObject.launchAutoText();
			currentAudioWordID=0;

			removeClass(audioButton.getElementsByTagName("a")[0], "playing");
		}

		return false;
	};

	audioElementTimeUpdateListener = function(){
		if(audioElement.currentTime>=settings.textsSettings.poemAudioText[currentAudioWordID][1]){	
			//test.innerHTML+=settings.textsSettings.poemAudioText[currentAudioWordID][0];

			threeJSObject.addAudioWord(settings.textsSettings.poemAudioText[currentAudioWordID][0]);
			currentAudioWordID+=1;

			if(currentAudioWordID>settings.textsSettings.poemAudioText.length-1){
				currentAudioWordID=0;
				clearInterval(audioElementTimeUpdateInterval);
			}
		}
	}

	audioElementEndListener = function(){
		audioButtonMouseDownListener();
	}

	renderStage = function(){
  		threeJSObject.render();
		cameraControlerObject.udpateOnRender(); 

		renderer.render(scene, camera);
  		requestAnimationFrame(renderStage);		
	};








	setScene = function(){
		stageContainer.innerHTML+="<audio id='audioElement' src='s3_sound/baudelaire_enivrez-vous_serge_reggiani_trimmed.m4a' controls></audio>";
		audioElement=document.getElementById("audioElement");
		audioElement.addEventListener("ended", audioElementEndListener);


		stageContainer.innerHTML+="<div id='audioButton'><a href='https://www.youtube.com/watch?v=ZpKb5I6kxbM' target='_blank'>Play audio: Serge Reggiani - Enivrez-vous - Poème de Baudelaire</a></div>";
		audioButton=document.getElementById("audioButton");
		audioButton.addEventListener("click", audioButtonMouseDownListener);
		audioButton.addEventListener("touchstart", audioButtonMouseDownListener);

		test=document.createElement('div');
		test.setAttribute("id", "test");
		document.body.appendChild(test);


		settingsThree.aspectRatio = window.stageSettings.width / window.stageSettings.height;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(settingsThree.fieldOfView, settingsThree.aspectRatio, settingsThree.nearPlane, settingsThree.farPlane);
		camera.position.x = settingsThree.cameraPosX;
		camera.position.y = settingsThree.cameraPosY;
		camera.position.z = settingsThree.cameraPosZ;

		renderer = new THREE.WebGLRenderer({
			alpha:false, 
			antialias:true
		});
		renderer.setClearColor( settingsThree.rendererBGColor, 1);
		renderer.isAltClearColor=false;
		renderer.setSize(window.stageSettings.width, window.stageSettings.height);
		renderer.setPixelRatio( window.devicePixelRatioCustom );
		stageContainer.append(renderer.domElement);

		threeJSObject = new ThreeJS();
		threeJSObject.init();
		scene.add(threeJSObject.mesh);

		cameraControlerObject = new CameraControler();
		cameraControlerObject.init();
		//createBasicShapes();

		renderStage();

		addClass(stage, "loaded");
	};

	
	createBasicShapes = function(){
		var startPositionX = -500;
		var startPositionY = 300;

		/* display only basic shapes
			for(i=0; i<scene.children.length; i++){
				scene.children[i].visible=false;
			}
		*/

		var planeGeom = new THREE.PlaneGeometry( 100, 100, 5, 5 );
		var plane = new THREE.Mesh( planeGeom, threeJSObject.materials.commonMaterial );
			plane.position.x=startPositionX+0;
			plane.position.y=startPositionY+0;
		scene.add( plane );

		var circleGeom = new THREE.CircleGeometry( 50, 60); 
		var circle = new THREE.Mesh( circleGeom, threeJSObject.materials.commonMaterial );
			circle.position.x=startPositionX+200;
			circle.position.y=startPositionY;
		scene.add( circle );

		var boxGeom = new THREE.BoxGeometry( 100, 100, 100, 1, 1, 1 );
		var box = new THREE.Mesh( boxGeom, threeJSObject.materials.commonMaterial );
			box.position.x=startPositionX+400;
			box.position.y=startPositionY+0;	
			scene.add( box );

		var coneGeom = new THREE.ConeGeometry(50, 100, 10, 1);
		var cone = new THREE.Mesh( coneGeom, threeJSObject.materials.commonMaterial );
			cone.position.x=startPositionX+600;
			cone.position.y=startPositionY+0;
		scene.add( cone );

		var cylinderGeom = new THREE.CylinderGeometry(25, 50, 100, 10, 1);
		var cylinder = new THREE.Mesh( cylinderGeom, threeJSObject.materials.commonMaterial );
			cylinder.position.x=startPositionX+800;
			cylinder.position.y=startPositionY+0;
		scene.add( cylinder );

		var dodecahedronGeom = new THREE.DodecahedronGeometry(50, 0);
		var dodecahedron = new THREE.Mesh( dodecahedronGeom, threeJSObject.materials.commonMaterial );
			dodecahedron.position.x=startPositionX+1000;
			dodecahedron.position.y=startPositionY+0;
		scene.add( dodecahedron );

		var icosahedronGeom = new THREE.IcosahedronGeometry(50, 0);
		var icosahedron = new THREE.Mesh( icosahedronGeom, threeJSObject.materials.commonMaterial );
			icosahedron.position.x=startPositionX+0;
			icosahedron.position.y=startPositionY-200;
		scene.add( icosahedron );

		var points = [];
		for ( var i = 0; i < 10; i ++ ) {
			points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 50 + 5, ( i - 5 ) * 10 ) );
		}
		var latheGeom = new THREE.LatheGeometry(points);
		var lathe = new THREE.Mesh( latheGeom, threeJSObject.materials.commonMaterial );
			lathe.position.x=startPositionX+200;
			lathe.position.y=startPositionY-200;
		scene.add( lathe );

		var octahedronGeom = new THREE.OctahedronGeometry(50, 0);
		var octahedron = new THREE.Mesh( octahedronGeom, threeJSObject.materials.commonMaterial );
			octahedron.position.x=startPositionX+400;
			octahedron.position.y=startPositionY-200;
		scene.add( octahedron );

		var ringGeom = new THREE.RingGeometry(25, 50, 10);
		var ring = new THREE.Mesh( ringGeom, threeJSObject.materials.commonMaterial );
			ring.position.x=startPositionX+600;
			ring.position.y=startPositionY-200;
		scene.add( ring );

		var sphereGeom = new THREE.SphereGeometry(50, 10, 10);
		var sphere = new THREE.Mesh( sphereGeom, threeJSObject.materials.commonMaterial );
			sphere.position.x=startPositionX+800;
			sphere.position.y=startPositionY-200;
		scene.add( sphere );

		var tetrahedronGeom = new THREE.TetrahedronGeometry(50, 0);
		var tetrahedron = new THREE.Mesh( tetrahedronGeom, threeJSObject.materials.commonMaterial );
			tetrahedron.position.x=startPositionX+0;
			tetrahedron.position.y=startPositionY-400;
		scene.add( tetrahedron );

		var torusGeom = new THREE.TorusGeometry( 50, 10, 5, 25 );
		var torus = new THREE.Mesh( torusGeom, threeJSObject.materials.commonMaterial );
			torus.position.x=startPositionX+200;
			torus.position.y=startPositionY-400;
		scene.add( torus );
	}

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



	setScene();

	renderer.domElement.addEventListener("mousedown", mouseDownListener);
	renderer.domElement.addEventListener("touchstart", mouseDownListener);
		
	//stageContainer.addEventListener("mouseup", mouseUpListener);
	//stageContainer.addEventListener("touchend", mouseUpListener);

	resizeListener();
	window.addEventListener('resize', resizeListener);
	window.addEventListener("keypress", keyPressListener);

})();







