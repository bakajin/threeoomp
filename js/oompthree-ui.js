/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

//using user agent because the rest is totally unusable
var userAgent = new Object();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
var heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgScene, fgScene;

var bgRenderer, fgRenderer;

var backgroundView, foregroundView;

var axis;

var bgGeometry, bgMaterial, bgMesh;

var mylarBalloon = new THREE.Object3D();
var mylarBalloonMixer = new TimelineLite();

var balloonMaterial, balloonMesh;

//snap svg for the menu
var paper;

/* global function calls */
function render() {
	init();
	menu("load");

	animate();	
}

function init() {
		console.log("init", navigator.userAgent);
		
//maybe do in a separate function
		var uA = navigator.userAgent;
		
		//lets check safari first, because chrome hold double values (Chrome and safari)
		if(uA.search("Safari") != -1) {
			console.log("Safari or Chrome");
			userAgent.browser = "Safari";
		}
		
		if(uA.search("Chrome") != -1) {
			console.log("Chrome");
			userAgent.browser = "Chrome";
		}

		if(uA.search("Firefox") != -1) {
			console.log("Firefox");
			userAgent.browser = "Firefox";
		}

		if(uA.search("Opera") != -1) {
			console.log("Opera");
			userAgent.browser = "Opera";
		}

		if(uA.search("Internet Explorer") != -1) {
			console.log("Explorer");
			userAgent.browser = "IE";
		}

		backgroundView = document.getElementById('threed-background');
		foregroundView = document.getElementById('threed-foreground');
		
		scene = new THREE.Scene();
		scene.background = 0xffffff;

		bgScene = new THREE.Scene();
		bgScene.background = 0xffffff;

		fgScene = new THREE.Scene();

		//Fog( hex, near, far )
		//scene.fog = new THREE.Fog( 0xffffff, 1, 450);
		

	//hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		//scene.add( hemisphereLight );
		ambientLight = new THREE.AmbientLight( 0x000000 );
		directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 10, 90, 10 );
		

		bgScene.add( directionalLight );
		bgScene.add( ambientLight );

		fgScene.add( directionalLight.clone() );
		fgScene.add( ambientLight.clone() );

		//bgScene.add( directionalLight );
		//bgScene.add( ambientLight );

		// field of view, aspect ratio, near plane, far plane 
		camera = new THREE.PerspectiveCamera( 63, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 450);
		//camera.position.x = 0;
		//camera.position.y = 90;
		//camera.position.z = 0;
	
	//set up manager
	var manager = new THREE.LoadingManager();
		manager.onProgress = function( item, loaded, total ) {
			console.log( item, loaded, total );
		};
	// event listeners
	var onProgress = function ( xhr ) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + "% downloaded" );
		}
	};

	var onError = function ( xhr ) {

	};

	// insert textureLoader
	var textureLoader = new THREE.TextureLoader( manager );

	var bgOne;
	var bgTwo;
	
	//environment map ballon (for reflectivity)
	
	// model balloon
		axis = new THREE.AxisHelper( 10 );
		axis.visible = false;
		axis.position.y += 10;
		axis.name = "camera_interest";
		
		bgScene.add( axis );

	//renderer = new THREE.WebGLRenderer( { alpha: true, antialias : true } );

	/* 
	
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	*/
	
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//foregroundView.appendChild( renderer.domElement );
	
//build the rest of the scene
	// model background
	var bgLoader = new THREE.OBJLoader( manager );
		bgLoader.load( themePath + '/assets/three_bg-tri-grid.obj', function ( object ) {
				
					bgOne = object.clone();
					bgOne.name = "bg-grid-1";
					bgOne.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshPhongMaterial({ 
														color: 0xffffff,
														emissive : 0x1C1B10,
														specular: 0x111111,
														shininess: 24, 
														shading: THREE.FlatShading,
														aoMap : textureLoader.load(themePath + '/assets/bg-tri-grid_ambocc.png'),
														aoMapIntensity : 0.61,
														normalMap : textureLoader.load(themePath + '/assets/bg-tri-grid_normal.png'),
														normalScale: new THREE.Vector2( 0.51, 0.51 )

											}); // specularMap, aoMap, (normalMap)

						}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading

					} );

				/*
					object.position.y = - 95;
					object.rotation.y = 90;
					object.scale.x = 10;
					object.scale.y = 10;
					object.scale.z = 10;
				*/
					bgScene.add( bgOne );
					//camera.lookAt(bgOne.position);
					//camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
					directionalLight.target = bgOne;

					bgTwo = object.clone();
					bgTwo.name = "bg-grid-2";
					bgTwo.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshLambertMaterial({ 
														color: 0xD4C978,
														emissive : 0x000000,
														shading: THREE.SmoothShading,
														wireframe : true,
														wireframeLinewidth : 1,

											}); // specularMap, aoMap, (normalMap)
							child.material.transparent = true;
							child.material.opacity = 0.2;

						}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading

					} );


				bgTwo.position.y = 0.1;
				
				bgScene.add(bgTwo);

				}, onProgress, onError );

	var menuLoader = new THREE.OBJLoader( manager );
		menuLoader.load( themePath + '/assets/menu-grid.obj', function ( object ) {
					
					object.name = "menu-grid";
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshLambertMaterial({ 
														color: 0xD78081,
														emissive : 0x000000,
														shading: THREE.SmoothShading,
														wireframe : true,
														wireframeLinewidth : 2,

											}); // specularMap, aoMap, (normalMap)
							child.material.transparent = true;
							child.material.opacity = 0;

						}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading

					} );


				object.position.y = 0.01;
				fgScene.add(object);

				}, onProgress, onError );

		var balloonLoader = new THREE.OBJLoader( manager );
		balloonLoader.load( themePath + '/assets/helium-balloon_2.2.obj', function ( object ) {
				var sphericalEnvironmentTexture = textureLoader.load(themePath + '/assets/app_hallway-2.jpg');
					sphericalEnvironmentTexture.mapping = THREE.SphericalReflectionMapping;
					mylarBalloon.name = "helium-balloon";
				
					object.traverse( function ( child ) {
						//console.log("name: ", child.name, object.matrixWorld);
						if ( child instanceof THREE.Mesh ) {
							switch(child.name) {
								case "mylar-ballon-low":
											child.material = new THREE.MeshPhongMaterial({ 

															color: 0xD4C978,
															emissive : 0x000000,
															specular: 0x111111,
															shininess: 24, 
															shading: THREE.SmoothShading,
															aoMap : textureLoader.load(themePath + '/assets/mylar-ballon-low_ambocc.png'),
															normalMap : textureLoader.load(themePath + '/assets/mylar-ballon-low_normal.png'),
															normalScale: new THREE.Vector2( 1, 1 ),
															envMap : sphericalEnvironmentTexture,
															combine : THREE.MixOperation															
											}); //envMap : textureLoader.load(themePath + '/assets/app_hallway-2.jpg'),
											// roughness, metalness, specularMap, normalMap, (normalScale), envMap, reflectivity, combine

								break;

								case "rope":
											child.material = new THREE.MeshPhongMaterial({ 

															color: 0x000000,
															emissive : 0x000000,
															specular: 0x111111,
															shininess: 24, 
															shading: THREE.SmoothShading
											});

								break;
								
								case "wire-MP":
											child.material = new THREE.MeshPhongMaterial({ 

															color: 0x000000,
															emissive : 0x000000,
															specular: 0x111111,
															shininess: 24, 
															shading: THREE.SmoothShading
									
											});

								break;
								
								default:
											child.material = new THREE.MeshLambertMaterial({ 
														
														color: 0xD78081,
														emissive : 0x000000,
														shading: THREE.SmoothShading,
														wireframe : true,
														wireframeLinewidth : 2

											}); // specularMap, aoMap, (normalMap)
								break;
								
							}	
							
						}

					} );
	

					mylarBalloon.add( object );
					

				}, onProgress, onError );
	

		mylarBalloon.scale.x = 0.81;
		mylarBalloon.scale.y = 0.81;
		mylarBalloon.scale.z = 0.81;

		mylarBalloon.position.x = 0; // left to right
		mylarBalloon.position.y = 10;//moves through the grid
		mylarBalloon.position.z = 141; //up and down, vertical positive is down negative is up!

		var keyToKey = 1.33;
		var tweenType = "Power1.easeInOut";
		//var tweenType = "Power.easeIn";
		//up to the top in a wavey motion
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey * 6 ), { z : -36, ease: tweenType });
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : 12, ease: tweenType, repeat : 2, yoyo : true }, 0);
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 12, ease: tweenType, repeat : 2, yoyo : true }, 0);
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : 4, ease: tweenType, repeat : 3, yoyo : true }, (keyToKey * 2) );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 9, ease: tweenType, repeat : 3, yoyo : true }, (keyToKey * 2) );
		
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey * 6 ), { x : -58, ease: tweenType });
		//mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : -58, ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 6 + keyToKey * 6 ) );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 11, ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 6 ) );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { z : -35, ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 6 ) );
		
		//	mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey * 6 ), { x : -20, y : 10, z : -36, ease: tweenType2 });
		//bounce up top

		/*	mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 0, y : 10, z : 141, ease: tweenType });
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -3, y : 14, z : 110, ease: tweenType });
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 2, y : 10, z : 63, ease: tweenType });
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -6, y : 13, z : 28, ease: tweenType });
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 3, y : 10, z : -5, ease: tweenType });
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -12, y : 12, z : -36, ease: tweenType });
		*/
		//bouncing up top
		/*	mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -30, y : 10, z : -32, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -33, y : 11, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -34, y : 10, z : -34, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -35.5, y : 10.5, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -36.9, y : 10.1, z : -35, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -38.2, y : 10, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -39.9, y : 10.1, z : -35.5, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -40.2, y : 10, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -43, y : 10, z : -35.7, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -48, y : 10.1, z : -35.9, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -52, y : 10, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -55, y : 10.1, z : -35.9, ease: SlowMo.ease.config(0.1, 0.1, false)});
			mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -56, y : 9.8, z : -36.3, ease: SlowMo.ease.config(0.1, 0.1, false), repeat:-1, yoyo:true});
		*/

			mylarBalloonMixer.play();
	//	mylarBalloon.rotation.y = 1;
			fgScene.add(mylarBalloon);

		//for the future two canvasses on over the other with the content in between setting the top renderer to transparent background
		
		bgRenderer = new THREE.WebGLRenderer( { antialias : true } );
		fgRenderer = new THREE.WebGLRenderer( { alpha: true, antialias : true } );
		
		onWindowResize();

		backgroundView.appendChild( bgRenderer.domElement );
		foregroundView.appendChild( fgRenderer.domElement );




	
}

function onWindowResize() {
				bgRenderer.setPixelRatio( window.devicePixelRatio );
				fgRenderer.setPixelRatio( window.devicePixelRatio );
				userAgent.pixelRatio = window.devicePixelRatio;
				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;

				widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
				heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();

				
				camera.position.y = 130 * widthRatio;

				var interest = bgScene.getObjectByName( "camera_interest" );
				var camMove = ( SCREEN_HEIGHT / 2 ) * widthRatio;

				var fixRatio = 0;
				switch(userAgent.browser) {

					case "Chrome":
							fixRatio = 5;
					break;
					case "Firefox":
							fixRatio = 5.61;
					break;
					case "Safari":
							fixRatio = 5.1;	
					break;
					case "Opera":
							//??
							fixRatio = 5.61;
					break;
					case "IE":
							//??
							fixRatio = 5.61;
					break;
				}
				 // 3.61;

				console.log( "device pixel ratio: ", window.devicePixelRatio, fixRatio, SCREEN_WIDTH, SCREEN_HEIGHT, userAgent.browser, userAgent.pixelRatio ); 
				if(window.devicePixelRatio > 1) {
							
							if(SCREEN_HEIGHT > SCREEN_WIDTH) {
								//portait
								fixRatio *= heightRatio;
							
							} else {
								//landscape
								fixRatio *= heightRatio;
							
							}

							
							

				} else if(window.devicePixelRatio > 2) {
							if(SCREEN_HEIGHT > SCREEN_WIDTH) {
								//portait
								fixRatio *= heightRatio;

							} else {
								//landscape
								fixRatio *= heightRatio;
							}

							console.log( "device pixel ratio: ", window.devicePixelRatio, fixRatio, SCREEN_WIDTH, SCREEN_HEIGHT ); 
							
							
				}
				
				camMove /= fixRatio;
					
				//console.log("ratios:: width: " + widthRatio + " height: " + heightRatio, camMove);
					
					interest.position.z = -55 + camMove;

					camera.position.z = interest.position.z;
					camera.lookAt(interest.position);

				fgRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				bgRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				//camera.position = ;

				/*var scaleObj = scene.getObjectByName( "bg-grid-1" );
					scaleObj.scale.x = heightRatio;
					scaleObj.scale.z = heightRatio;
					console.log("pos shift1 : " + scaleObj.position.z)
					scaleObj.position.z = 10 * heightRatio;
					console.log("pos shift2 : " + scaleObj.position.z)
				//	scaleObj.scale.z = 10;

					scaleObj = scene.getObjectByName( "bg-grid-2" );
					scaleObj.scale.x = heightRatio;
					scaleObj.scale.z = heightRatio;
					scaleObj.position.z = 10 * heightRatio;
				//	
					scaleObj = scene.getObjectByName( "menu-grid" );
					scaleObj.scale.x = heightRatio;
					scaleObj.scale.z = heightRatio;
					scaleObj.position.z = 10 * heightRatio;
				//	
				*/
				

}

function animate() {
	//console.log("animate");
	//animate stuff
	requestAnimationFrame( animate );
	//mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;
	bgRenderer.render( bgScene, camera );
	fgRenderer.render( fgScene, camera );
	//TWEEN.update();
}

function backgroundTriangleGrid() {

}

function balloon() {

}

function menu(phase) {
		//select the menu container in the menu on header.php
		paper = Snap("#svg-menu");
		paper.attr({ viewBox : "0 0 565 500" });

	var bgRect = paper.group( paper.rect(-100, 0, 40, 650).attr({"fill" : "#ffffff", "id" : "mouse-leave"}), paper.rect(-100, 600, 600, 40).attr({"fill" : "#ffffff", "id" : "mouse-leave"}) );
		//bgRect.attr("id", "mouse-leave");

		bgRect.attr("opacity", "0");
		
		paper.append(bgRect);
		
		switch(phase) {
			case "load":
					var assetList = { menu : "menu-button", main : "main-button", sub : "sub-button", view : "view-button" };
					
					for(ass in assetList) {
					//console.log("	assets: ", themePath + ass + ".svg");		
					//lets start loading assets
								Snap.load(themePath + "/assets/" + assetList[ass] + ".svg", svgLoadEvent);
					
					}
			break;
			default:

			break;
		}
		

}

function svgLoadEvent(event) {
			// define an array with the main button positions
				// it goes x y about, portfolio, connect, view
			var posArray = new Array([24,144],[-12,342],[214,460],[-50,0]);
			var idxConversionArray = new Array();

			paper = Snap("#svg-menu");

		var g = event.select("g");
			//console.log("snap svg load: ", event, g.attr("id") );

			switch(g.attr("id")) {
				case "menu-button-group":
							g.transform("t300,100");
							g.attr("class", "menu-button-group");
							
							var closeIcon = g.selectAll('rect');
								//for( c = 0; closeIcon.length; c++ ) {
									closeIcon[0].transform("t0,-15r0");
									closeIcon[2].transform("t0,15r0");

								//}
						//set some event handlers
							g.select("#button").attr("id", "menu-button-hit")
							g.select("#menu-button-hit").mouseover(mainMenuHandler);
							g.select("#menu-button-hit").mouseout(mainMenuHandler);
							g.select("#menu-button-hit").mousedown(mainMenuHandler);
							g.select("#menu-button-hit").mouseup(mainMenuHandler);
							g.select("#menu-button-hit").touchstart(mainMenuHandler);
							g.select("#menu-button-hit").touchend(mainMenuHandler);
							
							paper.append(g);
				break;
				case "main-button-group":
							var c = 0;

							for(b = 0; b < menuItems.length; b++) { 
								//check if we are dealing with a main menu item 
								if(menuItems[b].parent == 0) {
									//console.log(menuItems[b].idx, menuItems[b].parent, menuItems[b].title, menuItems[b].url, menuItems[b].guid, posArray[c]);
									var buttonAsset = g.clone();
										buttonAsset.attr({
											"class" : "main-button-group",
											"visibility" : "hidden",
											"id" : "main-button-" + menuItems[b].idx
										});

										buttonAsset.transform("t" + posArray[c][0] + "," + posArray[c][1]);
										
										buttonAsset.select("text").attr({
											"text" : menuItems[b].title,
											"opacity" : "0"
										});
										
										buttonAsset.select("g g g g:first-of-type circle:first-of-type").attr("r", "0");
										buttonAsset.select("g g g g:first-of-type circle:last-of-type").attr("r", "0");
										buttonAsset.select("g g g circle:first-of-type").attr("r", "0");

									var hitRect = paper.rect(0,0,225,55);
										hitRect.attr({
											"id" : "main-button-" + menuItems[b].idx,
											"class" : "main-button-hit",
											"fill" : "rgba(0,0,0,0)",
											"visibility" : "hidden"
										});
										
										hitRect.mouseover(mainMenuHandler);
										hitRect.mouseout(mainMenuHandler);
										hitRect.mousedown(mainMenuHandler);
										hitRect.mouseup(mainMenuHandler);
										hitRect.touchstart(mainMenuHandler);
										hitRect.touchend(mainMenuHandler);

										buttonAsset.append(hitRect);
										
										paper.append(buttonAsset);

										idxConversionArray[menuItems[b].idx] = c;

									c++;
								}
							}
				break;
				case "sub-button-group":
							var d = 0;
							var e = 0;
							var previousParent = 14;

							for(b = 0; b < menuItems.length; b++) { 
								//check if we are dealing with a sub menu item 
								if(menuItems[b].parent != 0 & menuItems[b].idx != undefined) {
									
									if(previousParent != parseInt(menuItems[b].parent) ) {
										d++;
										e = 0;
										previousParent = parseInt(menuItems[b].parent);
									}

									var subButtonAsset = g.clone();
										subButtonAsset.attr({
											"class" : "sub-button-group",
											"visibility" : "hidden",
											"id" : "sub-button-" + menuItems[b].idx
										});
										subButtonAsset.transform("t" + (posArray[ d ][0] + 81) + "," + ( posArray[d][1] + 72 + (e  * 40) ) );
										
										subButtonAsset.select("text").attr({
											"text" : menuItems[b].title,
											"opacity" : "0"
										});
										
										subButtonAsset.select("g g g g:first-of-type circle:first-of-type").attr("r", "0");
										subButtonAsset.select("g g g g:first-of-type circle:last-of-type").attr("r", "0");
										subButtonAsset.select("g g g circle:first-of-type").attr("r", "0");

									var subHitRect = paper.rect(0,0,120,25);
										subHitRect.attr({
											"id" : "sub-button-" + menuItems[b].idx,
											"class" : "sub-button-hit",
											"fill" : "rgba(0,0,0,0)",
											"visibility" : "hidden"
										});

										subHitRect.mouseover(mainMenuHandler);
										subHitRect.mouseout(mainMenuHandler);
										subHitRect.mousedown(mainMenuHandler);
										subHitRect.mouseup(mainMenuHandler);
										subHitRect.touchstart(mainMenuHandler);
										subHitRect.touchend(mainMenuHandler);

										subButtonAsset.append(subHitRect);

										paper.append(subButtonAsset);

									e++;
									console.log(menuItems[b].idx, menuItems[b].parent, menuItems[b].title, menuItems[b].url, menuItems[b].guid, posArray[d], d);
									
								}
							}
				break;
				case "view-button-group":
						console.log("view button");
							g.transform("t-78,64");
							g.attr("class", "view-button-group");
							g.attr("visibility", "hidden");

							g.mouseover(mainMenuHandler);
							g.mouseout(mainMenuHandler);
							g.mousedown(mainMenuHandler);
							g.mouseup(mainMenuHandler);
							g.touchstart(mainMenuHandler);
							g.touchend(mainMenuHandler);

							paper.append(g);
				break;
			}
			//this needs to go in the switch statement
			

}
/* event handler functions */

function mainMenuHandler(event) {

		console.log("!: ", event.target.id);
		paper = Snap("#svg-menu");
		
		var elem;

		var menuGrid;
	switch(event.target.id) {
		case "menu-button-hit":
						switch(event.type) {
									case "mouseover":
											console.log("over");
											elem = paper.select("#" + event.target.id);
											elem.animate({	
												"stroke-width" : "11"
											}, 231, mina.bounce ); //, onAnimComplete

									break;

									case "mouseout":
											console.log("out")
												elem = paper.select("#" + event.target.id);
												elem.animate({	
													"stroke-width" : "0.5"
												}, 131, mina.easeout ); //, onAnimComplete
									break;

									case "mousedown":

									break;

									case "mouseup":

											// lets fade in the red bg grid

											var closeIcon = paper.selectAll("#menu-button-group rect");
										//for( c = 0; closeIcon.length; c++ ) {
											/*
											closeIcon[0].animate({
												"transform" : "t0 0 r45"
											});
											closeIcon[2].animate({
												"transform" : "t0 0 r-45"
											});
											*/
											closeIcon[0].transform("t0,0r45");
											closeIcon[2].transform("t0,0r-45");


											menuGrid = fgScene.getObjectByName( "menu-grid" );
											menuGrid.traverse( function ( child ) {
											
														if ( child instanceof THREE.Mesh ) {
																				//child.material.opacity = 1;
																				TweenLite.to(child.material, 1.21, { opacity: 0.61 });
														}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading
												} );
											
											//fadein the main buttons
											elem = paper.selectAll(".main-button-group")

											elem.forEach( function( el ) {
												el.attr({
													'visibility': 'visible'
												});
												el.select("rect").attr({
													'visibility': 'visible'
												});
												TweenLite.to(".main-button-cls-4", 1.21, { opacity: 1, delay: 1 });
												//TweenLite.to(el.select("g g g g:first-of-type circle:first-of-type"), 1.21, { r: 27, delay: 1.21 });
												//TweenLite.to(el.select("g g g g:first-of-type circle:last-of-type"), 1.21, { r: 5.5, delay: 1.21 });
												//TweenLite.to(el.select("g g g circle:first-of-type"), 1.21, { r: 27, delay: 1.21 });
												//TweenLite.to(  )
												
												el.select("g g g g:first-of-type circle:first-of-type").animate({
																	"r" : "27"},
																	1231,
																	mina.bounce );
												el.select("g g g g:first-of-type circle:last-of-type").animate({
																	"r" : "5.5"},
																	1231,
																	mina.bounce );
												el.select("g g g circle:first-of-type").animate({
																	"r" : "27"},
																	1231,
																	mina.bounce );


											});
											
											// lets fade in the submenu
											elem = paper.selectAll(".sub-button-group");
											elem.forEach( function( el ) {
												el.attr({
													'visibility': 'visible'
												});
												el.select("rect").attr({
													'visibility': 'visible'
												});
												TweenLite.to(".sub-button-cls-4", 1.21, { opacity: 1, delay: 1.5 });

												el.select("g g g g:first-of-type circle:first-of-type").animate({
																	"r" : "11.5"},
																	1431,
																	mina.bounce );
												el.select("g g g g:first-of-type circle:last-of-type").animate({
																	"r" : "2.83"},
																	1431,
																	mina.bounce );
												el.select("g g g circle:first-of-type").animate({
																	"r" : "11.5"},
																	1431,
																	mina.bounce );

											});

											//lets contract the menu when the user mouse leaves the area
											paper.select("#mouse-leave").mouseover(mainMenuHandler);

									break;

									case "touchstart":

									break;

									case "touchend":

									break;
						}
		break;

		case "mouse-leave":
				// the leaving of the menu
				switch(event.type) {
					case "mouseover":
								//lets contract the menu when the user mouse leaves the area
								menuGrid = fgScene.getObjectByName( "menu-grid" );
								menuGrid.traverse( function ( child ) {
											
														if ( child instanceof THREE.Mesh ) {
																				//child.material.opacity = 1;
																				TweenLite.to(child.material, 1.21, { opacity: 0 });
														}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading
												} );
								elem = paper.selectAll(".main-button-group")

											elem.forEach( function( el ) {
												el.attr({
													'visibility': 'visible'
												});

												el.select("rect").attr({
													'visibility': 'hidden'
												});

												el.select("text").animate({
																	"opacity" : "0"},
																	1516,
																	mina.linear ); //, onAnimComplete
												el.select("g g g g:first-of-type circle:first-of-type").animate({
																	"r" : "0"},
																	616,
																	mina.bounce );
												el.select("g g g g:first-of-type circle:last-of-type").animate({
																	"r" : "0"},
																	616,
																	mina.bounce );
												el.select("g g g circle:first-of-type").animate({
																	"r" : "0"},
																	616,
																	mina.bounce );

											} );

								elem = paper.selectAll(".sub-button-group")

											elem.forEach( function( el ) {
												el.attr({
													'visibility': 'visible'
												});

												el.select("rect").attr({
													'visibility': 'hidden'
												});

												el.select("text").animate({
																	"opacity" : "0"},
																	1116,
																	mina.linear ); //, onAnimComplete
												el.select("g g g g:first-of-type circle:first-of-type").animate({
																	"r" : "0"},
																	316,
																	mina.bounce );
												el.select("g g g g:first-of-type circle:last-of-type").animate({
																	"r" : "0"},
																	316,
																	mina.bounce );
												el.select("g g g circle:first-of-type").animate({
																	"r" : "0"},
																	316,
																	mina.bounce );

											} );

											
											paper.unmouseout(mainMenuHandler);

					break;

					default:
							console.log("event not handled");
					break;
				}
		default:
			var id = event.target.id;
				id = id.substr(id.lastIndexOf("-") + 1);
			console.log(event, id, event.target.className.baseVal);
			switch(event.target.className.baseVal) {
				case "main-button-hit":
							switch(event.type) {
								case "mouseup":
												jQuery("li#menu-item-" + id + " a")[0].click();
								break;
								default:
										console.log(event.type);
								break;
							}
							
				break;

				case "sub-button-hit":
							switch(event.type) {
								case "mouseup":
												jQuery("li#menu-item-" + id + " a")[0].click();
								break;
								default:
										console.log(event.type);
								break;
							}
				break;
			}
		break;

	}

}

jQuery( window ).resize(function() {
	onWindowResize();
});
