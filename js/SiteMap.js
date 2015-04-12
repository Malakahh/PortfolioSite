$(document).ready(function() {
	/*
		Basic setup
	*/
	var container 		= $("body");
	var viewportWidth 	= $(window).width();
	var viewportHeight 	= $(window).height();

	var clock 		= new THREE.Clock();
	var scene 		= new THREE.Scene();
	var camera 		= new THREE.OrthographicCamera(viewportWidth / -2, viewportWidth / 2, viewportHeight / 2, viewportHeight / -2, 1, 1000);
	//var camera 	= new THREE.PerspectiveCamera(90, viewportWidth / viewportHeight, 1, 1000);
	var renderer 	= new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(viewportWidth, viewportHeight);
	container.append(renderer.domElement);
	
	/*
		Gameobjects
	*/

	//Background
	var backgroundMaterial = new THREE.SpriteMaterial({
		map: THREE.ImageUtils.loadTexture("Assets/map.png")
	});
	var backgroundSprite = new THREE.Sprite(backgroundMaterial);
	backgroundSprite.scale.set(viewportWidth,viewportHeight,1);
	scene.add(backgroundSprite);

	//Candle
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load("Assets/Candlestick/candlestick.js", function (geometry){
		var material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("Assets/Candlestick/diffuse.jpg"),
			specularMap: THREE.ImageUtils.loadTexture("Assets/Candlestick/specular.jpg")
		});

		var mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(1.3,1.3,1.3);
		mesh.position.set(595,175,50);
		mesh.rotation.set(45,45,0);

		scene.add(mesh);
	});

	//Flame
	var particleCount = 512,
		particleGeometry = new THREE.Geometry(),
		particleMaterial = new THREE.PointCloudMaterial({
			color: 0xFFFF00,
			size: 70,
			map: THREE.ImageUtils.loadTexture("Assets/smokeparticle.png"),
			transparent: true,
			alphaTest:0.5
		});

	var flameCloud = new THREE.PointCloud(particleGeometry, particleMaterial);
	flameCloud.position.set(0,0,50);

	for (var i = 0; i < particleCount; i++)
	{
		var particle = new THREE.Vector3(0, 0, 0);

		var pX = Math.random() * 10 - 5,
			pY = Math.random() * 5,
			pZ = Math.random() * 10 - 5;

		particle.started = false;
		particle.timeAlive = 0;
		particle.origVelocity = new THREE.Vector3(pX, pY, pZ);
		particle.velocity = new THREE.Vector3();
		particle.velocity.copy(particle.origVelocity);
		particleGeometry.vertices.push(particle);
	}

	
	scene.add(flameCloud);
	var correction = new THREE.Vector3(0,0,0);

	function UpdateFlame()
	{
		var toStart = 8;
		var timeToLive = 0.1;
		for (var i = 0; i < particleCount; i++)
		{
			var p = particleGeometry.vertices[i];

			//Reset
			if (p.y > 85 || p.timeAlive > timeToLive)
			{
				p.set(0,0,0);
				p.velocity.copy(p.origVelocity);
				p.started = false;
				p.timeAlive = 0;
			}

			if (!p.started && toStart > 0)
			{
				p.started = true;
				toStart--;
			}

			if (p.started)
			{
				p.timeAlive += clock.getDelta();

				p.velocity.x -= p.origVelocity.x * 0.1;
				if ((p.origVelocity.x > 0 && p.x < 0) || (p.origVelocity.x < 0 && p.x > 0))
				{
					p.velocity.x = 0;
				}

				p.velocity.z -= p.origVelocity.z * 0.1;
				if ((p.origVelocity.z > 0 && p.z < 0) || (p.origVelocity.z < 0 && p.z > 0))
				{
					p.velocity.z = 0;
				}
				
				p.add(p.velocity);
			}

			particleGeometry.verticesNeedUpdate = true;
		}
	}

	//Particle
	/*
	var particleCount = 1800,
		particles = new THREE.Geometry(),
		pMaterial = new THREE.PointCloudMaterial({
			color: 0xFFFFFF,
			size: 20,
			map: THREE.ImageUtils.loadTexture("Assets/smokeparticle.png")
		});

	for (var p = 0; p < particleCount; p++)
	{
		//Create a particle with random position values, -250 -> 250
		var pX = Math.random() * 500 - 250,
			pY = Math.random() * 500 - 250,
			pZ = Math.random() * 500 - 250,
			particle = new THREE.Vector3(pX, pY, pZ);

		particle.velocity = new THREE.Vector3(0, -Math.random(), 0);

		particles.vertices.push(particle);
	}

	var pointCloud = new THREE.PointCloud(particles, pMaterial);
	//pointCloud.sortParticles = true;
	scene.add(pointCloud);

	function updateParticle()
	{
		pointCloud.rotation.y += 0.01;

		var pCount = particleCount;
		while (pCount--)
		{
			var particle = particles.vertices[pCount];

			//Reset
			if (particle.y < -200) {
				particle.y = 200;
				particle.velocity.y = 0;
			}

			particle.velocity.y -= Math.random() * .1;

			particle.y += particle.velocity.y;
		}
	}*/

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
		viewportWidth 	= $(window).width();
		viewportHeight 	= $(window).height();

		camera.aspect 	= viewportWidth / viewportHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(viewportWidth, viewportHeight);
	}

	//Runs every frame
	function Update() {
		RotateCube();
		UpdateFlame()
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