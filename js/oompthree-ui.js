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
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 150);
	
		camera.position.x = 0;
		camera.position.y = 100;
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

	// insert loading of texture here if needed

	// model background
	var bgLoader = new THREE.OBJLoader( manager );
				bgLoader.load( themePath + '/assets/three_bg-tri-grid.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive : 0x000000, specular: 0x111111, shininess: 24, shading: THREE.FlatShading} ); // specularMap, aoMap, (normalMap)

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

	// model balloon
	 var balloonLoader = new THREE.OBJLoader( manager );
				balloonLoader.load( themePath + '/assets/three_mylar-balloon.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshStandardMaterial( { color: 0xd78081 } ); // roughness, metalness, specularMap, normalMap, (normalScale), envMap, reflectivity, combine

						}

					} );

					object.position.z = 20;
				/*
					object.position.y = - 95;
					object.rotation.y = 90;
					object.scale.x = 10;
					object.scale.y = 10;
					object.scale.z = 10;
				*/
					scene.add( object );
					

				}, onProgress, onError );



	renderer = new THREE.WebGLRenderer();
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

function backgroundAsset(list) {
	// instantiate a loader
	var bgLoader = new THREE.OBJLoader();

		bgLoader.load(
			// resource URL
			themePath + list,
				// Function when resource is loaded
				function ( object ) {
					//scene.add( object );
					//for ( var i = 0; i < 2; i ++ ) {
						console.log("mesh bg");
						//	if(i > 0) {
							bgmaterial = new THREE.MeshPhongMaterial( { color: 0xededdd } )//, emissive: 0x4d4b44, specular: 0xffffff, shininess: 3, shading: THREE.FlatShading, wireframe: false, fog: true } ); //fix shader
					//	} else {
							//material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } ); //fix shader
					//	}
						var obj = object.content;

    						obj.traverse( function ( child ) {

        										if ( child instanceof THREE.Mesh ) {

           														 	child.material = bgmaterial;

        										}

    						});
    					obj.scale.set( 10, 10, 10 );
    					scene.add( obj );
				});

				//	    var bgmesh = new THREE.Mesh( object.geometry, bgmaterial );
    						//bgmesh.position.set( 0, i * 1, 0 );
    			//			bgmesh.scale.set( 10, 10, 10 );
    			//			scene.add( bgmesh );
				//}

			//}
		//);

	/*var balloonLoader = new THREE.OBJLoader();

		balloonLoader.load(
			// resource URL
			themePath + '/assets/three_mylar-balloon.obj',
			//'models/collada/monster/monster.dae',
			// Function when resource is loaded
			function ( object ) {
				scene.add( object );
			}
		);*/
}

function balloonAsset(list) {
	// instantiate a loader
	var balloonLoader = new THREE.OBJLoader();
		balloonLoader.addEventListener( 'load', function ( event ) {

    var object = event.content;

    	object.traverse( function ( child ) {

        	if ( child instanceof THREE.Mesh ) {

            	child.material = material;

        	}

    	});

    	scene.add( object );
	});

	balloonLoader.load(themePath + list);
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
			

			paper = Snap("#svg-menu");

		var g = event.select("g");
			console.log("snap svg load: ", event, g.attr("id") );
			switch(g.attr("id")) {
				case "menu-button-group":
							g.transform("t250,25");
							
				break;
				case "main-button-group":
							var posArray = [];

							for(b = 0; b < menuItems.length; b++) { 
							console.log(menuItems[b].idx, menuItems[b].parent, menuItems[b].title, menuItems[b].url, menuItems[b].guid);
						}
				break;
				case "sub-button-group":

				break;
				case "view-button-group":

				break;
			}
			paper.append(g);

}
