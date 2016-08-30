/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

//using user agent because the rest is totally unusable
var clientSettings = new Object();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
var heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

var tanFOV;
var initWindowHeight;

var offsetValue = 0;
var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgScene, fgScene;

var bgRenderer, fgRenderer;

var backgroundView, foregroundView;

var axis;

var bgGeometry, bgMaterial, bgMesh;

var mylarBalloon = new THREE.Object3D();
var mylarBalloonMixer = new TimelineLite();

var balloonMaterial, balloonMesh;

//raycaster for mouse tracks
var projector;
var targetList = [];

//snap svg for the menu
var paper;

/* global function calls */
function render() {
	init();
	menu("load");

	animate();	
}

function init() {
		console.log("init", navigator.clientSettings);
		
//maybe do in a separate function

		backgroundView = document.getElementById('threed-background');
		foregroundView = document.getElementById('threed-foreground');
		
		bgRenderer = new THREE.WebGLRenderer( { alpha: true, antialias : true } );
		fgRenderer = new THREE.WebGLRenderer( { alpha: true, antialias : true } );
		
		bgRenderer.setSize(window.innerWidth, window.innerHeight);
		fgRenderer.setSize(window.innerWidth, window.innerHeight);

		backgroundView.appendChild( bgRenderer.domElement );
		foregroundView.appendChild( fgRenderer.domElement );

		bgScene = new THREE.Scene();
		//bgScene.background = 0xffffff;
		//Fog( hex, near, far 
		bgScene.fog = new THREE.Fog( 0xffffff, 1, 200);

		fgScene = new THREE.Scene();
		//fgScene.background = 0xffffff;
		

	//hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		//scene.add( hemisphereLight );
		ambientLight = new THREE.AmbientLight( 0x000000 );
		directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 10, 90, -30 );
		

		bgScene.add( directionalLight );
		bgScene.add( ambientLight );

		fgScene.add( directionalLight.clone() );
		fgScene.add( ambientLight.clone() );


		// field of view, aspect ratio, near plane, far plane 
		camera = new THREE.PerspectiveCamera( 63, window.innerWidth / window.innerHeight, 1, 450);
		camera.position.set(0,90,0);
		camera.lookAt(bgScene.position);
		//camera.position.x = 0;
		//camera.position.y = 90;
		//camera.position.z = 0;
	
	//set up manager
	var manager = new THREE.LoadingManager();
		manager.onProgress = function( item, loaded, total ) {
			//console.log( item, loaded, total );
		};
	// event listeners
	var onProgress = function ( xhr ) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			//console.log( Math.round(percentComplete, 2) + "% downloaded" );
		}
	};

	var onError = function ( xhr ) {

	};

	// insert textureLoader
	var textureLoader = new THREE.TextureLoader( manager );

	var bgOne;
	var bgOneVerticalClone;
	var bgTwo;
	var bgTwoVerticalClone;
	
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
														normalScale: new THREE.Vector2( 0.51, 0.51 ),
														

											}); // specularMap, aoMap, (normalMap)

						}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading

					} );

					targetList.push(bgOne);

					bgOneVerticalClone = bgOne.clone();
					bgOneVerticalClone.name = "bg-grid-vertical-clone-1"

				var getSize = new THREE.Box3().setFromObject( bgOneVerticalClone );
					
					bgOneVerticalClone.traverse( function( child ) {

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
																		normalScale: new THREE.Vector2( 0.51, 0.51 ),
																		side : THREE.BackSide

																		}); // specularMap, aoMap, (normalMap)

																		//child.material.side = THREE.BackSide;
														}
					});

					console.log("?? ", bgOneVerticalClone.scale.z, getSize.size().z, getSize.min, getSize.max);
					bgOneVerticalClone.scale.z = -1//getSize.size().z * -1;
					bgOneVerticalClone.position.z += (getSize.size().z * 1.4);
					
					bgScene.add( bgOne );
					bgScene.add( bgOneVerticalClone );
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

				bgTwoVerticalClone = bgTwo.clone();
				bgTwoVerticalClone.scale.z = -1//getSize.size().z * -1;
				bgTwoVerticalClone.position.z += (getSize.size().z * 1.4);
					

				bgScene.add(bgTwo);

				targetList.push(bgTwo);
				
				bgScene.add(bgTwoVerticalClone);

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
		
		checkClient("load");

		mylarBalloon.position.x = 0; // left to right
		mylarBalloon.position.y = 10;//moves through the grid
		mylarBalloon.position.z = 80;//up and down, vertical positive is down negative is up!

		var sizeOffset = 0;
		var posOffset = new THREE.Vector3(-60,10,-35);
		if(clientSettings.device == "iPhone" || clientSettings.device == "Android") {																		
				switch(clientSettings.orientation) {
					case "landscape":
							sizeOffset = 0.26;
							posOffset.x = -53;
							posOffset.z = -33;

							mylarBalloon.position.z = 141;
					break;
					case "portrait":
							sizeOffset = 1.16;
							posOffset.x = -52;
							posOffset.z = -21;
					break;
					default:
							sizeOffset = 1.16;
							posOffset.x = -52;
							posOffset.z = -40;
					break;
				}
																				
		}

		mylarBalloon.scale.x = 0.81 + sizeOffset;
		mylarBalloon.scale.y = 0.61 + sizeOffset;
		mylarBalloon.scale.z = 0.81 + sizeOffset;

		var keyToKey = 1.33;
		var tweenType = "Power1.easeInOut";
		//var tweenType = "Power.easeIn";
		//up to the top in a wavey motion
			// x y z duration
		var balloonKeys = new Array();

			balloonKeys.push ( new THREE.Vector4( 4, 10, 52, 0) );
			balloonKeys.push ( new THREE.Vector4( -0.43, 9.5, -39.72, 1.93 ) );
			balloonKeys.push ( new THREE.Vector4( -0.43, 10.5, -40.23, 0.07 ) );
			balloonKeys.push ( new THREE.Vector4( -4, 9.5, -37.66, 0.17 ) );
			balloonKeys.push ( new THREE.Vector4( -9, 10.5, -39.89, 0.63 ) );
			balloonKeys.push ( new THREE.Vector4( -13, 9.5, -37.35, 0.4 ) );
			balloonKeys.push ( new THREE.Vector4( -22, 10.5, -40.06, 0.4 ) );
			balloonKeys.push ( new THREE.Vector4( -27, 9.5, -37.90, 0.4 ) );
			balloonKeys.push ( new THREE.Vector4( -36, 10.5, -40.33, 0.43 ) );
			balloonKeys.push ( new THREE.Vector4( -41, 9.5, -38.86, 0.4 ) );
			balloonKeys.push ( new THREE.Vector4( -52, 10.5, -40.06, 0.4 ) );
			balloonKeys.push ( new THREE.Vector4( -60, 9.5, -37.90, 0.43 ) );
			balloonKeys.push ( new THREE.Vector4( -61, 10.5, -39.89, 0.4 ) );

		mylarBalloonMixer.to(mylarBalloon.position, ( 4.6 ), { z : posOffset.z, ease: Power2.easeIn }, 0);
		mylarBalloonMixer.to(mylarBalloon.position, ( 2.6 ), { x : (posOffset.x + 70), ease: tweenType, repeat : 1, yoyo : true }, 0);
		mylarBalloonMixer.to(mylarBalloon.position, ( 1 ), { y : 11.26, ease: tweenType, repeat : -1, yoyo : true }, 0);

		
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : (posOffset.x + 62), ease: tweenType, repeat : 2, yoyo : true }, 4.6 );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 9, ease: tweenType, repeat : 2, yoyo : true }, 4.6 );

		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey * 7 ), { x : posOffset.x, ease: tweenType }, 5.22 );
		//mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : -58, ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 6 + keyToKey * 6 ) );
		
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 9.74, ease: tweenType, repeat : 6, yoyo : true }, ( keyToKey * 3 ) );
		//mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { z : -38, ease: tweenType, repeat : 5, yoyo : true }, ( keyToKey * 4 ) );
		//turbulizerloops
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { x : (posOffset.x - 1.5), ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 18 ) );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { y : 11, ease: tweenType, repeat : -1, yoyo : true }, ( keyToKey * 6 ) );
		mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey ), { z : (posOffset.z + 1.2), ease: Power2.easeOut, repeat : -1, yoyo : true }, ( 5.22 ) );

	
		//	mylarBalloonMixer.to(mylarBalloon.position, ( keyToKey * 6 ), { x : -20, y : 10, z : -36, ease: tweenType2 });
		
			mylarBalloonMixer.play();
	//	mylarBalloon.rotation.y = 1;
			fgScene.add(mylarBalloon);

			//targetList.push(mylarBalloon);
		tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );

		initWindowHeight = window.innerHeight;

		onWindowResize();
		
		projector = new THREE.Projector();
		document.addEventListener( 'mousemove', onRayCastMouseMouse, false );
	
}

function onWindowResize() {
				checkClient("resize");
				//bgRenderer.setPixelRatio( clientSettings.pixelRatio );
				//fgRenderer.setPixelRatio( clientSettings.pixelRatio );
				
				//clientSettings.pixelRatio = window.devicePixelRatio;
				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;

				widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
				heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

				//camera.aspect = heightRatio;// / 1.6;
				//camera.updateProjectionMatrix();

				var interest = bgScene.getObjectByName( "camera_interest" );
				
				camera.aspect = window.innerWidth / window.innerHeight;
    
   			// adjust the FOV
    			camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / initWindowHeight ) );
    			camera.updateProjectionMatrix();
    			camera.position.y = 130 * widthRatio;//camera.fov * heightRatio//130 * widthRatio; //90 

				//camera.zoom = 10//camera.fov * widthRatio;
				interest.position.z = camera.fov / heightRatio - clientSettings.factor; //13
				camera.position.z = interest.position.z;
				camera.lookAt(interest.position);

    			bgScene.fog = new THREE.Fog( 0xffffff, 1, (camera.position.y + 101) );   
				console.log("set camera : ", camera.fov, camera.zoom, camera.position.y, camera.position.z, interest.position.z);
    			console.log("\t\t\t wxh ratios : ", widthRatio, heightRatio, window.innerWidth, window.innerHeight);

    			bgRenderer.setSize( window.innerWidth, window.innerHeight );
    			fgRenderer.setSize( window.innerWidth, window.innerHeight );
    			
    
				//seeing as the ratio of the screen wont change lets keep it all 16:9
			//	var staticWidthRatio = 9 / 16;
			//	var staticHeightRatio = 16 / 9;
			//	var camMove = (SCREEN_WIDTH / -130) * widthRatio;
					
				//console.log("ratios:: width: " + widthRatio + " height: " + heightRatio, interest.position.z);

					camera.position.z = interest.position.z;
					camera.lookAt(interest.position);


}

function checkClient(phase) {

		var uA = navigator.userAgent;
		
		SCREEN_WIDTH = window.innerWidth;
		SCREEN_HEIGHT = window.innerHeight;

		//{ device : "", version : "", orientation : "", browser : "", factor : "", w : "", h : "", ratio : "" } 
		clientSettings.device = "Default";
		clientSettings.browser = "Default";
		clientSettings.version = "";
		clientSettings.orientation = "";
		clientSettings.factor = 0;
		clientSettings.width = SCREEN_WIDTH;
		clientSettings.height = SCREEN_HEIGHT;
		clientSettings.ratio = window.devicePixelRatio;
		

		var fac = 0;

		if(SCREEN_WIDTH > SCREEN_HEIGHT) {
			//landscape view
		
								if(SCREEN_WIDTH >= 320) {
									//iphone 4s in landscape
									console.log("320+");
									fac = 8;
								
								}

								if(SCREEN_WIDTH >= 480) {
									
									console.log("480+");
									fac = 9;
								}
								
								if(SCREEN_WIDTH >= 640) {
									//
									console.log("640+");
									fac = 6;
								
								}
								
								if(SCREEN_WIDTH >= 800) {
									console.log("800+");
									fac = 7;
								}
									
								
								if(SCREEN_WIDTH >= 1024) {
									console.log("1024+");
									fac = 12;
								}

								if(SCREEN_WIDTH >= 1280) {
									console.log("1280+");
									fac = 12;
								}

								if(SCREEN_WIDTH >= 1366) {
									console.log("macbookpro 13 retina");
									console.log("1366+");
									fac = 14;
									
								}
									
								if(SCREEN_WIDTH >= 1440) {
									console.log("macbookpro 15 1440+");
									fac = 14;
									
								}
								if(SCREEN_WIDTH >= 1600) {
									console.log("1600+");
									fac = 14;
								}

								if(SCREEN_WIDTH >= 1920) {
									console.log("1920+");
									fac = 15;
									
								}

								if(SCREEN_WIDTH >= 2560) {
									console.log("macbookpro 15 retina 2560+");

									fac = 11;
									
								}
		} else {
			//portrait
			console.log("something portrait like");
			fac = 0;
			if(SCREEN_WIDTH >= 320) {
									//iphone 4s in landscape
									console.log("320+");
									fac = 8;
								
								}

								if(SCREEN_WIDTH >= 480) {
									
									console.log("480+");
									fac = 9;
								}
								
								if(SCREEN_WIDTH >= 640) {
									//
									console.log("640+");
									fac = 6;
								
								}
								
								if(SCREEN_WIDTH >= 800) {
									console.log("800+");
									fac = 7;
								}
									
								
								if(SCREEN_WIDTH >= 1024) {
									console.log("1024+");
									fac = 12;
								}

								if(SCREEN_WIDTH >= 1280) {
									console.log("1280+");
									fac = 12;
								}

								if(SCREEN_WIDTH >= 1366) {
									console.log("macbookpro 13 retina");
									console.log("1366+");
									fac = 14;
									
								}
									
								if(SCREEN_WIDTH >= 1440) {
									console.log("macbookpro 15 1440+");
									fac = 14;
									
								}
								if(SCREEN_WIDTH >= 1600) {
									console.log("1600+");
									fac = 14;
								}

								if(SCREEN_WIDTH >= 1920) {
									console.log("1920+");
									fac = 15;
									
								}

								if(SCREEN_WIDTH >= 2560) {
									console.log("macbookpro 15 retina 2560+");

									fac = 11;
									
								}
		}

		//lets check for safari first, because chrome hold double values (Chrome and safari)
		if(uA.search("Safari") != -1) {
			console.log("Safari or Chrome is safari");
			clientSettings.browser = "Safari";
			clientSettings.factor = 20;
		}
		
		if(uA.search("Chrome") != -1) {
			console.log("Chrome");
			clientSettings.browser = "Chrome";
			clientSettings.factor = 20;
		}

		if(uA.search("Firefox") != -1) {
			console.log("Firefox");
			clientSettings.browser = "Firefox";
			clientSettings.factor = 20;
		}

		if(uA.search("Opera") != -1) {
			console.log("Opera");
			clientSettings.browser = "Opera";
			clientSettings.factor = 20;
		}

		if(uA.search("Internet Explorer") != -1) {
			console.log("Explorer");
			clientSettings.browser = "IE";
			clientSettings.factor = 20;
		}

//check for devices
		if(uA.search("iPad") != -1) {
			console.log("ipad");
			clientSettings.device = "iPad";
			clientSettings.factor = 30;
		}

		if(uA.search("Intel Mac") != -1) {
			console.log("mac");
			clientSettings.device = "Mac";
			clientSettings.factor = 30;
		}

		if(uA.search("Android") != -1) {
			console.log("Android, this also can state mMobile on phone and Tablet for tablets");
			clientSettings.device = "Android";
			clientSettings.factor = 30;
		}
		
		if(uA.search("iPhone") != -1) {
			//console.log("iphone");
					clientSettings.device = "iPhone";
					
					
					if(SCREEN_WIDTH == 320 && SCREEN_HEIGHT == 480) {
									//iphone 4s in portrait
									console.log("iphone4");
									clientSettings.version = 4;
									clientSettings.orientation = "portrait";
									clientSettings.factor = 30;
					}
					if(SCREEN_WIDTH == 480 && SCREEN_HEIGHT == 320) {
									//iphone 4s in landscape
									console.log("iphone4");
									clientSettings.version = 4;
									clientSettings.orientation = "landscape";
									clientSettings.factor = 36;
					}
					if(SCREEN_WIDTH == 320 && SCREEN_HEIGHT == 568) {
									//iphone 5s in portrait
									console.log("iphone5 portrait ");
									clientSettings.version = 5;
									clientSettings.orientation = "portrait";
									clientSettings.factor = 19;
									
					}
					if(SCREEN_WIDTH == 568 && SCREEN_HEIGHT == 320) {
									//iphone 5s in landscape
									console.log("iphone5 landscape ");
									clientSettings.version = 5;
									clientSettings.orientation = "landscape";
									clientSettings.factor = 36;
									
					}
					if(SCREEN_WIDTH == 375 && SCREEN_HEIGHT == 667) {
									//iphone 6s in portrait
									console.log("iphone6s");
									clientSettings.version = 6;
									clientSettings.orientation = "portrait";
									clientSettings.factor = 18;
									
					}
					if(SCREEN_WIDTH == 667 && SCREEN_HEIGHT == 375) {
									//iphone 6s in landscape
									console.log("iphone6s");
									clientSettings.version = 6;
									clientSettings.orientation = "landscape";
									clientSettings.factor = 37;
									
					}
					if(SCREEN_WIDTH >= 414 && SCREEN_HEIGHT == 736) {
									//iphone 6s+ in portrait
									console.log("iphone6s +");
									clientSettings.version = 6.6;
									clientSettings.orientation = "portrait";
									clientSettings.factor = 26;
									
					}
					if(SCREEN_WIDTH >= 736 && SCREEN_HEIGHT == 414) {
									//iphone 6s+ in landscape
									console.log("iphone6s +");
									clientSettings.version = 6.6;
									clientSettings.orientation = "landscape";
									clientSettings.factor = 38;
									
					}
			}


			clientSettings.factor += fac;
		
				 // 3.61;
				//console.log("use container ratio!!! : ",jQuery("#threed-background").innerHeight());
				console.log( "clientSettings: ", clientSettings.ratio, clientSettings.browser, clientSettings.device, clientSettings.version, clientSettings.factor, fac ); 
				console.log( "\t\t\t width height, width ratio, height ratio ", SCREEN_WIDTH, SCREEN_HEIGHT, widthRatio, heightRatio);			
							

				//
}

function onRayCastMouseMouse(event) {
	console.log(event);

	var mouse = { x : 0, y : 0 };
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	var mouseVector = new THREE.Vector3(mouse.x, mouse.y, 1);
		
		projector.unprojectVector( mouseVector, camera );

	var mouseRay = new THREE.Raycaster( camera.position, mouseVector.sub(camera.position).normalize() );

	var intersects = mouseRay.intersectObjects( targetList );

	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		console.log("Hit @ " + toString( intersects[0].point ) );
		// change the color of the closest face.
		//intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
		//intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
	}
}

function animate() {
	//console.log("animate");
	//animate stuff
	requestAnimationFrame( animate );
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

	var bgRect = paper.group( paper.rect(-200, 0, 60, 750).attr({"fill" : "#ffffff", "id" : "mouse-leave"}), paper.rect(-200, 600, 750, 60).attr({"fill" : "#ffffff", "id" : "mouse-leave"}) );
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
							
							var previousParent = menuItems[0].idx;//14

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
									//console.log(menuItems[b].idx, menuItems[b].parent, menuItems[b].title, menuItems[b].url, menuItems[b].guid, posArray[d], d);
									
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

		//console.log("!: ", event.target.id);
		paper = Snap("#svg-menu");
		
		var elem;

		var menuGrid;
	switch(event.target.id) {
		case "menu-button-hit":
						switch(event.type) {
									case "mouseover":
											//console.log("over");
											elem = paper.select("#" + event.target.id);
											elem.animate({	
												"stroke-width" : "11"
											}, 231, mina.bounce ); //, onAnimComplete

									break;

									case "mouseout":
											//console.log("out")
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
			//console.log(event, id, event.target.className.baseVal);
			switch(event.target.className.baseVal) {
				case "main-button-hit":
							switch(event.type) {
								case "mouseup":
											jQuery("li#menu-item-" + id + " a")[0].click();

											//lets contract the menu when the user clicks a button
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
																	'visibilxity': 'visible'
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
																			816,
																			mina.linear ); //, onAnimComplete
															el.select("g g g g:first-of-type circle:first-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );
															el.select("g g g g:first-of-type circle:last-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );
															el.select("g g g circle:first-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );

													} );

											
											paper.unmouseout(mainMenuHandler);

								break;

								case "mouseover":
										//console.log("over");
											elem = paper.select("#main-button-" + id + " g g g circle");
											elem.animate({	
												"stroke-width" : "7"
											}, 331, mina.bounce ); //, onAnimComplete
								break;

								case "mouseout":
										//console.log("out");
											elem = paper.select("#main-button-" + id + " g g g circle");
											elem.animate({	
												"stroke-width" : "0.5"
											}, 331, mina.bounce ); //, onAnimComplete
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

											//lets contract the menu when the user clicks a button
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
																	'visibilxity': 'visible'
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
																			816,
																			mina.linear ); //, onAnimComplete
															el.select("g g g g:first-of-type circle:first-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );
															el.select("g g g g:first-of-type circle:last-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );
															el.select("g g g circle:first-of-type").animate({
																			"r" : "0"},
																			216,
																			mina.bounce );

													} );

											
											paper.unmouseout(mainMenuHandler);

								break;
								case "mouseover":
										//console.log("over");
											elem = paper.select("#sub-button-" + id + " g g g circle");
											elem.animate({	
												"stroke-width" : "4"
											}, 331, mina.bounce ); //, onAnimComplete
								break;

								case "mouseout":
										//console.log("out");
											elem = paper.select("#sub-button-" + id + " g g g circle");
											elem.animate({	
												"stroke-width" : "0.5"
											}, 331, mina.bounce ); //, onAnimComplete
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
