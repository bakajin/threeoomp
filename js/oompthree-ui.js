/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgGeometry, bgMaterial, bgMesh;

var mylarBalloon = new THREE.Object3D();
var balloonMaterial, balloonMesh;

var balloonAnimationMixer;

var view;

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
		view = document.getElementById('canvas3d');

		
		scene = new THREE.Scene();
		scene.background = 0xffffff;
		//Fog( hex, near, far )
		scene.fog = new THREE.Fog( 0xffffff, 1, 150);
		//scene.fog = new THREE.Fog( 0xd4c978, 1, 150);

	//hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		//scene.add( hemisphereLight );
		ambientLight = new THREE.AmbientLight( 0x000000 );
		directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 0, 1, 0 );
		
		scene.add( directionalLight );
		scene.add( ambientLight );

		// field of view, aspect ratio, near plane, far plane 
		camera = new THREE.PerspectiveCamera( 63, window.innerWidth / window.innerHeight, 1, 150);
	
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
	// insert a new animation mixer to control animation clips
	balloonAnimationMixer = new THREE.AnimationMixer(scene);
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
	 var balloonLoader = new THREE.OBJLoader( manager );
				balloonLoader.load( themePath + '/assets/three_mylar-balloon.obj', function ( object ) {
					var sphericalEnvironmentTexture = textureLoader.load(themePath + '/assets/app_hallway-2.jpg');
						sphericalEnvironmentTexture.mapping = THREE.SphericalReflectionMapping;
					
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

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
															combine : THREE.MixOperation,

															

											}); //envMap : textureLoader.load(themePath + '/assets/app_hallway-2.jpg'),
											// roughness, metalness, specularMap, normalMap, (normalScale), envMap, reflectivity, combine
							
							//reflectivity : 

						}

					} );

					
				/*
					object.position.z = 20;
					object.position.y = - 95;
					object.rotation.y = 90;
					object.scale.x = 10;
					object.scale.y = 10;
					object.scale.z = 10;
				*/
					mylarBalloon.add( object );
					

				}, onProgress, onError );
	
	var ropeLoader = new THREE.OBJLoader( manager );
		ropeLoader.load( themePath + '/assets/rope-mp.obj', function ( object ) {
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshPhongMaterial({ 

															color: 0x000000,
															emissive : 0x000000,
															specular: 0x111111,
															shininess: 24, 
															shading: THREE.SmoothShading,
									
											});

						}

					} );

					mylarBalloon.add( object );
					

				}, onProgress, onError );

		mylarBalloon.scale.x = 0.81;
		mylarBalloon.scale.y = 0.81;
		mylarBalloon.scale.z = 0.81;
		
		mylarBalloon.position.z = -8; //up and down, vertical
		mylarBalloon.position.y = 0;//moves through the grid
		mylarBalloon.position.x = -12; // left to right
		
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


	renderer = new THREE.WebGLRenderer();
	/* 
	
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	*/
	renderer.setPixelRatio( window.devicePixelRatio );
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	view.appendChild( renderer.domElement );
}

function animate() {
	//console.log("animate");
	//animate stuff
	requestAnimationFrame( animate );

	//mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

	renderer.render( scene, camera );
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
			console.log("snap svg load: ", event, g.attr("id") );

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

		//console.log("!: ", event.target.id);
		paper = Snap("#svg-menu");
		
		var elem;

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

											var menuGrid = scene.getObjectByName( "menu-grid" );
												menuGrid.traverse( function ( child ) {
											
														if ( child instanceof THREE.Mesh ) {
																				child.material.opacity = 1;
														}//color: 0xffffff, emissive : 0x66655e, specular: 0xd4c978, shininess: 42, shading: THREE.FlatShading
												} );



									break;

									case "touchstart":

									break;

									case "touchend":

									break;
						}
		break;

		default:
			console.log(event);
		break;

	}

}
