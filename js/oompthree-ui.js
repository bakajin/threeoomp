/* 
	OOMPthree function file
*/

/* globals */
var themePath, pageType;

var scene, camera, renderer, directionalLight, hemisphereLight, ambientLight;

var bgGeometry, bgMaterial, bgMesh;

var balloonGeometry, balloonMaterial, balloonMesh;

var view;

/* global function calls */
function render() {
	init();
	animate();	
}


function init() {
	console.log("init");
	view = document.getElementById('canvas3d');

	scene = new THREE.Scene();

	//hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		//scene.add( hemisphereLight );
		ambientLight = new THREE.AmbientLight( 0xcccccc );
		directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set( 0, 1, 0 );
		
		scene.add( directionalLight );
		scene.add( ambientLight );

	//set up manager
	var manager = new THREE.LoadingManager();
		manager.onProgress = function( item, loaded, total ) {
			console.log( item, laoded, total );
		};

	var onProgress = function ( xhr ) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + "% downloaded" );
		}
	};

	var onError = function ( xhr ) {

	};

	// model

				var loader = new THREE.OBJLoader( manager );
				loader.load( themePath + '/assets/three_bg-tri-grid.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = new THREE.MeshPhongMaterial( { color: 0xffffbb } );

						}

					} );

					//object.position.y = - 95;
					object.scale.x = 10;
					object.scale.y = 10;
					object.scale.z = 10;

					scene.add( object );

				}, onProgress, onError );

	// field of view, aspect ratio, near plane, far plane 
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 1000;

	//backgroundAsset("/assets/three_bg-tri-grid.obj"); 
	//load obj asset files
	//geometry = new THREE.BoxGeometry( 200, 200, 200 ); 
	//var mat = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } ); //fix shader

	//mesh = new THREE.Mesh( geometry, mat );
	//scene.add( mesh );

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

function menu() {

}
