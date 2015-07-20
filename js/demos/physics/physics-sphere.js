var SyncPhysicsBodyFn = require('../../utils/sync-physics-body')
var Cannon = require('cannon')

function _createMesh( poem, config ) {
	
	var mesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry(config.radius, 3),
		new THREE.MeshPhongMaterial({
			color: 0xcc3333
		})
	)
	mesh.castShadow = true
	mesh.receiveShadow = true

	return mesh
}

function _createPhysics( poem, config, mesh ) {
	
	var material = new Cannon.Material()
	
	var body = new Cannon.Body({
		mass: config.mass,
		material: material
	})
	body.addShape( new Cannon.Sphere( config.radius ) )
	body.linearDamping = 0.01
	body.position.set(
		config.start[0], config.start[1], config.start[2]
	)

	poem.scene.add( mesh )
	poem.world.add( body )
	
	mesh.body = body
	
	return body
}

function _updateFn( mesh ) {
	
	//Overkill at this point...
	var sync = SyncPhysicsBodyFn( mesh, mesh.body )
	
	return function updateSphere() {
		sync()
	}
}

function _restartFn( config, body ) {
	
	return function() {
		body.position.set(
			config.start[0], config.start[1], config.start[2]
		)
		body.velocity.set(0,0,0)
	}
}

module.exports = function initSphere( poem, props ) {
	
	var config = _.extend({
		radius: 10,
		mass : 5,
		start : [0,100,0]
	}, props)
	
	var mesh = _createMesh( poem, config )
	var body = _createPhysics( poem, config, mesh )
	
	$('canvas').on('touchstart, mousedown', _restartFn( config, body ) )
	
	poem.emitter.on( 'update', _updateFn( mesh ) )
	
	return mesh
}