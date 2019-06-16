
/*

	- boucles dans render: avec i et il
		-for(var i=0, il=this.spheresRep.length; i<il; i++) {
 */

(function(){

	var stage, stageContainer, 
	settings, settingsThree, settingsThreeCameraControl, i, devicePixelRatioCustom, mouseMoveTimeout, 
	settingsThree, ThreeJS, threeJSObject, scene, camera, renderer, createBasicShapes,  
	mousePos, mousePosInStage, mouseDistToCenterX, mouseDistToCenterY, 
	hasClass, addClass, removeClass, setScene, mouseDownListener, mouseUpListener, mouseMoveListener, mouseMoveTimeoutListener;

	devicePixelRatioCustom = (window.devicePixelRatio!=1 && window.windowSize.width<=1440) ? window.devicePixelRatio : 1; 

	settings={

		mouseMoveTimeoutDuration:2000,
		mousePosAutoAnimationDuration:2, 
		mousePosAutoAnimationEase:Expo.easeInOut, 
	};

	settingsThree = {
		aspectRatio:1, 
		fieldOfView:60, 
		nearPlane:1, 
		farPlane:10000, 
		cameraPosX:0, 
		cameraPosY:0,
		cameraPosZ:800, 
		rendererBGColor:0x000000, 
	
		controlsDampingFactor:0.25, 
		controlsMinDistance:400, 
		controlsMaxDistance:10000, 
		controlsMaxAngle:3, 
		cameraDelayBeforeFirstAnimation:1000, 
		cameraAnimationEachSecondStep:5, 
		cameraMaxDecalXOnSecondStep:300, 
		cameraMaxDecalYOnSecondStep:300, 
		cameraMaxDecalZOnSecondStep:500, 
		cameraAnimationOnSecondTickDuration:4000, 

		hemisphereLightSkyColor:0xffffff, 
		hemisphereLightGroundColor:0x0000ff, 
		hemisphereLightIntensity: 1, 
		shadowLightColor:0x00ff00, 
		shadowLightIntensity:0.5,
		shadowLightPosX:1000, 
		shadowLightPosY:-1000,  
		shadowLightPosZ:1000, 
		shadowLightCameraL:-400, 
		shadowLightCameraR:400, 
		shadowLightCameraT:400, 
		shadowLightCameraB:-400, 
		shadowLightCameraNear:1, 
		shadowLightCameraFar:1000, 
		shadowLightCameraW:2048, 
		shadowLightCameraH:2048,
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
	stageContainer=document.getElementById('stage__container');






	


	setScene = function(){

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
		renderer.setSize(window.stageSettings.width, window.stageSettings.height);
		renderer.setPixelRatio( window.devicePixelRatioCustom );
		//renderer.shadowMap.enabled = true;
		stageContainer.appendChild(renderer.domElement);

		threeJSObject = new ThreeJS();
		threeJSObject.init();
		scene.add(threeJSObject.mesh);

		createBasicShapes();

		renderStage();

		addClass(stage, "loaded");
		mouseMoveTimeoutListener();
	};





	resizeListener = function(){
		renderer.setSize(window.stageSettings.width, window.stageSettings.height);
		camera.aspect = window.stageSettings.width / window.stageSettings.height;
		camera.updateProjectionMatrix();
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
		//console.log("mouse  move timeout listener");
	};

	mouseDownListener = function(){

	};

	mouseUpListener = function(){

	};

	







	renderStage = function(){
  		threeJSObject.render();
		renderer.render(scene, camera);
  		requestAnimationFrame(renderStage);		
	}






	ThreeJS = function(){
		this.mesh = undefined; 
		this.controls = undefined; 
		this.cameraCurrentPos = undefined;
		this.cameraTargetPos = undefined;

		this.materials = {
			commonMaterial:undefined
		};

		this.lights = {
			mainLight:undefined
		};

		this.init = function(){
			this.controls = new THREE.OrbitControls( camera, renderer.domElement );
			this.controls.enableDamping = true;
			this.controls.dampingFactor = settingsThree.controlsDampingFactor;
			this.controls.enableZoom = true;
			this.controls.enablePan = true;
			this.controls.maxDistance = settingsThree.controlsMaxDistance;
			this.controls.minDistance = settingsThree.controlsMinDistance;
			this.controls.maxAzimuthAngle = settingsThree.controlsMaxAngle; 
			this.controls.minAzimuthAngle = settingsThree.controlsMaxAngle * -1;

			this.cameraCurrentPos = {
				x:settingsThree.cameraPosX, 
				y: settingsThree.cameraPosY, 
				z:settingsThree.cameraPosZ, 
				camera:camera
			}

			this.materials.commonMaterial = new THREE.MeshPhongMaterial({
				color:0xffffff,
				transparent:false,
				opacity:1,
				shininess:100, 
				flatShading:THREE.FlatShading, 
				side: THREE.DoubleSide
			});

			this.lights.mainLight = new THREE.HemisphereLight(settingsThree.hemisphereLightSkyColor, settingsThree.hemisphereLightGroundColor, settingsThree.hemisphereLightIntensity);
			scene.add(this.lights.mainLight);

			this.mesh = new THREE.Object3D();
		}	

		this.render = function(){
			this.controls.update();
		}
	}




	LightControler = function(){

		this.init = function(){
			this.hemisphereLight = new THREE.HemisphereLight(settingsThreeLightControl.hemisphereLightSkyColor, settingsThreeLightControl.hemisphereLightGroundColor, settingsThreeLightControl.hemisphereLightIntensity);
			scene.add(this.hemisphereLight);

			this.shadowLight = new THREE.DirectionalLight(settingsThreeLightControl.shadowLightColor, settingsThreeLightControl.shadowLightIntensity);
			this.shadowLight.position.set(settingsThreeLightControl.shadowLightPosX, settingsThreeLightControl.shadowLightPosY, settingsThreeLightControl.shadowLightPosZ);
			this.shadowLight.castShadow = false;
			this.shadowLight.shadow.camera.left = settingsThreeLightControl.shadowLightCameraL;
			this.shadowLight.shadow.camera.right = settingsThreeLightControl.shadowLightCameraR;
			this.shadowLight.shadow.camera.top = settingsThreeLightControl.shadowLightCameraT;
			this.shadowLight.shadow.camera.bottom = settingsThreeLightControl.shadowLightCameraB;
			this.shadowLight.shadow.camera.near = settingsThreeLightControl.shadowLightCameraNear;
			this.shadowLight.shadow.camera.far = settingsThreeLightControl.shadowLightCameraFar;
			this.shadowLight.shadow.mapSize.width = settingsThreeLightControl.shadowLightCameraW;
			this.shadowLight.shadow.mapSize.height = settingsThreeLightControl.shadowLightCameraH;

			scene.add(this.shadowLight);

			this.shadowLightPreviewGeom = new THREE.SphereGeometry(10, 10, 10);
			this.shadowLightPreview = new THREE.Mesh( this.shadowLightPreviewGeom, commonMaterial );
			this.shadowLightPreview.position.set(settingsThreeLightControl.shadowLightPosX, settingsThreeLightControl.shadowLightPosY, settingsThreeLightControl.shadowLightPosZ);
			scene.add( this.shadowLightPreview );
		}
	}







	
	
	createBasicShapes = function(){
		var startPositionX = -500;
		var startPositionY = 300;

		/* display only basic shapes
			for(i=0; i<scene.children.length; i++){
				scene.children[i].visible=false;
			}
			var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xff0000, 1);
			scene.add(hemisphereLight);
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

	document.body.addEventListener("mousedown", mouseDownListener);
	document.body.addEventListener("touchstart", mouseDownListener);
		
	document.body.addEventListener("mouseup", mouseUpListener);
	document.body.addEventListener("touchend", mouseUpListener);

	resizeListener();
	window.addEventListener('resize', resizeListener);
	window.addEventListener("mousemove", mouseMoveListener);

})();


