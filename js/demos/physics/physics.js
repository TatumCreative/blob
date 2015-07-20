var Cannon = require('cannon')
var DeviceOrientationQuaternion = require('../../utils/device-orientation-quat')
var DeviceOrientationControls = require('../../vendor/DeviceOrientationControls')
var OrbitControls = require('../../vendor/OrbitControls');

function _addLight( poem ) {
	
	var light = new THREE.SpotLight( 0xffffff );
	light.position.set( 0, 500, 0 );

	light.castShadow = true;

	light.shadowCameraNear = 20;
	light.shadowCameraFar = 5000;
	light.shadowCameraFov = 50;
	light.onlyShadow = true;

	light.shadowBias = -0.0000022;
	light.shadowDarkness = 0.2;

	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;

	poem.scene.add( light );	
	// poem.scene.add( new THREE.SpotLightHelper( light ) )
	
}

function _orientation( poem, world, gravity ) {
	
	var quat = new THREE.Quaternion()
	var rotatedGravity = new THREE.Vector3()
	$(window).on( 'deviceorientation', function(e) {
		
		var event = e.originalEvent;
		
		DeviceOrientationQuaternion( quat, event )
		
		rotatedGravity.copy( gravity ).applyQuaternion( quat )
		world.gravity.set( -rotatedGravity.x, rotatedGravity.y, -rotatedGravity.z )
	});
	
}

function _addArrowCameraHolder( poem ) {
	
	// var geometry = new THREE.CylinderGeometry( 5, 1, 20, 32 )
	// var material = new THREE.MeshPhongMaterial( {color: 0xffff00} )
	// var mesh = new THREE.Mesh( geometry, material )
	var mesh = new THREE.Object3D()
	
	poem.scene.add( mesh )

	var camera = poem.camera.object
	
	poem.scene.remove( camera )
	mesh.add( camera )
	
	return mesh
}

function _setupOrientationControls( poem, mesh ) {
	
	var controls = new DeviceOrientationControls( mesh )
		
	controls.freeze = false
	controls.update()
	
	controls.orientationQuaternion.setFromEuler( new THREE.Euler(Math.PI * 0.5,0,0) )
	
	return controls
}

function _setupMouseControls( poem, object3d ) {
	
	var controls = new OrbitControls( poem.camera.object, poem.canvas )
	
	return controls
}

module.exports = function initPhysics( poem, props ) {
	
	var gravity = new THREE.Vector3()
	
	poem.renderer.shadowMapEnabled = true;
	poem.renderer.shadowMapType = THREE.PCFShadowMap;
	
	var world = poem.world = new Cannon.World()
	world.gravity.set(gravity.x,gravity.y,gravity.z)
	world.broadphase = new Cannon.SAPBroadphase( world )
	
	var arrow               = _addArrowCameraHolder( poem )
	var orientationControls = _setupOrientationControls( poem, arrow )
	var mouseControls       = _setupMouseControls( poem, arrow )

	poem.emitter.on('update', function(e) {
		world.step( 1/60, e.dt * 1000 )
		
		mouseControls.update()
		orientationControls.update()
		
		arrow.position.lerp( poem.level.sphere.position, e.unitDt * 0.05 )
		
		gravity.set(0,-10,0)
		gravity.applyQuaternion( orientationControls.orientationQuaternion )
		
		world.gravity.set(gravity.x,gravity.y,0)
	})
	
	// _addLight( poem )
	// _orientation( poem, world, gravity )
	
	
	return {
		world: world,
		arrow: arrow
	}
}