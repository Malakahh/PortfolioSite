var container;
var viewportWidth, viewportHeight;

var scene, camera, renderer;

//Update size on window resize
function ViewportResize() {
	viewportWidth = $(window).width();
	viewportHeight = $(window).height();
	camera.aspect = viewportWidth / viewportHeight;
	renderer.setSize(viewportWidth, viewportHeight);
}

$(document).ready(function() {
	container = $("body");

	viewportWidth = $(window).width();
	viewportHeight = $(window).height();

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 90, viewportWidth/viewportHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(viewportWidth, viewportHeight);
	container.append(renderer.domElement);

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;

	var render = function () {
		requestAnimationFrame( render );

		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;

		renderer.render(scene, camera);
	};

	render();


	
	$(window).resize(ViewportResize);
});