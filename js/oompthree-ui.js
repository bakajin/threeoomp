/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
var heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgGeometry, bgMaterial, bgMesh;

var mylarBalloon = new THREE.Object3D();
var mylarBalloonMixer = new TimelineLite();

var balloonMaterial, balloonMesh;

//var balloonAnimationMixer;

var backGroundView;
var foreGroundView;

//snap svg for the menu
var paper;

/* global function calls */
function render() {
	init();
	menu("load");

	animate();	
}


function init() {
		console.log("init");
		backgroundView = document.getElementById('threed-background');
		foregroundView = document.getElementById('threed-foreground');
		
		scene = new THREE.Scene();
		scene.background = 0xffffff;
		//Fog( hex, near, far )
		scene.fog = new THREE.Fog( 0xffffff, 1, 150);
		//scene.fog = new THREE.Fog( 0xd4c978, 1, 150);

	//hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		//scene.add( hemisphereLight );
		ambientLight = new THREE.AmbientLight( 0x000000 );
		directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 10, 90, 10 );
		

		scene.add( directionalLight );
		scene.add( ambientLight );

		// field of view, aspect ratio, near plane, far plane 
		camera = new THREE.PerspectiveCamera( 63, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 150);
		camera.position.x = 0;
		camera.position.y = 90;
		camera.position.z = 0;
	
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
														normalScale: new THREE.Vector2( 0.61, 0.61 )

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
					scene.add( bgOne );
					camera.lookAt(bgOne.position);
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


				bgTwo.position.y = 0.01;
				scene.add(bgTwo);

				}, onProgress, onError );

	//environment map ballon (for reflectivity)
	
	// model balloon
	var axis = new THREE.AxisHelper( 50 );
		scene.add( axis );

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

		
		mylarBalloon.position.z = -38; //up and down, vertical positive is down negative is up!
		mylarBalloon.position.y = 10;//moves through the grid
		mylarBalloon.position.x = -34; // left to right
		
		var keyToKey = 1.33;
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 0, y : 10, z : 141, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -9, y : 10, z : 110, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 7, y : 10, z : 63, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -6, y : 10, z : 28, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : 5, y : 10, z : -5, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -28, y : 10, z : -38, ease: SlowMo.ease.config(0.1, 0.1, false)});
		//bouncing up top
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -30, y : 10, z : -32, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -32, y : 10, z : -38, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -33, y : 10, z : -34, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -33.5, y : 10, z : -38, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -33.9, y : 10, z : -36, ease: SlowMo.ease.config(0.1, 0.1, false)});
		mylarBalloonMixer.to(mylarBalloon.position, keyToKey, { x : -34.2, y : 10, z : -38, ease: SlowMo.ease.config(0.1, 0.1, false)});

		mylarBalloonMixer.play();
	//	mylarBalloon.rotation.y = 1;
		scene.add(mylarBalloon);

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
				scene.add(object);

				}, onProgress, onError );

		//for the future two canvasses on over the other with the content in between setting the top renderer to transparent background
	renderer = new THREE.WebGLRenderer( { alpha: true } );
	/* 
	
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	*/
	renderer.setPixelRatio( window.devicePixelRatio );
	onWindowResize();
	//renderer.setSize( window.innerWidth, window.innerHeight );
	
	backgroundView.appendChild( renderer.domElement );

	
}

function onWindowResize() {

				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;

				widthRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
				heightRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();

				console.log("ratios:: width: " + widthRatio + " heigth: " + heightRatio, camera.position.y, camera.position.y * widthRatio);
				
				camera.position.y = 130 * widthRatio;

				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				//camera.position.z = 1 * widthRatio;

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
	renderer.render( scene, camera );
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
		//
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
			var posArray = new Array([23,157],[-12,363],[215,475],[-50,0]);
			var idxConversionArray = new Array();

			paper = Snap("#svg-menu");

		var g = event.select("g");
			//console.log("snap svg load: ", event, g.attr("id") );

			switch(g.attr("id")) {
				case "menu-button-group":
							g.transform("t300,100");
							g.attr("class", "menu-button-group");
							
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

										buttonAsset.mouseover(mainMenuHandler);
										buttonAsset.mouseout(mainMenuHandler);
										buttonAsset.mousedown(mainMenuHandler);
										buttonAsset.mouseup(mainMenuHandler);
										buttonAsset.touchstart(mainMenuHandler);
										buttonAsset.touchend(mainMenuHandler);

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
											"text" : menuItems[b].title
										});
										
										subButtonAsset.mouseover(mainMenuHandler);
										subButtonAsset.mouseout(mainMenuHandler);
										subButtonAsset.mousedown(mainMenuHandler);
										subButtonAsset.mouseup(mainMenuHandler);
										subButtonAsset.touchstart(mainMenuHandler);
										subButtonAsset.touchend(mainMenuHandler);

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
											//fadein the main buttons
											elem = paper.selectAll(".main-button-group")

											elem.forEach( function( el ) {
												el.attr({
													'visibility': 'visible'
												});
												el.select("text").animate({
																	"opacity" : "1"},
																	3031,
																	mina.linear ); //, onAnimComplete
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

											} );

											 	menuGrid = scene.getObjectByName( "menu-grid" );
												menuGrid.traverse( function ( child ) {
											
														if ( child instanceof THREE.Mesh ) {
																				//child.material.opacity = 1;
																				TweenLite.to(child.material, 1.21, { opacity:1 });
														}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading
												} );

											//lets contract the menu when the user mouse leaves the area
											paper.mouseout(mainMenuHandler);

									break;

									case "touchstart":

									break;

									case "touchend":

									break;
						}
		break;

		case "svg-menu":
				// the leaving of the menu
				switch(event.type) {
					case "mouseout":
								//lets contract the menu when the user mouse leaves the area
								menuGrid = scene.getObjectByName( "menu-grid" );
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

											
											paper.unmouseout(mainMenuHandler);

					break;

					default:
							console.log("event not handled");
					break;
				}
		default:
			console.log(event);
		break;

	}

}

jQuery( window ).resize(function() {
	onWindowResize();
});
