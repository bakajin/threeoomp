/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgGeometry, bgMaterial, bgMesh;

var balloonGeometry, balloonMaterial, balloonMesh;

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

	// insert textureLoader
	var textureLoader = new THREE.TextureLoader( manager );

	// model background
	var bgLoader = new THREE.OBJLoader( manager );
				bgLoader.load( themePath + '/assets/three_bg-tri-grid.obj', function ( object ) {
					object.name = "bg-grid-1";
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshPhongMaterial({ 
														color: 0xffffff,
														emissive : 0x000000,
														specular: 0x111111,
														shininess: 24, 
														shading: THREE.FlatShading,
														aoMap : textureLoader.load(themePath + '/assets/bg-tri-grid_ambocc.png'),
														normalMap : textureLoader.load(themePath + '/assets/bg-tri-grid_normal.png'),
														normalScale: new THREE.Vector2( 1, 1 )

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
					scene.add( object );
					
					camera.lookAt(object.position);

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
					scene.add( object );
					

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

					scene.add( object );
					

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
			var posArray = new Array([50,25],[0,150],[200,230],[-50,0]);
			var idxConversionArray = new Array();

			paper = Snap("#svg-menu");

		var g = event.select("g");
			console.log("snap svg load: ", event, g.attr("id") );

			switch(g.attr("id")) {
				case "menu-button-group":
							g.transform("t250,25");

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
											"id" : "main-button-" + menuItems[b].idx
										});
										buttonAsset.transform("t" + posArray[c][0] + "," + posArray[c][1]);
										
										buttonAsset.select("text").attr({
											"text" : menuItems[b].title
										});
								
										paper.append(buttonAsset);

										idxConversionArray[menuItems[b].idx] = c;

									c++;
								}
							}
				break;
				case "sub-button-group":
							var d = 0;
							var previousParent = 14;

							for(b = 0; b < menuItems.length; b++) { 
								//check if we are dealing with a sub menu item 
								if(menuItems[b].parent != 0 & menuItems[b].idx != undefined) {
									
									if(previousParent != parseInt(menuItems[b].parent) ) {
										d++;
										previousParent = parseInt(menuItems[b].parent);
									}

									var subButtonAsset = g.clone();
										subButtonAsset.attr({
											"id" : "sub-button-" + menuItems[b].idx
										});
										subButtonAsset.transform("t" + (posArray[ d ][0] + 10) + "," + ( posArray[d][1] + (d + 1) * 30 ) );
										
										subButtonAsset.select("text").attr({
											"text" : menuItems[b].title
										});
								
										paper.append(subButtonAsset);
									
									console.log(menuItems[b].idx, menuItems[b].parent, menuItems[b].title, menuItems[b].url, menuItems[b].guid, posArray[d], d);
									
								}
							}
				break;
				case "view-button-group":
						console.log("view button");
				break;
			}
			//this needs to go in the switch statement
			

}
