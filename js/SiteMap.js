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
	var renderer 	= new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(viewportWidth, viewportHeight);
	THREEx.WindowResize(renderer, camera);
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
	var candlePosition = new THREE.Vector3(viewportWidth * 0.372,viewportHeight * 0.2383,50);
	var candleScale = new THREE.Vector3(viewportWidth * 0.0008125, viewportWidth * 0.0008125, viewportWidth * 0.0008125);
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load("Assets/Candlestick/candlestick.js", function (geometry){
		var material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture("Assets/Candlestick/diffuse.jpg"),
			specularMap: THREE.ImageUtils.loadTexture("Assets/Candlestick/specular.jpg")
		});

		var mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(candleScale.x, candleScale.y, candleScale.z);
		mesh.position.add(candlePosition);
		mesh.rotation.set(45,45,0);

		scene.add(mesh);
	});

	//Flame
	var flameTexture = new THREE.ImageUtils.loadTexture("Assets/FlameAnimation.png");
	var flameAnimator = new TextureAnimator(flameTexture, 8, 1, 8, 120);
	var flameMaterial = new THREE.MeshBasicMaterial({map: flameTexture, side:THREE.FrontSide, alphaTest: 0.1, transparent:true, opacity:0.9});
	var flameGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	var flame = new THREE.Mesh(flameGeometry, flameMaterial);
	flame.scale.set(candleScale.x * 0.5,candleScale.y * 0.5,candleScale.z * 0.5);
	//flame.position.set(candlePosition.x - viewportWidth * 0.009375,candlePosition.y + viewportHeight * 0.18117,candlePosition.z + 350);
	flame.position.set(candlePosition.x - 11.5385 * candleScale.x, candlePosition.y + 116.923 * candleScale.y, candlePosition.z + 350 * candleScale.z);
	scene.add(flame);
	
	/*
		Run engine
	*/

	function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
	{	
		// note: texture passed by reference, will be updated by the update function.
			
		this.tilesHorizontal = tilesHoriz;
		this.tilesVertical = tilesVert;
		// how many images does this spritesheet contain?
		//  usually equals tilesHoriz * tilesVert, but not necessarily,
		//  if there at blank tiles at the bottom of the spritesheet. 
		this.numberOfTiles = numTiles;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
		// how long should each image be displayed?
		this.tileDisplayDuration = tileDispDuration;
		// how long has the current image been displayed?
		this.currentDisplayTime = 0;
		// which image is currently being displayed?
		this.currentTile = 0;
			
		this.update = function( milliSec )
		{
			this.currentDisplayTime += milliSec;
			while (this.currentDisplayTime > this.tileDisplayDuration)
			{
				this.currentDisplayTime -= this.tileDisplayDuration;
				this.currentTile++;
				if (this.currentTile == this.numberOfTiles)
					this.currentTile = 0;
				var currentColumn = this.currentTile % this.tilesHorizontal;
				texture.offset.x = currentColumn / this.tilesHorizontal;
				var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
				texture.offset.y = currentRow / this.tilesVertical;
			}
		};
	}

	//Runs every frame
	function Update() {
		flameAnimator.update(clock.getDelta() * 1000);
	}

	camera.position.z = 1000;

	var render = function () {
		requestAnimationFrame( render );

		Update();
		
		renderer.render(scene, camera);
	};

	render();
});