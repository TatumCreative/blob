var degtorad = Math.PI / 180; // Degree-to-Radian conversion

module.exports = function deviceOrientationQuaternion( quaternion, event ) {

  var _x = event.beta  ? event.beta  * degtorad : 0; // beta value
  var _y = event.gamma ? event.gamma * degtorad : 0; // gamma value
  var _z = event.alpha ? event.alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x/2 );
  var cY = Math.cos( _y/2 );
  var cZ = Math.cos( _z/2 );
  var sX = Math.sin( _x/2 );
  var sY = Math.sin( _y/2 );
  var sZ = Math.sin( _z/2 );

  var x = sX * cY * cZ - cX * sY * sZ;
  var y = cX * sY * cZ + sX * cY * sZ;
  var z = cX * cY * sZ + sX * sY * cZ;
  var w = cX * cY * cZ - sX * sY * sZ;

  return quaternion.set( x, y, z, w );
}