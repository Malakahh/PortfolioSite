$(document).ready(function() {
	var mouseX = 0;
	var mouseY = 0;

	/*
		Basic setup
	*/
	var container = $("body");
	var viewportWidth = $(window).width();
	var viewportHeight = $(window).height();



	/*
		Gameobjects
	*/
	var gameObjects = [];

	// LIGHTS
	var ambient = new THREE.AmbientLight(0x666666);
	gameObjects[gameObjects.length] = ambient;

	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, 70, 100).normalize();
	gameObjects[gameObjects.length] = directionalLight;

	//Background
	var backgroundMap = new THREE.ImageUtils.loadTexture("Assets/map.jpg");
	var backgroundMaterial = new THREE.SpriteMaterial({
		map: backgroundMap,
		fog: false
	});
	var backgroundSprite = new THREE.Sprite(backgroundMaterial);
	backgroundSprite.scale.set(viewportWidth,viewportHeight,1);
	gameObjects[gameObjects.length] = backgroundSprite;

	//Candle
	var candleTexture = new THREE.Texture();
	var imgLoader = new THREE.ImageLoader ();
	imgLoader.load('Assets/Candlestick/diffuse.tga', function ( image ) {
		candleTexture.image = image;
		texture.needsUpdate = true;
	});


	var objLoader = new THREE.OBJLoader ();
	objLoader.load('Assets/Candlestick/candlestick.obj', function ( obj ) {
		obj.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = candleTexture;
			}
		});
		obj.position.set(125, 0, 100);
		obj.scale.set(100, 100, 100);
		gameObjects[gameObjects.length] = obj;
/*
		var mesh = new THREE.Mesh(obj, new THREE.MeshLambertMaterial({map: candleTexture}));
		mesh.position.set(125, 0, 100);
		mesh.scale.set(100,100,100);
		gameObjects[gameObjects.length] = mesh;*/
	});

	//Cube
	var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
	var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(0,0,100);
	gameObjects[gameObjects.length] = cube;

	function RotateCube() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}

	/*
		Engine
	*/

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(viewportWidth / -2, viewportWidth / 2, viewportHeight / 2, viewportHeight / -2, 1, 1000);
	//var camera = new THREE.PerspectiveCamera(90, viewportWidth / viewportHeight, 1, 1000);
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(viewportWidth, viewportHeight);
	container.append(renderer.domElement);

	//Update size on window resize
	function ViewportResize() {
		viewportWidth = $(window).width();
		viewportHeight = $(window).height();

		camera.aspect = viewportWidth / viewportHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(viewportWidth, viewportHeight);
	}

	//Runs every frame
	function Update() {
		RotateCube();
	}

	//Add gameobjects to the scene
	for (var i = 0; i < gameObjects.length; i++)
	{
		scene.add(gameObjects[i]);
	}

	camera.position.z = 1000;

	var render = function () {
		requestAnimationFrame( render );

		Update();

		camera.position.x += (mouseX - camera.position.x) * .05;
		camera.position.y += ( -mouseY - camera.position.y) * .05;

		//camera.lookAt(scene.position);

		renderer.render(scene, camera);
	};

	render();


	
	$(window).resize(ViewportResize);
	$(document).mousemove(function(event){
		mouseX = (event.clientX - viewportWidth / 2) / 2;
		mouseY = (event.clientY - viewportHeight / 2) / 2;
	});
});