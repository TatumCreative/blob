var ResizeRendererFn = require('./utils/resize-renderer-fn')
var ResizeHandler = require('./utils/resize-handler')
var CreateRenderer = require('./utils/create-renderer')

var ChromaticAberrationShader = require('../vendor/postprocessing/chromaticAberration')

//These get loaded onto the THREE object
require('../vendor/postprocessing')
require('../vendor/shaders/CopyShader')
require('../vendor/shaders/FilmShader')
require('../vendor/shaders/ConvolutionShader')
require('../vendor/shaders/FXAAShader')
require('../vendor/shaders/SSAOShader')

function _initSsao( ratio, renderer, scene, camera, depth ) {
	
	var ssao = new THREE.ShaderPass( THREE.SSAOShader )
	
	ssao.uniforms.tDiffuse.value     = null
	ssao.uniforms.tDepth.value       = depth.target
	ssao.uniforms.size.value         = new THREE.Vector2()
	ssao.uniforms.cameraNear.value   = camera.near
	ssao.uniforms.cameraFar.value    = camera.far
	ssao.uniforms.onlyAO.value       = false
	ssao.uniforms.aoClamp.value      = 0.5
	ssao.uniforms.lumInfluence.value = 0.6
	
	return ssao
}

function _createDepthTarget( ratio, renderer, scene, camera ) {
	
	var depthTarget = new THREE.WebGLRenderTarget(
		window.innerWidth * ratio,
		window.innerHeight * ratio,
		{
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		}
	)
	
	var depthShader = THREE.ShaderLib.depthRGBA;

	var depthMaterial = new THREE.ShaderMaterial({ 
		fragmentShader: depthShader.fragmentShader,
		vertexShader: depthShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone( depthShader.uniforms ),
		blending: THREE.NoBlending // important!
	})
	
	return {
		target: depthTarget,
		render : function() {
			
			var override = scene.overrideMaterial
			var autoClear = renderer.autoClear

			scene.overrideMaterial = depthMaterial
			renderer.autoClear = true

			renderer.render( scene, camera, depthTarget )
			
			scene.overrideMaterial = override
			renderer.autoClear = autoClear
		}
	}
}

function _createEffectComposer( ratio, renderer, scene, camera ) {

	var depth = _createDepthTarget( ratio, renderer, scene, camera )
	
	var renderPass          = new THREE.RenderPass( scene, camera )
	var antialias           = new THREE.ShaderPass( THREE.FXAAShader )
	var ssao                = _initSsao( ratio, renderer, scene, camera, depth )
	var copy                = new THREE.ShaderPass( THREE.CopyShader )	

	var composer = new THREE.EffectComposer( renderer )

	ssao.renderToScreen = true
	composer.addPass( renderPass )
	// composer.addPass( antialias )
	composer.addPass( ssao )
	// composer.addPass( copy )

	var resize = function() {
		
		var width = window.innerWidth * ratio
		var height = window.innerHeight * ratio
		
		antialias.uniforms.resolution.value.set( 1 / width, 1 / height )
		ssao.uniforms.size.value.set( width, height )
		composer.renderTarget1.setSize( width, height )
		composer.renderTarget2.setSize( width, height )
		depth.target.setSize( width, height )
	}
	
	resize()
	
	return [ composer, resize, depth ]
}

function handleNewPoem( poem, config ) {
	
	var renderer = CreateRenderer( poem, config )
	var scene = poem.scene
	var camera = poem.camera.object
	
	renderer.autoClear = false
	
	ResizeHandler( poem, ResizeRendererFn( renderer, poem.camera.object ) )
	
	var [ composer, resize, depth ] = _createEffectComposer( poem.ratio, renderer, scene, camera )
	
	poem.emitter.on( 'draw', function() {
		
		depth.render()
		composer.render( scene, camera )
		
	})
			
	return renderer
}

module.exports = handleNewPoem