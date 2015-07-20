var SyncPhysicsBodyFn = require('../../utils/sync-physics-body')
var Cannon = require('cannon')
var Boxes = require('../levels/intro')

function _createMesh( poem, config ) {
	
	var mesh = new THREE.Mesh(
		new THREE.BoxGeometry(config.size[0], config.size[1], config.size[2]),
		new THREE.MeshPhongMaterial({
			color: 0x3333cc
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
	body.addShape( new Cannon.Box(new Cannon.Vec3(
		config.size[0] / 2, config.size[1] / 2, config.size[2] / 2
	)))
	body.position.set( config.position[0], config.position[1], config.position[2] )
	body.quaternion.setFromEuler( config.euler[0], config.euler[1], config.euler[2], 'XYZ' )

	poem.scene.add( mesh )
	poem.world.add( body )
	
	mesh.body = body
	
	//Sync at least once
	SyncPhysicsBodyFn( mesh, mesh.body )()
	
	return body
}

function _updateFn( mesh ) {
	
	//Overkill at this point...
	var sync = SyncPhysicsBodyFn( mesh, mesh.body )
	
	return function updateSphere() {
		sync()
	}
}

module.exports = function initSphere( poem, props ) {
	
		
	var config = _.extend({
		size: [500, 10, 150],
		mass : 0,
		position : [0,-100,0],
		euler : [0,0,0]
	}, props)
	
	var mesh = _createMesh( poem, config )
	var body = _createPhysics( poem, config, mesh )
	
	// poem.emitter.on( 'update', _updateFn( mesh ) )
}