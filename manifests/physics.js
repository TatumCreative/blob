module.exports = {
	name : "Physics",
	description : "Cannon.js Tests",
	config : {
		fog : { enable: false },
		camera : {},
	},
	components : {
		// renderer : { function : require('../js/renderers/ssao-renderer') },
		renderer : { function : require('../js/renderers/basic-renderer') },
		physics : { function: require('../js/demos/physics/physics') },
		// sphere : { function: require('../js/demos/physics/physics-sphere') },
		level : { function: require('../js/demos/physics/physics-load-level') },
		// controls : { construct: require("../js/components/cameras/orbit-controls") },
		// grid : { construct: require("../js/components/grid") },
		lights : { function: require('../js/components/lights/track-camera-lights') },
	}
};