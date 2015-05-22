/// <reference path="../libs/THREE/three.min.js" />
/// <reference path="../libs/THREE/THREEx.WindowResize.js" />
/// <reference path="../libs/Bezier/bezier.js" />

/*
	Utilities
*/
//This was stolen from stackoverflow somewhere
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

			var currentColumn 	= this.currentTile % this.tilesHorizontal;
			texture.offset.x	= currentColumn / this.tilesHorizontal;
			var currentRow 		= Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y 	= currentRow / this.tilesVertical;
		}
	};
}

function IsUndefined(x)
{
	return typeof x === 'undefined';
}

function GetBounds(v1, v2)
{
	var minV = new THREE.Vector3(),
		maxV = new THREE.Vector3();

	if (!IsUndefined(v1.x) && !IsUndefined(v2.x))
	{
		minV.x = Math.min(v1.x, v2.x);
		maxV.x = Math.max(v1.x, v2.x);
	}

	if (!IsUndefined(v1.y) && !IsUndefined(v2.y))
	{
		minV.y = Math.min(v1.y, v2.y);
		maxV.y = Math.max(v1.y, v2.y);
	}

	if (!IsUndefined(v1.z) && !IsUndefined(v2.z))
	{
		minV.z = Math.min(v1.z, v2.z);
		maxV.z = Math.max(v1.z, v2.z);
	}

	return {
		min: minV,
		max: maxV
	};
}

/*
	Engine
*/
function Engine(updateFunc) {
	var container 			= $("body");
	this.viewportWidth 		= $(window).width();
	this.viewportHeight 	= $(window).height();

	this.clock 				= new THREE.Clock();
	this.scene 				= new THREE.Scene();
	this.renderer 			= new THREE.WebGLRenderer({antialias:true});
	this.camera 			= new THREE.OrthographicCamera(
		this.viewportWidth / -2, 
		this.viewportWidth / 2, 
		this.viewportHeight / 2, 
		this.viewportHeight / -2, 
		1, 
		1000);

	//Required for responsiveness calculations
	this.placementWidth 	= 1600;
	this.placementHeight	= 839;

	this.renderer.setSize(this.viewportWidth, this.viewportHeight);
	THREEx.WindowResize(this.renderer, this.camera);
	container.append(this.renderer.domElement);
	this.camera.position.z 	= 1000;

	this.Update 			= updateFunc;
}

Engine.prototype.Render = function() {
	requestAnimationFrame(this.Render.bind(this));

	this.Update(this.clock.getDelta());

	this.renderer.render(this.scene, this.camera);
};

Engine.prototype.Start = function() {
	this.Render();
};

Engine.prototype.GetScaledCoordinate = function(placementCoordinate, scaleAxisSize, axisSize) {
	return axisSize * placementCoordinate / scaleAxisSize;
};

Engine.prototype.GetScaledCoordWidth = function(placementCoordinate) {
	return this.GetScaledCoordinate(placementCoordinate, this.placementWidth, this.viewportWidth);
};

Engine.prototype.GetScaledCoordHeight = function(placementCoordinate) {
	return this.GetScaledCoordinate(placementCoordinate, this.placementHeight, this.viewportHeight);
};
/*
	SiteMap
*/
function SiteMap(category) {
	this.engine = new Engine(this.Update.bind(this));
	this.Init(category);
	this.engine.Start();
}

SiteMap.prototype.Update = function(dt) {
	this.flameAnimator.update(dt * 1000);
	this.AnimateFlameLight(dt);
	this.TransitionStep(dt);
};

SiteMap.prototype.Init = function(category) {
	//Ambient Light
	var ambientLight = new THREE.AmbientLight(0xB18260);
	this.engine.scene.add(ambientLight);

	//Background
	var backgroundGeometry 	= new THREE.PlaneGeometry(
		this.engine.viewportWidth,
		this.engine.viewportHeight,
		1);
	var backgroundMaterial 	= new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("Assets/map.png")
	});
	var background 			= new THREE.Mesh(backgroundGeometry, backgroundMaterial);
	this.engine.scene.add(background);

	//Candle
	var candlePosition 	= new THREE.Vector3(
		this.engine.GetScaledCoordWidth(595), 
		this.engine.GetScaledCoordHeight(200), 
		50);
	var candleScale 	= new THREE.Vector3(
		this.engine.GetScaledCoordWidth(1.3),
		this.engine.GetScaledCoordWidth(1.3),
		this.engine.GetScaledCoordWidth(1.3));
	var jsonLoader		= new THREE.JSONLoader();
	jsonLoader.load("Assets/Candlestick/candlestick.js", (function (geometry) {
		var material 	= new THREE.MeshLambertMaterial({
			map: 			THREE.ImageUtils.loadTexture("Assets/Candlestick/diffuse.jpg"),
			specularMap: 	THREE.ImageUtils.loadTexture("Assets/Candlestick/specular.jpg")
		});

		var mesh 		= new THREE.Mesh(geometry, material);
		mesh.scale.set(candleScale.x, candleScale.y, candleScale.z);
		mesh.position.add(candlePosition);
		mesh.rotation.set(45, 45, 0);

		this.engine.scene.add(mesh);
	}).bind(this));

	//Flame
	var flameTexture	= new THREE.ImageUtils.loadTexture("Assets/FlameAnimation.png");
	this.flameAnimator	= new TextureAnimator(flameTexture, 8, 1, 8, 120);
	var flameMaterial	= new THREE.MeshBasicMaterial({
		map: 			flameTexture,
		side: 			THREE.FontSide,
		alphaTest: 		0.1,
		transparent: 	true,
		opacity: 		1
	});
	var flameGeometry	= new THREE.PlaneGeometry(50, 50, 1, 1);
	var flame 			= new THREE.Mesh(flameGeometry, flameMaterial);

	flame.scale.set(candleScale.x * 0.5, candleScale.y * 0.5, candleScale.z * 0.5);
	flame.position.set(
		candlePosition.x - this.engine.GetScaledCoordWidth(15),
		candlePosition.y + this.engine.GetScaledCoordHeight(157),
		candlePosition.z + this.engine.GetScaledCoordWidth(250));
	this.engine.scene.add(flame);

	this.flameLight 			= {};
	this.flameLight.direction 	= -1;
	this.flameLight.min 		= 1.25;
	this.flameLight.max 		= 2.0;
	this.flameLight.time 		= 3.1;
	this.flameLight.change 		= (this.flameLight.max - this.flameLight.min) / this.flameLight.time;

	this.flamePointLight 		= new THREE.PointLight(0xDD9329, this.flameLight.max, this.engine.viewportWidth);
	this.flamePointLight.position.add(flame.position);
	this.engine.scene.add(this.flamePointLight);

	//Stripe prototype
	this.stripeMaterial		= new THREE.SpriteMaterial({
		map: THREE.ImageUtils.loadTexture("Assets/stripe.png")
	});
	this.stripePrototype	= new THREE.Sprite(this.stripeMaterial);
	this.stripePrototype.scale.set(30, 10, 1);
	this.stripeWidth 		= new THREE.Box3().setFromObject(this.stripePrototype).size().x;

	//Transition
	this.transition = {};
	this.transition.locations = {
		"About"		: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(120),
			this.engine.GetScaledCoordHeight(120),
			0),
		"Activity"		: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(-350),
			this.engine.GetScaledCoordHeight(-255),
			0),
		"Competences"	: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(420),
			this.engine.GetScaledCoordHeight(25),
			0),
		"Contact"		: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(50),
			this.engine.GetScaledCoordHeight(-350),
			0),
		"Portfolio"	: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(-375),
			this.engine.GetScaledCoordHeight(75),
			0),
		"Resume"		: new THREE.Vector3(
			this.engine.GetScaledCoordWidth(565),
			this.engine.GetScaledCoordHeight(-240),
			0)
	};

	this.transition.started 		= false;
	this.transition.currentLocation = category;
	this.transition.currentLCoord 	= this.transition.locations[this.transition.currentLocation].clone();
	this.transition.alphaIncrement	= 0.005;
	this.transition.alpha 			= 0;
	this.transition.stripes 		= [];
	this.transition.axis 			= new THREE.Vector3(1,0,0);
};

SiteMap.prototype.AnimateFlameLight = function(dt) {
	this.flamePointLight.intensity 		+= this.flameLight.change * dt * this.flameLight.direction;

	if (this.flamePointLight.intensity <= this.flameLight.min)
	{
		this.flamePointLight.intensity 	= this.flameLight.min;
		this.flameLight.direction 		= 1;
	}
	else if (this.flamePointLight.intensity >= this.flameLight.max)
	{
		this.flamePointLight.intensity 	= this.flameLight.max;
		this.flameLight.direction 		= -1;
	}
};

SiteMap.prototype.StartTransition = function(to, onTransitionFinish) {
	console.log("whee" + to);

	if (to != this.transition.currentLocation)
	{
		this.transition.targetLocation 		= to;
		this.transition.started 			= true;
		this.transition.OnTransitionFinish 	= onTransitionFinish;

		var startCoords						= this.transition.currentLCoord,
			endCoords						= this.transition.locations[this.transition.targetLocation],
			bounds 							= GetBounds(startCoords, endCoords);

		var boundsAdditionX					= this.engine.GetScaledCoordWidth(265),
			boundsAdditionY					= this.engine.GetScaledCoordHeight(265);

		bounds.max.x 						+= boundsAdditionX;
		bounds.max.y 						+= boundsAdditionY;
		bounds.min.x 						-= boundsAdditionX;
		bounds.min.y 						-= boundsAdditionY;

		var points 							= [];
		var numPoints						= 2;

		console.log("NumPoints: " + numPoints);

		points[points.length] = {
			x: startCoords.x,
			y: startCoords.y
		};

		while (numPoints-- > 0)
		{
			points[points.length] 			= {
				x: Math.floor(Math.random() * (bounds.max.x - bounds.min.x)) + bounds.min.x,
				y: Math.floor(Math.random() * (bounds.max.y - bounds.min.y)) + bounds.min.y 
			};
		}

		points[points.length] 				= {
			x: endCoords.x,
			y: endCoords.y
		};

		this.transition.curve 				= new Bezier(points);
	}
	else
	{
		onTransitionFinish();
	}
};

SiteMap.prototype.TransitionStep = function() {
	if (!this.transition.started)
		return;

	var pos 						= this.transition.nextPos || this.transition.curve.get(this.transition.alpha);
	var stripe 						= this.stripePrototype.clone();
	stripe.position.set(pos.x, pos.y, 1);

	this.transition.alpha 			+= this.transition.alphaIncrement;
	this.transition.nextPos 		= this.transition.curve.get(this.transition.alpha + this.transition.alphaIncrement);

	//Check to only place a stripe once a certain length away from previous length
	if (this.transition.stripes.length == 0 || stripe.position.distanceTo(this.transition.stripes[this.transition.stripes.length-1].position) > this.stripeWidth * 1.5)
	{
		stripe.material 				= stripe.material.clone();

		//Rotation
		var direction 					= new THREE.Vector3(
			this.transition.nextPos.x,
			this.transition.nextPos.y,
			 1).sub(stripe.position);
		var angle 						= direction.angleTo(this.transition.axis);
		stripe.material.rotation 		= (direction.y < 0) ? -angle : angle;

		this.transition.stripes.push(stripe);
		this.engine.scene.add(stripe);
	}

	//Reset variables for next transition
	if (this.transition.alpha >= 1)
	{
		this.transition.currentLCoord 	= this.transition.locations[this.transition.targetLocation];
		this.transition.currentLocation = this.transition.targetLocation;
		//location.hash 					= this.transition.targetLocation;
		this.transition.started 		= false;
		this.transition.alpha 			= 0;
		this.transition.nextPos 		= null;

		var s;
		while (s = this.transition.stripes.pop())
		{
			this.engine.scene.remove(s);
		}

		this.transition.OnTransitionFinish();
	}
};