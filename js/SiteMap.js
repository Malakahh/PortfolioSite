$(document).ready(function() {
	/*
		Basic setup
	*/
	var container = $("body");
	var viewportWidth = $(window).width();
	var viewportHeight = $(window).height();

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(viewportWidth / -2, viewportWidth / 2, viewportHeight / 2, viewportHeight / -2, 1, 1000);
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(viewportWidth, viewportHeight);
	container.append(renderer.domElement);

	/*
		Gameobjects
	*/
	var gameObjects = [];

	var backgroundMap = new THREE.ImageUtils.loadTexture("Assets/map.jpg");
	var backgroundMaterial = new THREE.SpriteMaterial({
		map: backgroundMap,
		fog: false
	});
	var backgroundSprite = new THREE.Sprite(backgroundMaterial);
	backgroundSprite.scale.set(viewportWidth,viewportHeight,1);
	gameObjects[gameObjects.length] = backgroundSprite;

	var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
	var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(0,0,1);
	gameObjects[gameObjects.length] = cube;

	function RotateCube() {
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
	}

	//Update size on window resize
	function ViewportResize() {
		viewportWidth = $(window).width();
		viewportHeight = $(window).height();
		camera.aspect = viewportWidth / viewportHeight;
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

		renderer.render(scene, camera);
	};

	render();


	
	$(window).resize(ViewportResize);
});