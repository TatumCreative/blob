module.exports = function syncPhysicsBodyFn( mesh, body ) {
	
	return function() {
		mesh.position.copy( body.position )
		mesh.quaternion.copy( body.quaternion )
	}
}