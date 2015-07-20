var SyncPhysicsBodyFn = require('../../utils/sync-physics-body')
var Cannon = require('cannon')
var Level = require('../levels/intro')
var CreateBox = require('./physics-box')
var CreateSphere = require('./physics-sphere')

function _timesScaleFn( scale ) {
	return function( n ) {
		return n * scale
	}
}

function _scaleBoxes( boxes, scale ) {
	
	return _.map( boxes, function(box) {
		return [
			[box[0][0] * scale, box[0][1] * scale, box[0][2] * scale],
			[box[1][0] * scale, box[1][1] * scale, box[1][2] * scale],
		]
	})
}

function _boxToProps( box, scale ) {
	
	var center = [
		(box[0][0] + box[1][0]) / 2,
		(box[0][1] + box[1][1]) / 2,
		0
	]
	
	var manhattan = [
		box[1][0] - box[0][0],
		box[1][1] - box[0][1],			
	]
	
	var rotationZ = Math.atan2( manhattan[1], manhattan[0] )
	var length = Math.sqrt( manhattan[0] * manhattan[0] + manhattan[1] * manhattan[1] )
	
	return {
		size: [length + 1 * scale, scale * 0.25, scale * 2],
		position : center,
		euler : [0,0,rotationZ]
	}
}

module.exports = function initSphere( poem, props ) {
	
	var scale = 50;
	var start = _.map( Level.start, _timesScaleFn( scale ) )
	
	var boxes = _.map( _scaleBoxes( Level.boxes, scale ), function( box ) {
		CreateBox( poem, _boxToProps( box, scale ) )
	})
	var sphere = CreateSphere( poem, {
		start : start
	})
	
	poem.physics.arrow.position.set( start[0], start[1], start[2] )
	
	return {
		boxes: boxes,
		sphere: sphere
	}
}