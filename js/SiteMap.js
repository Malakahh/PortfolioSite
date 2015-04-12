$(document).ready(function() {
	/*
		Basic setup
	*/
	var container = $("body");
	var viewportWidth = $(window).width();
	var viewportHeight = $(window).height();

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(viewportWidth / -2, viewportWidth / 2, viewportHeight / 2, viewportHeight / -2, 1, 1000);
	//var camera = new THREE.PerspectiveCamera(90, viewportWidth / viewportHeight, 1, 1000);
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(viewportWidth, viewportHeight);
	container.append(renderer.domElement);
	
	/*
		Gameobjects
	*/

	//Background
	var backgroundMap = new THREE.ImageUtils.loadTexture("Assets/map.png");
	var backgroundMaterial = new THREE.SpriteMaterial({
		map: backgroundMap,
		fog: false
	});
	var backgroundSprite = new THREE.Sprite(backgroundMaterial);
	backgroundSprite.scale.set(viewportWidth,viewportHeight,1);
	scene.add(backgroundSprite);

	//Candle
	var loader = new THREE.JSONLoader();
	loader.load("Assets/Candlestick/candlestick.js", function (geometry){
		var material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("Assets/Candlestick/diffuse.jpg"),
			specularMap: THREE.ImageUtils.loadTexture("Assets/Candlestick/specular.jpg")
		});

		var mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(1.3,1.3,1.3);
		mesh.position.set(575,175,50);
		mesh.rotation.set(45,45,0);

		scene.add(mesh);
	});

	//Cube
	var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
	var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(0,0,100);
	//scene.add(cube);

	function RotateCube() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}

	/*
		Run engine
	*/

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

	camera.position.z = 1000;

	var render = function () {
		requestAnimationFrame( render );

		Update();

		renderer.render(scene, camera);
	};

	render();


	
	$(window).resize(ViewportResize);
	$(document).mousemove(function(event){
		mouseX = (event.clientX - viewportWidth / 2) / 2;
		mouseY = (event.clientY - viewportHeight / 2) / 2;
	});
});