/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	/* global THREE */
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	__webpack_require__(/*! OrbitControls */ 1);
	
	var _datGui = __webpack_require__(/*! dat-gui */ 2);
	
	var _datGui2 = _interopRequireDefault(_datGui);
	
	var _deformableface = __webpack_require__(/*! ./deformableface */ 5);
	
	var _deformableface2 = _interopRequireDefault(_deformableface);
	
	__webpack_require__(/*! ./main.sass */ 19);
	
	document.body.innerHTML = __webpack_require__(/*! ./main.jade */ 23)();
	
	var App = (function () {
	  function App() {
	    _classCallCheck(this, App);
	
	    this.animate = this.animate.bind(this);
	
	    this.initScene();
	    this.initObjects();
	
	    this.animate();
	  }
	
	  _createClass(App, [{
	    key: 'initScene',
	    value: function initScene() {
	      this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
	      this.camera.position.z = 500;
	
	      this.scene = new THREE.Scene();
	
	      this.renderer = new THREE.WebGLRenderer();
	      this.renderer.setSize(window.innerWidth, window.innerHeight);
	      document.body.appendChild(this.renderer.domElement);
	
	      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	
	      window.addEventListener('resize', this.onResize.bind(this));
	    }
	  }, {
	    key: 'initObjects',
	    value: function initObjects() {
	      var _this = this;
	
	      this.face = new _deformableface2['default']();
	      this.face.load('media/shutterstock_102487424').then(function () {
	        _this.face.scale.set(200, 200, 150);
	        _this.scene.add(_this.face);
	
	        var gui = new _datGui2['default'].GUI();
	        for (var i = 0; i < 11; i++) {
	          var p = gui.add(_this.face.mesh.material.uniforms.morphTargetInfluences.value, i, -1, 1).name('morphTarget' + i);
	          _this.face.mesh.material.uniforms.morphTargetInfluences.value[i] = 0;
	        }
	        gui.__controllers.forEach(function (c) {
	          return c.updateDisplay();
	        });
	      });
	    }
	  }, {
	    key: 'animate',
	    value: function animate(t) {
	      requestAnimationFrame(this.animate);
	
	      this.controls.update();
	      this.renderer.render(this.scene, this.camera);
	    }
	  }, {
	    key: 'onResize',
	    value: function onResize() {
	      this.camera.aspect = window.innerWidth / window.innerHeight;
	      this.camera.updateProjectionMatrix();
	      this.renderer.setSize(window.innerWidth, window.innerHeight);
	    }
	  }]);
	
	  return App;
	})();
	
	new App();

/***/ },
/* 1 */
/*!**************************************!*\
  !*** ./web_modules/OrbitControls.js ***!
  \**************************************/
/***/ function(module, exports) {

	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */
	/*global THREE, console */
	
	( function () {
	
		function OrbitConstraint ( object ) {
	
			this.object = object;
	
			// "target" sets the location of focus, where the object orbits around
			// and where it pans with respect to.
			this.target = new THREE.Vector3();
	
			// Limits to how far you can dolly in and out ( PerspectiveCamera only )
			this.minDistance = 0;
			this.maxDistance = Infinity;
	
			// Limits to how far you can zoom in and out ( OrthographicCamera only )
			this.minZoom = 0;
			this.maxZoom = Infinity;
	
			// How far you can orbit vertically, upper and lower limits.
			// Range is 0 to Math.PI radians.
			this.minPolarAngle = 0; // radians
			this.maxPolarAngle = Math.PI; // radians
	
			// How far you can orbit horizontally, upper and lower limits.
			// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
			this.minAzimuthAngle = - Infinity; // radians
			this.maxAzimuthAngle = Infinity; // radians
	
			// Set to true to enable damping (inertia)
			// If damping is enabled, you must call controls.update() in your animation loop
			this.enableDamping = false;
			this.dampingFactor = 0.25;
	
			////////////
			// internals
	
			var scope = this;
	
			var EPS = 0.000001;
	
			// Current position in spherical coordinate system.
			var theta;
			var phi;
	
			// Pending changes
			var phiDelta = 0;
			var thetaDelta = 0;
			var scale = 1;
			var panOffset = new THREE.Vector3();
			var zoomChanged = false;
	
			// API
	
			this.getPolarAngle = function () {
	
				return phi;
	
			};
	
			this.getAzimuthalAngle = function () {
	
				return theta;
	
			};
	
			this.rotateLeft = function ( angle ) {
	
				thetaDelta -= angle;
	
			};
	
			this.rotateUp = function ( angle ) {
	
				phiDelta -= angle;
	
			};
	
			// pass in distance in world space to move left
			this.panLeft = function() {
	
				var v = new THREE.Vector3();
	
				return function panLeft ( distance ) {
	
					var te = this.object.matrix.elements;
	
					// get X column of matrix
					v.set( te[ 0 ], te[ 1 ], te[ 2 ] );
					v.multiplyScalar( - distance );
	
					panOffset.add( v );
	
				};
	
			}();
	
			// pass in distance in world space to move up
			this.panUp = function() {
	
				var v = new THREE.Vector3();
	
				return function panUp ( distance ) {
	
					var te = this.object.matrix.elements;
	
					// get Y column of matrix
					v.set( te[ 4 ], te[ 5 ], te[ 6 ] );
					v.multiplyScalar( distance );
	
					panOffset.add( v );
	
				};
	
			}();
	
			// pass in x,y of change desired in pixel space,
			// right and down are positive
			this.pan = function ( deltaX, deltaY, screenWidth, screenHeight ) {
	
				if ( scope.object instanceof THREE.PerspectiveCamera ) {
	
					// perspective
					var position = scope.object.position;
					var offset = position.clone().sub( scope.target );
					var targetDistance = offset.length();
	
					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );
	
					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					scope.panLeft( 2 * deltaX * targetDistance / screenHeight );
					scope.panUp( 2 * deltaY * targetDistance / screenHeight );
	
				} else if ( scope.object instanceof THREE.OrthographicCamera ) {
	
					// orthographic
					scope.panLeft( deltaX * ( scope.object.right - scope.object.left ) / screenWidth );
					scope.panUp( deltaY * ( scope.object.top - scope.object.bottom ) / screenHeight );
	
				} else {
	
					// camera neither orthographic or perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
	
				}
	
			};
	
			this.dollyIn = function ( dollyScale ) {
	
				if ( scope.object instanceof THREE.PerspectiveCamera ) {
	
					scale /= dollyScale;
	
				} else if ( scope.object instanceof THREE.OrthographicCamera ) {
	
					scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom * dollyScale ) );
					scope.object.updateProjectionMatrix();
					zoomChanged = true;
	
				} else {
	
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
	
				}
	
			};
	
			this.dollyOut = function ( dollyScale ) {
	
				if ( scope.object instanceof THREE.PerspectiveCamera ) {
	
					scale *= dollyScale;
	
				} else if ( scope.object instanceof THREE.OrthographicCamera ) {
	
					scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / dollyScale ) );
					scope.object.updateProjectionMatrix();
					zoomChanged = true;
	
				} else {
	
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
	
				}
	
			};
	
			this.update = function() {
	
				var offset = new THREE.Vector3();
	
				// so camera.up is the orbit axis
				var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
				var quatInverse = quat.clone().inverse();
	
				var lastPosition = new THREE.Vector3();
				var lastQuaternion = new THREE.Quaternion();
	
				return function () {
	
					var position = this.object.position;
	
					offset.copy( position ).sub( this.target );
	
					// rotate offset to "y-axis-is-up" space
					offset.applyQuaternion( quat );
	
					// angle from z-axis around y-axis
	
					theta = Math.atan2( offset.x, offset.z );
	
					// angle from y-axis
	
					phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );
	
					theta += thetaDelta;
					phi += phiDelta;
	
					// restrict theta to be between desired limits
					theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, theta ) );
	
					// restrict phi to be between desired limits
					phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );
	
					// restrict phi to be betwee EPS and PI-EPS
					phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );
	
					var radius = offset.length() * scale;
	
					// restrict radius to be between desired limits
					radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );
	
					// move target to panned location
					this.target.add( panOffset );
	
					offset.x = radius * Math.sin( phi ) * Math.sin( theta );
					offset.y = radius * Math.cos( phi );
					offset.z = radius * Math.sin( phi ) * Math.cos( theta );
	
					// rotate offset back to "camera-up-vector-is-up" space
					offset.applyQuaternion( quatInverse );
	
					position.copy( this.target ).add( offset );
	
					this.object.lookAt( this.target );
	
					if ( this.enableDamping === true ) {
	
						thetaDelta *= ( 1 - this.dampingFactor );
						phiDelta *= ( 1 - this.dampingFactor );
	
					} else {
	
						thetaDelta = 0;
						phiDelta = 0;
	
					}
	
					scale = 1;
					panOffset.set( 0, 0, 0 );
	
					// update condition is:
					// min(camera displacement, camera rotation in radians)^2 > EPS
					// using small-angle approximation cos(x/2) = 1 - x^2 / 8
	
					if ( zoomChanged ||
						 lastPosition.distanceToSquared( this.object.position ) > EPS ||
					    8 * ( 1 - lastQuaternion.dot( this.object.quaternion ) ) > EPS ) {
	
						lastPosition.copy( this.object.position );
						lastQuaternion.copy( this.object.quaternion );
						zoomChanged = false;
	
						return true;
	
					}
	
					return false;
	
				};
	
			}();
	
		};
	
	
		// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
		// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
		// supported.
		//
		//    Orbit - left mouse / touch: one finger move
		//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
		//    Pan - right mouse, or arrow keys / touch: three finter swipe
	
		THREE.OrbitControls = function ( object, domElement ) {
	
			var constraint = new OrbitConstraint( object );
	
			this.domElement = ( domElement !== undefined ) ? domElement : document;
	
			// API
	
			Object.defineProperty( this, 'constraint', {
	
				get: function() {
	
					return constraint;
	
				}
	
			} );
	
			this.getPolarAngle = function () {
	
				return constraint.getPolarAngle();
	
			};
	
			this.getAzimuthalAngle = function () {
	
				return constraint.getAzimuthalAngle();
	
			};
	
			// Set to false to disable this control
			this.enabled = true;
	
			// center is old, deprecated; use "target" instead
			this.center = this.target;
	
			// This option actually enables dollying in and out; left as "zoom" for
			// backwards compatibility.
			// Set to false to disable zooming
			this.enableZoom = true;
			this.zoomSpeed = 1.0;
	
			// Set to false to disable rotating
			this.enableRotate = true;
			this.rotateSpeed = 1.0;
	
			// Set to false to disable panning
			this.enablePan = true;
			this.keyPanSpeed = 7.0;	// pixels moved per arrow key push
	
			// Set to true to automatically rotate around the target
			// If auto-rotate is enabled, you must call controls.update() in your animation loop
			this.autoRotate = false;
			this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
	
			// Set to false to disable use of the keys
			this.enableKeys = true;
	
			// The four arrow keys
			this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
	
			// Mouse buttons
			this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
	
			////////////
			// internals
	
			var scope = this;
	
			var rotateStart = new THREE.Vector2();
			var rotateEnd = new THREE.Vector2();
			var rotateDelta = new THREE.Vector2();
	
			var panStart = new THREE.Vector2();
			var panEnd = new THREE.Vector2();
			var panDelta = new THREE.Vector2();
	
			var dollyStart = new THREE.Vector2();
			var dollyEnd = new THREE.Vector2();
			var dollyDelta = new THREE.Vector2();
	
			var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
	
			var state = STATE.NONE;
	
			// for reset
	
			this.target0 = this.target.clone();
			this.position0 = this.object.position.clone();
			this.zoom0 = this.object.zoom;
	
			// events
	
			var changeEvent = { type: 'change' };
			var startEvent = { type: 'start' };
			var endEvent = { type: 'end' };
	
			// pass in x,y of change desired in pixel space,
			// right and down are positive
			function pan( deltaX, deltaY ) {
	
				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
				constraint.pan( deltaX, deltaY, element.clientWidth, element.clientHeight );
	
			}
	
			this.update = function () {
	
				if ( this.autoRotate && state === STATE.NONE ) {
	
					constraint.rotateLeft( getAutoRotationAngle() );
	
				}
	
				if ( constraint.update() === true ) {
	
					this.dispatchEvent( changeEvent );
	
				}
	
			};
	
			this.reset = function () {
	
				state = STATE.NONE;
	
				this.target.copy( this.target0 );
				this.object.position.copy( this.position0 );
				this.object.zoom = this.zoom0;
	
				this.object.updateProjectionMatrix();
				this.dispatchEvent( changeEvent );
	
				this.update();
	
			};
	
			function getAutoRotationAngle() {
	
				return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
	
			}
	
			function getZoomScale() {
	
				return Math.pow( 0.95, scope.zoomSpeed );
	
			}
	
			function onMouseDown( event ) {
	
				if ( scope.enabled === false ) return;
	
				event.preventDefault();
	
				if ( event.button === scope.mouseButtons.ORBIT ) {
	
					if ( scope.enableRotate === false ) return;
	
					state = STATE.ROTATE;
	
					rotateStart.set( event.clientX, event.clientY );
	
				} else if ( event.button === scope.mouseButtons.ZOOM ) {
	
					if ( scope.enableZoom === false ) return;
	
					state = STATE.DOLLY;
	
					dollyStart.set( event.clientX, event.clientY );
	
				} else if ( event.button === scope.mouseButtons.PAN ) {
	
					if ( scope.enablePan === false ) return;
	
					state = STATE.PAN;
	
					panStart.set( event.clientX, event.clientY );
	
				}
	
				if ( state !== STATE.NONE ) {
	
					document.addEventListener( 'mousemove', onMouseMove, false );
					document.addEventListener( 'mouseup', onMouseUp, false );
					scope.dispatchEvent( startEvent );
	
				}
	
			}
	
			function onMouseMove( event ) {
	
				if ( scope.enabled === false ) return;
	
				event.preventDefault();
	
				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
				if ( state === STATE.ROTATE ) {
	
					if ( scope.enableRotate === false ) return;
	
					rotateEnd.set( event.clientX, event.clientY );
					rotateDelta.subVectors( rotateEnd, rotateStart );
	
					// rotating across whole screen goes 360 degrees around
					constraint.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
	
					// rotating up and down along whole screen attempts to go 360, but limited to 180
					constraint.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );
	
					rotateStart.copy( rotateEnd );
	
				} else if ( state === STATE.DOLLY ) {
	
					if ( scope.enableZoom === false ) return;
	
					dollyEnd.set( event.clientX, event.clientY );
					dollyDelta.subVectors( dollyEnd, dollyStart );
	
					if ( dollyDelta.y > 0 ) {
	
						constraint.dollyIn( getZoomScale() );
	
					} else if ( dollyDelta.y < 0 ) {
	
						constraint.dollyOut( getZoomScale() );
	
					}
	
					dollyStart.copy( dollyEnd );
	
				} else if ( state === STATE.PAN ) {
	
					if ( scope.enablePan === false ) return;
	
					panEnd.set( event.clientX, event.clientY );
					panDelta.subVectors( panEnd, panStart );
	
					pan( panDelta.x, panDelta.y );
	
					panStart.copy( panEnd );
	
				}
	
				if ( state !== STATE.NONE ) scope.update();
	
			}
	
			function onMouseUp( /* event */ ) {
	
				if ( scope.enabled === false ) return;
	
				document.removeEventListener( 'mousemove', onMouseMove, false );
				document.removeEventListener( 'mouseup', onMouseUp, false );
				scope.dispatchEvent( endEvent );
				state = STATE.NONE;
	
			}
	
			function onMouseWheel( event ) {
	
				if ( scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE ) return;
	
				event.preventDefault();
				event.stopPropagation();
	
				var delta = 0;
	
				if ( event.wheelDelta !== undefined ) {
	
					// WebKit / Opera / Explorer 9
	
					delta = event.wheelDelta;
	
				} else if ( event.detail !== undefined ) {
	
					// Firefox
	
					delta = - event.detail;
	
				}
	
				if ( delta > 0 ) {
	
					constraint.dollyOut( getZoomScale() );
	
				} else if ( delta < 0 ) {
	
					constraint.dollyIn( getZoomScale() );
	
				}
	
				scope.update();
				scope.dispatchEvent( startEvent );
				scope.dispatchEvent( endEvent );
	
			}
	
			function onKeyDown( event ) {
	
				if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;
	
				switch ( event.keyCode ) {
	
					case scope.keys.UP:
						pan( 0, scope.keyPanSpeed );
						scope.update();
						break;
	
					case scope.keys.BOTTOM:
						pan( 0, - scope.keyPanSpeed );
						scope.update();
						break;
	
					case scope.keys.LEFT:
						pan( scope.keyPanSpeed, 0 );
						scope.update();
						break;
	
					case scope.keys.RIGHT:
						pan( - scope.keyPanSpeed, 0 );
						scope.update();
						break;
	
				}
	
			}
	
			function touchstart( event ) {
	
				if ( scope.enabled === false ) return;
	
				switch ( event.touches.length ) {
	
					case 1:	// one-fingered touch: rotate
	
						if ( scope.enableRotate === false ) return;
	
						state = STATE.TOUCH_ROTATE;
	
						rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
						break;
	
					case 2:	// two-fingered touch: dolly
	
						if ( scope.enableZoom === false ) return;
	
						state = STATE.TOUCH_DOLLY;
	
						var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
						var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
						var distance = Math.sqrt( dx * dx + dy * dy );
						dollyStart.set( 0, distance );
						break;
	
					case 3: // three-fingered touch: pan
	
						if ( scope.enablePan === false ) return;
	
						state = STATE.TOUCH_PAN;
	
						panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
						break;
	
					default:
	
						state = STATE.NONE;
	
				}
	
				if ( state !== STATE.NONE ) scope.dispatchEvent( startEvent );
	
			}
	
			function touchmove( event ) {
	
				if ( scope.enabled === false ) return;
	
				event.preventDefault();
				event.stopPropagation();
	
				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
				switch ( event.touches.length ) {
	
					case 1: // one-fingered touch: rotate
	
						if ( scope.enableRotate === false ) return;
						if ( state !== STATE.TOUCH_ROTATE ) return;
	
						rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
						rotateDelta.subVectors( rotateEnd, rotateStart );
	
						// rotating across whole screen goes 360 degrees around
						constraint.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
						// rotating up and down along whole screen attempts to go 360, but limited to 180
						constraint.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );
	
						rotateStart.copy( rotateEnd );
	
						scope.update();
						break;
	
					case 2: // two-fingered touch: dolly
	
						if ( scope.enableZoom === false ) return;
						if ( state !== STATE.TOUCH_DOLLY ) return;
	
						var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
						var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
						var distance = Math.sqrt( dx * dx + dy * dy );
	
						dollyEnd.set( 0, distance );
						dollyDelta.subVectors( dollyEnd, dollyStart );
	
						if ( dollyDelta.y > 0 ) {
	
							constraint.dollyOut( getZoomScale() );
	
						} else if ( dollyDelta.y < 0 ) {
	
							constraint.dollyIn( getZoomScale() );
	
						}
	
						dollyStart.copy( dollyEnd );
	
						scope.update();
						break;
	
					case 3: // three-fingered touch: pan
	
						if ( scope.enablePan === false ) return;
						if ( state !== STATE.TOUCH_PAN ) return;
	
						panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
						panDelta.subVectors( panEnd, panStart );
	
						pan( panDelta.x, panDelta.y );
	
						panStart.copy( panEnd );
	
						scope.update();
						break;
	
					default:
	
						state = STATE.NONE;
	
				}
	
			}
	
			function touchend( /* event */ ) {
	
				if ( scope.enabled === false ) return;
	
				scope.dispatchEvent( endEvent );
				state = STATE.NONE;
	
			}
	
			function contextmenu( event ) {
	
				event.preventDefault();
	
			}
	
			this.dispose = function() {
	
				this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
				this.domElement.removeEventListener( 'mousedown', onMouseDown, false );
				this.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
				this.domElement.removeEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox
	
				this.domElement.removeEventListener( 'touchstart', touchstart, false );
				this.domElement.removeEventListener( 'touchend', touchend, false );
				this.domElement.removeEventListener( 'touchmove', touchmove, false );
	
				document.removeEventListener( 'mousemove', onMouseMove, false );
				document.removeEventListener( 'mouseup', onMouseUp, false );
	
				window.removeEventListener( 'keydown', onKeyDown, false );
	
			}
	
			this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	
			this.domElement.addEventListener( 'mousedown', onMouseDown, false );
			this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
			this.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox
	
			this.domElement.addEventListener( 'touchstart', touchstart, false );
			this.domElement.addEventListener( 'touchend', touchend, false );
			this.domElement.addEventListener( 'touchmove', touchmove, false );
	
			window.addEventListener( 'keydown', onKeyDown, false );
	
			// force an update at start
			this.update();
	
		};
	
		THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
		THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
	
		Object.defineProperties( THREE.OrbitControls.prototype, {
	
			object: {
	
				get: function () {
	
					return this.constraint.object;
	
				}
	
			},
	
			target: {
	
				get: function () {
	
					return this.constraint.target;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: target is now immutable. Use target.set() instead.' );
					this.constraint.target.copy( value );
	
				}
	
			},
	
			minDistance : {
	
				get: function () {
	
					return this.constraint.minDistance;
	
				},
	
				set: function ( value ) {
	
					this.constraint.minDistance = value;
	
				}
	
			},
	
			maxDistance : {
	
				get: function () {
	
					return this.constraint.maxDistance;
	
				},
	
				set: function ( value ) {
	
					this.constraint.maxDistance = value;
	
				}
	
			},
	
			minZoom : {
	
				get: function () {
	
					return this.constraint.minZoom;
	
				},
	
				set: function ( value ) {
	
					this.constraint.minZoom = value;
	
				}
	
			},
	
			maxZoom : {
	
				get: function () {
	
					return this.constraint.maxZoom;
	
				},
	
				set: function ( value ) {
	
					this.constraint.maxZoom = value;
	
				}
	
			},
	
			minPolarAngle : {
	
				get: function () {
	
					return this.constraint.minPolarAngle;
	
				},
	
				set: function ( value ) {
	
					this.constraint.minPolarAngle = value;
	
				}
	
			},
	
			maxPolarAngle : {
	
				get: function () {
	
					return this.constraint.maxPolarAngle;
	
				},
	
				set: function ( value ) {
	
					this.constraint.maxPolarAngle = value;
	
				}
	
			},
	
			minAzimuthAngle : {
	
				get: function () {
	
					return this.constraint.minAzimuthAngle;
	
				},
	
				set: function ( value ) {
	
					this.constraint.minAzimuthAngle = value;
	
				}
	
			},
	
			maxAzimuthAngle : {
	
				get: function () {
	
					return this.constraint.maxAzimuthAngle;
	
				},
	
				set: function ( value ) {
	
					this.constraint.maxAzimuthAngle = value;
	
				}
	
			},
	
			enableDamping : {
	
				get: function () {
	
					return this.constraint.enableDamping;
	
				},
	
				set: function ( value ) {
	
					this.constraint.enableDamping = value;
	
				}
	
			},
	
			dampingFactor : {
	
				get: function () {
	
					return this.constraint.dampingFactor;
	
				},
	
				set: function ( value ) {
	
					this.constraint.dampingFactor = value;
	
				}
	
			},
	
			// backward compatibility
	
			noZoom: {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
					return ! this.enableZoom;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
					this.enableZoom = ! value;
	
				}
	
			},
	
			noRotate: {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
					return ! this.enableRotate;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
					this.enableRotate = ! value;
	
				}
	
			},
	
			noPan: {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
					return ! this.enablePan;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
					this.enablePan = ! value;
	
				}
	
			},
	
			noKeys: {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
					return ! this.enableKeys;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
					this.enableKeys = ! value;
	
				}
	
			},
	
			staticMoving : {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
					return ! this.constraint.enableDamping;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
					this.constraint.enableDamping = ! value;
	
				}
	
			},
	
			dynamicDampingFactor : {
	
				get: function () {
	
					console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
					return this.constraint.dampingFactor;
	
				},
	
				set: function ( value ) {
	
					console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
					this.constraint.dampingFactor = value;
	
				}
	
			}
	
		} );
	
	}() );


/***/ },
/* 2 */
/*!****************************!*\
  !*** ./~/dat-gui/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./vendor/dat.gui */ 3)
	module.exports.color = __webpack_require__(/*! ./vendor/dat.color */ 4)

/***/ },
/* 3 */
/*!*************************************!*\
  !*** ./~/dat-gui/vendor/dat.gui.js ***!
  \*************************************/
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	/** @namespace */
	var dat = module.exports = dat || {};
	
	/** @namespace */
	dat.gui = dat.gui || {};
	
	/** @namespace */
	dat.utils = dat.utils || {};
	
	/** @namespace */
	dat.controllers = dat.controllers || {};
	
	/** @namespace */
	dat.dom = dat.dom || {};
	
	/** @namespace */
	dat.color = dat.color || {};
	
	dat.utils.css = (function () {
	  return {
	    load: function (url, doc) {
	      doc = doc || document;
	      var link = doc.createElement('link');
	      link.type = 'text/css';
	      link.rel = 'stylesheet';
	      link.href = url;
	      doc.getElementsByTagName('head')[0].appendChild(link);
	    },
	    inject: function(css, doc) {
	      doc = doc || document;
	      var injected = document.createElement('style');
	      injected.type = 'text/css';
	      injected.innerHTML = css;
	      doc.getElementsByTagName('head')[0].appendChild(injected);
	    }
	  }
	})();
	
	
	dat.utils.common = (function () {
	  
	  var ARR_EACH = Array.prototype.forEach;
	  var ARR_SLICE = Array.prototype.slice;
	
	  /**
	   * Band-aid methods for things that should be a lot easier in JavaScript.
	   * Implementation and structure inspired by underscore.js
	   * http://documentcloud.github.com/underscore/
	   */
	
	  return { 
	    
	    BREAK: {},
	  
	    extend: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (!this.isUndefined(obj[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	      
	    },
	    
	    defaults: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (this.isUndefined(target[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	    
	    },
	    
	    compose: function() {
	      var toCall = ARR_SLICE.call(arguments);
	            return function() {
	              var args = ARR_SLICE.call(arguments);
	              for (var i = toCall.length -1; i >= 0; i--) {
	                args = [toCall[i].apply(this, args)];
	              }
	              return args[0];
	            }
	    },
	    
	    each: function(obj, itr, scope) {
	
	      
	      if (ARR_EACH && obj.forEach === ARR_EACH) { 
	        
	        obj.forEach(itr, scope);
	        
	      } else if (obj.length === obj.length + 0) { // Is number but not NaN
	        
	        for (var key = 0, l = obj.length; key < l; key++)
	          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
	            return;
	            
	      } else {
	
	        for (var key in obj) 
	          if (itr.call(scope, obj[key], key) === this.BREAK)
	            return;
	            
	      }
	            
	    },
	    
	    defer: function(fnc) {
	      setTimeout(fnc, 0);
	    },
	    
	    toArray: function(obj) {
	      if (obj.toArray) return obj.toArray();
	      return ARR_SLICE.call(obj);
	    },
	
	    isUndefined: function(obj) {
	      return obj === undefined;
	    },
	    
	    isNull: function(obj) {
	      return obj === null;
	    },
	    
	    isNaN: function(obj) {
	      return obj !== obj;
	    },
	    
	    isArray: Array.isArray || function(obj) {
	      return obj.constructor === Array;
	    },
	    
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },
	    
	    isNumber: function(obj) {
	      return obj === obj+0;
	    },
	    
	    isString: function(obj) {
	      return obj === obj+'';
	    },
	    
	    isBoolean: function(obj) {
	      return obj === false || obj === true;
	    },
	    
	    isFunction: function(obj) {
	      return Object.prototype.toString.call(obj) === '[object Function]';
	    }
	  
	  };
	    
	})();
	
	
	dat.controllers.Controller = (function (common) {
	
	  /**
	   * @class An "abstract" class that represents a given property of an object.
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var Controller = function(object, property) {
	
	    this.initialValue = object[property];
	
	    /**
	     * Those who extend this class will put their DOM elements in here.
	     * @type {DOMElement}
	     */
	    this.domElement = document.createElement('div');
	
	    /**
	     * The object to manipulate
	     * @type {Object}
	     */
	    this.object = object;
	
	    /**
	     * The name of the property to manipulate
	     * @type {String}
	     */
	    this.property = property;
	
	    /**
	     * The function to be called on change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onChange = undefined;
	
	    /**
	     * The function to be called on finishing change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onFinishChange = undefined;
	
	  };
	
	  common.extend(
	
	      Controller.prototype,
	
	      /** @lends dat.controllers.Controller.prototype */
	      {
	
	        /**
	         * Specify that a function fire every time someone changes the value with
	         * this Controller.
	         *
	         * @param {Function} fnc This function will be called whenever the value
	         * is modified via this Controller.
	         * @returns {dat.controllers.Controller} this
	         */
	        onChange: function(fnc) {
	          this.__onChange = fnc;
	          return this;
	        },
	
	        /**
	         * Specify that a function fire every time someone "finishes" changing
	         * the value wih this Controller. Useful for values that change
	         * incrementally like numbers or strings.
	         *
	         * @param {Function} fnc This function will be called whenever
	         * someone "finishes" changing the value via this Controller.
	         * @returns {dat.controllers.Controller} this
	         */
	        onFinishChange: function(fnc) {
	          this.__onFinishChange = fnc;
	          return this;
	        },
	
	        /**
	         * Change the value of <code>object[property]</code>
	         *
	         * @param {Object} newValue The new value of <code>object[property]</code>
	         */
	        setValue: function(newValue) {
	          this.object[this.property] = newValue;
	          if (this.__onChange) {
	            this.__onChange.call(this, newValue);
	          }
	          this.updateDisplay();
	          return this;
	        },
	
	        /**
	         * Gets the value of <code>object[property]</code>
	         *
	         * @returns {Object} The current value of <code>object[property]</code>
	         */
	        getValue: function() {
	          return this.object[this.property];
	        },
	
	        /**
	         * Refreshes the visual display of a Controller in order to keep sync
	         * with the object's current value.
	         * @returns {dat.controllers.Controller} this
	         */
	        updateDisplay: function() {
	          return this;
	        },
	
	        /**
	         * @returns {Boolean} true if the value has deviated from initialValue
	         */
	        isModified: function() {
	          return this.initialValue !== this.getValue()
	        }
	
	      }
	
	  );
	
	  return Controller;
	
	
	})(dat.utils.common);
	
	
	dat.dom.dom = (function (common) {
	
	  var EVENT_MAP = {
	    'HTMLEvents': ['change'],
	    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
	    'KeyboardEvents': ['keydown']
	  };
	
	  var EVENT_MAP_INV = {};
	  common.each(EVENT_MAP, function(v, k) {
	    common.each(v, function(e) {
	      EVENT_MAP_INV[e] = k;
	    });
	  });
	
	  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
	
	  function cssValueToPixels(val) {
	
	    if (val === '0' || common.isUndefined(val)) return 0;
	
	    var match = val.match(CSS_VALUE_PIXELS);
	
	    if (!common.isNull(match)) {
	      return parseFloat(match[1]);
	    }
	
	    // TODO ...ems? %?
	
	    return 0;
	
	  }
	
	  /**
	   * @namespace
	   * @member dat.dom
	   */
	  var dom = {
	
	    /**
	     * 
	     * @param elem
	     * @param selectable
	     */
	    makeSelectable: function(elem, selectable) {
	
	      if (elem === undefined || elem.style === undefined) return;
	
	      elem.onselectstart = selectable ? function() {
	        return false;
	      } : function() {
	      };
	
	      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	      elem.unselectable = selectable ? 'on' : 'off';
	
	    },
	
	    /**
	     *
	     * @param elem
	     * @param horizontal
	     * @param vertical
	     */
	    makeFullscreen: function(elem, horizontal, vertical) {
	
	      if (common.isUndefined(horizontal)) horizontal = true;
	      if (common.isUndefined(vertical)) vertical = true;
	
	      elem.style.position = 'absolute';
	
	      if (horizontal) {
	        elem.style.left = 0;
	        elem.style.right = 0;
	      }
	      if (vertical) {
	        elem.style.top = 0;
	        elem.style.bottom = 0;
	      }
	
	    },
	
	    /**
	     *
	     * @param elem
	     * @param eventType
	     * @param params
	     */
	    fakeEvent: function(elem, eventType, params, aux) {
	      params = params || {};
	      var className = EVENT_MAP_INV[eventType];
	      if (!className) {
	        throw new Error('Event type ' + eventType + ' not supported.');
	      }
	      var evt = document.createEvent(className);
	      switch (className) {
	        case 'MouseEvents':
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false,
	              params.cancelable || true, window, params.clickCount || 1,
	              0, //screen X
	              0, //screen Y
	              clientX, //client X
	              clientY, //client Y
	              false, false, false, false, 0, null);
	          break;
	        case 'KeyboardEvents':
	          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
	          common.defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false,
	              params.cancelable, window,
	              params.ctrlKey, params.altKey,
	              params.shiftKey, params.metaKey,
	              params.keyCode, params.charCode);
	          break;
	        default:
	          evt.initEvent(eventType, params.bubbles || false,
	              params.cancelable || true);
	          break;
	      }
	      common.defaults(evt, aux);
	      elem.dispatchEvent(evt);
	    },
	
	    /**
	     *
	     * @param elem
	     * @param event
	     * @param func
	     * @param bool
	     */
	    bind: function(elem, event, func, bool) {
	      bool = bool || false;
	      if (elem.addEventListener)
	        elem.addEventListener(event, func, bool);
	      else if (elem.attachEvent)
	        elem.attachEvent('on' + event, func);
	      return dom;
	    },
	
	    /**
	     *
	     * @param elem
	     * @param event
	     * @param func
	     * @param bool
	     */
	    unbind: function(elem, event, func, bool) {
	      bool = bool || false;
	      if (elem.removeEventListener)
	        elem.removeEventListener(event, func, bool);
	      else if (elem.detachEvent)
	        elem.detachEvent('on' + event, func);
	      return dom;
	    },
	
	    /**
	     *
	     * @param elem
	     * @param className
	     */
	    addClass: function(elem, className) {
	      if (elem.className === undefined) {
	        elem.className = className;
	      } else if (elem.className !== className) {
	        var classes = elem.className.split(/ +/);
	        if (classes.indexOf(className) == -1) {
	          classes.push(className);
	          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	        }
	      }
	      return dom;
	    },
	
	    /**
	     *
	     * @param elem
	     * @param className
	     */
	    removeClass: function(elem, className) {
	      if (className) {
	        if (elem.className === undefined) {
	          // elem.className = className;
	        } else if (elem.className === className) {
	          elem.removeAttribute('class');
	        } else {
	          var classes = elem.className.split(/ +/);
	          var index = classes.indexOf(className);
	          if (index != -1) {
	            classes.splice(index, 1);
	            elem.className = classes.join(' ');
	          }
	        }
	      } else {
	        elem.className = undefined;
	      }
	      return dom;
	    },
	
	    hasClass: function(elem, className) {
	      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	    },
	
	    /**
	     *
	     * @param elem
	     */
	    getWidth: function(elem) {
	
	      var style = getComputedStyle(elem);
	
	      return cssValueToPixels(style['border-left-width']) +
	          cssValueToPixels(style['border-right-width']) +
	          cssValueToPixels(style['padding-left']) +
	          cssValueToPixels(style['padding-right']) +
	          cssValueToPixels(style['width']);
	    },
	
	    /**
	     *
	     * @param elem
	     */
	    getHeight: function(elem) {
	
	      var style = getComputedStyle(elem);
	
	      return cssValueToPixels(style['border-top-width']) +
	          cssValueToPixels(style['border-bottom-width']) +
	          cssValueToPixels(style['padding-top']) +
	          cssValueToPixels(style['padding-bottom']) +
	          cssValueToPixels(style['height']);
	    },
	
	    /**
	     *
	     * @param elem
	     */
	    getOffset: function(elem) {
	      var offset = {left: 0, top:0};
	      if (elem.offsetParent) {
	        do {
	          offset.left += elem.offsetLeft;
	          offset.top += elem.offsetTop;
	        } while (elem = elem.offsetParent);
	      }
	      return offset;
	    },
	
	    // http://stackoverflow.com/posts/2684561/revisions
	    /**
	     * 
	     * @param elem
	     */
	    isActive: function(elem) {
	      return elem === document.activeElement && ( elem.type || elem.href );
	    }
	
	  };
	
	  return dom;
	
	})(dat.utils.common);
	
	
	dat.controllers.OptionController = (function (Controller, dom, common) {
	
	  /**
	   * @class Provides a select input to alter the property of an object, using a
	   * list of accepted values.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object|string[]} options A map of labels to acceptable values, or
	   * a list of acceptable string values.
	   *
	   * @member dat.controllers
	   */
	  var OptionController = function(object, property, options) {
	
	    OptionController.superclass.call(this, object, property);
	
	    var _this = this;
	
	    /**
	     * The drop down menu
	     * @ignore
	     */
	    this.__select = document.createElement('select');
	
	    if (common.isArray(options)) {
	      var map = {};
	      common.each(options, function(element) {
	        map[element] = element;
	      });
	      options = map;
	    }
	
	    common.each(options, function(value, key) {
	
	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);
	
	    });
	
	    // Acknowledge original value
	    this.updateDisplay();
	
	    dom.bind(this.__select, 'change', function() {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });
	
	    this.domElement.appendChild(this.__select);
	
	  };
	
	  OptionController.superclass = Controller;
	
	  common.extend(
	
	      OptionController.prototype,
	      Controller.prototype,
	
	      {
	
	        setValue: function(v) {
	          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          return toReturn;
	        },
	
	        updateDisplay: function() {
	          this.__select.value = this.getValue();
	          return OptionController.superclass.prototype.updateDisplay.call(this);
	        }
	
	      }
	
	  );
	
	  return OptionController;
	
	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);
	
	
	dat.controllers.NumberController = (function (Controller, common) {
	
	  /**
	   * @class Represents a given property of an object that is a number.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object} [params] Optional parameters
	   * @param {Number} [params.min] Minimum allowed value
	   * @param {Number} [params.max] Maximum allowed value
	   * @param {Number} [params.step] Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberController = function(object, property, params) {
	
	    NumberController.superclass.call(this, object, property);
	
	    params = params || {};
	
	    this.__min = params.min;
	    this.__max = params.max;
	    this.__step = params.step;
	
	    if (common.isUndefined(this.__step)) {
	
	      if (this.initialValue == 0) {
	        this.__impliedStep = 1; // What are we, psychics?
	      } else {
	        // Hey Doug, check this out.
	        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
	      }
	
	    } else {
	
	      this.__impliedStep = this.__step;
	
	    }
	
	    this.__precision = numDecimals(this.__impliedStep);
	
	
	  };
	
	  NumberController.superclass = Controller;
	
	  common.extend(
	
	      NumberController.prototype,
	      Controller.prototype,
	
	      /** @lends dat.controllers.NumberController.prototype */
	      {
	
	        setValue: function(v) {
	
	          if (this.__min !== undefined && v < this.__min) {
	            v = this.__min;
	          } else if (this.__max !== undefined && v > this.__max) {
	            v = this.__max;
	          }
	
	          if (this.__step !== undefined && v % this.__step != 0) {
	            v = Math.round(v / this.__step) * this.__step;
	          }
	
	          return NumberController.superclass.prototype.setValue.call(this, v);
	
	        },
	
	        /**
	         * Specify a minimum value for <code>object[property]</code>.
	         *
	         * @param {Number} minValue The minimum value for
	         * <code>object[property]</code>
	         * @returns {dat.controllers.NumberController} this
	         */
	        min: function(v) {
	          this.__min = v;
	          return this;
	        },
	
	        /**
	         * Specify a maximum value for <code>object[property]</code>.
	         *
	         * @param {Number} maxValue The maximum value for
	         * <code>object[property]</code>
	         * @returns {dat.controllers.NumberController} this
	         */
	        max: function(v) {
	          this.__max = v;
	          return this;
	        },
	
	        /**
	         * Specify a step value that dat.controllers.NumberController
	         * increments by.
	         *
	         * @param {Number} stepValue The step value for
	         * dat.controllers.NumberController
	         * @default if minimum and maximum specified increment is 1% of the
	         * difference otherwise stepValue is 1
	         * @returns {dat.controllers.NumberController} this
	         */
	        step: function(v) {
	          this.__step = v;
	          return this;
	        }
	
	      }
	
	  );
	
	  function numDecimals(x) {
	    x = x.toString();
	    if (x.indexOf('.') > -1) {
	      return x.length - x.indexOf('.') - 1;
	    } else {
	      return 0;
	    }
	  }
	
	  return NumberController;
	
	})(dat.controllers.Controller,
	dat.utils.common);
	
	
	dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {
	
	  /**
	   * @class Represents a given property of an object that is a number and
	   * provides an input element with which to manipulate it.
	   *
	   * @extends dat.controllers.Controller
	   * @extends dat.controllers.NumberController
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object} [params] Optional parameters
	   * @param {Number} [params.min] Minimum allowed value
	   * @param {Number} [params.max] Maximum allowed value
	   * @param {Number} [params.step] Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberControllerBox = function(object, property, params) {
	
	    this.__truncationSuspended = false;
	
	    NumberControllerBox.superclass.call(this, object, property, params);
	
	    var _this = this;
	
	    /**
	     * {Number} Previous mouse y position
	     * @ignore
	     */
	    var prev_y;
	
	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');
	
	    // Makes it so manually specified values are not truncated.
	
	    dom.bind(this.__input, 'change', onChange);
	    dom.bind(this.__input, 'blur', onBlur);
	    dom.bind(this.__input, 'mousedown', onMouseDown);
	    dom.bind(this.__input, 'keydown', function(e) {
	
	      // When pressing entire, you can be as precise as you want.
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	      }
	
	    });
	
	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!common.isNaN(attempted)) _this.setValue(attempted);
	    }
	
	    function onBlur() {
	      onChange();
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    function onMouseDown(e) {
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      prev_y = e.clientY;
	    }
	
	    function onMouseDrag(e) {
	
	      var diff = prev_y - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
	
	      prev_y = e.clientY;
	
	    }
	
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	    }
	
	    this.updateDisplay();
	
	    this.domElement.appendChild(this.__input);
	
	  };
	
	  NumberControllerBox.superclass = NumberController;
	
	  common.extend(
	
	      NumberControllerBox.prototype,
	      NumberController.prototype,
	
	      {
	
	        updateDisplay: function() {
	
	          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
	          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
	        }
	
	      }
	
	  );
	
	  function roundToDecimal(value, decimals) {
	    var tenTo = Math.pow(10, decimals);
	    return Math.round(value * tenTo) / tenTo;
	  }
	
	  return NumberControllerBox;
	
	})(dat.controllers.NumberController,
	dat.dom.dom,
	dat.utils.common);
	
	
	dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {
	
	  /**
	   * @class Represents a given property of an object that is a number, contains
	   * a minimum and maximum, and provides a slider element with which to
	   * manipulate it. It should be noted that the slider element is made up of
	   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
	   * <code>&lt;slider&gt;</code> element.
	   *
	   * @extends dat.controllers.Controller
	   * @extends dat.controllers.NumberController
	   * 
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Number} minValue Minimum allowed value
	   * @param {Number} maxValue Maximum allowed value
	   * @param {Number} stepValue Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberControllerSlider = function(object, property, min, max, step) {
	
	    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });
	
	    var _this = this;
	
	    this.__background = document.createElement('div');
	    this.__foreground = document.createElement('div');
	    
	
	
	    dom.bind(this.__background, 'mousedown', onMouseDown);
	    
	    dom.addClass(this.__background, 'slider');
	    dom.addClass(this.__foreground, 'slider-fg');
	
	    function onMouseDown(e) {
	
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	
	      onMouseDrag(e);
	    }
	
	    function onMouseDrag(e) {
	
	      e.preventDefault();
	
	      var offset = dom.getOffset(_this.__background);
	      var width = dom.getWidth(_this.__background);
	      
	      _this.setValue(
	        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
	      );
	
	      return false;
	
	    }
	
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    this.updateDisplay();
	
	    this.__background.appendChild(this.__foreground);
	    this.domElement.appendChild(this.__background);
	
	  };
	
	  NumberControllerSlider.superclass = NumberController;
	
	  /**
	   * Injects default stylesheet for slider elements.
	   */
	  NumberControllerSlider.useDefaultStyles = function() {
	    css.inject(styleSheet);
	  };
	
	  common.extend(
	
	      NumberControllerSlider.prototype,
	      NumberController.prototype,
	
	      {
	
	        updateDisplay: function() {
	          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
	          this.__foreground.style.width = pct*100+'%';
	          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
	        }
	
	      }
	
	
	
	  );
	
	  function map(v, i1, i2, o1, o2) {
	    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	  }
	
	  return NumberControllerSlider;
	  
	})(dat.controllers.NumberController,
	dat.dom.dom,
	dat.utils.css,
	dat.utils.common,
	".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
	
	
	dat.controllers.FunctionController = (function (Controller, dom, common) {
	
	  /**
	   * @class Provides a GUI interface to fire a specified method, a property of an object.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var FunctionController = function(object, property, text) {
	
	    FunctionController.superclass.call(this, object, property);
	
	    var _this = this;
	
	    this.__button = document.createElement('div');
	    this.__button.innerHTML = text === undefined ? 'Fire' : text;
	    dom.bind(this.__button, 'click', function(e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });
	
	    dom.addClass(this.__button, 'button');
	
	    this.domElement.appendChild(this.__button);
	
	
	  };
	
	  FunctionController.superclass = Controller;
	
	  common.extend(
	
	      FunctionController.prototype,
	      Controller.prototype,
	      {
	        
	        fire: function() {
	          if (this.__onChange) {
	            this.__onChange.call(this);
	          }
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          this.getValue().call(this.object);
	        }
	      }
	
	  );
	
	  return FunctionController;
	
	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);
	
	
	dat.controllers.BooleanController = (function (Controller, dom, common) {
	
	  /**
	   * @class Provides a checkbox input to alter the boolean property of an object.
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var BooleanController = function(object, property) {
	
	    BooleanController.superclass.call(this, object, property);
	
	    var _this = this;
	    this.__prev = this.getValue();
	
	    this.__checkbox = document.createElement('input');
	    this.__checkbox.setAttribute('type', 'checkbox');
	
	
	    dom.bind(this.__checkbox, 'change', onChange, false);
	
	    this.domElement.appendChild(this.__checkbox);
	
	    // Match original value
	    this.updateDisplay();
	
	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }
	
	  };
	
	  BooleanController.superclass = Controller;
	
	  common.extend(
	
	      BooleanController.prototype,
	      Controller.prototype,
	
	      {
	
	        setValue: function(v) {
	          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          this.__prev = this.getValue();
	          return toReturn;
	        },
	
	        updateDisplay: function() {
	          
	          if (this.getValue() === true) {
	            this.__checkbox.setAttribute('checked', 'checked');
	            this.__checkbox.checked = true;    
	          } else {
	              this.__checkbox.checked = false;
	          }
	
	          return BooleanController.superclass.prototype.updateDisplay.call(this);
	
	        }
	
	
	      }
	
	  );
	
	  return BooleanController;
	
	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);
	
	
	dat.color.toString = (function (common) {
	
	  return function(color) {
	
	    if (color.a == 1 || common.isUndefined(color.a)) {
	
	      var s = color.hex.toString(16);
	      while (s.length < 6) {
	        s = '0' + s;
	      }
	
	      return '#' + s;
	
	    } else {
	
	      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
	
	    }
	
	  }
	
	})(dat.utils.common);
	
	
	dat.color.interpret = (function (toString, common) {
	
	  var result, toReturn;
	
	  var interpret = function() {
	
	    toReturn = false;
	
	    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];
	
	    common.each(INTERPRETATIONS, function(family) {
	
	      if (family.litmus(original)) {
	
	        common.each(family.conversions, function(conversion, conversionName) {
	
	          result = conversion.read(original);
	
	          if (toReturn === false && result !== false) {
	            toReturn = result;
	            result.conversionName = conversionName;
	            result.conversion = conversion;
	            return common.BREAK;
	
	          }
	
	        });
	
	        return common.BREAK;
	
	      }
	
	    });
	
	    return toReturn;
	
	  };
	
	  var INTERPRETATIONS = [
	
	    // Strings
	    {
	
	      litmus: common.isString,
	
	      conversions: {
	
	        THREE_CHAR_HEX: {
	
	          read: function(original) {
	
	            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	            if (test === null) return false;
	
	            return {
	              space: 'HEX',
	              hex: parseInt(
	                  '0x' +
	                      test[1].toString() + test[1].toString() +
	                      test[2].toString() + test[2].toString() +
	                      test[3].toString() + test[3].toString())
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        SIX_CHAR_HEX: {
	
	          read: function(original) {
	
	            var test = original.match(/^#([A-F0-9]{6})$/i);
	            if (test === null) return false;
	
	            return {
	              space: 'HEX',
	              hex: parseInt('0x' + test[1].toString())
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        CSS_RGB: {
	
	          read: function(original) {
	
	            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	            if (test === null) return false;
	
	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3])
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        CSS_RGBA: {
	
	          read: function(original) {
	
	            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
	            if (test === null) return false;
	
	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3]),
	              a: parseFloat(test[4])
	            };
	
	          },
	
	          write: toString
	
	        }
	
	      }
	
	    },
	
	    // Numbers
	    {
	
	      litmus: common.isNumber,
	
	      conversions: {
	
	        HEX: {
	          read: function(original) {
	            return {
	              space: 'HEX',
	              hex: original,
	              conversionName: 'HEX'
	            }
	          },
	
	          write: function(color) {
	            return color.hex;
	          }
	        }
	
	      }
	
	    },
	
	    // Arrays
	    {
	
	      litmus: common.isArray,
	
	      conversions: {
	
	        RGB_ARRAY: {
	          read: function(original) {
	            if (original.length != 3) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2]
	            };
	          },
	
	          write: function(color) {
	            return [color.r, color.g, color.b];
	          }
	
	        },
	
	        RGBA_ARRAY: {
	          read: function(original) {
	            if (original.length != 4) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2],
	              a: original[3]
	            };
	          },
	
	          write: function(color) {
	            return [color.r, color.g, color.b, color.a];
	          }
	
	        }
	
	      }
	
	    },
	
	    // Objects
	    {
	
	      litmus: common.isObject,
	
	      conversions: {
	
	        RGBA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b,
	                a: original.a
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b,
	              a: color.a
	            }
	          }
	        },
	
	        RGB_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b
	            }
	          }
	        },
	
	        HSVA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v,
	                a: original.a
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v,
	              a: color.a
	            }
	          }
	        },
	
	        HSV_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v
	            }
	          }
	
	        }
	
	      }
	
	    }
	
	
	  ];
	
	  return interpret;
	
	
	})(dat.color.toString,
	dat.utils.common);
	
	
	dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {
	
	  css.inject(styleSheet);
	
	  /** Outer-most className for GUI's */
	  var CSS_NAMESPACE = 'dg';
	
	  var HIDE_KEY_CODE = 72;
	
	  /** The only value shared between the JS and SCSS. Use caution. */
	  var CLOSE_BUTTON_HEIGHT = 20;
	
	  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
	
	  var SUPPORTS_LOCAL_STORAGE = (function() {
	    try {
	      return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	      return false;
	    }
	  })();
	
	  var SAVE_DIALOGUE;
	
	  /** Have we yet to create an autoPlace GUI? */
	  var auto_place_virgin = true;
	
	  /** Fixed position div that auto place GUI's go inside */
	  var auto_place_container;
	
	  /** Are we hiding the GUI's ? */
	  var hide = false;
	
	  /** GUI's which should be hidden */
	  var hideable_guis = [];
	
	  /**
	   * A lightweight controller library for JavaScript. It allows you to easily
	   * manipulate variables and fire functions on the fly.
	   * @class
	   *
	   * @member dat.gui
	   *
	   * @param {Object} [params]
	   * @param {String} [params.name] The name of this GUI.
	   * @param {Object} [params.load] JSON object representing the saved state of
	   * this GUI.
	   * @param {Boolean} [params.auto=true]
	   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
	   * @param {Boolean} [params.closed] If true, starts closed
	   */
	  var GUI = function(params) {
	
	    var _this = this;
	
	    /**
	     * Outermost DOM Element
	     * @type DOMElement
	     */
	    this.domElement = document.createElement('div');
	    this.__ul = document.createElement('ul');
	    this.domElement.appendChild(this.__ul);
	
	    dom.addClass(this.domElement, CSS_NAMESPACE);
	
	    /**
	     * Nested GUI's by name
	     * @ignore
	     */
	    this.__folders = {};
	
	    this.__controllers = [];
	
	    /**
	     * List of objects I'm remembering for save, only used in top level GUI
	     * @ignore
	     */
	    this.__rememberedObjects = [];
	
	    /**
	     * Maps the index of remembered objects to a map of controllers, only used
	     * in top level GUI.
	     *
	     * @private
	     * @ignore
	     *
	     * @example
	     * [
	     *  {
	     *    propertyName: Controller,
	     *    anotherPropertyName: Controller
	     *  },
	     *  {
	     *    propertyName: Controller
	     *  }
	     * ]
	     */
	    this.__rememberedObjectIndecesToControllers = [];
	
	    this.__listening = [];
	
	    params = params || {};
	
	    // Default parameters
	    params = common.defaults(params, {
	      autoPlace: true,
	      width: GUI.DEFAULT_WIDTH
	    });
	
	    params = common.defaults(params, {
	      resizable: params.autoPlace,
	      hideable: params.autoPlace
	    });
	
	
	    if (!common.isUndefined(params.load)) {
	
	      // Explicit preset
	      if (params.preset) params.load.preset = params.preset;
	
	    } else {
	
	      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
	
	    }
	
	    if (common.isUndefined(params.parent) && params.hideable) {
	      hideable_guis.push(this);
	    }
	
	    // Only root level GUI's are resizable.
	    params.resizable = common.isUndefined(params.parent) && params.resizable;
	
	
	    if (params.autoPlace && common.isUndefined(params.scrollable)) {
	      params.scrollable = true;
	    }
	//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;
	
	    // Not part of params because I don't want people passing this in via
	    // constructor. Should be a 'remembered' value.
	    var use_local_storage =
	        SUPPORTS_LOCAL_STORAGE &&
	            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
	
	    Object.defineProperties(this,
	
	        /** @lends dat.gui.GUI.prototype */
	        {
	
	          /**
	           * The parent <code>GUI</code>
	           * @type dat.gui.GUI
	           */
	          parent: {
	            get: function() {
	              return params.parent;
	            }
	          },
	
	          scrollable: {
	            get: function() {
	              return params.scrollable;
	            }
	          },
	
	          /**
	           * Handles <code>GUI</code>'s element placement for you
	           * @type Boolean
	           */
	          autoPlace: {
	            get: function() {
	              return params.autoPlace;
	            }
	          },
	
	          /**
	           * The identifier for a set of saved values
	           * @type String
	           */
	          preset: {
	
	            get: function() {
	              if (_this.parent) {
	                return _this.getRoot().preset;
	              } else {
	                return params.load.preset;
	              }
	            },
	
	            set: function(v) {
	              if (_this.parent) {
	                _this.getRoot().preset = v;
	              } else {
	                params.load.preset = v;
	              }
	              setPresetSelectIndex(this);
	              _this.revert();
	            }
	
	          },
	
	          /**
	           * The width of <code>GUI</code> element
	           * @type Number
	           */
	          width: {
	            get: function() {
	              return params.width;
	            },
	            set: function(v) {
	              params.width = v;
	              setWidth(_this, v);
	            }
	          },
	
	          /**
	           * The name of <code>GUI</code>. Used for folders. i.e
	           * a folder's name
	           * @type String
	           */
	          name: {
	            get: function() {
	              return params.name;
	            },
	            set: function(v) {
	              // TODO Check for collisions among sibling folders
	              params.name = v;
	              if (title_row_name) {
	                title_row_name.innerHTML = params.name;
	              }
	            }
	          },
	
	          /**
	           * Whether the <code>GUI</code> is collapsed or not
	           * @type Boolean
	           */
	          closed: {
	            get: function() {
	              return params.closed;
	            },
	            set: function(v) {
	              params.closed = v;
	              if (params.closed) {
	                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
	              } else {
	                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
	              }
	              // For browsers that aren't going to respect the CSS transition,
	              // Lets just check our height against the window height right off
	              // the bat.
	              this.onResize();
	
	              if (_this.__closeButton) {
	                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	              }
	            }
	          },
	
	          /**
	           * Contains all presets
	           * @type Object
	           */
	          load: {
	            get: function() {
	              return params.load;
	            }
	          },
	
	          /**
	           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
	           * <code>remember</code>ing
	           * @type Boolean
	           */
	          useLocalStorage: {
	
	            get: function() {
	              return use_local_storage;
	            },
	            set: function(bool) {
	              if (SUPPORTS_LOCAL_STORAGE) {
	                use_local_storage = bool;
	                if (bool) {
	                  dom.bind(window, 'unload', saveToLocalStorage);
	                } else {
	                  dom.unbind(window, 'unload', saveToLocalStorage);
	                }
	                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
	              }
	            }
	
	          }
	
	        });
	
	    // Are we a root level GUI?
	    if (common.isUndefined(params.parent)) {
	
	      params.closed = false;
	
	      dom.addClass(this.domElement, GUI.CLASS_MAIN);
	      dom.makeSelectable(this.domElement, false);
	
	      // Are we supposed to be loading locally?
	      if (SUPPORTS_LOCAL_STORAGE) {
	
	        if (use_local_storage) {
	
	          _this.useLocalStorage = true;
	
	          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
	
	          if (saved_gui) {
	            params.load = JSON.parse(saved_gui);
	          }
	
	        }
	
	      }
	
	      this.__closeButton = document.createElement('div');
	      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	      this.domElement.appendChild(this.__closeButton);
	
	      dom.bind(this.__closeButton, 'click', function() {
	
	        _this.closed = !_this.closed;
	
	
	      });
	
	
	      // Oh, you're a nested GUI!
	    } else {
	
	      if (params.closed === undefined) {
	        params.closed = true;
	      }
	
	      var title_row_name = document.createTextNode(params.name);
	      dom.addClass(title_row_name, 'controller-name');
	
	      var title_row = addRow(_this, title_row_name);
	
	      var on_click_title = function(e) {
	        e.preventDefault();
	        _this.closed = !_this.closed;
	        return false;
	      };
	
	      dom.addClass(this.__ul, GUI.CLASS_CLOSED);
	
	      dom.addClass(title_row, 'title');
	      dom.bind(title_row, 'click', on_click_title);
	
	      if (!params.closed) {
	        this.closed = false;
	      }
	
	    }
	
	    if (params.autoPlace) {
	
	      if (common.isUndefined(params.parent)) {
	
	        if (auto_place_virgin) {
	          auto_place_container = document.createElement('div');
	          dom.addClass(auto_place_container, CSS_NAMESPACE);
	          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
	          document.body.appendChild(auto_place_container);
	          auto_place_virgin = false;
	        }
	
	        // Put it in the dom for you.
	        auto_place_container.appendChild(this.domElement);
	
	        // Apply the auto styles
	        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
	
	      }
	
	
	      // Make it not elastic.
	      if (!this.parent) setWidth(_this, params.width);
	
	    }
	
	    dom.bind(window, 'resize', function() { _this.onResize() });
	    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
	    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
	    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
	    this.onResize();
	
	
	    if (params.resizable) {
	      addResizeHandle(this);
	    }
	
	    function saveToLocalStorage() {
	      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }
	
	    var root = _this.getRoot();
	    function resetWidth() {
	        var root = _this.getRoot();
	        root.width += 1;
	        common.defer(function() {
	          root.width -= 1;
	        });
	      }
	
	      if (!params.parent) {
	        resetWidth();
	      }
	
	  };
	
	  GUI.toggleHide = function() {
	
	    hide = !hide;
	    common.each(hideable_guis, function(gui) {
	      gui.domElement.style.zIndex = hide ? -999 : 999;
	      gui.domElement.style.opacity = hide ? 0 : 1;
	    });
	  };
	
	  GUI.CLASS_AUTO_PLACE = 'a';
	  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	  GUI.CLASS_MAIN = 'main';
	  GUI.CLASS_CONTROLLER_ROW = 'cr';
	  GUI.CLASS_TOO_TALL = 'taller-than-window';
	  GUI.CLASS_CLOSED = 'closed';
	  GUI.CLASS_CLOSE_BUTTON = 'close-button';
	  GUI.CLASS_DRAG = 'drag';
	
	  GUI.DEFAULT_WIDTH = 245;
	  GUI.TEXT_CLOSED = 'Close Controls';
	  GUI.TEXT_OPEN = 'Open Controls';
	
	  dom.bind(window, 'keydown', function(e) {
	
	    if (document.activeElement.type !== 'text' &&
	        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
	      GUI.toggleHide();
	    }
	
	  }, false);
	
	  common.extend(
	
	      GUI.prototype,
	
	      /** @lends dat.gui.GUI */
	      {
	
	        /**
	         * @param object
	         * @param property
	         * @returns {dat.controllers.Controller} The new controller that was added.
	         * @instance
	         */
	        add: function(object, property) {
	
	          return add(
	              this,
	              object,
	              property,
	              {
	                factoryArgs: Array.prototype.slice.call(arguments, 2)
	              }
	          );
	
	        },
	
	        /**
	         * @param object
	         * @param property
	         * @returns {dat.controllers.ColorController} The new controller that was added.
	         * @instance
	         */
	        addColor: function(object, property) {
	
	          return add(
	              this,
	              object,
	              property,
	              {
	                color: true
	              }
	          );
	
	        },
	
	        /**
	         * @param controller
	         * @instance
	         */
	        remove: function(controller) {
	
	          // TODO listening?
	          this.__ul.removeChild(controller.__li);
	          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
	          var _this = this;
	          common.defer(function() {
	            _this.onResize();
	          });
	
	        },
	
	        destroy: function() {
	
	          if (this.autoPlace) {
	            auto_place_container.removeChild(this.domElement);
	          }
	
	        },
	
	        /**
	         * @param name
	         * @returns {dat.gui.GUI} The new folder.
	         * @throws {Error} if this GUI already has a folder by the specified
	         * name
	         * @instance
	         */
	        addFolder: function(name) {
	
	          // We have to prevent collisions on names in order to have a key
	          // by which to remember saved values
	          if (this.__folders[name] !== undefined) {
	            throw new Error('You already have a folder in this GUI by the' +
	                ' name "' + name + '"');
	          }
	
	          var new_gui_params = { name: name, parent: this };
	
	          // We need to pass down the autoPlace trait so that we can
	          // attach event listeners to open/close folder actions to
	          // ensure that a scrollbar appears if the window is too short.
	          new_gui_params.autoPlace = this.autoPlace;
	
	          // Do we have saved appearance data for this folder?
	
	          if (this.load && // Anything loaded?
	              this.load.folders && // Was my parent a dead-end?
	              this.load.folders[name]) { // Did daddy remember me?
	
	            // Start me closed if I was closed
	            new_gui_params.closed = this.load.folders[name].closed;
	
	            // Pass down the loaded data
	            new_gui_params.load = this.load.folders[name];
	
	          }
	
	          var gui = new GUI(new_gui_params);
	          this.__folders[name] = gui;
	
	          var li = addRow(this, gui.domElement);
	          dom.addClass(li, 'folder');
	          return gui;
	
	        },
	
	        open: function() {
	          this.closed = false;
	        },
	
	        close: function() {
	          this.closed = true;
	        },
	
	        onResize: function() {
	
	          var root = this.getRoot();
	
	          if (root.scrollable) {
	
	            var top = dom.getOffset(root.__ul).top;
	            var h = 0;
	
	            common.each(root.__ul.childNodes, function(node) {
	              if (! (root.autoPlace && node === root.__save_row))
	                h += dom.getHeight(node);
	            });
	
	            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
	              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
	              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
	            } else {
	              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
	              root.__ul.style.height = 'auto';
	            }
	
	          }
	
	          if (root.__resize_handle) {
	            common.defer(function() {
	              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	            });
	          }
	
	          if (root.__closeButton) {
	            root.__closeButton.style.width = root.width + 'px';
	          }
	
	        },
	
	        /**
	         * Mark objects for saving. The order of these objects cannot change as
	         * the GUI grows. When remembering new objects, append them to the end
	         * of the list.
	         *
	         * @param {Object...} objects
	         * @throws {Error} if not called on a top level GUI.
	         * @instance
	         */
	        remember: function() {
	
	          if (common.isUndefined(SAVE_DIALOGUE)) {
	            SAVE_DIALOGUE = new CenteredDiv();
	            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
	          }
	
	          if (this.parent) {
	            throw new Error("You can only call remember on a top level GUI.");
	          }
	
	          var _this = this;
	
	          common.each(Array.prototype.slice.call(arguments), function(object) {
	            if (_this.__rememberedObjects.length == 0) {
	              addSaveMenu(_this);
	            }
	            if (_this.__rememberedObjects.indexOf(object) == -1) {
	              _this.__rememberedObjects.push(object);
	            }
	          });
	
	          if (this.autoPlace) {
	            // Set save row width
	            setWidth(this, this.width);
	          }
	
	        },
	
	        /**
	         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
	         * @instance
	         */
	        getRoot: function() {
	          var gui = this;
	          while (gui.parent) {
	            gui = gui.parent;
	          }
	          return gui;
	        },
	
	        /**
	         * @returns {Object} a JSON object representing the current state of
	         * this GUI as well as its remembered properties.
	         * @instance
	         */
	        getSaveObject: function() {
	
	          var toReturn = this.load;
	
	          toReturn.closed = this.closed;
	
	          // Am I remembering any values?
	          if (this.__rememberedObjects.length > 0) {
	
	            toReturn.preset = this.preset;
	
	            if (!toReturn.remembered) {
	              toReturn.remembered = {};
	            }
	
	            toReturn.remembered[this.preset] = getCurrentPreset(this);
	
	          }
	
	          toReturn.folders = {};
	          common.each(this.__folders, function(element, key) {
	            toReturn.folders[key] = element.getSaveObject();
	          });
	
	          return toReturn;
	
	        },
	
	        save: function() {
	
	          if (!this.load.remembered) {
	            this.load.remembered = {};
	          }
	
	          this.load.remembered[this.preset] = getCurrentPreset(this);
	          markPresetModified(this, false);
	
	        },
	
	        saveAs: function(presetName) {
	
	          if (!this.load.remembered) {
	
	            // Retain default values upon first save
	            this.load.remembered = {};
	            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
	
	          }
	
	          this.load.remembered[presetName] = getCurrentPreset(this);
	          this.preset = presetName;
	          addPresetOption(this, presetName, true);
	
	        },
	
	        revert: function(gui) {
	
	          common.each(this.__controllers, function(controller) {
	            // Make revert work on Default.
	            if (!this.getRoot().load.remembered) {
	              controller.setValue(controller.initialValue);
	            } else {
	              recallSavedValue(gui || this.getRoot(), controller);
	            }
	          }, this);
	
	          common.each(this.__folders, function(folder) {
	            folder.revert(folder);
	          });
	
	          if (!gui) {
	            markPresetModified(this.getRoot(), false);
	          }
	
	
	        },
	
	        listen: function(controller) {
	
	          var init = this.__listening.length == 0;
	          this.__listening.push(controller);
	          if (init) updateDisplays(this.__listening);
	
	        }
	
	      }
	
	  );
	
	  function add(gui, object, property, params) {
	
	    if (object[property] === undefined) {
	      throw new Error("Object " + object + " has no property \"" + property + "\"");
	    }
	
	    var controller;
	
	    if (params.color) {
	
	      controller = new ColorController(object, property);
	
	    } else {
	
	      var factoryArgs = [object,property].concat(params.factoryArgs);
	      controller = controllerFactory.apply(gui, factoryArgs);
	
	    }
	
	    if (params.before instanceof Controller) {
	      params.before = params.before.__li;
	    }
	
	    recallSavedValue(gui, controller);
	
	    dom.addClass(controller.domElement, 'c');
	
	    var name = document.createElement('span');
	    dom.addClass(name, 'property-name');
	    name.innerHTML = controller.property;
	
	    var container = document.createElement('div');
	    container.appendChild(name);
	    container.appendChild(controller.domElement);
	
	    var li = addRow(gui, container, params.before);
	
	    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
	    dom.addClass(li, typeof controller.getValue());
	
	    augmentController(gui, li, controller);
	
	    gui.__controllers.push(controller);
	
	    return controller;
	
	  }
	
	  /**
	   * Add a row to the end of the GUI or before another row.
	   *
	   * @param gui
	   * @param [dom] If specified, inserts the dom content in the new row
	   * @param [liBefore] If specified, places the new row before another row
	   */
	  function addRow(gui, dom, liBefore) {
	    var li = document.createElement('li');
	    if (dom) li.appendChild(dom);
	    if (liBefore) {
	      gui.__ul.insertBefore(li, params.before);
	    } else {
	      gui.__ul.appendChild(li);
	    }
	    gui.onResize();
	    return li;
	  }
	
	  function augmentController(gui, li, controller) {
	
	    controller.__li = li;
	    controller.__gui = gui;
	
	    common.extend(controller, {
	
	      options: function(options) {
	
	        if (arguments.length > 1) {
	          controller.remove();
	
	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [common.toArray(arguments)]
	              }
	          );
	
	        }
	
	        if (common.isArray(options) || common.isObject(options)) {
	          controller.remove();
	
	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [options]
	              }
	          );
	
	        }
	
	      },
	
	      name: function(v) {
	        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
	        return controller;
	      },
	
	      listen: function() {
	        controller.__gui.listen(controller);
	        return controller;
	      },
	
	      remove: function() {
	        controller.__gui.remove(controller);
	        return controller;
	      }
	
	    });
	
	    // All sliders should be accompanied by a box.
	    if (controller instanceof NumberControllerSlider) {
	
	      var box = new NumberControllerBox(controller.object, controller.property,
	          { min: controller.__min, max: controller.__max, step: controller.__step });
	
	      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
	        var pc = controller[method];
	        var pb = box[method];
	        controller[method] = box[method] = function() {
	          var args = Array.prototype.slice.call(arguments);
	          pc.apply(controller, args);
	          return pb.apply(box, args);
	        }
	      });
	
	      dom.addClass(li, 'has-slider');
	      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
	
	    }
	    else if (controller instanceof NumberControllerBox) {
	
	      var r = function(returned) {
	
	        // Have we defined both boundaries?
	        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {
	
	          // Well, then lets just replace this with a slider.
	          controller.remove();
	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [controller.__min, controller.__max, controller.__step]
	              });
	
	        }
	
	        return returned;
	
	      };
	
	      controller.min = common.compose(r, controller.min);
	      controller.max = common.compose(r, controller.max);
	
	    }
	    else if (controller instanceof BooleanController) {
	
	      dom.bind(li, 'click', function() {
	        dom.fakeEvent(controller.__checkbox, 'click');
	      });
	
	      dom.bind(controller.__checkbox, 'click', function(e) {
	        e.stopPropagation(); // Prevents double-toggle
	      })
	
	    }
	    else if (controller instanceof FunctionController) {
	
	      dom.bind(li, 'click', function() {
	        dom.fakeEvent(controller.__button, 'click');
	      });
	
	      dom.bind(li, 'mouseover', function() {
	        dom.addClass(controller.__button, 'hover');
	      });
	
	      dom.bind(li, 'mouseout', function() {
	        dom.removeClass(controller.__button, 'hover');
	      });
	
	    }
	    else if (controller instanceof ColorController) {
	
	      dom.addClass(li, 'color');
	      controller.updateDisplay = common.compose(function(r) {
	        li.style.borderLeftColor = controller.__color.toString();
	        return r;
	      }, controller.updateDisplay);
	
	      controller.updateDisplay();
	
	    }
	
	    controller.setValue = common.compose(function(r) {
	      if (gui.getRoot().__preset_select && controller.isModified()) {
	        markPresetModified(gui.getRoot(), true);
	      }
	      return r;
	    }, controller.setValue);
	
	  }
	
	  function recallSavedValue(gui, controller) {
	
	    // Find the topmost GUI, that's where remembered objects live.
	    var root = gui.getRoot();
	
	    // Does the object we're controlling match anything we've been told to
	    // remember?
	    var matched_index = root.__rememberedObjects.indexOf(controller.object);
	
	    // Why yes, it does!
	    if (matched_index != -1) {
	
	      // Let me fetch a map of controllers for thcommon.isObject.
	      var controller_map =
	          root.__rememberedObjectIndecesToControllers[matched_index];
	
	      // Ohp, I believe this is the first controller we've created for this
	      // object. Lets make the map fresh.
	      if (controller_map === undefined) {
	        controller_map = {};
	        root.__rememberedObjectIndecesToControllers[matched_index] =
	            controller_map;
	      }
	
	      // Keep track of this controller
	      controller_map[controller.property] = controller;
	
	      // Okay, now have we saved any values for this controller?
	      if (root.load && root.load.remembered) {
	
	        var preset_map = root.load.remembered;
	
	        // Which preset are we trying to load?
	        var preset;
	
	        if (preset_map[gui.preset]) {
	
	          preset = preset_map[gui.preset];
	
	        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {
	
	          // Uhh, you can have the default instead?
	          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];
	
	        } else {
	
	          // Nada.
	
	          return;
	
	        }
	
	
	        // Did the loaded object remember thcommon.isObject?
	        if (preset[matched_index] &&
	
	          // Did we remember this particular property?
	            preset[matched_index][controller.property] !== undefined) {
	
	          // We did remember something for this guy ...
	          var value = preset[matched_index][controller.property];
	
	          // And that's what it is.
	          controller.initialValue = value;
	          controller.setValue(value);
	
	        }
	
	      }
	
	    }
	
	  }
	
	  function getLocalStorageHash(gui, key) {
	    // TODO how does this deal with multiple GUI's?
	    return document.location.href + '.' + key;
	
	  }
	
	  function addSaveMenu(gui) {
	
	    var div = gui.__save_row = document.createElement('li');
	
	    dom.addClass(gui.domElement, 'has-save');
	
	    gui.__ul.insertBefore(div, gui.__ul.firstChild);
	
	    dom.addClass(div, 'save-row');
	
	    var gears = document.createElement('span');
	    gears.innerHTML = '&nbsp;';
	    dom.addClass(gears, 'button gears');
	
	    // TODO replace with FunctionController
	    var button = document.createElement('span');
	    button.innerHTML = 'Save';
	    dom.addClass(button, 'button');
	    dom.addClass(button, 'save');
	
	    var button2 = document.createElement('span');
	    button2.innerHTML = 'New';
	    dom.addClass(button2, 'button');
	    dom.addClass(button2, 'save-as');
	
	    var button3 = document.createElement('span');
	    button3.innerHTML = 'Revert';
	    dom.addClass(button3, 'button');
	    dom.addClass(button3, 'revert');
	
	    var select = gui.__preset_select = document.createElement('select');
	
	    if (gui.load && gui.load.remembered) {
	
	      common.each(gui.load.remembered, function(value, key) {
	        addPresetOption(gui, key, key == gui.preset);
	      });
	
	    } else {
	      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
	    }
	
	    dom.bind(select, 'change', function() {
	
	
	      for (var index = 0; index < gui.__preset_select.length; index++) {
	        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	      }
	
	      gui.preset = this.value;
	
	    });
	
	    div.appendChild(select);
	    div.appendChild(gears);
	    div.appendChild(button);
	    div.appendChild(button2);
	    div.appendChild(button3);
	
	    if (SUPPORTS_LOCAL_STORAGE) {
	
	      var saveLocally = document.getElementById('dg-save-locally');
	      var explain = document.getElementById('dg-local-explain');
	
	      saveLocally.style.display = 'block';
	
	      var localStorageCheckBox = document.getElementById('dg-local-storage');
	
	      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
	        localStorageCheckBox.setAttribute('checked', 'checked');
	      }
	
	      function showHideExplain() {
	        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	      }
	
	      showHideExplain();
	
	      // TODO: Use a boolean controller, fool!
	      dom.bind(localStorageCheckBox, 'change', function() {
	        gui.useLocalStorage = !gui.useLocalStorage;
	        showHideExplain();
	      });
	
	    }
	
	    var newConstructorTextArea = document.getElementById('dg-new-constructor');
	
	    dom.bind(newConstructorTextArea, 'keydown', function(e) {
	      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
	        SAVE_DIALOGUE.hide();
	      }
	    });
	
	    dom.bind(gears, 'click', function() {
	      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	      SAVE_DIALOGUE.show();
	      newConstructorTextArea.focus();
	      newConstructorTextArea.select();
	    });
	
	    dom.bind(button, 'click', function() {
	      gui.save();
	    });
	
	    dom.bind(button2, 'click', function() {
	      var presetName = prompt('Enter a new preset name.');
	      if (presetName) gui.saveAs(presetName);
	    });
	
	    dom.bind(button3, 'click', function() {
	      gui.revert();
	    });
	
	//    div.appendChild(button2);
	
	  }
	
	  function addResizeHandle(gui) {
	
	    gui.__resize_handle = document.createElement('div');
	
	    common.extend(gui.__resize_handle.style, {
	
	      width: '6px',
	      marginLeft: '-3px',
	      height: '200px',
	      cursor: 'ew-resize',
	      position: 'absolute'
	//      border: '1px solid blue'
	
	    });
	
	    var pmouseX;
	
	    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
	    dom.bind(gui.__closeButton, 'mousedown', dragStart);
	
	    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
	
	    function dragStart(e) {
	
	      e.preventDefault();
	
	      pmouseX = e.clientX;
	
	      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
	      dom.bind(window, 'mousemove', drag);
	      dom.bind(window, 'mouseup', dragStop);
	
	      return false;
	
	    }
	
	    function drag(e) {
	
	      e.preventDefault();
	
	      gui.width += pmouseX - e.clientX;
	      gui.onResize();
	      pmouseX = e.clientX;
	
	      return false;
	
	    }
	
	    function dragStop() {
	
	      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
	      dom.unbind(window, 'mousemove', drag);
	      dom.unbind(window, 'mouseup', dragStop);
	
	    }
	
	  }
	
	  function setWidth(gui, w) {
	    gui.domElement.style.width = w + 'px';
	    // Auto placed save-rows are position fixed, so we have to
	    // set the width manually if we want it to bleed to the edge
	    if (gui.__save_row && gui.autoPlace) {
	      gui.__save_row.style.width = w + 'px';
	    }if (gui.__closeButton) {
	      gui.__closeButton.style.width = w + 'px';
	    }
	  }
	
	  function getCurrentPreset(gui, useInitialValues) {
	
	    var toReturn = {};
	
	    // For each object I'm remembering
	    common.each(gui.__rememberedObjects, function(val, index) {
	
	      var saved_values = {};
	
	      // The controllers I've made for thcommon.isObject by property
	      var controller_map =
	          gui.__rememberedObjectIndecesToControllers[index];
	
	      // Remember each value for each property
	      common.each(controller_map, function(controller, property) {
	        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
	      });
	
	      // Save the values for thcommon.isObject
	      toReturn[index] = saved_values;
	
	    });
	
	    return toReturn;
	
	  }
	
	  function addPresetOption(gui, name, setSelected) {
	    var opt = document.createElement('option');
	    opt.innerHTML = name;
	    opt.value = name;
	    gui.__preset_select.appendChild(opt);
	    if (setSelected) {
	      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	    }
	  }
	
	  function setPresetSelectIndex(gui) {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      if (gui.__preset_select[index].value == gui.preset) {
	        gui.__preset_select.selectedIndex = index;
	      }
	    }
	  }
	
	  function markPresetModified(gui, modified) {
	    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	//    console.log('mark', modified, opt);
	    if (modified) {
	      opt.innerHTML = opt.value + "*";
	    } else {
	      opt.innerHTML = opt.value;
	    }
	  }
	
	  function updateDisplays(controllerArray) {
	
	
	    if (controllerArray.length != 0) {
	
	      requestAnimationFrame(function() {
	        updateDisplays(controllerArray);
	      });
	
	    }
	
	    common.each(controllerArray, function(c) {
	      c.updateDisplay();
	    });
	
	  }
	
	  return GUI;
	
	})(dat.utils.css,
	"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
	".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
	dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {
	
	      return function(object, property) {
	
	        var initialValue = object[property];
	
	        // Providing options?
	        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
	          return new OptionController(object, property, arguments[2]);
	        }
	
	        // Providing a map?
	
	        if (common.isNumber(initialValue)) {
	
	          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {
	
	            // Has min and max.
	            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
	
	          } else {
	
	            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
	
	          }
	
	        }
	
	        if (common.isString(initialValue)) {
	          return new StringController(object, property);
	        }
	
	        if (common.isFunction(initialValue)) {
	          return new FunctionController(object, property, '');
	        }
	
	        if (common.isBoolean(initialValue)) {
	          return new BooleanController(object, property);
	        }
	
	      }
	
	    })(dat.controllers.OptionController,
	dat.controllers.NumberControllerBox,
	dat.controllers.NumberControllerSlider,
	dat.controllers.StringController = (function (Controller, dom, common) {
	
	  /**
	   * @class Provides a text input to alter the string property of an object.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var StringController = function(object, property) {
	
	    StringController.superclass.call(this, object, property);
	
	    var _this = this;
	
	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');
	
	    dom.bind(this.__input, 'keyup', onChange);
	    dom.bind(this.__input, 'change', onChange);
	    dom.bind(this.__input, 'blur', onBlur);
	    dom.bind(this.__input, 'keydown', function(e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	    
	
	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }
	
	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    this.updateDisplay();
	
	    this.domElement.appendChild(this.__input);
	
	  };
	
	  StringController.superclass = Controller;
	
	  common.extend(
	
	      StringController.prototype,
	      Controller.prototype,
	
	      {
	
	        updateDisplay: function() {
	          // Stops the caret from moving on account of:
	          // keyup -> setValue -> updateDisplay
	          if (!dom.isActive(this.__input)) {
	            this.__input.value = this.getValue();
	          }
	          return StringController.superclass.prototype.updateDisplay.call(this);
	        }
	
	      }
	
	  );
	
	  return StringController;
	
	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common),
	dat.controllers.FunctionController,
	dat.controllers.BooleanController,
	dat.utils.common),
	dat.controllers.Controller,
	dat.controllers.BooleanController,
	dat.controllers.FunctionController,
	dat.controllers.NumberControllerBox,
	dat.controllers.NumberControllerSlider,
	dat.controllers.OptionController,
	dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {
	
	  var ColorController = function(object, property) {
	
	    ColorController.superclass.call(this, object, property);
	
	    this.__color = new Color(this.getValue());
	    this.__temp = new Color(0);
	
	    var _this = this;
	
	    this.domElement = document.createElement('div');
	
	    dom.makeSelectable(this.domElement, false);
	
	    this.__selector = document.createElement('div');
	    this.__selector.className = 'selector';
	
	    this.__saturation_field = document.createElement('div');
	    this.__saturation_field.className = 'saturation-field';
	
	    this.__field_knob = document.createElement('div');
	    this.__field_knob.className = 'field-knob';
	    this.__field_knob_border = '2px solid ';
	
	    this.__hue_knob = document.createElement('div');
	    this.__hue_knob.className = 'hue-knob';
	
	    this.__hue_field = document.createElement('div');
	    this.__hue_field.className = 'hue-field';
	
	    this.__input = document.createElement('input');
	    this.__input.type = 'text';
	    this.__input_textShadow = '0 1px 1px ';
	
	    dom.bind(this.__input, 'keydown', function(e) {
	      if (e.keyCode === 13) { // on enter
	        onBlur.call(this);
	      }
	    });
	
	    dom.bind(this.__input, 'blur', onBlur);
	
	    dom.bind(this.__selector, 'mousedown', function(e) {
	
	      dom
	        .addClass(this, 'drag')
	        .bind(window, 'mouseup', function(e) {
	          dom.removeClass(_this.__selector, 'drag');
	        });
	
	    });
	
	    var value_field = document.createElement('div');
	
	    common.extend(this.__selector.style, {
	      width: '122px',
	      height: '102px',
	      padding: '3px',
	      backgroundColor: '#222',
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	    });
	
	    common.extend(this.__field_knob.style, {
	      position: 'absolute',
	      width: '12px',
	      height: '12px',
	      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	      borderRadius: '12px',
	      zIndex: 1
	    });
	    
	    common.extend(this.__hue_knob.style, {
	      position: 'absolute',
	      width: '15px',
	      height: '2px',
	      borderRight: '4px solid #fff',
	      zIndex: 1
	    });
	
	    common.extend(this.__saturation_field.style, {
	      width: '100px',
	      height: '100px',
	      border: '1px solid #555',
	      marginRight: '3px',
	      display: 'inline-block',
	      cursor: 'pointer'
	    });
	
	    common.extend(value_field.style, {
	      width: '100%',
	      height: '100%',
	      background: 'none'
	    });
	    
	    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');
	
	    common.extend(this.__hue_field.style, {
	      width: '15px',
	      height: '100px',
	      display: 'inline-block',
	      border: '1px solid #555',
	      cursor: 'ns-resize'
	    });
	
	    hueGradient(this.__hue_field);
	
	    common.extend(this.__input.style, {
	      outline: 'none',
	//      width: '120px',
	      textAlign: 'center',
	//      padding: '4px',
	//      marginBottom: '6px',
	      color: '#fff',
	      border: 0,
	      fontWeight: 'bold',
	      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
	    });
	
	    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
	    dom.bind(this.__field_knob, 'mousedown', fieldDown);
	
	    dom.bind(this.__hue_field, 'mousedown', function(e) {
	      setH(e);
	      dom.bind(window, 'mousemove', setH);
	      dom.bind(window, 'mouseup', unbindH);
	    });
	
	    function fieldDown(e) {
	      setSV(e);
	      // document.body.style.cursor = 'none';
	      dom.bind(window, 'mousemove', setSV);
	      dom.bind(window, 'mouseup', unbindSV);
	    }
	
	    function unbindSV() {
	      dom.unbind(window, 'mousemove', setSV);
	      dom.unbind(window, 'mouseup', unbindSV);
	      // document.body.style.cursor = 'default';
	    }
	
	    function onBlur() {
	      var i = interpret(this.value);
	      if (i !== false) {
	        _this.__color.__state = i;
	        _this.setValue(_this.__color.toOriginal());
	      } else {
	        this.value = _this.__color.toString();
	      }
	    }
	
	    function unbindH() {
	      dom.unbind(window, 'mousemove', setH);
	      dom.unbind(window, 'mouseup', unbindH);
	    }
	
	    this.__saturation_field.appendChild(value_field);
	    this.__selector.appendChild(this.__field_knob);
	    this.__selector.appendChild(this.__saturation_field);
	    this.__selector.appendChild(this.__hue_field);
	    this.__hue_field.appendChild(this.__hue_knob);
	
	    this.domElement.appendChild(this.__input);
	    this.domElement.appendChild(this.__selector);
	
	    this.updateDisplay();
	
	    function setSV(e) {
	
	      e.preventDefault();
	
	      var w = dom.getWidth(_this.__saturation_field);
	      var o = dom.getOffset(_this.__saturation_field);
	      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
	      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;
	
	      if (v > 1) v = 1;
	      else if (v < 0) v = 0;
	
	      if (s > 1) s = 1;
	      else if (s < 0) s = 0;
	
	      _this.__color.v = v;
	      _this.__color.s = s;
	
	      _this.setValue(_this.__color.toOriginal());
	
	
	      return false;
	
	    }
	
	    function setH(e) {
	
	      e.preventDefault();
	
	      var s = dom.getHeight(_this.__hue_field);
	      var o = dom.getOffset(_this.__hue_field);
	      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;
	
	      if (h > 1) h = 1;
	      else if (h < 0) h = 0;
	
	      _this.__color.h = h * 360;
	
	      _this.setValue(_this.__color.toOriginal());
	
	      return false;
	
	    }
	
	  };
	
	  ColorController.superclass = Controller;
	
	  common.extend(
	
	      ColorController.prototype,
	      Controller.prototype,
	
	      {
	
	        updateDisplay: function() {
	
	          var i = interpret(this.getValue());
	
	          if (i !== false) {
	
	            var mismatch = false;
	
	            // Check for mismatch on the interpreted value.
	
	            common.each(Color.COMPONENTS, function(component) {
	              if (!common.isUndefined(i[component]) &&
	                  !common.isUndefined(this.__color.__state[component]) &&
	                  i[component] !== this.__color.__state[component]) {
	                mismatch = true;
	                return {}; // break
	              }
	            }, this);
	
	            // If nothing diverges, we keep our previous values
	            // for statefulness, otherwise we recalculate fresh
	            if (mismatch) {
	              common.extend(this.__color.__state, i);
	            }
	
	          }
	
	          common.extend(this.__temp.__state, this.__color.__state);
	
	          this.__temp.a = 1;
	
	          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
	          var _flip = 255 - flip;
	
	          common.extend(this.__field_knob.style, {
	            marginLeft: 100 * this.__color.s - 7 + 'px',
	            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	            backgroundColor: this.__temp.toString(),
	            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
	          });
	
	          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'
	
	          this.__temp.s = 1;
	          this.__temp.v = 1;
	
	          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());
	
	          common.extend(this.__input.style, {
	            backgroundColor: this.__input.value = this.__color.toString(),
	            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
	            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
	          });
	
	        }
	
	      }
	
	  );
	  
	  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
	  
	  function linearGradient(elem, x, a, b) {
	    elem.style.background = '';
	    common.each(vendors, function(vendor) {
	      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
	    });
	  }
	  
	  function hueGradient(elem) {
	    elem.style.background = '';
	    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
	    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	  }
	
	
	  return ColorController;
	
	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.color.Color = (function (interpret, math, toString, common) {
	
	  var Color = function() {
	
	    this.__state = interpret.apply(this, arguments);
	
	    if (this.__state === false) {
	      throw 'Failed to interpret color arguments';
	    }
	
	    this.__state.a = this.__state.a || 1;
	
	
	  };
	
	  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];
	
	  common.extend(Color.prototype, {
	
	    toString: function() {
	      return toString(this);
	    },
	
	    toOriginal: function() {
	      return this.__state.conversion.write(this);
	    }
	
	  });
	
	  defineRGBComponent(Color.prototype, 'r', 2);
	  defineRGBComponent(Color.prototype, 'g', 1);
	  defineRGBComponent(Color.prototype, 'b', 0);
	
	  defineHSVComponent(Color.prototype, 'h');
	  defineHSVComponent(Color.prototype, 's');
	  defineHSVComponent(Color.prototype, 'v');
	
	  Object.defineProperty(Color.prototype, 'a', {
	
	    get: function() {
	      return this.__state.a;
	    },
	
	    set: function(v) {
	      this.__state.a = v;
	    }
	
	  });
	
	  Object.defineProperty(Color.prototype, 'hex', {
	
	    get: function() {
	
	      if (!this.__state.space !== 'HEX') {
	        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
	      }
	
	      return this.__state.hex;
	
	    },
	
	    set: function(v) {
	
	      this.__state.space = 'HEX';
	      this.__state.hex = v;
	
	    }
	
	  });
	
	  function defineRGBComponent(target, component, componentHexIndex) {
	
	    Object.defineProperty(target, component, {
	
	      get: function() {
	
	        if (this.__state.space === 'RGB') {
	          return this.__state[component];
	        }
	
	        recalculateRGB(this, component, componentHexIndex);
	
	        return this.__state[component];
	
	      },
	
	      set: function(v) {
	
	        if (this.__state.space !== 'RGB') {
	          recalculateRGB(this, component, componentHexIndex);
	          this.__state.space = 'RGB';
	        }
	
	        this.__state[component] = v;
	
	      }
	
	    });
	
	  }
	
	  function defineHSVComponent(target, component) {
	
	    Object.defineProperty(target, component, {
	
	      get: function() {
	
	        if (this.__state.space === 'HSV')
	          return this.__state[component];
	
	        recalculateHSV(this);
	
	        return this.__state[component];
	
	      },
	
	      set: function(v) {
	
	        if (this.__state.space !== 'HSV') {
	          recalculateHSV(this);
	          this.__state.space = 'HSV';
	        }
	
	        this.__state[component] = v;
	
	      }
	
	    });
	
	  }
	
	  function recalculateRGB(color, component, componentHexIndex) {
	
	    if (color.__state.space === 'HEX') {
	
	      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
	
	    } else if (color.__state.space === 'HSV') {
	
	      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	
	    } else {
	
	      throw 'Corrupted color state';
	
	    }
	
	  }
	
	  function recalculateHSV(color) {
	
	    var result = math.rgb_to_hsv(color.r, color.g, color.b);
	
	    common.extend(color.__state,
	        {
	          s: result.s,
	          v: result.v
	        }
	    );
	
	    if (!common.isNaN(result.h)) {
	      color.__state.h = result.h;
	    } else if (common.isUndefined(color.__state.h)) {
	      color.__state.h = 0;
	    }
	
	  }
	
	  return Color;
	
	})(dat.color.interpret,
	dat.color.math = (function () {
	
	  var tmpComponent;
	
	  return {
	
	    hsv_to_rgb: function(h, s, v) {
	
	      var hi = Math.floor(h / 60) % 6;
	
	      var f = h / 60 - Math.floor(h / 60);
	      var p = v * (1.0 - s);
	      var q = v * (1.0 - (f * s));
	      var t = v * (1.0 - ((1.0 - f) * s));
	      var c = [
	        [v, t, p],
	        [q, v, p],
	        [p, v, t],
	        [p, q, v],
	        [t, p, v],
	        [v, p, q]
	      ][hi];
	
	      return {
	        r: c[0] * 255,
	        g: c[1] * 255,
	        b: c[2] * 255
	      };
	
	    },
	
	    rgb_to_hsv: function(r, g, b) {
	
	      var min = Math.min(r, g, b),
	          max = Math.max(r, g, b),
	          delta = max - min,
	          h, s;
	
	      if (max != 0) {
	        s = delta / max;
	      } else {
	        return {
	          h: NaN,
	          s: 0,
	          v: 0
	        };
	      }
	
	      if (r == max) {
	        h = (g - b) / delta;
	      } else if (g == max) {
	        h = 2 + (b - r) / delta;
	      } else {
	        h = 4 + (r - g) / delta;
	      }
	      h /= 6;
	      if (h < 0) {
	        h += 1;
	      }
	
	      return {
	        h: h * 360,
	        s: s,
	        v: max / 255
	      };
	    },
	
	    rgb_to_hex: function(r, g, b) {
	      var hex = this.hex_with_component(0, 2, r);
	      hex = this.hex_with_component(hex, 1, g);
	      hex = this.hex_with_component(hex, 0, b);
	      return hex;
	    },
	
	    component_from_hex: function(hex, componentIndex) {
	      return (hex >> (componentIndex * 8)) & 0xFF;
	    },
	
	    hex_with_component: function(hex, componentIndex, value) {
	      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
	    }
	
	  }
	
	})(),
	dat.color.toString,
	dat.utils.common),
	dat.color.interpret,
	dat.utils.common),
	dat.utils.requestAnimationFrame = (function () {
	
	  /**
	   * requirejs version of Paul Irish's RequestAnimationFrame
	   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	   */
	
	  return window.webkitRequestAnimationFrame ||
	      window.mozRequestAnimationFrame ||
	      window.oRequestAnimationFrame ||
	      window.msRequestAnimationFrame ||
	      function(callback, element) {
	
	        window.setTimeout(callback, 1000 / 60);
	
	      };
	})(),
	dat.dom.CenteredDiv = (function (dom, common) {
	
	
	  var CenteredDiv = function() {
	
	    this.backgroundElement = document.createElement('div');
	    common.extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear'
	    });
	
	    dom.makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';
	
	    this.domElement = document.createElement('div');
	    common.extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
	    });
	
	
	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);
	
	    var _this = this;
	    dom.bind(this.backgroundElement, 'click', function() {
	      _this.hide();
	    });
	
	
	  };
	
	  CenteredDiv.prototype.show = function() {
	
	    var _this = this;
	    
	
	
	    this.backgroundElement.style.display = 'block';
	
	    this.domElement.style.display = 'block';
	    this.domElement.style.opacity = 0;
	//    this.domElement.style.top = '52%';
	    this.domElement.style.webkitTransform = 'scale(1.1)';
	
	    this.layout();
	
	    common.defer(function() {
	      _this.backgroundElement.style.opacity = 1;
	      _this.domElement.style.opacity = 1;
	      _this.domElement.style.webkitTransform = 'scale(1)';
	    });
	
	  };
	
	  CenteredDiv.prototype.hide = function() {
	
	    var _this = this;
	
	    var hide = function() {
	
	      _this.domElement.style.display = 'none';
	      _this.backgroundElement.style.display = 'none';
	
	      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
	      dom.unbind(_this.domElement, 'transitionend', hide);
	      dom.unbind(_this.domElement, 'oTransitionEnd', hide);
	
	    };
	
	    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
	    dom.bind(this.domElement, 'transitionend', hide);
	    dom.bind(this.domElement, 'oTransitionEnd', hide);
	
	    this.backgroundElement.style.opacity = 0;
	//    this.domElement.style.top = '48%';
	    this.domElement.style.opacity = 0;
	    this.domElement.style.webkitTransform = 'scale(1.1)';
	
	  };
	
	  CenteredDiv.prototype.layout = function() {
	    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
	    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
	  };
	  
	  function lockScroll(e) {
	    console.log(e);
	  }
	
	  return CenteredDiv;
	
	})(dat.dom.dom,
	dat.utils.common),
	dat.dom.dom,
	dat.utils.common);

/***/ },
/* 4 */
/*!***************************************!*\
  !*** ./~/dat-gui/vendor/dat.color.js ***!
  \***************************************/
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	/** @namespace */
	var dat = module.exports = dat || {};
	
	/** @namespace */
	dat.color = dat.color || {};
	
	/** @namespace */
	dat.utils = dat.utils || {};
	
	dat.utils.common = (function () {
	  
	  var ARR_EACH = Array.prototype.forEach;
	  var ARR_SLICE = Array.prototype.slice;
	
	  /**
	   * Band-aid methods for things that should be a lot easier in JavaScript.
	   * Implementation and structure inspired by underscore.js
	   * http://documentcloud.github.com/underscore/
	   */
	
	  return { 
	    
	    BREAK: {},
	  
	    extend: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (!this.isUndefined(obj[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	      
	    },
	    
	    defaults: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (this.isUndefined(target[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	    
	    },
	    
	    compose: function() {
	      var toCall = ARR_SLICE.call(arguments);
	            return function() {
	              var args = ARR_SLICE.call(arguments);
	              for (var i = toCall.length -1; i >= 0; i--) {
	                args = [toCall[i].apply(this, args)];
	              }
	              return args[0];
	            }
	    },
	    
	    each: function(obj, itr, scope) {
	
	      
	      if (ARR_EACH && obj.forEach === ARR_EACH) { 
	        
	        obj.forEach(itr, scope);
	        
	      } else if (obj.length === obj.length + 0) { // Is number but not NaN
	        
	        for (var key = 0, l = obj.length; key < l; key++)
	          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
	            return;
	            
	      } else {
	
	        for (var key in obj) 
	          if (itr.call(scope, obj[key], key) === this.BREAK)
	            return;
	            
	      }
	            
	    },
	    
	    defer: function(fnc) {
	      setTimeout(fnc, 0);
	    },
	    
	    toArray: function(obj) {
	      if (obj.toArray) return obj.toArray();
	      return ARR_SLICE.call(obj);
	    },
	
	    isUndefined: function(obj) {
	      return obj === undefined;
	    },
	    
	    isNull: function(obj) {
	      return obj === null;
	    },
	    
	    isNaN: function(obj) {
	      return obj !== obj;
	    },
	    
	    isArray: Array.isArray || function(obj) {
	      return obj.constructor === Array;
	    },
	    
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },
	    
	    isNumber: function(obj) {
	      return obj === obj+0;
	    },
	    
	    isString: function(obj) {
	      return obj === obj+'';
	    },
	    
	    isBoolean: function(obj) {
	      return obj === false || obj === true;
	    },
	    
	    isFunction: function(obj) {
	      return Object.prototype.toString.call(obj) === '[object Function]';
	    }
	  
	  };
	    
	})();
	
	
	dat.color.toString = (function (common) {
	
	  return function(color) {
	
	    if (color.a == 1 || common.isUndefined(color.a)) {
	
	      var s = color.hex.toString(16);
	      while (s.length < 6) {
	        s = '0' + s;
	      }
	
	      return '#' + s;
	
	    } else {
	
	      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
	
	    }
	
	  }
	
	})(dat.utils.common);
	
	
	dat.Color = dat.color.Color = (function (interpret, math, toString, common) {
	
	  var Color = function() {
	
	    this.__state = interpret.apply(this, arguments);
	
	    if (this.__state === false) {
	      throw 'Failed to interpret color arguments';
	    }
	
	    this.__state.a = this.__state.a || 1;
	
	
	  };
	
	  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];
	
	  common.extend(Color.prototype, {
	
	    toString: function() {
	      return toString(this);
	    },
	
	    toOriginal: function() {
	      return this.__state.conversion.write(this);
	    }
	
	  });
	
	  defineRGBComponent(Color.prototype, 'r', 2);
	  defineRGBComponent(Color.prototype, 'g', 1);
	  defineRGBComponent(Color.prototype, 'b', 0);
	
	  defineHSVComponent(Color.prototype, 'h');
	  defineHSVComponent(Color.prototype, 's');
	  defineHSVComponent(Color.prototype, 'v');
	
	  Object.defineProperty(Color.prototype, 'a', {
	
	    get: function() {
	      return this.__state.a;
	    },
	
	    set: function(v) {
	      this.__state.a = v;
	    }
	
	  });
	
	  Object.defineProperty(Color.prototype, 'hex', {
	
	    get: function() {
	
	      if (!this.__state.space !== 'HEX') {
	        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
	      }
	
	      return this.__state.hex;
	
	    },
	
	    set: function(v) {
	
	      this.__state.space = 'HEX';
	      this.__state.hex = v;
	
	    }
	
	  });
	
	  function defineRGBComponent(target, component, componentHexIndex) {
	
	    Object.defineProperty(target, component, {
	
	      get: function() {
	
	        if (this.__state.space === 'RGB') {
	          return this.__state[component];
	        }
	
	        recalculateRGB(this, component, componentHexIndex);
	
	        return this.__state[component];
	
	      },
	
	      set: function(v) {
	
	        if (this.__state.space !== 'RGB') {
	          recalculateRGB(this, component, componentHexIndex);
	          this.__state.space = 'RGB';
	        }
	
	        this.__state[component] = v;
	
	      }
	
	    });
	
	  }
	
	  function defineHSVComponent(target, component) {
	
	    Object.defineProperty(target, component, {
	
	      get: function() {
	
	        if (this.__state.space === 'HSV')
	          return this.__state[component];
	
	        recalculateHSV(this);
	
	        return this.__state[component];
	
	      },
	
	      set: function(v) {
	
	        if (this.__state.space !== 'HSV') {
	          recalculateHSV(this);
	          this.__state.space = 'HSV';
	        }
	
	        this.__state[component] = v;
	
	      }
	
	    });
	
	  }
	
	  function recalculateRGB(color, component, componentHexIndex) {
	
	    if (color.__state.space === 'HEX') {
	
	      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
	
	    } else if (color.__state.space === 'HSV') {
	
	      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	
	    } else {
	
	      throw 'Corrupted color state';
	
	    }
	
	  }
	
	  function recalculateHSV(color) {
	
	    var result = math.rgb_to_hsv(color.r, color.g, color.b);
	
	    common.extend(color.__state,
	        {
	          s: result.s,
	          v: result.v
	        }
	    );
	
	    if (!common.isNaN(result.h)) {
	      color.__state.h = result.h;
	    } else if (common.isUndefined(color.__state.h)) {
	      color.__state.h = 0;
	    }
	
	  }
	
	  return Color;
	
	})(dat.color.interpret = (function (toString, common) {
	
	  var result, toReturn;
	
	  var interpret = function() {
	
	    toReturn = false;
	
	    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];
	
	    common.each(INTERPRETATIONS, function(family) {
	
	      if (family.litmus(original)) {
	
	        common.each(family.conversions, function(conversion, conversionName) {
	
	          result = conversion.read(original);
	
	          if (toReturn === false && result !== false) {
	            toReturn = result;
	            result.conversionName = conversionName;
	            result.conversion = conversion;
	            return common.BREAK;
	
	          }
	
	        });
	
	        return common.BREAK;
	
	      }
	
	    });
	
	    return toReturn;
	
	  };
	
	  var INTERPRETATIONS = [
	
	    // Strings
	    {
	
	      litmus: common.isString,
	
	      conversions: {
	
	        THREE_CHAR_HEX: {
	
	          read: function(original) {
	
	            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	            if (test === null) return false;
	
	            return {
	              space: 'HEX',
	              hex: parseInt(
	                  '0x' +
	                      test[1].toString() + test[1].toString() +
	                      test[2].toString() + test[2].toString() +
	                      test[3].toString() + test[3].toString())
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        SIX_CHAR_HEX: {
	
	          read: function(original) {
	
	            var test = original.match(/^#([A-F0-9]{6})$/i);
	            if (test === null) return false;
	
	            return {
	              space: 'HEX',
	              hex: parseInt('0x' + test[1].toString())
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        CSS_RGB: {
	
	          read: function(original) {
	
	            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	            if (test === null) return false;
	
	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3])
	            };
	
	          },
	
	          write: toString
	
	        },
	
	        CSS_RGBA: {
	
	          read: function(original) {
	
	            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
	            if (test === null) return false;
	
	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3]),
	              a: parseFloat(test[4])
	            };
	
	          },
	
	          write: toString
	
	        }
	
	      }
	
	    },
	
	    // Numbers
	    {
	
	      litmus: common.isNumber,
	
	      conversions: {
	
	        HEX: {
	          read: function(original) {
	            return {
	              space: 'HEX',
	              hex: original,
	              conversionName: 'HEX'
	            }
	          },
	
	          write: function(color) {
	            return color.hex;
	          }
	        }
	
	      }
	
	    },
	
	    // Arrays
	    {
	
	      litmus: common.isArray,
	
	      conversions: {
	
	        RGB_ARRAY: {
	          read: function(original) {
	            if (original.length != 3) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2]
	            };
	          },
	
	          write: function(color) {
	            return [color.r, color.g, color.b];
	          }
	
	        },
	
	        RGBA_ARRAY: {
	          read: function(original) {
	            if (original.length != 4) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2],
	              a: original[3]
	            };
	          },
	
	          write: function(color) {
	            return [color.r, color.g, color.b, color.a];
	          }
	
	        }
	
	      }
	
	    },
	
	    // Objects
	    {
	
	      litmus: common.isObject,
	
	      conversions: {
	
	        RGBA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b,
	                a: original.a
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b,
	              a: color.a
	            }
	          }
	        },
	
	        RGB_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b
	            }
	          }
	        },
	
	        HSVA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v,
	                a: original.a
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v,
	              a: color.a
	            }
	          }
	        },
	
	        HSV_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v
	              }
	            }
	            return false;
	          },
	
	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v
	            }
	          }
	
	        }
	
	      }
	
	    }
	
	
	  ];
	
	  return interpret;
	
	
	})(dat.color.toString,
	dat.utils.common),
	dat.color.math = (function () {
	
	  var tmpComponent;
	
	  return {
	
	    hsv_to_rgb: function(h, s, v) {
	
	      var hi = Math.floor(h / 60) % 6;
	
	      var f = h / 60 - Math.floor(h / 60);
	      var p = v * (1.0 - s);
	      var q = v * (1.0 - (f * s));
	      var t = v * (1.0 - ((1.0 - f) * s));
	      var c = [
	        [v, t, p],
	        [q, v, p],
	        [p, v, t],
	        [p, q, v],
	        [t, p, v],
	        [v, p, q]
	      ][hi];
	
	      return {
	        r: c[0] * 255,
	        g: c[1] * 255,
	        b: c[2] * 255
	      };
	
	    },
	
	    rgb_to_hsv: function(r, g, b) {
	
	      var min = Math.min(r, g, b),
	          max = Math.max(r, g, b),
	          delta = max - min,
	          h, s;
	
	      if (max != 0) {
	        s = delta / max;
	      } else {
	        return {
	          h: NaN,
	          s: 0,
	          v: 0
	        };
	      }
	
	      if (r == max) {
	        h = (g - b) / delta;
	      } else if (g == max) {
	        h = 2 + (b - r) / delta;
	      } else {
	        h = 4 + (r - g) / delta;
	      }
	      h /= 6;
	      if (h < 0) {
	        h += 1;
	      }
	
	      return {
	        h: h * 360,
	        s: s,
	        v: max / 255
	      };
	    },
	
	    rgb_to_hex: function(r, g, b) {
	      var hex = this.hex_with_component(0, 2, r);
	      hex = this.hex_with_component(hex, 1, g);
	      hex = this.hex_with_component(hex, 0, b);
	      return hex;
	    },
	
	    component_from_hex: function(hex, componentIndex) {
	      return (hex >> (componentIndex * 8)) & 0xFF;
	    },
	
	    hex_with_component: function(hex, componentIndex, value) {
	      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
	    }
	
	  }
	
	})(),
	dat.color.toString,
	dat.utils.common);

/***/ },
/* 5 */
/*!*******************************!*\
  !*** ./src/deformableface.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	/* global THREE createjs */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _glMatrix = __webpack_require__(/*! gl-matrix */ 6);
	
	var _default = (function (_THREE$Object3D) {
	  _inherits(_default, _THREE$Object3D);
	
	  function _default() {
	    _classCallCheck(this, _default);
	
	    _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this);
	  }
	
	  _createClass(_default, [{
	    key: 'load',
	    value: function load(basename) {
	      var _this = this;
	
	      return new Promise(function (resolve) {
	        var loader = new createjs.LoadQueue();
	        loader.loadFile({ id: 'json', src: basename + '.json' });
	        loader.loadFile({ id: 'image', src: basename + '.png' });
	        loader.on('complete', function () {
	          _this.buildMesh(loader.getResult('image'), loader.getResult('json'));
	          resolve();
	        });
	      });
	    }
	  }, {
	    key: 'buildMesh',
	    value: function buildMesh(image, featurePoints) {
	      this.morph = __webpack_require__(/*! ./morph.json */ 26);
	      console.log(this.morph);
	
	      this.data = __webpack_require__(/*! ./face.json */ 16);
	      console.log(this.data);
	
	      var index = this.data.face.index.concat(this.data.rightEye.index, this.data.leftEye.index);
	
	      var geometry = new THREE.BufferGeometry();
	      geometry.dynamic = true;
	      geometry.setIndex(new THREE.Uint16Attribute(index, 1));
	      // geometry.addAttribute('position', this.getInitialDeformedVertices(featurePoints))
	      // geometry.addAttribute('position', new THREE.Float32Attribute(this.morph[0].face.vertices, 3))
	      geometry.addAttribute('position', new THREE.Float32Attribute(this.data.face.position, 3));
	      geometry.addAttribute('uv', this.getDeformedUV(featurePoints));
	
	      this.morph.forEach(function (target, i) {
	        geometry.addAttribute('morphTarget' + i, new THREE.Float32Attribute(target.face.vertices, 3));
	      });
	
	      var morphTargetInfluences = [];
	      for (var i = 0; i < this.morph.length; i++) {
	        morphTargetInfluences.push(0.001);
	      }
	      // morphTargetInfluences[3] = 1
	      // console.log(morphTargetInfluences)
	
	      var map = new THREE.Texture(image);
	      map.needsUpdate = true;
	      var material = new THREE.ShaderMaterial({
	        uniforms: {
	          map: { type: 't', value: map },
	          morphTargetInfluences: { type: 'fv1', value: morphTargetInfluences }
	        },
	        vertexShader: __webpack_require__(/*! raw!./face.vert */ 17),
	        fragmentShader: __webpack_require__(/*! raw!./face.frag */ 18),
	        side: THREE.DoubleSide
	      });
	      // let material = new THREE.MeshBasicMaterial({map, side: THREE.DoubleSide, morphTargets: true})
	
	      this.mesh = new THREE.Mesh(geometry, material);
	      this.add(this.mesh);
	    }
	  }, {
	    key: 'getInitialDeformedVertices',
	    value: function getInitialDeformedVertices(featurePoints) {
	      var _this2 = this;
	
	      var displacement = featurePoints.map(function (c, i) {
	        var fp = _this2.getPosition(_this2.data.face.featurePoint[i]);
	        var scale = (500 - fp[2] * 200) / 500;
	        var p = _glMatrix.vec3.clone(fp);
	        p[0] = (c[0] - 0.5) * scale;
	        p[1] = (c[1] - 0.5) * scale;
	        return _glMatrix.vec3.sub(p, p, fp);
	      });
	
	      var n = this.data.face.position.length / 3;
	      var position = new Float32Array(n * 3);
	
	      var _loop = function (i) {
	        var p = _glMatrix.vec3.create();
	        var b = 0;
	        _this2.data.face.weight[i].forEach(function (w) {
	          _glMatrix.vec3.add(p, p, _glMatrix.vec3.scale(_glMatrix.vec3.create(), displacement[w[0]], w[1]));
	          b += w[1];
	        });
	        _glMatrix.vec3.scale(p, p, 1 / b);
	        _glMatrix.vec3.add(p, p, _this2.getPosition(i));
	        position[i * 3 + 0] = p[0];
	        position[i * 3 + 1] = p[1];
	        position[i * 3 + 2] = p[2];
	      };
	
	      for (var i = 0; i < n; i++) {
	        _loop(i);
	      }
	      return new THREE.BufferAttribute(position, 3);
	    }
	  }, {
	    key: 'getDeformedUV',
	    value: function getDeformedUV(featurePoint) {
	      var _this3 = this;
	
	      var displacement = featurePoint.map(function (c, i) {
	        var fp = _this3.getPosition(_this3.data.face.featurePoint[i]);
	        return _glMatrix.vec2.sub([], c, fp);
	      });
	
	      var n = this.data.face.position.length / 3;
	      var uv = new Float32Array(n * 2);
	
	      var _loop2 = function (i) {
	        var p = _glMatrix.vec2.create();
	        var b = 0;
	        _this3.data.face.weight[i].forEach(function (w) {
	          _glMatrix.vec2.add(p, p, _glMatrix.vec2.scale([], displacement[w[0]], w[1]));
	          b += w[1];
	        });
	        _glMatrix.vec2.scale(p, p, 1 / b);
	        _glMatrix.vec2.add(p, p, _this3.getPosition(i));
	        uv[i * 2 + 0] = p[0];
	        uv[i * 2 + 1] = p[1];
	      };
	
	      for (var i = 0; i < n; i++) {
	        _loop2(i);
	      }
	      return new THREE.BufferAttribute(uv, 2);
	    }
	  }, {
	    key: 'getPosition',
	    value: function getPosition(index) {
	      var array = arguments.length <= 1 || arguments[1] === undefined ? this.data.face.position : arguments[1];
	
	      var i = index * 3;
	      return [array[i], array[i + 1], array[i + 2]];
	    }
	  }]);
	
	  return _default;
	})(THREE.Object3D);
	
	exports['default'] = _default;
	module.exports = exports['default'];

/***/ },
/* 6 */
/*!**************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.3.0
	 */
	
	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	// END HEADER
	
	exports.glMatrix = __webpack_require__(/*! ./gl-matrix/common.js */ 7);
	exports.mat2 = __webpack_require__(/*! ./gl-matrix/mat2.js */ 8);
	exports.mat2d = __webpack_require__(/*! ./gl-matrix/mat2d.js */ 9);
	exports.mat3 = __webpack_require__(/*! ./gl-matrix/mat3.js */ 10);
	exports.mat4 = __webpack_require__(/*! ./gl-matrix/mat4.js */ 11);
	exports.quat = __webpack_require__(/*! ./gl-matrix/quat.js */ 12);
	exports.vec2 = __webpack_require__(/*! ./gl-matrix/vec2.js */ 15);
	exports.vec3 = __webpack_require__(/*! ./gl-matrix/vec3.js */ 13);
	exports.vec4 = __webpack_require__(/*! ./gl-matrix/vec4.js */ 14);

/***/ },
/* 7 */
/*!*********************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/common.js ***!
  \*********************************************/
/***/ function(module, exports) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	/**
	 * @class Common utilities
	 * @name glMatrix
	 */
	var glMatrix = {};
	
	// Constants
	glMatrix.EPSILON = 0.000001;
	glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
	glMatrix.RANDOM = Math.random;
	
	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	glMatrix.setMatrixArrayType = function(type) {
	    GLMAT_ARRAY_TYPE = type;
	}
	
	var degree = Math.PI / 180;
	
	/**
	* Convert Degree To Radian
	*
	* @param {Number} Angle in Degrees
	*/
	glMatrix.toRadian = function(a){
	     return a * degree;
	}
	
	module.exports = glMatrix;


/***/ },
/* 8 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/mat2.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 2x2 Matrix
	 * @name mat2
	 */
	var mat2 = {};
	
	/**
	 * Creates a new identity mat2
	 *
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};
	
	/**
	 * Creates a new mat2 initialized with values from an existing matrix
	 *
	 * @param {mat2} a matrix to clone
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Copy the values from one mat2 to another
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Set a mat2 to the identity matrix
	 *
	 * @param {mat2} out the receiving matrix
	 * @returns {mat2} out
	 */
	mat2.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};
	
	/**
	 * Transpose the values of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a1 = a[1];
	        out[1] = a[2];
	        out[2] = a1;
	    } else {
	        out[0] = a[0];
	        out[1] = a[2];
	        out[2] = a[1];
	        out[3] = a[3];
	    }
	    
	    return out;
	};
	
	/**
	 * Inverts a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.invert = function(out, a) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	
	        // Calculate the determinant
	        det = a0 * a3 - a2 * a1;
	
	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;
	    
	    out[0] =  a3 * det;
	    out[1] = -a1 * det;
	    out[2] = -a2 * det;
	    out[3] =  a0 * det;
	
	    return out;
	};
	
	/**
	 * Calculates the adjugate of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.adjoint = function(out, a) {
	    // Caching this value is nessecary if out == a
	    var a0 = a[0];
	    out[0] =  a[3];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] =  a0;
	
	    return out;
	};
	
	/**
	 * Calculates the determinant of a mat2
	 *
	 * @param {mat2} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2.determinant = function (a) {
	    return a[0] * a[3] - a[2] * a[1];
	};
	
	/**
	 * Multiplies two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	mat2.multiply = function (out, a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    return out;
	};
	
	/**
	 * Alias for {@link mat2.multiply}
	 * @function
	 */
	mat2.mul = mat2.multiply;
	
	/**
	 * Rotates a mat2 by the given angle
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.rotate = function (out, a, rad) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 *  c + a2 * s;
	    out[1] = a1 *  c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    return out;
	};
	
	/**
	 * Scales the mat2 by the dimensions in the given vec2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2} out
	 **/
	mat2.scale = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    return out;
	};
	
	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.rotate(dest, dest, rad);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.fromRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    return out;
	}
	
	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.scale(dest, dest, vec);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2} out
	 */
	mat2.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    return out;
	}
	
	/**
	 * Returns a string representation of a mat2
	 *
	 * @param {mat2} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2.str = function (a) {
	    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};
	
	/**
	 * Returns Frobenius norm of a mat2
	 *
	 * @param {mat2} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
	};
	
	/**
	 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
	 * @param {mat2} L the lower triangular matrix 
	 * @param {mat2} D the diagonal matrix 
	 * @param {mat2} U the upper triangular matrix 
	 * @param {mat2} a the input matrix to factorize
	 */
	
	mat2.LDU = function (L, D, U, a) { 
	    L[2] = a[2]/a[0]; 
	    U[0] = a[0]; 
	    U[1] = a[1]; 
	    U[3] = a[3] - L[2] * U[1]; 
	    return [L, D, U];       
	}; 
	
	
	module.exports = mat2;


/***/ },
/* 9 */
/*!********************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/mat2d.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 2x3 Matrix
	 * @name mat2d
	 * 
	 * @description 
	 * A mat2d contains six elements defined as:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty]
	 * </pre>
	 * This is a short form for the 3x3 matrix:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty,
	 *  0, 0, 1]
	 * </pre>
	 * The last row is ignored so the array is shorter and operations are faster.
	 */
	var mat2d = {};
	
	/**
	 * Creates a new identity mat2d
	 *
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};
	
	/**
	 * Creates a new mat2d initialized with values from an existing matrix
	 *
	 * @param {mat2d} a matrix to clone
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};
	
	/**
	 * Copy the values from one mat2d to another
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};
	
	/**
	 * Set a mat2d to the identity matrix
	 *
	 * @param {mat2d} out the receiving matrix
	 * @returns {mat2d} out
	 */
	mat2d.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};
	
	/**
	 * Inverts a mat2d
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.invert = function(out, a) {
	    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
	        atx = a[4], aty = a[5];
	
	    var det = aa * ad - ab * ac;
	    if(!det){
	        return null;
	    }
	    det = 1.0 / det;
	
	    out[0] = ad * det;
	    out[1] = -ab * det;
	    out[2] = -ac * det;
	    out[3] = aa * det;
	    out[4] = (ac * aty - ad * atx) * det;
	    out[5] = (ab * atx - aa * aty) * det;
	    return out;
	};
	
	/**
	 * Calculates the determinant of a mat2d
	 *
	 * @param {mat2d} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2d.determinant = function (a) {
	    return a[0] * a[3] - a[1] * a[2];
	};
	
	/**
	 * Multiplies two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	mat2d.multiply = function (out, a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    out[4] = a0 * b4 + a2 * b5 + a4;
	    out[5] = a1 * b4 + a3 * b5 + a5;
	    return out;
	};
	
	/**
	 * Alias for {@link mat2d.multiply}
	 * @function
	 */
	mat2d.mul = mat2d.multiply;
	
	/**
	 * Rotates a mat2d by the given angle
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.rotate = function (out, a, rad) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 *  c + a2 * s;
	    out[1] = a1 *  c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};
	
	/**
	 * Scales the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.scale = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};
	
	/**
	 * Translates the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to translate the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.translate = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0;
	    out[1] = a1;
	    out[2] = a2;
	    out[3] = a3;
	    out[4] = a0 * v0 + a2 * v1 + a4;
	    out[5] = a1 * v0 + a3 * v1 + a5;
	    return out;
	};
	
	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.rotate(dest, dest, rad);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.fromRotation = function(out, rad) {
	    var s = Math.sin(rad), c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	}
	
	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.scale(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2d} out
	 */
	mat2d.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	}
	
	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.translate(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat2d} out
	 */
	mat2d.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = v[0];
	    out[5] = v[1];
	    return out;
	}
	
	/**
	 * Returns a string representation of a mat2d
	 *
	 * @param {mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2d.str = function (a) {
	    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
	                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
	};
	
	/**
	 * Returns Frobenius norm of a mat2d
	 *
	 * @param {mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2d.frob = function (a) { 
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
	}; 
	
	module.exports = mat2d;


/***/ },
/* 10 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/mat3.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 3x3 Matrix
	 * @name mat3
	 */
	var mat3 = {};
	
	/**
	 * Creates a new identity mat3
	 *
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};
	
	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */
	mat3.fromMat4 = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[4];
	    out[4] = a[5];
	    out[5] = a[6];
	    out[6] = a[8];
	    out[7] = a[9];
	    out[8] = a[10];
	    return out;
	};
	
	/**
	 * Creates a new mat3 initialized with values from an existing matrix
	 *
	 * @param {mat3} a matrix to clone
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};
	
	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};
	
	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */
	mat3.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};
	
	/**
	 * Transpose the values of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a12 = a[5];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a01;
	        out[5] = a[7];
	        out[6] = a02;
	        out[7] = a12;
	    } else {
	        out[0] = a[0];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a[1];
	        out[4] = a[4];
	        out[5] = a[7];
	        out[6] = a[2];
	        out[7] = a[5];
	        out[8] = a[8];
	    }
	    
	    return out;
	};
	
	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.invert = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],
	
	        b01 = a22 * a11 - a12 * a21,
	        b11 = -a22 * a10 + a12 * a20,
	        b21 = a21 * a10 - a11 * a20,
	
	        // Calculate the determinant
	        det = a00 * b01 + a01 * b11 + a02 * b21;
	
	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;
	
	    out[0] = b01 * det;
	    out[1] = (-a22 * a01 + a02 * a21) * det;
	    out[2] = (a12 * a01 - a02 * a11) * det;
	    out[3] = b11 * det;
	    out[4] = (a22 * a00 - a02 * a20) * det;
	    out[5] = (-a12 * a00 + a02 * a10) * det;
	    out[6] = b21 * det;
	    out[7] = (-a21 * a00 + a01 * a20) * det;
	    out[8] = (a11 * a00 - a01 * a10) * det;
	    return out;
	};
	
	/**
	 * Calculates the adjugate of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.adjoint = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8];
	
	    out[0] = (a11 * a22 - a12 * a21);
	    out[1] = (a02 * a21 - a01 * a22);
	    out[2] = (a01 * a12 - a02 * a11);
	    out[3] = (a12 * a20 - a10 * a22);
	    out[4] = (a00 * a22 - a02 * a20);
	    out[5] = (a02 * a10 - a00 * a12);
	    out[6] = (a10 * a21 - a11 * a20);
	    out[7] = (a01 * a20 - a00 * a21);
	    out[8] = (a00 * a11 - a01 * a10);
	    return out;
	};
	
	/**
	 * Calculates the determinant of a mat3
	 *
	 * @param {mat3} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat3.determinant = function (a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8];
	
	    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	};
	
	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	mat3.multiply = function (out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],
	
	        b00 = b[0], b01 = b[1], b02 = b[2],
	        b10 = b[3], b11 = b[4], b12 = b[5],
	        b20 = b[6], b21 = b[7], b22 = b[8];
	
	    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
	
	    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
	
	    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	    return out;
	};
	
	/**
	 * Alias for {@link mat3.multiply}
	 * @function
	 */
	mat3.mul = mat3.multiply;
	
	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */
	mat3.translate = function(out, a, v) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],
	        x = v[0], y = v[1];
	
	    out[0] = a00;
	    out[1] = a01;
	    out[2] = a02;
	
	    out[3] = a10;
	    out[4] = a11;
	    out[5] = a12;
	
	    out[6] = x * a00 + y * a10 + a20;
	    out[7] = x * a01 + y * a11 + a21;
	    out[8] = x * a02 + y * a12 + a22;
	    return out;
	};
	
	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.rotate = function (out, a, rad) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],
	
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	
	    out[0] = c * a00 + s * a10;
	    out[1] = c * a01 + s * a11;
	    out[2] = c * a02 + s * a12;
	
	    out[3] = c * a10 - s * a00;
	    out[4] = c * a11 - s * a01;
	    out[5] = c * a12 - s * a02;
	
	    out[6] = a20;
	    out[7] = a21;
	    out[8] = a22;
	    return out;
	};
	
	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/
	mat3.scale = function(out, a, v) {
	    var x = v[0], y = v[1];
	
	    out[0] = x * a[0];
	    out[1] = x * a[1];
	    out[2] = x * a[2];
	
	    out[3] = y * a[3];
	    out[4] = y * a[4];
	    out[5] = y * a[5];
	
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};
	
	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.translate(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat3} out
	 */
	mat3.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = v[0];
	    out[7] = v[1];
	    out[8] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.rotate(dest, dest, rad);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.fromRotation = function(out, rad) {
	    var s = Math.sin(rad), c = Math.cos(rad);
	
	    out[0] = c;
	    out[1] = s;
	    out[2] = 0;
	
	    out[3] = -s;
	    out[4] = c;
	    out[5] = 0;
	
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.scale(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat3} out
	 */
	mat3.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	
	    out[3] = 0;
	    out[4] = v[1];
	    out[5] = 0;
	
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	}
	
	/**
	 * Copies the values from a mat2d into a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat2d} a the matrix to copy
	 * @returns {mat3} out
	 **/
	mat3.fromMat2d = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = 0;
	
	    out[3] = a[2];
	    out[4] = a[3];
	    out[5] = 0;
	
	    out[6] = a[4];
	    out[7] = a[5];
	    out[8] = 1;
	    return out;
	};
	
	/**
	* Calculates a 3x3 matrix from the given quaternion
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat3} out
	*/
	mat3.fromQuat = function (out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	
	    out[0] = 1 - yy - zz;
	    out[3] = yx - wz;
	    out[6] = zx + wy;
	
	    out[1] = yx + wz;
	    out[4] = 1 - xx - zz;
	    out[7] = zy - wx;
	
	    out[2] = zx - wy;
	    out[5] = zy + wx;
	    out[8] = 1 - xx - yy;
	
	    return out;
	};
	
	/**
	* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {mat4} a Mat4 to derive the normal matrix from
	*
	* @returns {mat3} out
	*/
	mat3.normalFromMat4 = function (out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
	
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,
	
	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	
	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;
	
	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	
	    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	
	    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	
	    return out;
	};
	
	/**
	 * Returns a string representation of a mat3
	 *
	 * @param {mat3} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat3.str = function (a) {
	    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
	                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
	                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
	};
	
	/**
	 * Returns Frobenius norm of a mat3
	 *
	 * @param {mat3} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat3.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
	};
	
	
	module.exports = mat3;


/***/ },
/* 11 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/mat4.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 4x4 Matrix
	 * @name mat4
	 */
	var mat4 = {};
	
	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};
	
	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};
	
	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};
	
	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	mat4.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};
	
	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];
	
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }
	    
	    return out;
	};
	
	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.invert = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
	
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,
	
	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	
	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;
	
	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
	
	    return out;
	};
	
	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.adjoint = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
	
	    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
	    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
	    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
	    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
	    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
	    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	    return out;
	};
	
	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat4.determinant = function (a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
	
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;
	
	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};
	
	/**
	 * Multiplies two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.multiply = function (out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
	
	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	
	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;
	};
	
	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	mat4.mul = mat4.multiply;
	
	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.translate = function (out, a, v) {
	    var x = v[0], y = v[1], z = v[2],
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23;
	
	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
	
	        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
	        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
	        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;
	
	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }
	
	    return out;
	};
	
	/**
	 * Scales the mat4 by the dimensions in the given vec3
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	mat4.scale = function(out, a, v) {
	    var x = v[0], y = v[1], z = v[2];
	
	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};
	
	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.rotate = function (out, a, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t,
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23,
	        b00, b01, b02,
	        b10, b11, b12,
	        b20, b21, b22;
	
	    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
	    
	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;
	
	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;
	
	    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
	
	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
	
	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};
	
	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateX = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};
	
	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateY = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};
	
	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateZ = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];
	
	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	
	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};
	
	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.scale(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = v[1];
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = v[2];
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from a given angle around a given axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotate(dest, dest, rad, axis);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.fromRotation = function(out, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t;
	    
	    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
	    
	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;
	    
	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;
	    
	    // Perform rotation-specific matrix multiplication
	    out[0] = x * x * t + c;
	    out[1] = y * x * t + z * s;
	    out[2] = z * x * t - y * s;
	    out[3] = 0;
	    out[4] = x * y * t - z * s;
	    out[5] = y * y * t + c;
	    out[6] = z * y * t + x * s;
	    out[7] = 0;
	    out[8] = x * z * t + y * s;
	    out[9] = y * z * t - x * s;
	    out[10] = z * z * t + c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from the given angle around the X axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateX(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromXRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    
	    // Perform axis-specific matrix multiplication
	    out[0]  = 1;
	    out[1]  = 0;
	    out[2]  = 0;
	    out[3]  = 0;
	    out[4] = 0;
	    out[5] = c;
	    out[6] = s;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = -s;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from the given angle around the Y axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateY(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromYRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    
	    // Perform axis-specific matrix multiplication
	    out[0]  = c;
	    out[1]  = 0;
	    out[2]  = -s;
	    out[3]  = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = s;
	    out[9] = 0;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from the given angle around the Z axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateZ(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromZRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    
	    // Perform axis-specific matrix multiplication
	    out[0]  = c;
	    out[1]  = s;
	    out[2]  = 0;
	    out[3]  = 0;
	    out[4] = -s;
	    out[5] = c;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}
	
	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslation = function (out, q, v) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	
	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    
	    return out;
	};
	
	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScale = function (out, q, v, s) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2,
	        sx = s[0],
	        sy = s[1],
	        sz = s[2];
	
	    out[0] = (1 - (yy + zz)) * sx;
	    out[1] = (xy + wz) * sx;
	    out[2] = (xz - wy) * sx;
	    out[3] = 0;
	    out[4] = (xy - wz) * sy;
	    out[5] = (1 - (xx + zz)) * sy;
	    out[6] = (yz + wx) * sy;
	    out[7] = 0;
	    out[8] = (xz + wy) * sz;
	    out[9] = (yz - wx) * sz;
	    out[10] = (1 - (xx + yy)) * sz;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    
	    return out;
	};
	
	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     mat4.translate(dest, origin);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *     mat4.translate(dest, negativeOrigin);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @param {vec3} o The origin vector around which to scale and rotate
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
	  // Quaternion math
	  var x = q[0], y = q[1], z = q[2], w = q[3],
	      x2 = x + x,
	      y2 = y + y,
	      z2 = z + z,
	
	      xx = x * x2,
	      xy = x * y2,
	      xz = x * z2,
	      yy = y * y2,
	      yz = y * z2,
	      zz = z * z2,
	      wx = w * x2,
	      wy = w * y2,
	      wz = w * z2,
	      
	      sx = s[0],
	      sy = s[1],
	      sz = s[2],
	
	      ox = o[0],
	      oy = o[1],
	      oz = o[2];
	      
	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
	  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
	  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
	  out[15] = 1;
	        
	  return out;
	};
	
	mat4.fromQuat = function (out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	
	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	
	    out[0] = 1 - yy - zz;
	    out[1] = yx + wz;
	    out[2] = zx - wy;
	    out[3] = 0;
	
	    out[4] = yx - wz;
	    out[5] = 1 - xx - zz;
	    out[6] = zy + wx;
	    out[7] = 0;
	
	    out[8] = zx + wy;
	    out[9] = zy - wx;
	    out[10] = 1 - xx - yy;
	    out[11] = 0;
	
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	
	    return out;
	};
	
	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.frustum = function (out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = (near * 2) * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = (near * 2) * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (far * near * 2) * nf;
	    out[15] = 0;
	    return out;
	};
	
	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspective = function (out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
	};
	
	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
	    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
	        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
	        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
	        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
	        xScale = 2.0 / (leftTan + rightTan),
	        yScale = 2.0 / (upTan + downTan);
	
	    out[0] = xScale;
	    out[1] = 0.0;
	    out[2] = 0.0;
	    out[3] = 0.0;
	    out[4] = 0.0;
	    out[5] = yScale;
	    out[6] = 0.0;
	    out[7] = 0.0;
	    out[8] = -((leftTan - rightTan) * xScale * 0.5);
	    out[9] = ((upTan - downTan) * yScale * 0.5);
	    out[10] = far / (near - far);
	    out[11] = -1.0;
	    out[12] = 0.0;
	    out[13] = 0.0;
	    out[14] = (far * near) / (near - far);
	    out[15] = 0.0;
	    return out;
	}
	
	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.ortho = function (out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};
	
	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	mat4.lookAt = function (out, eye, center, up) {
	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];
	
	    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
	        Math.abs(eyey - centery) < glMatrix.EPSILON &&
	        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
	        return mat4.identity(out);
	    }
	
	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;
	
	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;
	
	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }
	
	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;
	
	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }
	
	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;
	
	    return out;
	};
	
	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat4.str = function (a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};
	
	/**
	 * Returns Frobenius norm of a mat4
	 *
	 * @param {mat4} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat4.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
	};
	
	
	module.exports = mat4;


/***/ },
/* 12 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/quat.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	var mat3 = __webpack_require__(/*! ./mat3.js */ 10);
	var vec3 = __webpack_require__(/*! ./vec3.js */ 13);
	var vec4 = __webpack_require__(/*! ./vec4.js */ 14);
	
	/**
	 * @class Quaternion
	 * @name quat
	 */
	var quat = {};
	
	/**
	 * Creates a new identity quat
	 *
	 * @returns {quat} a new quaternion
	 */
	quat.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};
	
	/**
	 * Sets a quaternion to represent the shortest rotation from one
	 * vector to another.
	 *
	 * Both vectors are assumed to be unit length.
	 *
	 * @param {quat} out the receiving quaternion.
	 * @param {vec3} a the initial vector
	 * @param {vec3} b the destination vector
	 * @returns {quat} out
	 */
	quat.rotationTo = (function() {
	    var tmpvec3 = vec3.create();
	    var xUnitVec3 = vec3.fromValues(1,0,0);
	    var yUnitVec3 = vec3.fromValues(0,1,0);
	
	    return function(out, a, b) {
	        var dot = vec3.dot(a, b);
	        if (dot < -0.999999) {
	            vec3.cross(tmpvec3, xUnitVec3, a);
	            if (vec3.length(tmpvec3) < 0.000001)
	                vec3.cross(tmpvec3, yUnitVec3, a);
	            vec3.normalize(tmpvec3, tmpvec3);
	            quat.setAxisAngle(out, tmpvec3, Math.PI);
	            return out;
	        } else if (dot > 0.999999) {
	            out[0] = 0;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            return out;
	        } else {
	            vec3.cross(tmpvec3, a, b);
	            out[0] = tmpvec3[0];
	            out[1] = tmpvec3[1];
	            out[2] = tmpvec3[2];
	            out[3] = 1 + dot;
	            return quat.normalize(out, out);
	        }
	    };
	})();
	
	/**
	 * Sets the specified quaternion with values corresponding to the given
	 * axes. Each axis is a vec3 and is expected to be unit length and
	 * perpendicular to all other specified axes.
	 *
	 * @param {vec3} view  the vector representing the viewing direction
	 * @param {vec3} right the vector representing the local "right" direction
	 * @param {vec3} up    the vector representing the local "up" direction
	 * @returns {quat} out
	 */
	quat.setAxes = (function() {
	    var matr = mat3.create();
	
	    return function(out, view, right, up) {
	        matr[0] = right[0];
	        matr[3] = right[1];
	        matr[6] = right[2];
	
	        matr[1] = up[0];
	        matr[4] = up[1];
	        matr[7] = up[2];
	
	        matr[2] = -view[0];
	        matr[5] = -view[1];
	        matr[8] = -view[2];
	
	        return quat.normalize(out, quat.fromMat3(out, matr));
	    };
	})();
	
	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat} a quaternion to clone
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.clone = vec4.clone;
	
	/**
	 * Creates a new quat initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.fromValues = vec4.fromValues;
	
	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */
	quat.copy = vec4.copy;
	
	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */
	quat.set = vec4.set;
	
	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	quat.identity = function(out) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};
	
	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/
	quat.setAxisAngle = function(out, axis, rad) {
	    rad = rad * 0.5;
	    var s = Math.sin(rad);
	    out[0] = s * axis[0];
	    out[1] = s * axis[1];
	    out[2] = s * axis[2];
	    out[3] = Math.cos(rad);
	    return out;
	};
	
	/**
	 * Adds two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 * @function
	 */
	quat.add = vec4.add;
	
	/**
	 * Multiplies two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */
	quat.multiply = function(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = b[0], by = b[1], bz = b[2], bw = b[3];
	
	    out[0] = ax * bw + aw * bx + ay * bz - az * by;
	    out[1] = ay * bw + aw * by + az * bx - ax * bz;
	    out[2] = az * bw + aw * bz + ax * by - ay * bx;
	    out[3] = aw * bw - ax * bx - ay * by - az * bz;
	    return out;
	};
	
	/**
	 * Alias for {@link quat.multiply}
	 * @function
	 */
	quat.mul = quat.multiply;
	
	/**
	 * Scales a quat by a scalar number
	 *
	 * @param {quat} out the receiving vector
	 * @param {quat} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {quat} out
	 * @function
	 */
	quat.scale = vec4.scale;
	
	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateX = function (out, a, rad) {
	    rad *= 0.5; 
	
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = Math.sin(rad), bw = Math.cos(rad);
	
	    out[0] = ax * bw + aw * bx;
	    out[1] = ay * bw + az * bx;
	    out[2] = az * bw - ay * bx;
	    out[3] = aw * bw - ax * bx;
	    return out;
	};
	
	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateY = function (out, a, rad) {
	    rad *= 0.5; 
	
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        by = Math.sin(rad), bw = Math.cos(rad);
	
	    out[0] = ax * bw - az * by;
	    out[1] = ay * bw + aw * by;
	    out[2] = az * bw + ax * by;
	    out[3] = aw * bw - ay * by;
	    return out;
	};
	
	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateZ = function (out, a, rad) {
	    rad *= 0.5; 
	
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bz = Math.sin(rad), bw = Math.cos(rad);
	
	    out[0] = ax * bw + ay * bz;
	    out[1] = ay * bw - ax * bz;
	    out[2] = az * bw + aw * bz;
	    out[3] = aw * bw - az * bz;
	    return out;
	};
	
	/**
	 * Calculates the W component of a quat from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length.
	 * Any existing W component will be ignored.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate W component of
	 * @returns {quat} out
	 */
	quat.calculateW = function (out, a) {
	    var x = a[0], y = a[1], z = a[2];
	
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
	    return out;
	};
	
	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	quat.dot = vec4.dot;
	
	/**
	 * Performs a linear interpolation between two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 * @function
	 */
	quat.lerp = vec4.lerp;
	
	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 */
	quat.slerp = function (out, a, b, t) {
	    // benchmarks:
	    //    http://jsperf.com/quaternion-slerp-implementations
	
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = b[0], by = b[1], bz = b[2], bw = b[3];
	
	    var        omega, cosom, sinom, scale0, scale1;
	
	    // calc cosine
	    cosom = ax * bx + ay * by + az * bz + aw * bw;
	    // adjust signs (if necessary)
	    if ( cosom < 0.0 ) {
	        cosom = -cosom;
	        bx = - bx;
	        by = - by;
	        bz = - bz;
	        bw = - bw;
	    }
	    // calculate coefficients
	    if ( (1.0 - cosom) > 0.000001 ) {
	        // standard case (slerp)
	        omega  = Math.acos(cosom);
	        sinom  = Math.sin(omega);
	        scale0 = Math.sin((1.0 - t) * omega) / sinom;
	        scale1 = Math.sin(t * omega) / sinom;
	    } else {        
	        // "from" and "to" quaternions are very close 
	        //  ... so we can do a linear interpolation
	        scale0 = 1.0 - t;
	        scale1 = t;
	    }
	    // calculate final values
	    out[0] = scale0 * ax + scale1 * bx;
	    out[1] = scale0 * ay + scale1 * by;
	    out[2] = scale0 * az + scale1 * bz;
	    out[3] = scale0 * aw + scale1 * bw;
	    
	    return out;
	};
	
	/**
	 * Performs a spherical linear interpolation with two control points
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {quat} c the third operand
	 * @param {quat} d the fourth operand
	 * @param {Number} t interpolation amount
	 * @returns {quat} out
	 */
	quat.sqlerp = (function () {
	  var temp1 = quat.create();
	  var temp2 = quat.create();
	  
	  return function (out, a, b, c, d, t) {
	    quat.slerp(temp1, a, d, t);
	    quat.slerp(temp2, b, c, t);
	    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
	    
	    return out;
	  };
	}());
	
	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */
	quat.invert = function(out, a) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
	        invDot = dot ? 1.0/dot : 0;
	    
	    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
	
	    out[0] = -a0*invDot;
	    out[1] = -a1*invDot;
	    out[2] = -a2*invDot;
	    out[3] = a3*invDot;
	    return out;
	};
	
	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */
	quat.conjugate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Calculates the length of a quat
	 *
	 * @param {quat} a vector to calculate length of
	 * @returns {Number} length of a
	 * @function
	 */
	quat.length = vec4.length;
	
	/**
	 * Alias for {@link quat.length}
	 * @function
	 */
	quat.len = quat.length;
	
	/**
	 * Calculates the squared length of a quat
	 *
	 * @param {quat} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	quat.squaredLength = vec4.squaredLength;
	
	/**
	 * Alias for {@link quat.squaredLength}
	 * @function
	 */
	quat.sqrLen = quat.squaredLength;
	
	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */
	quat.normalize = vec4.normalize;
	
	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */
	quat.fromMat3 = function(out, m) {
	    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	    // article "Quaternion Calculus and Fast Animation".
	    var fTrace = m[0] + m[4] + m[8];
	    var fRoot;
	
	    if ( fTrace > 0.0 ) {
	        // |w| > 1/2, may as well choose w > 1/2
	        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
	        out[3] = 0.5 * fRoot;
	        fRoot = 0.5/fRoot;  // 1/(4w)
	        out[0] = (m[5]-m[7])*fRoot;
	        out[1] = (m[6]-m[2])*fRoot;
	        out[2] = (m[1]-m[3])*fRoot;
	    } else {
	        // |w| <= 1/2
	        var i = 0;
	        if ( m[4] > m[0] )
	          i = 1;
	        if ( m[8] > m[i*3+i] )
	          i = 2;
	        var j = (i+1)%3;
	        var k = (i+2)%3;
	        
	        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
	        out[i] = 0.5 * fRoot;
	        fRoot = 0.5 / fRoot;
	        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
	        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
	        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
	    }
	    
	    return out;
	};
	
	/**
	 * Returns a string representation of a quatenion
	 *
	 * @param {quat} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	quat.str = function (a) {
	    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};
	
	module.exports = quat;


/***/ },
/* 13 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/vec3.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 3 Dimensional Vector
	 * @name vec3
	 */
	var vec3 = {};
	
	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	vec3.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    return out;
	};
	
	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
	vec3.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};
	
	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	vec3.fromValues = function(x, y, z) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};
	
	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	vec3.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};
	
	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	vec3.set = function(out, x, y, z) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};
	
	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    return out;
	};
	
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    return out;
	};
	
	/**
	 * Alias for {@link vec3.subtract}
	 * @function
	 */
	vec3.sub = vec3.subtract;
	
	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    return out;
	};
	
	/**
	 * Alias for {@link vec3.multiply}
	 * @function
	 */
	vec3.mul = vec3.multiply;
	
	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    return out;
	};
	
	/**
	 * Alias for {@link vec3.divide}
	 * @function
	 */
	vec3.div = vec3.divide;
	
	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    return out;
	};
	
	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    return out;
	};
	
	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	vec3.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    return out;
	};
	
	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	vec3.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    return out;
	};
	
	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec3.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return Math.sqrt(x*x + y*y + z*z);
	};
	
	/**
	 * Alias for {@link vec3.distance}
	 * @function
	 */
	vec3.dist = vec3.distance;
	
	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec3.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return x*x + y*y + z*z;
	};
	
	/**
	 * Alias for {@link vec3.squaredDistance}
	 * @function
	 */
	vec3.sqrDist = vec3.squaredDistance;
	
	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec3.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return Math.sqrt(x*x + y*y + z*z);
	};
	
	/**
	 * Alias for {@link vec3.length}
	 * @function
	 */
	vec3.len = vec3.length;
	
	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec3.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return x*x + y*y + z*z;
	};
	
	/**
	 * Alias for {@link vec3.squaredLength}
	 * @function
	 */
	vec3.sqrLen = vec3.squaredLength;
	
	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	vec3.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    return out;
	};
	
	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	vec3.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  return out;
	};
	
	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	vec3.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    var len = x*x + y*y + z*z;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	        out[2] = a[2] * len;
	    }
	    return out;
	};
	
	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec3.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	};
	
	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.cross = function(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2],
	        bx = b[0], by = b[1], bz = b[2];
	
	    out[0] = ay * bz - az * by;
	    out[1] = az * bx - ax * bz;
	    out[2] = ax * by - ay * bx;
	    return out;
	};
	
	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    return out;
	};
	
	/**
	 * Performs a hermite interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.hermite = function (out, a, b, c, d, t) {
	  var factorTimes2 = t * t,
	      factor1 = factorTimes2 * (2 * t - 3) + 1,
	      factor2 = factorTimes2 * (t - 2) + t,
	      factor3 = factorTimes2 * (t - 1),
	      factor4 = factorTimes2 * (3 - 2 * t);
	  
	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
	  
	  return out;
	};
	
	/**
	 * Performs a bezier interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.bezier = function (out, a, b, c, d, t) {
	  var inverseFactor = 1 - t,
	      inverseFactorTimesTwo = inverseFactor * inverseFactor,
	      factorTimes2 = t * t,
	      factor1 = inverseFactorTimesTwo * inverseFactor,
	      factor2 = 3 * t * inverseFactorTimesTwo,
	      factor3 = 3 * factorTimes2 * inverseFactor,
	      factor4 = factorTimes2 * t;
	  
	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
	  
	  return out;
	};
	
	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	vec3.random = function (out, scale) {
	    scale = scale || 1.0;
	
	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
	    var zScale = Math.sqrt(1.0-z*z) * scale;
	
	    out[0] = Math.cos(r) * zScale;
	    out[1] = Math.sin(r) * zScale;
	    out[2] = z * scale;
	    return out;
	};
	
	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat4 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2],
	        w = m[3] * x + m[7] * y + m[11] * z + m[15];
	    w = w || 1.0;
	    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	    return out;
	};
	
	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat3 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2];
	    out[0] = x * m[0] + y * m[3] + z * m[6];
	    out[1] = x * m[1] + y * m[4] + z * m[7];
	    out[2] = x * m[2] + y * m[5] + z * m[8];
	    return out;
	};
	
	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	vec3.transformQuat = function(out, a, q) {
	    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
	
	    var x = a[0], y = a[1], z = a[2],
	        qx = q[0], qy = q[1], qz = q[2], qw = q[3],
	
	        // calculate quat * vec
	        ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;
	
	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    return out;
	};
	
	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateX = function(out, a, b, c){
	   var p = [], r=[];
		  //Translate point to the origin
		  p[0] = a[0] - b[0];
		  p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];
	
		  //perform rotation
		  r[0] = p[0];
		  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
		  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);
	
		  //translate to correct position
		  out[0] = r[0] + b[0];
		  out[1] = r[1] + b[1];
		  out[2] = r[2] + b[2];
	
	  	return out;
	};
	
	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateY = function(out, a, b, c){
	  	var p = [], r=[];
	  	//Translate point to the origin
	  	p[0] = a[0] - b[0];
	  	p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];
	  
	  	//perform rotation
	  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
	  	r[1] = p[1];
	  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
	  
	  	//translate to correct position
	  	out[0] = r[0] + b[0];
	  	out[1] = r[1] + b[1];
	  	out[2] = r[2] + b[2];
	  
	  	return out;
	};
	
	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateZ = function(out, a, b, c){
	  	var p = [], r=[];
	  	//Translate point to the origin
	  	p[0] = a[0] - b[0];
	  	p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];
	  
	  	//perform rotation
	  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
	  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
	  	r[2] = p[2];
	  
	  	//translate to correct position
	  	out[0] = r[0] + b[0];
	  	out[1] = r[1] + b[1];
	  	out[2] = r[2] + b[2];
	  
	  	return out;
	};
	
	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec3.forEach = (function() {
	    var vec = vec3.create();
	
	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 3;
	        }
	
	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }
	
	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
	        }
	        
	        return a;
	    };
	})();
	
	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	vec3.angle = function(a, b) {
	   
	    var tempA = vec3.fromValues(a[0], a[1], a[2]);
	    var tempB = vec3.fromValues(b[0], b[1], b[2]);
	 
	    vec3.normalize(tempA, tempA);
	    vec3.normalize(tempB, tempB);
	 
	    var cosine = vec3.dot(tempA, tempB);
	
	    if(cosine > 1.0){
	        return 0;
	    } else {
	        return Math.acos(cosine);
	    }     
	};
	
	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec3} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec3.str = function (a) {
	    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
	};
	
	module.exports = vec3;


/***/ },
/* 14 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/vec4.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 4 Dimensional Vector
	 * @name vec4
	 */
	var vec4 = {};
	
	/**
	 * Creates a new, empty vec4
	 *
	 * @returns {vec4} a new 4D vector
	 */
	vec4.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    return out;
	};
	
	/**
	 * Creates a new vec4 initialized with values from an existing vector
	 *
	 * @param {vec4} a vector to clone
	 * @returns {vec4} a new 4D vector
	 */
	vec4.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	vec4.fromValues = function(x, y, z, w) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};
	
	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */
	vec4.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */
	vec4.set = function(out, x, y, z, w) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};
	
	/**
	 * Adds two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    return out;
	};
	
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    return out;
	};
	
	/**
	 * Alias for {@link vec4.subtract}
	 * @function
	 */
	vec4.sub = vec4.subtract;
	
	/**
	 * Multiplies two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    out[3] = a[3] * b[3];
	    return out;
	};
	
	/**
	 * Alias for {@link vec4.multiply}
	 * @function
	 */
	vec4.mul = vec4.multiply;
	
	/**
	 * Divides two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    out[3] = a[3] / b[3];
	    return out;
	};
	
	/**
	 * Alias for {@link vec4.divide}
	 * @function
	 */
	vec4.div = vec4.divide;
	
	/**
	 * Returns the minimum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    out[3] = Math.min(a[3], b[3]);
	    return out;
	};
	
	/**
	 * Returns the maximum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    out[3] = Math.max(a[3], b[3]);
	    return out;
	};
	
	/**
	 * Scales a vec4 by a scalar number
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec4} out
	 */
	vec4.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    return out;
	};
	
	/**
	 * Adds two vec4's after scaling the second operand by a scalar value
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec4} out
	 */
	vec4.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    return out;
	};
	
	/**
	 * Calculates the euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec4.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return Math.sqrt(x*x + y*y + z*z + w*w);
	};
	
	/**
	 * Alias for {@link vec4.distance}
	 * @function
	 */
	vec4.dist = vec4.distance;
	
	/**
	 * Calculates the squared euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec4.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return x*x + y*y + z*z + w*w;
	};
	
	/**
	 * Alias for {@link vec4.squaredDistance}
	 * @function
	 */
	vec4.sqrDist = vec4.squaredDistance;
	
	/**
	 * Calculates the length of a vec4
	 *
	 * @param {vec4} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec4.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return Math.sqrt(x*x + y*y + z*z + w*w);
	};
	
	/**
	 * Alias for {@link vec4.length}
	 * @function
	 */
	vec4.len = vec4.length;
	
	/**
	 * Calculates the squared length of a vec4
	 *
	 * @param {vec4} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec4.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return x*x + y*y + z*z + w*w;
	};
	
	/**
	 * Alias for {@link vec4.squaredLength}
	 * @function
	 */
	vec4.sqrLen = vec4.squaredLength;
	
	/**
	 * Negates the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to negate
	 * @returns {vec4} out
	 */
	vec4.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = -a[3];
	    return out;
	};
	
	/**
	 * Returns the inverse of the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to invert
	 * @returns {vec4} out
	 */
	vec4.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  out[3] = 1.0 / a[3];
	  return out;
	};
	
	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */
	vec4.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    var len = x*x + y*y + z*z + w*w;
	    if (len > 0) {
	        len = 1 / Math.sqrt(len);
	        out[0] = x * len;
	        out[1] = y * len;
	        out[2] = z * len;
	        out[3] = w * len;
	    }
	    return out;
	};
	
	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec4.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	};
	
	/**
	 * Performs a linear interpolation between two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec4} out
	 */
	vec4.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    out[3] = aw + t * (b[3] - aw);
	    return out;
	};
	
	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec4} out
	 */
	vec4.random = function (out, scale) {
	    scale = scale || 1.0;
	
	    //TODO: This is a pretty awful way of doing this. Find something better.
	    out[0] = glMatrix.RANDOM();
	    out[1] = glMatrix.RANDOM();
	    out[2] = glMatrix.RANDOM();
	    out[3] = glMatrix.RANDOM();
	    vec4.normalize(out, out);
	    vec4.scale(out, out, scale);
	    return out;
	};
	
	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	vec4.transformMat4 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2], w = a[3];
	    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	    return out;
	};
	
	/**
	 * Transforms the vec4 with a quat
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec4} out
	 */
	vec4.transformQuat = function(out, a, q) {
	    var x = a[0], y = a[1], z = a[2],
	        qx = q[0], qy = q[1], qz = q[2], qw = q[3],
	
	        // calculate quat * vec
	        ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;
	
	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    out[3] = a[3];
	    return out;
	};
	
	/**
	 * Perform some operation over an array of vec4s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec4.forEach = (function() {
	    var vec = vec4.create();
	
	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 4;
	        }
	
	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }
	
	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
	        }
	        
	        return a;
	    };
	})();
	
	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec4} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec4.str = function (a) {
	    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};
	
	module.exports = vec4;


/***/ },
/* 15 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/src/gl-matrix/vec2.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	
	var glMatrix = __webpack_require__(/*! ./common.js */ 7);
	
	/**
	 * @class 2 Dimensional Vector
	 * @name vec2
	 */
	var vec2 = {};
	
	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	vec2.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = 0;
	    out[1] = 0;
	    return out;
	};
	
	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
	vec2.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};
	
	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	vec2.fromValues = function(x, y) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = x;
	    out[1] = y;
	    return out;
	};
	
	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	vec2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};
	
	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	vec2.set = function(out, x, y) {
	    out[0] = x;
	    out[1] = y;
	    return out;
	};
	
	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    return out;
	};
	
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    return out;
	};
	
	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	vec2.sub = vec2.subtract;
	
	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    return out;
	};
	
	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	vec2.mul = vec2.multiply;
	
	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    return out;
	};
	
	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	vec2.div = vec2.divide;
	
	/**
	 * Returns the minimum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    return out;
	};
	
	/**
	 * Returns the maximum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    return out;
	};
	
	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */
	vec2.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    return out;
	};
	
	/**
	 * Adds two vec2's after scaling the second operand by a scalar value
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec2} out
	 */
	vec2.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    return out;
	};
	
	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec2.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return Math.sqrt(x*x + y*y);
	};
	
	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	vec2.dist = vec2.distance;
	
	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec2.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return x*x + y*y;
	};
	
	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	vec2.sqrDist = vec2.squaredDistance;
	
	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec2.length = function (a) {
	    var x = a[0],
	        y = a[1];
	    return Math.sqrt(x*x + y*y);
	};
	
	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	vec2.len = vec2.length;
	
	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec2.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1];
	    return x*x + y*y;
	};
	
	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	vec2.sqrLen = vec2.squaredLength;
	
	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	vec2.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    return out;
	};
	
	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */
	vec2.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  return out;
	};
	
	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	vec2.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1];
	    var len = x*x + y*y;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	    }
	    return out;
	};
	
	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec2.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	};
	
	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	vec2.cross = function(out, a, b) {
	    var z = a[0] * b[1] - a[1] * b[0];
	    out[0] = out[1] = 0;
	    out[2] = z;
	    return out;
	};
	
	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec2} out
	 */
	vec2.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    return out;
	};
	
	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec2} out
	 */
	vec2.random = function (out, scale) {
	    scale = scale || 1.0;
	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    out[0] = Math.cos(r) * scale;
	    out[1] = Math.sin(r) * scale;
	    return out;
	};
	
	/**
	 * Transforms the vec2 with a mat2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y;
	    out[1] = m[1] * x + m[3] * y;
	    return out;
	};
	
	/**
	 * Transforms the vec2 with a mat2d
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2d} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2d = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y + m[4];
	    out[1] = m[1] * x + m[3] * y + m[5];
	    return out;
	};
	
	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat3 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[3] * y + m[6];
	    out[1] = m[1] * x + m[4] * y + m[7];
	    return out;
	};
	
	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat4 = function(out, a, m) {
	    var x = a[0], 
	        y = a[1];
	    out[0] = m[0] * x + m[4] * y + m[12];
	    out[1] = m[1] * x + m[5] * y + m[13];
	    return out;
	};
	
	/**
	 * Perform some operation over an array of vec2s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec2.forEach = (function() {
	    var vec = vec2.create();
	
	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 2;
	        }
	
	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }
	
	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1];
	        }
	        
	        return a;
	    };
	})();
	
	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec2.str = function (a) {
	    return 'vec2(' + a[0] + ', ' + a[1] + ')';
	};
	
	module.exports = vec2;


/***/ },
/* 16 */
/*!***********************!*\
  !*** ./src/face.json ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = {
		"face": {
			"position": [
				0.03815,
				-0.06365,
				0.02312,
				0,
				-0.05952,
				0.03923,
				0,
				-0.1035,
				0.06995,
				0.03849,
				-0.1046,
				0.05281,
				0.03619,
				0.08163,
				-0.05285,
				0,
				0.08837,
				-0.04032,
				0,
				0,
				0,
				0.04243,
				-0.008568,
				-0.0141,
				0.07497,
				0.0458,
				-0.09676,
				0.07683,
				-0.0414,
				-0.07184,
				0,
				-0.1535,
				0.07161,
				0.03853,
				-0.149,
				0.05611,
				0.0915,
				-0.1514,
				-0.01107,
				0.09298,
				-0.1199,
				-0.02114,
				0,
				-0.1848,
				0.04713,
				0.03386,
				-0.1775,
				0.03478,
				0.08027,
				-0.1711,
				-0.007969,
				0.01467,
				-0.1903,
				0.009363,
				0,
				-0.1953,
				0.01097,
				0.03079,
				-0.201,
				-0.0237,
				0,
				-0.2085,
				-0.01697,
				0.1212,
				-0.05466,
				-0.1007,
				0.1832,
				-0.01051,
				-0.1295,
				0.2343,
				-0.08553,
				-0.1383,
				0.1761,
				-0.1329,
				-0.1131,
				0.2219,
				-0.2308,
				-0.1442,
				0.242,
				-0.2794,
				-0.1579,
				0.3065,
				-0.2407,
				-0.2255,
				0.2906,
				-0.1915,
				-0.1963,
				0.173,
				-0.2579,
				-0.1134,
				0.1935,
				-0.3033,
				-0.1192,
				0.2683,
				-0.1395,
				-0.1633,
				0.2002,
				-0.1803,
				-0.1286,
				0.1532,
				-0.2071,
				-0.1068,
				0.316,
				-0.2869,
				-0.2482,
				0.2565,
				-0.3244,
				-0.1701,
				0.2062,
				-0.3399,
				-0.1266,
				0.3208,
				-0.3585,
				-0.2788,
				0.2384,
				-0.4121,
				-0.1678,
				0.1942,
				-0.398,
				-0.1226,
				0.1389,
				-0.3195,
				-0.07301,
				0.1494,
				-0.3394,
				-0.1046,
				0.1441,
				-0.2947,
				-0.07972,
				0.1675,
				-0.3243,
				-0.1033,
				0.07724,
				-0.4293,
				-0.06353,
				0,
				-0.4403,
				-0.03551,
				0.09584,
				-0.4704,
				-0.0751,
				0,
				-0.4751,
				-0.04961,
				0.1266,
				-0.4083,
				-0.08467,
				0.1474,
				-0.3538,
				-0.1142,
				0.116,
				-0.385,
				-0.08127,
				0.1679,
				-0.3756,
				-0.1115,
				0.07556,
				-0.3043,
				-0.02149,
				0.08932,
				-0.2892,
				-0.0363,
				0.166,
				-0.3478,
				-0.1165,
				0.1813,
				-0.3445,
				-0.1171,
				0.1542,
				-0.346,
				-0.1184,
				0.1419,
				-0.3524,
				-0.1205,
				0.1219,
				-0.3365,
				-0.09275,
				0.1411,
				-0.342,
				-0.1134,
				0.1325,
				-0.3287,
				-0.07901,
				0.0726,
				-0.321,
				-0.02867,
				0.0665,
				-0.3302,
				-0.0492,
				0,
				-0.3211,
				-0.008766,
				0,
				-0.3067,
				-0.005393,
				0,
				-0.3293,
				-0.03031,
				0.125,
				-0.2197,
				-0.0862,
				0.05536,
				-0.2347,
				-0.0376,
				0.04027,
				-0.282,
				-0.02056,
				0,
				-0.2889,
				-0.01367,
				0.1074,
				-0.1759,
				-0.0861,
				0.1349,
				-0.1632,
				-0.102,
				0,
				-0.2425,
				-0.02751,
				0.1186,
				-0.1511,
				-0.08671,
				0,
				-0.5273,
				-0.03931,
				0.1136,
				-0.5194,
				-0.07705,
				0.229,
				-0.5102,
				-0.2083,
				0.3185,
				-0.4287,
				-0.3121,
				0.3501,
				-0.3836,
				-0.3671,
				0.3452,
				-0.3205,
				-0.332,
				0.3822,
				-0.3111,
				-0.4464,
				0.3749,
				-0.2628,
				-0.4023,
				0.4374,
				0.1364,
				-0.5792,
				0.4293,
				0.2308,
				-0.5725,
				0.3968,
				0.2382,
				-0.3646,
				0.4166,
				0.04559,
				-0.3992,
				0.4383,
				0.05378,
				-0.5802,
				0.4146,
				-0.02746,
				-0.4276,
				0.4097,
				-0.08167,
				-0.4557,
				0.4087,
				-0.1254,
				-0.4789,
				0.4289,
				-0.08916,
				-0.5588,
				0.4362,
				-0.01401,
				-0.5724,
				0.4104,
				-0.1863,
				-0.53,
				0.3564,
				0.3587,
				-0.3653,
				0.4126,
				0.345,
				-0.5495,
				0.3908,
				0.447,
				-0.5159,
				0.3253,
				0.4758,
				-0.3885,
				0.1182,
				-0.5897,
				-0.1052,
				0.1384,
				0.1366,
				-0.1568,
				0.122,
				0.1457,
				-0.1284,
				0.08922,
				0.1102,
				-0.1424,
				0.1102,
				0.1075,
				-0.16,
				0.1891,
				0.04054,
				-0.145,
				0.1861,
				0.06724,
				-0.1517,
				0.1363,
				0.08889,
				-0.1573,
				0.1201,
				0.06988,
				-0.1434,
				0.2323,
				0.06182,
				-0.161,
				0.2381,
				0.0356,
				-0.1622,
				0.2843,
				0.07763,
				-0.1906,
				0.2947,
				0.05669,
				-0.1978,
				0.3367,
				0.1024,
				-0.2433,
				0.3215,
				0.1103,
				-0.231,
				0.3318,
				0.1421,
				-0.2005,
				0.3184,
				0.1346,
				-0.2049,
				0.3099,
				0.263,
				-0.1506,
				0.1514,
				0.1273,
				-0.1625,
				0.1288,
				0.1081,
				-0.1678,
				0.1857,
				0.09272,
				-0.1567,
				0.1511,
				0.1068,
				-0.1652,
				0.2297,
				0.0869,
				-0.1619,
				0.3097,
				0.1162,
				-0.2225,
				0.2797,
				0.09599,
				-0.1889,
				0.1422,
				0.1135,
				-0.1754,
				0.2335,
				0.1701,
				-0.156,
				0.1823,
				0.16,
				-0.1564,
				0.2322,
				0.1568,
				-0.1574,
				0.1831,
				0.148,
				-0.1599,
				0.2523,
				0.217,
				-0.1046,
				0.1852,
				0.2017,
				-0.08847,
				0.2398,
				0.174,
				-0.1341,
				0.1813,
				0.1643,
				-0.1314,
				0.1087,
				0.1725,
				-0.08099,
				0.06559,
				0.1195,
				-0.101,
				0.2538,
				-0.003445,
				-0.1545,
				0.3189,
				0.02741,
				-0.207,
				0.3622,
				0.08619,
				-0.2591,
				0.3523,
				0.1768,
				-0.1931,
				0.3045,
				0.2032,
				-0.1411,
				0.2539,
				0.288,
				-0.1017,
				0.03409,
				0.1289,
				-0.06244,
				0.07284,
				0.2393,
				-0.04767,
				0.3701,
				0.2128,
				-0.2486,
				0,
				0.1313,
				-0.05193,
				0,
				0.2437,
				-0.04321,
				0.2511,
				0.3352,
				-0.12,
				0.2533,
				0.3979,
				-0.163,
				0.12,
				0.4175,
				-0.1039,
				0.1189,
				0.3357,
				-0.06785,
				0,
				0.4192,
				-0.09193,
				0,
				0.3326,
				-0.06122,
				0.1235,
				0.5276,
				-0.1888,
				0.2449,
				0.5119,
				-0.2501,
				0,
				0.5359,
				-0.1736,
				0.3286,
				0.5511,
				-0.4387,
				0.2381,
				0.6051,
				-0.3678,
				0,
				0.6365,
				-0.2955,
				0.1195,
				0.6298,
				-0.3172,
				0.3888,
				0.05843,
				-0.2879,
				0.3496,
				-0.02266,
				-0.2205,
				0.285,
				-0.06441,
				-0.1628,
				0.309,
				-0.1166,
				-0.1913,
				0.3245,
				-0.1683,
				-0.2308,
				0.3338,
				-0.2148,
				-0.266,
				0.3385,
				-0.2569,
				-0.2954,
				0.3632,
				-0.06963,
				-0.2512,
				0.367,
				-0.1213,
				-0.2932,
				0.3705,
				-0.1653,
				-0.3317,
				0.3719,
				-0.2045,
				-0.3637,
				0.3052,
				0.1258,
				-0.2018,
				0.125,
				-0.1272,
				-0.09647,
				0.08798,
				-0.09029,
				-0.03624,
				0.111,
				-0.3732,
				-0.08619,
				0.1795,
				0.2777,
				-0.07489,
				0.2905,
				0.1615,
				-0.1671,
				0.2798,
				0.1583,
				-0.1795,
				0.2772,
				0.1459,
				-0.181,
				0.1066,
				-0.3661,
				-0.09434,
				0,
				-0.6053,
				-0.07017,
				0.07113,
				-0.4087,
				-0.05058,
				0.06772,
				-0.3893,
				-0.05554,
				0,
				-0.4152,
				-0.02269,
				0,
				-0.392,
				-0.02709,
				0,
				-0.3829,
				-0.03881,
				0.06631,
				-0.3813,
				-0.06757,
				-0.03815,
				-0.06365,
				0.02312,
				-0.03849,
				-0.1046,
				0.05281,
				-0.03619,
				0.08163,
				-0.05285,
				-0.04243,
				-0.008568,
				-0.0141,
				-0.07497,
				0.0458,
				-0.09676,
				-0.07683,
				-0.0414,
				-0.07184,
				-0.03853,
				-0.149,
				0.05611,
				-0.0915,
				-0.1514,
				-0.01107,
				-0.09298,
				-0.1199,
				-0.02114,
				-0.03386,
				-0.1775,
				0.03478,
				-0.08027,
				-0.1711,
				-0.007969,
				-0.01467,
				-0.1903,
				0.009363,
				-0.03079,
				-0.201,
				-0.0237,
				-0.1212,
				-0.05466,
				-0.1007,
				-0.1832,
				-0.01051,
				-0.1295,
				-0.2343,
				-0.08553,
				-0.1383,
				-0.1761,
				-0.1329,
				-0.1131,
				-0.2219,
				-0.2308,
				-0.1442,
				-0.3065,
				-0.2407,
				-0.2255,
				-0.242,
				-0.2794,
				-0.1579,
				-0.2906,
				-0.1915,
				-0.1963,
				-0.173,
				-0.2579,
				-0.1134,
				-0.1935,
				-0.3033,
				-0.1192,
				-0.2002,
				-0.1803,
				-0.1286,
				-0.2683,
				-0.1395,
				-0.1633,
				-0.1532,
				-0.2071,
				-0.1068,
				-0.316,
				-0.2869,
				-0.2482,
				-0.2565,
				-0.3244,
				-0.1701,
				-0.2062,
				-0.3399,
				-0.1266,
				-0.3208,
				-0.3585,
				-0.2788,
				-0.2384,
				-0.4121,
				-0.1678,
				-0.1942,
				-0.398,
				-0.1226,
				-0.1389,
				-0.3195,
				-0.07301,
				-0.1441,
				-0.2947,
				-0.07972,
				-0.1494,
				-0.3394,
				-0.1046,
				-0.1675,
				-0.3243,
				-0.1033,
				-0.07724,
				-0.4293,
				-0.06353,
				-0.09584,
				-0.4704,
				-0.0751,
				-0.1266,
				-0.4083,
				-0.08467,
				-0.1474,
				-0.3538,
				-0.1142,
				-0.1679,
				-0.3756,
				-0.1115,
				-0.116,
				-0.385,
				-0.08127,
				-0.07556,
				-0.3043,
				-0.02149,
				-0.08932,
				-0.2892,
				-0.0363,
				-0.166,
				-0.3478,
				-0.1165,
				-0.1813,
				-0.3445,
				-0.1171,
				-0.1542,
				-0.346,
				-0.1184,
				-0.1419,
				-0.3524,
				-0.1205,
				-0.1219,
				-0.3365,
				-0.09275,
				-0.1325,
				-0.3287,
				-0.07901,
				-0.1411,
				-0.342,
				-0.1134,
				-0.0726,
				-0.321,
				-0.02867,
				-0.0665,
				-0.3302,
				-0.0492,
				-0.125,
				-0.2197,
				-0.0862,
				-0.05536,
				-0.2347,
				-0.0376,
				-0.04027,
				-0.282,
				-0.02056,
				-0.1074,
				-0.1759,
				-0.0861,
				-0.1349,
				-0.1632,
				-0.102,
				-0.1186,
				-0.1511,
				-0.08671,
				-0.1136,
				-0.5194,
				-0.07705,
				-0.229,
				-0.5102,
				-0.2083,
				-0.3185,
				-0.4287,
				-0.3121,
				-0.3452,
				-0.3205,
				-0.332,
				-0.3501,
				-0.3836,
				-0.3671,
				-0.3822,
				-0.3111,
				-0.4464,
				-0.3749,
				-0.2628,
				-0.4023,
				-0.4374,
				0.1364,
				-0.5792,
				-0.3968,
				0.2382,
				-0.3646,
				-0.4293,
				0.2308,
				-0.5725,
				-0.4166,
				0.04559,
				-0.3992,
				-0.4383,
				0.05378,
				-0.5802,
				-0.4146,
				-0.02746,
				-0.4276,
				-0.4097,
				-0.08167,
				-0.4557,
				-0.4289,
				-0.08916,
				-0.5588,
				-0.4087,
				-0.1254,
				-0.4789,
				-0.4362,
				-0.01401,
				-0.5724,
				-0.4104,
				-0.1863,
				-0.53,
				-0.3564,
				0.3587,
				-0.3653,
				-0.4126,
				0.345,
				-0.5495,
				-0.3908,
				0.447,
				-0.5159,
				-0.3253,
				0.4758,
				-0.3885,
				-0.1182,
				-0.5897,
				-0.1052,
				-0.1384,
				0.1366,
				-0.1568,
				-0.08922,
				0.1102,
				-0.1424,
				-0.122,
				0.1457,
				-0.1284,
				-0.1102,
				0.1075,
				-0.16,
				-0.1891,
				0.04054,
				-0.145,
				-0.1363,
				0.08889,
				-0.1573,
				-0.1861,
				0.06724,
				-0.1517,
				-0.1201,
				0.06988,
				-0.1434,
				-0.2323,
				0.06182,
				-0.161,
				-0.2381,
				0.0356,
				-0.1622,
				-0.2843,
				0.07763,
				-0.1906,
				-0.3367,
				0.1024,
				-0.2433,
				-0.2947,
				0.05669,
				-0.1978,
				-0.3215,
				0.1103,
				-0.231,
				-0.3318,
				0.1421,
				-0.2005,
				-0.3184,
				0.1346,
				-0.2049,
				-0.3099,
				0.263,
				-0.1506,
				-0.1514,
				0.1273,
				-0.1625,
				-0.1288,
				0.1081,
				-0.1678,
				-0.1511,
				0.1068,
				-0.1652,
				-0.1857,
				0.09272,
				-0.1567,
				-0.2297,
				0.0869,
				-0.1619,
				-0.3097,
				0.1162,
				-0.2225,
				-0.2797,
				0.09599,
				-0.1889,
				-0.1422,
				0.1135,
				-0.1754,
				-0.2335,
				0.1701,
				-0.156,
				-0.2322,
				0.1568,
				-0.1574,
				-0.1823,
				0.16,
				-0.1564,
				-0.1831,
				0.148,
				-0.1599,
				-0.2523,
				0.217,
				-0.1046,
				-0.2398,
				0.174,
				-0.1341,
				-0.1852,
				0.2017,
				-0.08847,
				-0.1813,
				0.1643,
				-0.1314,
				-0.1087,
				0.1725,
				-0.08099,
				-0.06559,
				0.1195,
				-0.101,
				-0.2538,
				-0.003445,
				-0.1545,
				-0.3189,
				0.02741,
				-0.207,
				-0.3622,
				0.08619,
				-0.2591,
				-0.3523,
				0.1768,
				-0.1931,
				-0.2539,
				0.288,
				-0.1017,
				-0.3045,
				0.2032,
				-0.1411,
				-0.03409,
				0.1289,
				-0.06244,
				-0.07284,
				0.2393,
				-0.04767,
				-0.3701,
				0.2128,
				-0.2486,
				-0.2511,
				0.3352,
				-0.12,
				-0.12,
				0.4175,
				-0.1039,
				-0.2533,
				0.3979,
				-0.163,
				-0.1189,
				0.3357,
				-0.06785,
				-0.1235,
				0.5276,
				-0.1888,
				-0.2449,
				0.5119,
				-0.2501,
				-0.3286,
				0.5511,
				-0.4387,
				-0.2381,
				0.6051,
				-0.3678,
				-0.1195,
				0.6298,
				-0.3172,
				-0.3888,
				0.05843,
				-0.2879,
				-0.3496,
				-0.02266,
				-0.2205,
				-0.285,
				-0.06441,
				-0.1628,
				-0.309,
				-0.1166,
				-0.1913,
				-0.3245,
				-0.1683,
				-0.2308,
				-0.3338,
				-0.2148,
				-0.266,
				-0.3385,
				-0.2569,
				-0.2954,
				-0.3632,
				-0.06963,
				-0.2512,
				-0.367,
				-0.1213,
				-0.2932,
				-0.3705,
				-0.1653,
				-0.3317,
				-0.3719,
				-0.2045,
				-0.3637,
				-0.3052,
				0.1258,
				-0.2018,
				-0.125,
				-0.1272,
				-0.09647,
				-0.08798,
				-0.09029,
				-0.03624,
				-0.111,
				-0.3732,
				-0.08619,
				-0.1795,
				0.2777,
				-0.07489,
				-0.2905,
				0.1615,
				-0.1671,
				-0.2798,
				0.1583,
				-0.1795,
				-0.2772,
				0.1459,
				-0.181,
				-0.1066,
				-0.3661,
				-0.09434,
				-0.07113,
				-0.4087,
				-0.05058,
				-0.06772,
				-0.3893,
				-0.05554,
				-0.06631,
				-0.3813,
				-0.06757
			],
			"index": [
				0,
				1,
				2,
				2,
				3,
				0,
				4,
				5,
				6,
				6,
				7,
				4,
				8,
				4,
				7,
				7,
				9,
				8,
				3,
				2,
				10,
				10,
				11,
				3,
				3,
				11,
				12,
				12,
				13,
				3,
				10,
				14,
				15,
				15,
				11,
				10,
				11,
				15,
				16,
				16,
				12,
				11,
				17,
				15,
				14,
				14,
				18,
				17,
				19,
				17,
				18,
				18,
				20,
				19,
				16,
				15,
				17,
				17,
				19,
				16,
				6,
				1,
				0,
				0,
				7,
				6,
				21,
				8,
				9,
				22,
				8,
				21,
				23,
				22,
				21,
				21,
				24,
				23,
				25,
				26,
				27,
				27,
				28,
				25,
				29,
				30,
				26,
				26,
				25,
				29,
				28,
				31,
				32,
				32,
				25,
				28,
				25,
				32,
				33,
				33,
				29,
				25,
				34,
				27,
				26,
				26,
				35,
				34,
				35,
				26,
				30,
				30,
				36,
				35,
				37,
				34,
				35,
				35,
				38,
				37,
				38,
				35,
				36,
				36,
				39,
				38,
				40,
				41,
				42,
				41,
				43,
				42,
				44,
				45,
				46,
				45,
				47,
				46,
				44,
				46,
				48,
				49,
				50,
				51,
				50,
				48,
				51,
				40,
				42,
				52,
				42,
				53,
				52,
				54,
				55,
				41,
				55,
				43,
				41,
				49,
				54,
				56,
				57,
				49,
				56,
				58,
				59,
				60,
				59,
				41,
				60,
				41,
				59,
				56,
				60,
				40,
				61,
				40,
				52,
				61,
				41,
				40,
				60,
				56,
				54,
				41,
				58,
				60,
				62,
				60,
				61,
				62,
				54,
				49,
				55,
				49,
				51,
				55,
				61,
				52,
				63,
				52,
				64,
				63,
				62,
				61,
				65,
				61,
				63,
				65,
				51,
				39,
				36,
				36,
				55,
				51,
				43,
				55,
				36,
				36,
				30,
				43,
				42,
				43,
				30,
				30,
				29,
				42,
				29,
				33,
				66,
				66,
				42,
				29,
				67,
				53,
				66,
				53,
				42,
				66,
				64,
				52,
				68,
				64,
				68,
				69,
				70,
				66,
				33,
				33,
				71,
				70,
				67,
				66,
				70,
				70,
				19,
				67,
				20,
				72,
				67,
				67,
				19,
				20,
				71,
				33,
				32,
				32,
				24,
				71,
				24,
				32,
				31,
				31,
				23,
				24,
				70,
				12,
				16,
				16,
				19,
				70,
				73,
				70,
				71,
				74,
				75,
				47,
				75,
				46,
				47,
				69,
				68,
				72,
				76,
				77,
				37,
				37,
				38,
				76,
				77,
				78,
				79,
				79,
				37,
				77,
				80,
				81,
				79,
				79,
				78,
				80,
				82,
				83,
				84,
				84,
				85,
				82,
				86,
				82,
				85,
				85,
				87,
				86,
				88,
				89,
				90,
				90,
				91,
				88,
				81,
				80,
				92,
				93,
				84,
				83,
				83,
				94,
				93,
				93,
				94,
				95,
				95,
				96,
				93,
				46,
				39,
				48,
				12,
				73,
				13,
				70,
				73,
				12,
				52,
				53,
				68,
				38,
				75,
				97,
				97,
				76,
				38,
				98,
				99,
				100,
				100,
				101,
				98,
				102,
				103,
				104,
				104,
				105,
				102,
				106,
				103,
				102,
				102,
				107,
				106,
				108,
				109,
				110,
				110,
				111,
				108,
				111,
				110,
				112,
				112,
				113,
				111,
				93,
				114,
				84,
				115,
				98,
				101,
				101,
				116,
				115,
				103,
				117,
				118,
				118,
				104,
				103,
				119,
				117,
				103,
				103,
				106,
				119,
				120,
				121,
				108,
				108,
				111,
				120,
				115,
				116,
				122,
				123,
				124,
				125,
				124,
				126,
				125,
				127,
				128,
				129,
				128,
				130,
				129,
				101,
				100,
				105,
				105,
				104,
				101,
				116,
				101,
				104,
				104,
				118,
				116,
				109,
				108,
				106,
				106,
				107,
				109,
				108,
				121,
				119,
				119,
				106,
				108,
				124,
				98,
				126,
				98,
				115,
				126,
				123,
				129,
				124,
				129,
				130,
				124,
				100,
				99,
				131,
				131,
				132,
				100,
				102,
				105,
				8,
				8,
				22,
				102,
				107,
				102,
				22,
				22,
				133,
				107,
				110,
				109,
				134,
				134,
				135,
				110,
				112,
				110,
				135,
				135,
				136,
				112,
				124,
				130,
				98,
				130,
				99,
				98,
				127,
				137,
				138,
				137,
				114,
				138,
				105,
				100,
				132,
				132,
				8,
				105,
				109,
				107,
				133,
				133,
				134,
				109,
				139,
				4,
				8,
				8,
				132,
				139,
				140,
				139,
				132,
				132,
				131,
				140,
				137,
				136,
				114,
				136,
				141,
				114,
				141,
				84,
				114,
				142,
				5,
				4,
				4,
				139,
				142,
				143,
				142,
				139,
				139,
				140,
				143,
				144,
				145,
				146,
				146,
				147,
				144,
				114,
				93,
				145,
				145,
				144,
				114,
				147,
				146,
				148,
				148,
				149,
				147,
				150,
				146,
				145,
				145,
				151,
				150,
				151,
				145,
				93,
				93,
				96,
				151,
				148,
				146,
				150,
				150,
				152,
				148,
				153,
				154,
				151,
				96,
				153,
				151,
				155,
				152,
				150,
				150,
				156,
				155,
				136,
				135,
				157,
				157,
				141,
				136,
				158,
				157,
				135,
				135,
				134,
				158,
				159,
				158,
				134,
				134,
				133,
				159,
				23,
				159,
				133,
				133,
				22,
				23,
				159,
				23,
				31,
				31,
				160,
				159,
				161,
				28,
				27,
				27,
				162,
				161,
				160,
				31,
				28,
				28,
				161,
				160,
				162,
				27,
				34,
				34,
				163,
				162,
				34,
				37,
				79,
				79,
				163,
				34,
				158,
				159,
				160,
				160,
				164,
				158,
				165,
				161,
				162,
				162,
				166,
				165,
				164,
				160,
				161,
				161,
				165,
				164,
				166,
				162,
				163,
				163,
				167,
				166,
				163,
				79,
				81,
				81,
				167,
				163,
				157,
				158,
				164,
				164,
				85,
				157,
				87,
				165,
				166,
				166,
				88,
				87,
				85,
				164,
				165,
				165,
				87,
				85,
				88,
				166,
				167,
				167,
				89,
				88,
				167,
				81,
				92,
				92,
				89,
				167,
				141,
				157,
				85,
				85,
				84,
				141,
				113,
				168,
				120,
				120,
				111,
				113,
				169,
				9,
				170,
				87,
				88,
				91,
				91,
				86,
				87,
				150,
				151,
				154,
				154,
				156,
				150,
				96,
				95,
				153,
				49,
				171,
				50,
				38,
				39,
				46,
				46,
				75,
				38,
				67,
				68,
				53,
				68,
				67,
				72,
				122,
				116,
				118,
				147,
				149,
				143,
				143,
				140,
				147,
				147,
				140,
				172,
				131,
				128,
				140,
				128,
				172,
				140,
				128,
				131,
				130,
				131,
				99,
				130,
				136,
				137,
				112,
				137,
				173,
				112,
				173,
				174,
				112,
				174,
				113,
				112,
				175,
				168,
				174,
				168,
				113,
				174,
				137,
				127,
				173,
				127,
				129,
				173,
				129,
				123,
				173,
				123,
				174,
				173,
				125,
				175,
				123,
				175,
				174,
				123,
				147,
				172,
				144,
				138,
				114,
				144,
				138,
				144,
				172,
				128,
				127,
				172,
				127,
				138,
				172,
				39,
				51,
				48,
				89,
				92,
				90,
				57,
				176,
				49,
				176,
				171,
				49,
				177,
				97,
				74,
				97,
				75,
				74,
				170,
				0,
				3,
				3,
				13,
				170,
				7,
				0,
				170,
				170,
				9,
				7,
				9,
				169,
				21,
				24,
				21,
				169,
				169,
				71,
				24,
				178,
				44,
				50,
				44,
				48,
				50,
				179,
				178,
				171,
				178,
				50,
				171,
				178,
				180,
				44,
				180,
				45,
				44,
				180,
				178,
				181,
				178,
				179,
				181,
				181,
				179,
				182,
				179,
				183,
				182,
				71,
				169,
				73,
				13,
				73,
				169,
				169,
				170,
				13,
				179,
				171,
				183,
				171,
				176,
				183,
				184,
				2,
				1,
				2,
				184,
				185,
				186,
				6,
				5,
				6,
				186,
				187,
				188,
				187,
				186,
				187,
				188,
				189,
				185,
				10,
				2,
				10,
				185,
				190,
				185,
				191,
				190,
				191,
				185,
				192,
				10,
				193,
				14,
				193,
				10,
				190,
				190,
				194,
				193,
				194,
				190,
				191,
				195,
				14,
				193,
				14,
				195,
				18,
				196,
				18,
				195,
				18,
				196,
				20,
				194,
				195,
				193,
				195,
				194,
				196,
				6,
				184,
				1,
				184,
				6,
				187,
				197,
				189,
				188,
				198,
				197,
				188,
				199,
				197,
				198,
				197,
				199,
				200,
				201,
				202,
				203,
				202,
				201,
				204,
				205,
				203,
				206,
				203,
				205,
				201,
				204,
				207,
				208,
				207,
				204,
				201,
				201,
				209,
				207,
				209,
				201,
				205,
				210,
				203,
				202,
				203,
				210,
				211,
				211,
				206,
				203,
				206,
				211,
				212,
				213,
				211,
				210,
				211,
				213,
				214,
				214,
				212,
				211,
				212,
				214,
				215,
				216,
				217,
				218,
				217,
				219,
				218,
				220,
				221,
				45,
				221,
				47,
				45,
				220,
				222,
				221,
				223,
				224,
				225,
				224,
				222,
				225,
				216,
				226,
				217,
				226,
				227,
				217,
				228,
				218,
				229,
				218,
				219,
				229,
				230,
				228,
				223,
				230,
				223,
				231,
				232,
				233,
				234,
				233,
				218,
				234,
				218,
				230,
				234,
				233,
				235,
				216,
				235,
				226,
				216,
				233,
				216,
				218,
				230,
				218,
				228,
				232,
				236,
				233,
				236,
				235,
				233,
				228,
				229,
				223,
				229,
				224,
				223,
				235,
				63,
				226,
				63,
				64,
				226,
				236,
				65,
				235,
				65,
				63,
				235,
				224,
				212,
				215,
				212,
				224,
				229,
				219,
				212,
				229,
				212,
				219,
				206,
				217,
				206,
				219,
				206,
				217,
				205,
				205,
				237,
				209,
				237,
				205,
				217,
				238,
				237,
				227,
				227,
				237,
				217,
				64,
				239,
				226,
				64,
				69,
				239,
				240,
				209,
				237,
				209,
				240,
				241,
				238,
				240,
				237,
				240,
				238,
				196,
				20,
				238,
				72,
				238,
				20,
				196,
				241,
				207,
				209,
				207,
				241,
				200,
				200,
				208,
				207,
				208,
				200,
				199,
				240,
				194,
				191,
				194,
				240,
				196,
				242,
				241,
				240,
				74,
				47,
				243,
				47,
				221,
				243,
				69,
				72,
				239,
				244,
				213,
				245,
				213,
				244,
				214,
				245,
				246,
				247,
				246,
				245,
				213,
				248,
				246,
				249,
				246,
				248,
				247,
				250,
				251,
				252,
				251,
				250,
				253,
				254,
				253,
				250,
				253,
				254,
				255,
				256,
				257,
				258,
				257,
				256,
				259,
				249,
				260,
				248,
				261,
				252,
				251,
				252,
				261,
				262,
				261,
				263,
				262,
				263,
				261,
				264,
				221,
				222,
				215,
				191,
				192,
				242,
				240,
				191,
				242,
				226,
				239,
				227,
				214,
				265,
				243,
				265,
				214,
				244,
				266,
				267,
				268,
				267,
				266,
				269,
				270,
				271,
				272,
				271,
				270,
				273,
				274,
				270,
				272,
				270,
				274,
				275,
				276,
				277,
				278,
				277,
				276,
				279,
				279,
				280,
				277,
				280,
				279,
				281,
				261,
				251,
				282,
				283,
				269,
				266,
				269,
				283,
				284,
				272,
				285,
				286,
				285,
				272,
				271,
				287,
				272,
				286,
				272,
				287,
				274,
				288,
				276,
				289,
				276,
				288,
				279,
				283,
				290,
				284,
				291,
				292,
				293,
				292,
				294,
				293,
				295,
				296,
				297,
				296,
				298,
				297,
				269,
				273,
				267,
				273,
				269,
				271,
				284,
				271,
				269,
				271,
				284,
				285,
				278,
				274,
				276,
				274,
				278,
				275,
				276,
				287,
				289,
				287,
				276,
				274,
				293,
				294,
				266,
				294,
				283,
				266,
				291,
				293,
				296,
				293,
				298,
				296,
				267,
				299,
				268,
				299,
				267,
				300,
				270,
				188,
				273,
				188,
				270,
				198,
				275,
				198,
				270,
				198,
				275,
				301,
				277,
				302,
				278,
				302,
				277,
				303,
				280,
				303,
				277,
				303,
				280,
				304,
				293,
				266,
				298,
				266,
				268,
				298,
				295,
				305,
				306,
				305,
				282,
				306,
				273,
				300,
				267,
				300,
				273,
				188,
				278,
				301,
				275,
				301,
				278,
				302,
				307,
				188,
				186,
				188,
				307,
				300,
				308,
				300,
				307,
				300,
				308,
				299,
				306,
				282,
				304,
				282,
				309,
				304,
				309,
				282,
				251,
				142,
				186,
				5,
				186,
				142,
				307,
				143,
				307,
				142,
				307,
				143,
				308,
				310,
				311,
				312,
				311,
				310,
				313,
				282,
				312,
				261,
				312,
				282,
				310,
				313,
				148,
				311,
				148,
				313,
				149,
				314,
				312,
				311,
				312,
				314,
				315,
				315,
				261,
				312,
				261,
				315,
				264,
				148,
				314,
				311,
				314,
				148,
				152,
				316,
				315,
				317,
				264,
				315,
				316,
				155,
				314,
				152,
				314,
				155,
				318,
				304,
				319,
				303,
				319,
				304,
				309,
				320,
				303,
				319,
				303,
				320,
				302,
				321,
				302,
				320,
				302,
				321,
				301,
				199,
				301,
				321,
				301,
				199,
				198,
				321,
				208,
				199,
				208,
				321,
				322,
				323,
				202,
				204,
				202,
				323,
				324,
				322,
				204,
				208,
				204,
				322,
				323,
				324,
				210,
				202,
				210,
				324,
				325,
				210,
				246,
				213,
				246,
				210,
				325,
				320,
				322,
				321,
				322,
				320,
				326,
				327,
				324,
				323,
				324,
				327,
				328,
				326,
				323,
				322,
				323,
				326,
				327,
				328,
				325,
				324,
				325,
				328,
				329,
				325,
				249,
				246,
				249,
				325,
				329,
				319,
				326,
				320,
				326,
				319,
				253,
				255,
				328,
				327,
				328,
				255,
				256,
				253,
				327,
				326,
				327,
				253,
				255,
				256,
				329,
				328,
				329,
				256,
				258,
				329,
				260,
				249,
				260,
				329,
				258,
				309,
				253,
				319,
				253,
				309,
				251,
				281,
				288,
				330,
				288,
				281,
				279,
				331,
				332,
				189,
				255,
				259,
				256,
				259,
				255,
				254,
				314,
				317,
				315,
				317,
				314,
				318,
				264,
				316,
				263,
				225,
				333,
				223,
				214,
				221,
				215,
				221,
				214,
				243,
				238,
				227,
				239,
				239,
				72,
				238,
				290,
				285,
				284,
				313,
				143,
				149,
				143,
				313,
				308,
				313,
				334,
				308,
				299,
				308,
				297,
				308,
				334,
				297,
				297,
				298,
				299,
				298,
				268,
				299,
				304,
				280,
				306,
				280,
				335,
				306,
				335,
				280,
				336,
				280,
				281,
				336,
				337,
				336,
				330,
				336,
				281,
				330,
				306,
				335,
				295,
				335,
				296,
				295,
				296,
				335,
				291,
				335,
				336,
				291,
				292,
				291,
				337,
				291,
				336,
				337,
				313,
				310,
				334,
				305,
				310,
				282,
				305,
				334,
				310,
				297,
				334,
				295,
				334,
				305,
				295,
				215,
				222,
				224,
				258,
				257,
				260,
				231,
				223,
				338,
				223,
				333,
				338,
				177,
				74,
				265,
				74,
				243,
				265,
				332,
				185,
				184,
				185,
				332,
				192,
				187,
				332,
				184,
				332,
				187,
				189,
				189,
				197,
				331,
				200,
				331,
				197,
				331,
				200,
				241,
				339,
				225,
				220,
				225,
				222,
				220,
				340,
				333,
				339,
				333,
				225,
				339,
				339,
				220,
				180,
				220,
				45,
				180,
				180,
				181,
				339,
				181,
				340,
				339,
				181,
				182,
				340,
				182,
				341,
				340,
				241,
				242,
				331,
				192,
				331,
				242,
				331,
				192,
				332,
				340,
				341,
				333,
				341,
				338,
				333
			],
			"featurePoint": [
				250,
				259,
				260,
				248,
				245,
				244,
				265,
				177,
				97,
				76,
				77,
				80,
				92,
				91,
				82,
				141,
				114,
				172,
				140,
				309,
				282,
				334,
				308,
				288,
				292,
				290,
				287,
				-1,
				120,
				125,
				122,
				119,
				-1,
				5,
				189,
				331,
				240,
				20,
				70,
				169,
				9,
				6,
				193,
				15,
				230,
				227,
				239,
				69,
				68,
				53,
				56,
				48,
				44,
				45,
				220,
				222,
				341,
				182,
				183,
				62,
				65,
				236,
				2,
				337,
				294,
				286,
				289,
				175,
				126,
				117,
				121,
				83,
				95,
				153,
				156,
				155,
				318,
				316,
				263,
				252
			],
			"weight": [
				[
					[
						62,
						184
					],
					[
						41,
						158.7
					],
					[
						40,
						43.28
					],
					[
						39,
						31.58
					]
				],
				[
					[
						62,
						306.8
					],
					[
						41,
						157.2
					],
					[
						33,
						1.602
					]
				],
				[
					[
						62,
						1
					]
				],
				[
					[
						62,
						558.3
					],
					[
						43,
						150.3
					],
					[
						41,
						56.34
					],
					[
						37,
						34.13
					]
				],
				[
					[
						33,
						650.3
					],
					[
						41,
						82.11
					],
					[
						40,
						28.89
					],
					[
						18,
						25.76
					]
				],
				[
					[
						33,
						1
					]
				],
				[
					[
						41,
						1
					]
				],
				[
					[
						41,
						464.3
					],
					[
						40,
						160.7
					],
					[
						39,
						15.67
					],
					[
						43,
						9.369
					]
				],
				[
					[
						40,
						119.6
					],
					[
						33,
						84.5
					],
					[
						30,
						51.05
					],
					[
						41,
						42.7
					]
				],
				[
					[
						40,
						1
					]
				],
				[
					[
						62,
						397.1
					],
					[
						43,
						322.4
					],
					[
						42,
						322.4
					],
					[
						37,
						82.91
					]
				],
				[
					[
						43,
						756.6
					],
					[
						62,
						115.9
					],
					[
						41,
						17.22
					],
					[
						40,
						7.316
					]
				],
				[
					[
						38,
						118.9
					],
					[
						43,
						99.01
					],
					[
						39,
						53
					],
					[
						37,
						41.37
					]
				],
				[
					[
						39,
						119.9
					],
					[
						40,
						82.75
					],
					[
						38,
						64.52
					],
					[
						43,
						42.93
					]
				],
				[
					[
						43,
						663.5
					],
					[
						42,
						663.5
					],
					[
						37,
						139.9
					],
					[
						62,
						54.53
					]
				],
				[
					[
						43,
						1
					]
				],
				[
					[
						43,
						246.7
					],
					[
						38,
						143.8
					],
					[
						37,
						115.5
					],
					[
						39,
						57.39
					]
				],
				[
					[
						43,
						839.8
					],
					[
						37,
						453
					],
					[
						42,
						223.5
					],
					[
						47,
						49.15
					]
				],
				[
					[
						37,
						963.4
					],
					[
						43,
						319.5
					],
					[
						42,
						319.5
					]
				],
				[
					[
						37,
						905.4
					],
					[
						43,
						143.9
					],
					[
						48,
						63.22
					],
					[
						38,
						52.32
					]
				],
				[
					[
						37,
						1
					]
				],
				[
					[
						40,
						332.5
					],
					[
						39,
						186.3
					],
					[
						38,
						59.87
					],
					[
						69,
						25.53
					]
				],
				[
					[
						69,
						82.83
					],
					[
						31,
						55.49
					],
					[
						40,
						50.15
					],
					[
						39,
						38.18
					]
				],
				[
					[
						39,
						50.42
					],
					[
						31,
						24.74
					],
					[
						69,
						19.57
					],
					[
						70,
						16.07
					]
				],
				[
					[
						39,
						338.8
					],
					[
						31,
						11.48
					],
					[
						69,
						9.669
					],
					[
						50,
						9.557
					]
				],
				[
					[
						38,
						45.31
					],
					[
						50,
						23.02
					],
					[
						49,
						22.26
					],
					[
						59,
						13.52
					]
				],
				[
					[
						50,
						46.54
					],
					[
						38,
						24.03
					],
					[
						39,
						18.3
					],
					[
						10,
						12.92
					]
				],
				[
					[
						10,
						20.79
					],
					[
						50,
						14.45
					],
					[
						38,
						12.65
					],
					[
						11,
						11.65
					]
				],
				[
					[
						38,
						17.02
					],
					[
						39,
						16.53
					],
					[
						10,
						10.43
					],
					[
						50,
						8.891
					]
				],
				[
					[
						38,
						70.14
					],
					[
						50,
						57.22
					],
					[
						49,
						54.62
					],
					[
						59,
						28.42
					]
				],
				[
					[
						50,
						167.3
					],
					[
						38,
						34.34
					],
					[
						39,
						24.79
					],
					[
						40,
						9.057
					]
				],
				[
					[
						39,
						36.03
					],
					[
						31,
						13.92
					],
					[
						70,
						10.73
					],
					[
						69,
						10.72
					]
				],
				[
					[
						38,
						84.13
					],
					[
						39,
						79.85
					],
					[
						50,
						14.01
					],
					[
						31,
						6.565
					]
				],
				[
					[
						38,
						280.5
					],
					[
						49,
						54.27
					],
					[
						50,
						25.83
					],
					[
						59,
						20.83
					]
				],
				[
					[
						10,
						39.47
					],
					[
						11,
						19.77
					],
					[
						50,
						17.42
					],
					[
						51,
						10.38
					]
				],
				[
					[
						50,
						61.07
					],
					[
						9,
						21.18
					],
					[
						10,
						18.19
					],
					[
						39,
						9.052
					]
				],
				[
					[
						50,
						324.2
					],
					[
						9,
						18.34
					],
					[
						10,
						5.692
					]
				],
				[
					[
						10,
						163.2
					],
					[
						11,
						25.02
					],
					[
						50,
						12.97
					],
					[
						51,
						9.276
					]
				],
				[
					[
						9,
						86.53
					],
					[
						50,
						47.84
					],
					[
						51,
						47.4
					],
					[
						52,
						23.34
					]
				],
				[
					[
						50,
						149.3
					],
					[
						51,
						146.6
					],
					[
						52,
						37.78
					],
					[
						9,
						18.13
					]
				],
				[
					[
						50,
						309.1
					],
					[
						59,
						114.6
					],
					[
						49,
						84.69
					],
					[
						48,
						41.75
					]
				],
				[
					[
						50,
						3879
					],
					[
						59,
						67.81
					],
					[
						51,
						62.42
					],
					[
						49,
						44.95
					]
				],
				[
					[
						50,
						210.3
					],
					[
						49,
						194.2
					],
					[
						59,
						71.46
					],
					[
						48,
						57.96
					]
				],
				[
					[
						50,
						633.5
					],
					[
						49,
						74.08
					],
					[
						59,
						58.39
					],
					[
						48,
						33.95
					]
				],
				[
					[
						52,
						1
					]
				],
				[
					[
						53,
						1
					]
				],
				[
					[
						52,
						439.2
					],
					[
						51,
						182.1
					],
					[
						8,
						39.39
					]
				],
				[
					[
						53,
						676.6
					],
					[
						54,
						40.88
					],
					[
						52,
						40.88
					],
					[
						7,
						25.87
					]
				],
				[
					[
						51,
						1
					]
				],
				[
					[
						50,
						7868
					],
					[
						51,
						61.81
					],
					[
						58,
						18.79
					]
				],
				[
					[
						51,
						1491
					],
					[
						52,
						262.1
					],
					[
						58,
						251.6
					],
					[
						50,
						225.1
					]
				],
				[
					[
						50,
						571.2
					],
					[
						51,
						268.9
					],
					[
						52,
						57
					],
					[
						58,
						49.27
					]
				],
				[
					[
						49,
						1559
					],
					[
						59,
						563.6
					],
					[
						48,
						562
					],
					[
						47,
						133.5
					]
				],
				[
					[
						49,
						1
					]
				],
				[
					[
						50,
						6770
					],
					[
						9,
						5.253
					]
				],
				[
					[
						50,
						1286
					],
					[
						9,
						12.43
					],
					[
						10,
						3.562
					]
				],
				[
					[
						50,
						1
					]
				],
				[
					[
						50,
						5075
					],
					[
						51,
						120.3
					],
					[
						58,
						102.4
					],
					[
						52,
						59.33
					]
				],
				[
					[
						50,
						490.1
					],
					[
						59,
						157.5
					],
					[
						49,
						22.03
					],
					[
						51,
						16.1
					]
				],
				[
					[
						50,
						4739
					],
					[
						59,
						85.73
					],
					[
						51,
						72.66
					],
					[
						58,
						50.68
					]
				],
				[
					[
						50,
						377.1
					],
					[
						59,
						143.3
					],
					[
						49,
						39.4
					],
					[
						48,
						10.79
					]
				],
				[
					[
						59,
						1794
					],
					[
						49,
						476.4
					],
					[
						48,
						228.4
					],
					[
						47,
						51.81
					]
				],
				[
					[
						59,
						1
					]
				],
				[
					[
						60,
						1845
					],
					[
						47,
						808.2
					],
					[
						48,
						204.3
					],
					[
						46,
						204.3
					]
				],
				[
					[
						47,
						2584
					],
					[
						60,
						696.3
					],
					[
						61,
						82.94
					],
					[
						59,
						82.94
					]
				],
				[
					[
						60,
						1
					]
				],
				[
					[
						38,
						426
					],
					[
						49,
						95.26
					],
					[
						48,
						31.66
					],
					[
						50,
						27.31
					]
				],
				[
					[
						48,
						358.3
					],
					[
						49,
						237.6
					],
					[
						37,
						234.6
					],
					[
						38,
						112.6
					]
				],
				[
					[
						48,
						1
					]
				],
				[
					[
						47,
						1
					]
				],
				[
					[
						38,
						1
					]
				],
				[
					[
						38,
						851
					],
					[
						39,
						697.8
					],
					[
						40,
						49.17
					],
					[
						69,
						8.808
					]
				],
				[
					[
						37,
						784.5
					],
					[
						47,
						422
					],
					[
						46,
						305.5
					],
					[
						48,
						305.5
					]
				],
				[
					[
						39,
						1386
					],
					[
						38,
						1333
					],
					[
						37,
						16.79
					],
					[
						43,
						14.61
					]
				],
				[
					[
						7,
						140.1
					],
					[
						53,
						119
					],
					[
						8,
						42.85
					],
					[
						6,
						42.85
					]
				],
				[
					[
						8,
						169
					],
					[
						52,
						98.02
					],
					[
						51,
						62.52
					],
					[
						58,
						35.21
					]
				],
				[
					[
						9,
						1
					]
				],
				[
					[
						10,
						1
					]
				],
				[
					[
						10,
						147.6
					],
					[
						11,
						62.76
					],
					[
						12,
						0.07065
					]
				],
				[
					[
						10,
						76.51
					],
					[
						11,
						67.21
					],
					[
						12,
						14.61
					],
					[
						50,
						8.035
					]
				],
				[
					[
						11,
						1
					]
				],
				[
					[
						11,
						226.6
					],
					[
						12,
						38.44
					],
					[
						10,
						18.73
					],
					[
						13,
						5.036
					]
				],
				[
					[
						14,
						1
					]
				],
				[
					[
						71,
						1
					]
				],
				[
					[
						15,
						57.47
					],
					[
						71,
						13.05
					],
					[
						14,
						7.937
					],
					[
						72,
						2.027
					]
				],
				[
					[
						14,
						22.24
					],
					[
						13,
						17.59
					],
					[
						15,
						16.86
					],
					[
						28,
						16.13
					]
				],
				[
					[
						13,
						184
					],
					[
						14,
						116.3
					],
					[
						71,
						5.152
					]
				],
				[
					[
						13,
						42.82
					],
					[
						12,
						24.23
					],
					[
						15,
						7.239
					],
					[
						28,
						6.94
					]
				],
				[
					[
						12,
						56.21
					],
					[
						13,
						49.02
					],
					[
						14,
						8.312
					],
					[
						15,
						3.74
					]
				],
				[
					[
						12,
						154.6
					],
					[
						13,
						32.12
					],
					[
						14,
						6.246
					],
					[
						71,
						2.37
					]
				],
				[
					[
						13,
						151.3
					],
					[
						12,
						75.93
					]
				],
				[
					[
						13,
						1
					]
				],
				[
					[
						12,
						1
					]
				],
				[
					[
						72,
						26.93
					],
					[
						73,
						17.26
					],
					[
						16,
						12.87
					],
					[
						15,
						11.61
					]
				],
				[
					[
						72,
						67.56
					],
					[
						71,
						56.41
					],
					[
						14,
						7.653
					]
				],
				[
					[
						72,
						1
					]
				],
				[
					[
						73,
						119
					],
					[
						72,
						43.72
					],
					[
						74,
						5.3
					],
					[
						16,
						4.685
					]
				],
				[
					[
						8,
						1
					]
				],
				[
					[
						30,
						672.2
					],
					[
						68,
						442.2
					],
					[
						29,
						83.68
					],
					[
						67,
						22.39
					]
				],
				[
					[
						30,
						177.5
					],
					[
						68,
						139.3
					],
					[
						29,
						43.6
					],
					[
						18,
						36.5
					]
				],
				[
					[
						30,
						233.4
					],
					[
						18,
						23.35
					],
					[
						33,
						20.86
					],
					[
						40,
						12.55
					]
				],
				[
					[
						30,
						738.8
					],
					[
						18,
						14.14
					],
					[
						40,
						13.62
					],
					[
						33,
						12.56
					]
				],
				[
					[
						69,
						343.5
					],
					[
						31,
						169.1
					],
					[
						40,
						23.89
					],
					[
						39,
						19.26
					]
				],
				[
					[
						69,
						1481
					],
					[
						31,
						414.5
					],
					[
						40,
						17.28
					],
					[
						39,
						14.16
					]
				],
				[
					[
						30,
						628.6
					],
					[
						69,
						242.5
					],
					[
						31,
						82.59
					],
					[
						40,
						17.77
					]
				],
				[
					[
						30,
						205.6
					],
					[
						69,
						109.9
					],
					[
						40,
						29.63
					],
					[
						33,
						22.63
					]
				],
				[
					[
						31,
						1568
					],
					[
						40,
						15.04
					],
					[
						39,
						12.71
					],
					[
						38,
						8.022
					]
				],
				[
					[
						31,
						365.1
					],
					[
						40,
						18.58
					],
					[
						39,
						15.35
					],
					[
						38,
						9.125
					]
				],
				[
					[
						70,
						2769
					],
					[
						40,
						8.129
					],
					[
						39,
						6.942
					],
					[
						38,
						4.922
					]
				],
				[
					[
						70,
						525.1
					],
					[
						40,
						8.493
					],
					[
						39,
						7.091
					],
					[
						38,
						5.1
					]
				],
				[
					[
						28,
						730.1
					],
					[
						15,
						30.19
					],
					[
						14,
						1.626
					],
					[
						13,
						1.051
					]
				],
				[
					[
						28,
						4001
					],
					[
						15,
						36.53
					],
					[
						14,
						1.09
					],
					[
						13,
						0.6092
					]
				],
				[
					[
						28,
						503.6
					],
					[
						67,
						157.3
					],
					[
						15,
						45.13
					],
					[
						29,
						28.51
					]
				],
				[
					[
						28,
						1364
					],
					[
						67,
						290.9
					],
					[
						29,
						62.2
					],
					[
						15,
						40.86
					]
				],
				[
					[
						16,
						1
					]
				],
				[
					[
						30,
						2227
					],
					[
						68,
						636
					],
					[
						69,
						126.5
					],
					[
						29,
						76.08
					]
				],
				[
					[
						30,
						3716
					],
					[
						40,
						11.69
					],
					[
						18,
						10.11
					],
					[
						33,
						8.918
					]
				],
				[
					[
						69,
						1
					]
				],
				[
					[
						30,
						4170
					],
					[
						69,
						468.2
					]
				],
				[
					[
						31,
						1
					]
				],
				[
					[
						28,
						1
					]
				],
				[
					[
						70,
						1
					]
				],
				[
					[
						30,
						1
					]
				],
				[
					[
						29,
						5556
					],
					[
						16,
						27.28
					],
					[
						17,
						25.24
					],
					[
						15,
						13.55
					]
				],
				[
					[
						68,
						6332
					],
					[
						29,
						391.4
					],
					[
						17,
						31.42
					],
					[
						18,
						18.21
					]
				],
				[
					[
						29,
						1
					]
				],
				[
					[
						68,
						1
					]
				],
				[
					[
						29,
						89.62
					],
					[
						17,
						68.01
					],
					[
						16,
						30.75
					]
				],
				[
					[
						17,
						164.9
					],
					[
						68,
						109.1
					],
					[
						29,
						76.72
					],
					[
						18,
						61.91
					]
				],
				[
					[
						29,
						717.5
					],
					[
						17,
						12.05
					],
					[
						16,
						3.677
					]
				],
				[
					[
						68,
						660.1
					],
					[
						29,
						142.7
					],
					[
						17,
						24.57
					],
					[
						18,
						5.212
					]
				],
				[
					[
						18,
						144
					],
					[
						68,
						60.64
					],
					[
						30,
						59.33
					],
					[
						17,
						37.54
					]
				],
				[
					[
						30,
						65.13
					],
					[
						33,
						44.86
					],
					[
						18,
						44.37
					],
					[
						40,
						23.44
					]
				],
				[
					[
						31,
						107.9
					],
					[
						70,
						57.8
					],
					[
						40,
						19.31
					],
					[
						39,
						17.72
					]
				],
				[
					[
						70,
						142.7
					],
					[
						28,
						65.78
					],
					[
						39,
						7.242
					],
					[
						38,
						5.246
					]
				],
				[
					[
						28,
						193.4
					],
					[
						15,
						25.33
					],
					[
						14,
						2.735
					],
					[
						13,
						1.962
					]
				],
				[
					[
						15,
						210.7
					],
					[
						28,
						139.8
					],
					[
						16,
						88.22
					],
					[
						67,
						77.02
					]
				],
				[
					[
						16,
						268.6
					],
					[
						67,
						153.2
					],
					[
						29,
						64.58
					],
					[
						28,
						55.78
					]
				],
				[
					[
						16,
						136.1
					],
					[
						17,
						131.1
					],
					[
						29,
						14.51
					],
					[
						18,
						3.31
					]
				],
				[
					[
						33,
						152
					],
					[
						18,
						68.23
					],
					[
						30,
						33.93
					],
					[
						22,
						24.29
					]
				],
				[
					[
						18,
						1
					]
				],
				[
					[
						15,
						1
					]
				],
				[
					[
						33,
						504.1
					],
					[
						18,
						39.57
					],
					[
						22,
						39.57
					],
					[
						25,
						22.53
					]
				],
				[
					[
						22,
						158.2
					],
					[
						18,
						158.2
					],
					[
						33,
						14.28
					],
					[
						21,
						3.068
					]
				],
				[
					[
						16,
						100.5
					],
					[
						17,
						92.21
					],
					[
						18,
						17.43
					],
					[
						22,
						4.217
					]
				],
				[
					[
						16,
						41.75
					],
					[
						17,
						26.85
					],
					[
						18,
						7.102
					],
					[
						74,
						3.922
					]
				],
				[
					[
						17,
						29.13
					],
					[
						18,
						21.46
					],
					[
						74,
						7.012
					],
					[
						22,
						6.236
					]
				],
				[
					[
						17,
						136.9
					],
					[
						18,
						80.51
					],
					[
						22,
						15.72
					],
					[
						33,
						6.78
					]
				],
				[
					[
						21,
						16.03
					],
					[
						17,
						16.03
					],
					[
						18,
						12.68
					],
					[
						22,
						12.68
					]
				],
				[
					[
						18,
						34.77
					],
					[
						22,
						34.77
					],
					[
						21,
						21.71
					],
					[
						20,
						5.359
					]
				],
				[
					[
						74,
						32.09
					],
					[
						75,
						20.99
					],
					[
						17,
						5.49
					],
					[
						16,
						4.379
					]
				],
				[
					[
						73,
						19.22
					],
					[
						74,
						9.23
					],
					[
						16,
						8.482
					],
					[
						17,
						6.315
					]
				],
				[
					[
						75,
						35.74
					],
					[
						21,
						3.239
					],
					[
						17,
						3.239
					],
					[
						22,
						2.448
					]
				],
				[
					[
						73,
						1
					]
				],
				[
					[
						73,
						50.21
					],
					[
						74,
						46.26
					],
					[
						75,
						4.941
					]
				],
				[
					[
						75,
						1
					]
				],
				[
					[
						74,
						1
					]
				],
				[
					[
						28,
						65.42
					],
					[
						15,
						33.66
					],
					[
						14,
						5.02
					],
					[
						13,
						3.811
					]
				],
				[
					[
						70,
						45.03
					],
					[
						28,
						26.91
					],
					[
						39,
						8.098
					],
					[
						38,
						5.866
					]
				],
				[
					[
						31,
						34.1
					],
					[
						70,
						24.58
					],
					[
						39,
						23.63
					],
					[
						38,
						16.51
					]
				],
				[
					[
						39,
						19.17
					],
					[
						31,
						16.51
					],
					[
						70,
						13.38
					],
					[
						69,
						10.75
					]
				],
				[
					[
						38,
						10.55
					],
					[
						39,
						10.29
					],
					[
						10,
						9.715
					],
					[
						11,
						9.151
					]
				],
				[
					[
						11,
						15.44
					],
					[
						10,
						15.18
					],
					[
						50,
						7.824
					],
					[
						38,
						6.846
					]
				],
				[
					[
						11,
						28.35
					],
					[
						10,
						25.74
					],
					[
						50,
						9.188
					],
					[
						9,
						6.444
					]
				],
				[
					[
						70,
						20.92
					],
					[
						28,
						13.79
					],
					[
						39,
						6.789
					],
					[
						11,
						6.495
					]
				],
				[
					[
						11,
						12.92
					],
					[
						70,
						10.27
					],
					[
						12,
						8.98
					],
					[
						28,
						7.119
					]
				],
				[
					[
						11,
						24.98
					],
					[
						12,
						16.47
					],
					[
						13,
						8.03
					],
					[
						70,
						5.781
					]
				],
				[
					[
						11,
						50.4
					],
					[
						12,
						30.11
					],
					[
						13,
						7.763
					],
					[
						70,
						3.504
					]
				],
				[
					[
						28,
						1804
					],
					[
						67,
						575.3
					],
					[
						70,
						147.7
					],
					[
						29,
						76.77
					]
				],
				[
					[
						39,
						1
					]
				],
				[
					[
						40,
						245.5
					],
					[
						39,
						138.6
					],
					[
						38,
						38.05
					],
					[
						62,
						29.68
					]
				],
				[
					[
						51,
						636.9
					],
					[
						58,
						412.8
					],
					[
						50,
						266.2
					],
					[
						57,
						65.76
					]
				],
				[
					[
						17,
						1
					]
				],
				[
					[
						67,
						1119
					],
					[
						16,
						40.29
					],
					[
						15,
						0.9378
					]
				],
				[
					[
						67,
						6126
					],
					[
						29,
						229.4
					],
					[
						16,
						51.4
					],
					[
						15,
						26.51
					]
				],
				[
					[
						67,
						1
					]
				],
				[
					[
						58,
						376.9
					],
					[
						51,
						369.4
					],
					[
						50,
						283.7
					],
					[
						59,
						22.58
					]
				],
				[
					[
						7,
						1
					]
				],
				[
					[
						52,
						1581
					],
					[
						58,
						819.2
					],
					[
						57,
						117.5
					],
					[
						53,
						85.94
					]
				],
				[
					[
						58,
						4593
					],
					[
						52,
						360.4
					],
					[
						57,
						86.44
					],
					[
						51,
						3.833
					]
				],
				[
					[
						53,
						1257
					],
					[
						57,
						673.3
					],
					[
						58,
						77.87
					],
					[
						56,
						77.87
					]
				],
				[
					[
						57,
						4507
					],
					[
						53,
						312.9
					],
					[
						54,
						41.17
					],
					[
						52,
						41.17
					]
				],
				[
					[
						57,
						1
					]
				],
				[
					[
						58,
						1
					]
				],
				[
					[
						62,
						184
					],
					[
						41,
						158.7
					],
					[
						34,
						43.28
					],
					[
						35,
						31.58
					]
				],
				[
					[
						62,
						558.3
					],
					[
						42,
						150.3
					],
					[
						41,
						56.34
					],
					[
						37,
						34.13
					]
				],
				[
					[
						33,
						650.3
					],
					[
						41,
						82.11
					],
					[
						34,
						28.89
					],
					[
						22,
						25.76
					]
				],
				[
					[
						41,
						464.3
					],
					[
						34,
						160.7
					],
					[
						35,
						15.67
					],
					[
						42,
						9.369
					]
				],
				[
					[
						34,
						119.6
					],
					[
						33,
						84.5
					],
					[
						25,
						51.05
					],
					[
						41,
						42.7
					]
				],
				[
					[
						34,
						1
					]
				],
				[
					[
						42,
						756.6
					],
					[
						62,
						115.9
					],
					[
						41,
						17.22
					],
					[
						34,
						7.316
					]
				],
				[
					[
						36,
						118.9
					],
					[
						42,
						99.01
					],
					[
						35,
						53
					],
					[
						37,
						41.37
					]
				],
				[
					[
						35,
						119.9
					],
					[
						34,
						82.75
					],
					[
						36,
						64.52
					],
					[
						42,
						42.93
					]
				],
				[
					[
						42,
						1
					]
				],
				[
					[
						42,
						246.7
					],
					[
						36,
						143.8
					],
					[
						37,
						115.5
					],
					[
						35,
						57.39
					]
				],
				[
					[
						42,
						839.8
					],
					[
						37,
						453
					],
					[
						43,
						223.5
					],
					[
						47,
						49.15
					]
				],
				[
					[
						37,
						905.4
					],
					[
						42,
						143.9
					],
					[
						46,
						63.22
					],
					[
						36,
						52.32
					]
				],
				[
					[
						34,
						332.5
					],
					[
						35,
						186.3
					],
					[
						36,
						59.87
					],
					[
						65,
						25.53
					]
				],
				[
					[
						65,
						82.83
					],
					[
						26,
						55.49
					],
					[
						34,
						50.15
					],
					[
						35,
						38.18
					]
				],
				[
					[
						35,
						50.42
					],
					[
						26,
						24.74
					],
					[
						65,
						19.57
					],
					[
						66,
						16.07
					]
				],
				[
					[
						35,
						338.8
					],
					[
						26,
						11.48
					],
					[
						65,
						9.669
					],
					[
						44,
						9.557
					]
				],
				[
					[
						36,
						45.31
					],
					[
						44,
						23.02
					],
					[
						45,
						22.26
					],
					[
						61,
						13.52
					]
				],
				[
					[
						4,
						20.79
					],
					[
						44,
						14.45
					],
					[
						36,
						12.65
					],
					[
						3,
						11.65
					]
				],
				[
					[
						44,
						46.54
					],
					[
						36,
						24.03
					],
					[
						35,
						18.3
					],
					[
						4,
						12.92
					]
				],
				[
					[
						36,
						17.02
					],
					[
						35,
						16.53
					],
					[
						4,
						10.43
					],
					[
						44,
						8.891
					]
				],
				[
					[
						36,
						70.14
					],
					[
						44,
						57.22
					],
					[
						45,
						54.62
					],
					[
						61,
						28.42
					]
				],
				[
					[
						44,
						167.3
					],
					[
						36,
						34.34
					],
					[
						35,
						24.79
					],
					[
						34,
						9.057
					]
				],
				[
					[
						36,
						84.13
					],
					[
						35,
						79.85
					],
					[
						44,
						14.01
					],
					[
						26,
						6.565
					]
				],
				[
					[
						35,
						36.03
					],
					[
						26,
						13.92
					],
					[
						66,
						10.73
					],
					[
						65,
						10.72
					]
				],
				[
					[
						36,
						280.5
					],
					[
						45,
						54.27
					],
					[
						44,
						25.83
					],
					[
						61,
						20.83
					]
				],
				[
					[
						4,
						39.47
					],
					[
						3,
						19.77
					],
					[
						44,
						17.42
					],
					[
						55,
						10.38
					]
				],
				[
					[
						44,
						61.07
					],
					[
						5,
						21.18
					],
					[
						4,
						18.19
					],
					[
						35,
						9.052
					]
				],
				[
					[
						44,
						324.2
					],
					[
						5,
						18.34
					],
					[
						4,
						5.692
					]
				],
				[
					[
						4,
						163.2
					],
					[
						3,
						25.02
					],
					[
						44,
						12.97
					],
					[
						55,
						9.276
					]
				],
				[
					[
						5,
						86.53
					],
					[
						44,
						47.84
					],
					[
						55,
						47.4
					],
					[
						54,
						23.34
					]
				],
				[
					[
						44,
						149.3
					],
					[
						55,
						146.6
					],
					[
						54,
						37.78
					],
					[
						5,
						18.13
					]
				],
				[
					[
						44,
						309.1
					],
					[
						61,
						114.6
					],
					[
						45,
						84.69
					],
					[
						46,
						41.75
					]
				],
				[
					[
						44,
						210.3
					],
					[
						45,
						194.2
					],
					[
						61,
						71.46
					],
					[
						46,
						57.96
					]
				],
				[
					[
						44,
						3879
					],
					[
						61,
						67.81
					],
					[
						55,
						62.42
					],
					[
						45,
						44.95
					]
				],
				[
					[
						44,
						633.5
					],
					[
						45,
						74.08
					],
					[
						61,
						58.39
					],
					[
						46,
						33.95
					]
				],
				[
					[
						54,
						1
					]
				],
				[
					[
						54,
						439.2
					],
					[
						55,
						182.1
					],
					[
						6,
						39.39
					]
				],
				[
					[
						55,
						1
					]
				],
				[
					[
						44,
						7868
					],
					[
						55,
						61.81
					],
					[
						56,
						18.79
					]
				],
				[
					[
						44,
						571.2
					],
					[
						55,
						268.9
					],
					[
						54,
						57
					],
					[
						56,
						49.27
					]
				],
				[
					[
						55,
						1491
					],
					[
						54,
						262.1
					],
					[
						56,
						251.6
					],
					[
						44,
						225.1
					]
				],
				[
					[
						45,
						1559
					],
					[
						61,
						563.6
					],
					[
						46,
						562
					],
					[
						47,
						133.5
					]
				],
				[
					[
						45,
						1
					]
				],
				[
					[
						44,
						6770
					],
					[
						5,
						5.253
					]
				],
				[
					[
						44,
						1286
					],
					[
						5,
						12.43
					],
					[
						4,
						3.562
					]
				],
				[
					[
						44,
						1
					]
				],
				[
					[
						44,
						5075
					],
					[
						55,
						120.3
					],
					[
						56,
						102.4
					],
					[
						54,
						59.33
					]
				],
				[
					[
						44,
						490.1
					],
					[
						61,
						157.5
					],
					[
						45,
						22.03
					],
					[
						55,
						16.1
					]
				],
				[
					[
						44,
						377.1
					],
					[
						61,
						143.3
					],
					[
						45,
						39.4
					],
					[
						46,
						10.79
					]
				],
				[
					[
						44,
						4739
					],
					[
						61,
						85.73
					],
					[
						55,
						72.66
					],
					[
						56,
						50.68
					]
				],
				[
					[
						61,
						1794
					],
					[
						45,
						476.4
					],
					[
						46,
						228.4
					],
					[
						47,
						51.81
					]
				],
				[
					[
						61,
						1
					]
				],
				[
					[
						36,
						426
					],
					[
						45,
						95.26
					],
					[
						46,
						31.66
					],
					[
						44,
						27.31
					]
				],
				[
					[
						46,
						358.3
					],
					[
						45,
						237.6
					],
					[
						37,
						234.6
					],
					[
						36,
						112.6
					]
				],
				[
					[
						46,
						1
					]
				],
				[
					[
						36,
						1
					]
				],
				[
					[
						36,
						851
					],
					[
						35,
						697.8
					],
					[
						34,
						49.17
					],
					[
						65,
						8.808
					]
				],
				[
					[
						35,
						1386
					],
					[
						36,
						1333
					],
					[
						37,
						16.79
					],
					[
						42,
						14.61
					]
				],
				[
					[
						6,
						169
					],
					[
						54,
						98.02
					],
					[
						55,
						62.52
					],
					[
						56,
						35.21
					]
				],
				[
					[
						5,
						1
					]
				],
				[
					[
						4,
						1
					]
				],
				[
					[
						4,
						76.51
					],
					[
						3,
						67.21
					],
					[
						2,
						14.61
					],
					[
						44,
						8.035
					]
				],
				[
					[
						4,
						147.6
					],
					[
						3,
						62.76
					],
					[
						2,
						0.07065
					]
				],
				[
					[
						3,
						1
					]
				],
				[
					[
						3,
						226.6
					],
					[
						2,
						38.44
					],
					[
						4,
						18.73
					],
					[
						1,
						5.036
					]
				],
				[
					[
						0,
						1
					]
				],
				[
					[
						19,
						57.47
					],
					[
						79,
						13.05
					],
					[
						0,
						7.937
					],
					[
						78,
						2.027
					]
				],
				[
					[
						79,
						1
					]
				],
				[
					[
						0,
						22.24
					],
					[
						1,
						17.59
					],
					[
						19,
						16.86
					],
					[
						23,
						16.13
					]
				],
				[
					[
						1,
						184
					],
					[
						0,
						116.3
					],
					[
						79,
						5.152
					]
				],
				[
					[
						1,
						42.82
					],
					[
						2,
						24.23
					],
					[
						19,
						7.239
					],
					[
						23,
						6.94
					]
				],
				[
					[
						2,
						56.21
					],
					[
						1,
						49.02
					],
					[
						0,
						8.312
					],
					[
						19,
						3.74
					]
				],
				[
					[
						1,
						151.3
					],
					[
						2,
						75.93
					]
				],
				[
					[
						2,
						154.6
					],
					[
						1,
						32.12
					],
					[
						0,
						6.246
					],
					[
						79,
						2.37
					]
				],
				[
					[
						1,
						1
					]
				],
				[
					[
						2,
						1
					]
				],
				[
					[
						78,
						26.93
					],
					[
						77,
						17.26
					],
					[
						20,
						12.87
					],
					[
						19,
						11.61
					]
				],
				[
					[
						78,
						67.56
					],
					[
						79,
						56.41
					],
					[
						0,
						7.653
					]
				],
				[
					[
						78,
						1
					]
				],
				[
					[
						77,
						119
					],
					[
						78,
						43.72
					],
					[
						76,
						5.3
					],
					[
						20,
						4.685
					]
				],
				[
					[
						6,
						1
					]
				],
				[
					[
						25,
						672.2
					],
					[
						64,
						442.2
					],
					[
						24,
						83.68
					],
					[
						63,
						22.39
					]
				],
				[
					[
						25,
						233.4
					],
					[
						22,
						23.35
					],
					[
						33,
						20.86
					],
					[
						34,
						12.55
					]
				],
				[
					[
						25,
						177.5
					],
					[
						64,
						139.3
					],
					[
						24,
						43.6
					],
					[
						22,
						36.5
					]
				],
				[
					[
						25,
						738.8
					],
					[
						22,
						14.14
					],
					[
						34,
						13.62
					],
					[
						33,
						12.56
					]
				],
				[
					[
						65,
						343.5
					],
					[
						26,
						169.1
					],
					[
						34,
						23.89
					],
					[
						35,
						19.26
					]
				],
				[
					[
						25,
						628.6
					],
					[
						65,
						242.5
					],
					[
						26,
						82.59
					],
					[
						34,
						17.77
					]
				],
				[
					[
						65,
						1481
					],
					[
						26,
						414.5
					],
					[
						34,
						17.28
					],
					[
						35,
						14.16
					]
				],
				[
					[
						25,
						205.6
					],
					[
						65,
						109.9
					],
					[
						34,
						29.63
					],
					[
						33,
						22.63
					]
				],
				[
					[
						26,
						1568
					],
					[
						34,
						15.04
					],
					[
						35,
						12.71
					],
					[
						36,
						8.022
					]
				],
				[
					[
						26,
						365.1
					],
					[
						34,
						18.58
					],
					[
						35,
						15.35
					],
					[
						36,
						9.125
					]
				],
				[
					[
						66,
						2769
					],
					[
						34,
						8.129
					],
					[
						35,
						6.942
					],
					[
						36,
						4.922
					]
				],
				[
					[
						23,
						730.1
					],
					[
						19,
						30.19
					],
					[
						0,
						1.626
					],
					[
						1,
						1.051
					]
				],
				[
					[
						66,
						525.1
					],
					[
						34,
						8.493
					],
					[
						35,
						7.091
					],
					[
						36,
						5.1
					]
				],
				[
					[
						23,
						4001
					],
					[
						19,
						36.53
					],
					[
						0,
						1.09
					],
					[
						1,
						0.6092
					]
				],
				[
					[
						23,
						503.6
					],
					[
						63,
						157.3
					],
					[
						19,
						45.13
					],
					[
						24,
						28.51
					]
				],
				[
					[
						23,
						1364
					],
					[
						63,
						290.9
					],
					[
						24,
						62.2
					],
					[
						19,
						40.86
					]
				],
				[
					[
						20,
						1
					]
				],
				[
					[
						25,
						2227
					],
					[
						64,
						636
					],
					[
						65,
						126.5
					],
					[
						24,
						76.08
					]
				],
				[
					[
						25,
						3716
					],
					[
						34,
						11.69
					],
					[
						22,
						10.11
					],
					[
						33,
						8.918
					]
				],
				[
					[
						25,
						4170
					],
					[
						65,
						468.2
					]
				],
				[
					[
						65,
						1
					]
				],
				[
					[
						26,
						1
					]
				],
				[
					[
						23,
						1
					]
				],
				[
					[
						66,
						1
					]
				],
				[
					[
						25,
						1
					]
				],
				[
					[
						24,
						5556
					],
					[
						20,
						27.28
					],
					[
						21,
						25.24
					],
					[
						19,
						13.55
					]
				],
				[
					[
						24,
						1
					]
				],
				[
					[
						64,
						6332
					],
					[
						24,
						391.4
					],
					[
						21,
						31.42
					],
					[
						22,
						18.21
					]
				],
				[
					[
						64,
						1
					]
				],
				[
					[
						24,
						89.62
					],
					[
						21,
						68.01
					],
					[
						20,
						30.75
					]
				],
				[
					[
						24,
						717.5
					],
					[
						21,
						12.05
					],
					[
						20,
						3.677
					]
				],
				[
					[
						21,
						164.9
					],
					[
						64,
						109.1
					],
					[
						24,
						76.72
					],
					[
						22,
						61.91
					]
				],
				[
					[
						64,
						660.1
					],
					[
						24,
						142.7
					],
					[
						21,
						24.57
					],
					[
						22,
						5.212
					]
				],
				[
					[
						22,
						144
					],
					[
						64,
						60.64
					],
					[
						25,
						59.33
					],
					[
						21,
						37.54
					]
				],
				[
					[
						25,
						65.13
					],
					[
						33,
						44.86
					],
					[
						22,
						44.37
					],
					[
						34,
						23.44
					]
				],
				[
					[
						26,
						107.9
					],
					[
						66,
						57.8
					],
					[
						34,
						19.31
					],
					[
						35,
						17.72
					]
				],
				[
					[
						66,
						142.7
					],
					[
						23,
						65.78
					],
					[
						35,
						7.242
					],
					[
						36,
						5.246
					]
				],
				[
					[
						23,
						193.4
					],
					[
						19,
						25.33
					],
					[
						0,
						2.735
					],
					[
						1,
						1.962
					]
				],
				[
					[
						19,
						210.7
					],
					[
						23,
						139.8
					],
					[
						20,
						88.22
					],
					[
						63,
						77.02
					]
				],
				[
					[
						20,
						136.1
					],
					[
						21,
						131.1
					],
					[
						24,
						14.51
					],
					[
						22,
						3.31
					]
				],
				[
					[
						20,
						268.6
					],
					[
						63,
						153.2
					],
					[
						24,
						64.58
					],
					[
						23,
						55.78
					]
				],
				[
					[
						33,
						152
					],
					[
						22,
						68.23
					],
					[
						25,
						33.93
					],
					[
						18,
						24.29
					]
				],
				[
					[
						22,
						1
					]
				],
				[
					[
						19,
						1
					]
				],
				[
					[
						20,
						100.5
					],
					[
						21,
						92.21
					],
					[
						22,
						17.43
					],
					[
						18,
						4.217
					]
				],
				[
					[
						21,
						29.13
					],
					[
						22,
						21.46
					],
					[
						76,
						7.012
					],
					[
						18,
						6.236
					]
				],
				[
					[
						20,
						41.75
					],
					[
						21,
						26.85
					],
					[
						22,
						7.102
					],
					[
						76,
						3.922
					]
				],
				[
					[
						21,
						136.9
					],
					[
						22,
						80.51
					],
					[
						18,
						15.72
					],
					[
						33,
						6.78
					]
				],
				[
					[
						76,
						32.09
					],
					[
						75,
						20.99
					],
					[
						21,
						5.49
					],
					[
						20,
						4.379
					]
				],
				[
					[
						77,
						19.22
					],
					[
						76,
						9.23
					],
					[
						20,
						8.482
					],
					[
						21,
						6.315
					]
				],
				[
					[
						77,
						1
					]
				],
				[
					[
						77,
						50.21
					],
					[
						76,
						46.26
					],
					[
						75,
						4.941
					]
				],
				[
					[
						76,
						1
					]
				],
				[
					[
						23,
						65.42
					],
					[
						19,
						33.66
					],
					[
						0,
						5.02
					],
					[
						1,
						3.811
					]
				],
				[
					[
						66,
						45.03
					],
					[
						23,
						26.91
					],
					[
						35,
						8.098
					],
					[
						36,
						5.866
					]
				],
				[
					[
						26,
						34.1
					],
					[
						66,
						24.58
					],
					[
						35,
						23.63
					],
					[
						36,
						16.51
					]
				],
				[
					[
						35,
						19.17
					],
					[
						26,
						16.51
					],
					[
						66,
						13.38
					],
					[
						65,
						10.75
					]
				],
				[
					[
						36,
						10.55
					],
					[
						35,
						10.29
					],
					[
						4,
						9.715
					],
					[
						3,
						9.151
					]
				],
				[
					[
						3,
						15.44
					],
					[
						4,
						15.18
					],
					[
						44,
						7.824
					],
					[
						36,
						6.846
					]
				],
				[
					[
						3,
						28.35
					],
					[
						4,
						25.74
					],
					[
						44,
						9.188
					],
					[
						5,
						6.444
					]
				],
				[
					[
						66,
						20.92
					],
					[
						23,
						13.79
					],
					[
						35,
						6.789
					],
					[
						3,
						6.495
					]
				],
				[
					[
						3,
						12.92
					],
					[
						66,
						10.27
					],
					[
						2,
						8.98
					],
					[
						23,
						7.119
					]
				],
				[
					[
						3,
						24.98
					],
					[
						2,
						16.47
					],
					[
						1,
						8.03
					],
					[
						66,
						5.781
					]
				],
				[
					[
						3,
						50.4
					],
					[
						2,
						30.11
					],
					[
						1,
						7.763
					],
					[
						66,
						3.504
					]
				],
				[
					[
						23,
						1804
					],
					[
						63,
						575.3
					],
					[
						66,
						147.7
					],
					[
						24,
						76.77
					]
				],
				[
					[
						35,
						1
					]
				],
				[
					[
						34,
						245.5
					],
					[
						35,
						138.6
					],
					[
						36,
						38.05
					],
					[
						62,
						29.68
					]
				],
				[
					[
						55,
						636.9
					],
					[
						56,
						412.8
					],
					[
						44,
						266.2
					],
					[
						57,
						65.76
					]
				],
				[
					[
						21,
						1
					]
				],
				[
					[
						63,
						1119
					],
					[
						20,
						40.29
					],
					[
						19,
						0.9378
					]
				],
				[
					[
						63,
						6126
					],
					[
						24,
						229.4
					],
					[
						20,
						51.4
					],
					[
						19,
						26.51
					]
				],
				[
					[
						63,
						1
					]
				],
				[
					[
						56,
						376.9
					],
					[
						55,
						369.4
					],
					[
						44,
						283.7
					],
					[
						61,
						22.58
					]
				],
				[
					[
						54,
						1581
					],
					[
						56,
						819.2
					],
					[
						57,
						117.5
					],
					[
						53,
						85.94
					]
				],
				[
					[
						56,
						4593
					],
					[
						54,
						360.4
					],
					[
						57,
						86.44
					],
					[
						55,
						3.833
					]
				],
				[
					[
						56,
						1
					]
				]
			]
		},
		"rightEye": {
			"index": [
				286,
				283,
				294,
				289,
				330,
				288,
				290,
				283,
				285,
				337,
				330,
				289,
				292,
				337,
				287,
				286,
				294,
				287,
				285,
				283,
				286,
				287,
				337,
				289,
				287,
				294,
				292
			]
		},
		"leftEye": {
			"index": [
				119,
				121,
				175,
				119,
				125,
				126,
				117,
				126,
				115,
				121,
				120,
				168,
				122,
				118,
				115,
				175,
				121,
				168,
				125,
				119,
				175,
				117,
				119,
				126,
				118,
				117,
				115
			]
		},
		"mouth": {
			"index": []
		}
	};

/***/ },
/* 17 */
/*!**************************************!*\
  !*** ./~/raw-loader!./src/face.vert ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = "varying vec2 vUv;\n\nuniform float morphTargetInfluences[11];\n\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\nattribute vec3 morphTarget8;\nattribute vec3 morphTarget9;\nattribute vec3 morphTarget10;\n\nvoid main() {\n  vUv = uv;\n\n  vec3 transformed = position;\n  transformed += (morphTarget0 - position) * morphTargetInfluences[0];\n  transformed += (morphTarget1 - position) * morphTargetInfluences[1];\n  transformed += (morphTarget2 - position) * morphTargetInfluences[2];\n  transformed += (morphTarget3 - position) * morphTargetInfluences[3];\n  transformed += (morphTarget4 - position) * morphTargetInfluences[4];\n  transformed += (morphTarget5 - position) * morphTargetInfluences[5];\n  transformed += (morphTarget6 - position) * morphTargetInfluences[6];\n  transformed += (morphTarget7 - position) * morphTargetInfluences[7];\n  transformed += (morphTarget8 - position) * morphTargetInfluences[8];\n  transformed += (morphTarget9 - position) * morphTargetInfluences[9];\n  transformed += (morphTarget10 - position) * morphTargetInfluences[10];\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);\n}\n"

/***/ },
/* 18 */
/*!**************************************!*\
  !*** ./~/raw-loader!./src/face.frag ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = "uniform sampler2D map;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 c = texture2D(map, vUv);\n  if (!gl_FrontFacing) {\n    c = mix(c, vec4(0, 0, 0, 1), 0.8);\n  }\n  gl_FragColor = c;\n}\n"

/***/ },
/* 19 */
/*!***********************!*\
  !*** ./src/main.sass ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../~/css-loader!./../~/autoprefixer-loader!./../~/sass-loader?indentedSyntax!./main.sass */ 20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../~/style-loader/addStyles.js */ 22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js?indentedSyntax!./main.sass", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/sass-loader/index.js?indentedSyntax!./main.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/*!*********************************************************************************************!*\
  !*** ./~/css-loader!./~/autoprefixer-loader!./~/sass-loader?indentedSyntax!./src/main.sass ***!
  \*********************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../~/css-loader/lib/css-base.js */ 21)();
	// imports
	
	
	// module
	exports.push([module.id, "html, body {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden; }\n\nbody {\n  color: #666;\n  background-color: #ccc;\n  font: 20px sans-serif; }\n", ""]);
	
	// exports


/***/ },
/* 21 */
/*!**************************************!*\
  !*** ./~/css-loader/lib/css-base.js ***!
  \**************************************/
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 22 */
/*!*************************************!*\
  !*** ./~/style-loader/addStyles.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 23 */
/*!***********************!*\
  !*** ./src/main.jade ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(/*! ./~/jade/lib/runtime.js */ 24);
	
	module.exports = function template(locals) {
	var jade_debug = [ new jade.DebugItem( 1, "/Users/hiko/Dropbox (dotby.jp)/My Projects/KAMRA - Artificial Emotions/repos/experiments/12 - Face morph/src/main.jade" ) ];
	try {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	var self = locals || {};
	jade_debug.unshift(new jade.DebugItem( 0, "/Users/hiko/Dropbox (dotby.jp)/My Projects/KAMRA - Artificial Emotions/repos/experiments/12 - Face morph/src/main.jade" ));
	jade_debug.shift();;return buf.join("");
	} catch (err) {
	  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "");
	}
	}

/***/ },
/* 24 */
/*!*******************************!*\
  !*** ./~/jade/lib/runtime.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(/*! fs */ 25).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 25 */
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 26 */
/*!************************!*\
  !*** ./src/morph.json ***!
  \************************/
/***/ function(module, exports) {

	module.exports = [
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.096458,
					-0.2017,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.152735,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.206538,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "eye-right-close",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.120752,
					-0.054697,
					-0.100737,
					0.169566,
					0.005143,
					-0.129515,
					0.221862,
					-0.074005,
					-0.138323,
					0.175003,
					-0.131898,
					-0.113097,
					0.221874,
					-0.230809,
					-0.144174,
					0.241987,
					-0.279391,
					-0.157915,
					0.306483,
					-0.240744,
					-0.22545,
					0.289558,
					-0.190267,
					-0.196317,
					0.172963,
					-0.257925,
					-0.113391,
					0.193472,
					-0.303309,
					-0.119153,
					0.264725,
					-0.137389,
					-0.163265,
					0.199559,
					-0.179549,
					-0.128637,
					0.153183,
					-0.207138,
					-0.106757,
					0.316047,
					-0.286909,
					-0.248207,
					0.256453,
					-0.324421,
					-0.170077,
					0.206227,
					-0.339919,
					-0.126553,
					0.320751,
					-0.358534,
					-0.27881,
					0.238439,
					-0.412053,
					-0.167834,
					0.194203,
					-0.398041,
					-0.122565,
					0.1389,
					-0.319522,
					-0.073007,
					0.149351,
					-0.339445,
					-0.104638,
					0.144112,
					-0.294698,
					-0.079721,
					0.167479,
					-0.324306,
					-0.103252,
					0.077238,
					-0.429326,
					-0.06353,
					0,
					-0.440253,
					-0.035507,
					0.095841,
					-0.470373,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.126596,
					-0.408323,
					-0.084668,
					0.147383,
					-0.353823,
					-0.114221,
					0.115996,
					-0.384963,
					-0.081272,
					0.167924,
					-0.375573,
					-0.111517,
					0.075563,
					-0.304321,
					-0.021487,
					0.089321,
					-0.289214,
					-0.036301,
					0.165999,
					-0.347759,
					-0.116507,
					0.181297,
					-0.344482,
					-0.117068,
					0.15415,
					-0.345961,
					-0.118449,
					0.141856,
					-0.352417,
					-0.12046,
					0.121892,
					-0.336462,
					-0.092747,
					0.14114,
					-0.341957,
					-0.113448,
					0.132517,
					-0.328741,
					-0.079014,
					0.0726,
					-0.32102,
					-0.028674,
					0.066498,
					-0.330196,
					-0.049199,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.12501,
					-0.219718,
					-0.086196,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.107404,
					-0.175854,
					-0.0861,
					0.134927,
					-0.163201,
					-0.102034,
					0,
					-0.242487,
					-0.027512,
					0.118593,
					-0.151122,
					-0.086707,
					0,
					-0.52733,
					-0.039309,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.510218,
					-0.208261,
					0.318452,
					-0.428674,
					-0.312063,
					0.350139,
					-0.383595,
					-0.367148,
					0.345195,
					-0.320538,
					-0.332002,
					0.382181,
					-0.311069,
					-0.446371,
					0.374865,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.370177,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.133677,
					0.121253,
					-0.156775,
					0.121426,
					0.137054,
					-0.128418,
					0.089098,
					0.112842,
					-0.142426,
					0.107971,
					0.112577,
					-0.159768,
					0.15565,
					0.074404,
					-0.142779,
					0.160395,
					0.099236,
					-0.1491,
					0.128791,
					0.100411,
					-0.156371,
					0.109738,
					0.083461,
					-0.143303,
					0.211517,
					0.098313,
					-0.146254,
					0.222728,
					0.069773,
					-0.159357,
					0.279489,
					0.104092,
					-0.182243,
					0.290012,
					0.07863,
					-0.196596,
					0.331372,
					0.105557,
					-0.242429,
					0.317157,
					0.11243,
					-0.229575,
					0.32908,
					0.129018,
					-0.199395,
					0.314885,
					0.119226,
					-0.204649,
					0.308259,
					0.253837,
					-0.150639,
					0.145253,
					0.111279,
					-0.16211,
					0.124276,
					0.112223,
					-0.166998,
					0.167581,
					0.109095,
					-0.154253,
					0.142809,
					0.111346,
					-0.162014,
					0.212555,
					0.109312,
					-0.150055,
					0.306874,
					0.112429,
					-0.221211,
					0.276869,
					0.112514,
					-0.183553,
					0.137823,
					0.110611,
					-0.173797,
					0.213199,
					0.115534,
					-0.147758,
					0.168097,
					0.116808,
					-0.151314,
					0.214586,
					0.109473,
					-0.150717,
					0.170437,
					0.109155,
					-0.153914,
					0.248641,
					0.198004,
					-0.104641,
					0.185157,
					0.179803,
					-0.088473,
					0.230065,
					0.14049,
					-0.132203,
					0.174076,
					0.134525,
					-0.130817,
					0.108741,
					0.169151,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.241641,
					0.009488,
					-0.154481,
					0.313552,
					0.034642,
					-0.206869,
					0.359238,
					0.09259,
					-0.258711,
					0.349377,
					0.164189,
					-0.192909,
					0.298693,
					0.191502,
					-0.141058,
					0.253033,
					0.261234,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.229285,
					-0.047672,
					0.370456,
					0.212669,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243331,
					-0.043212,
					0.251983,
					0.315372,
					-0.119951,
					0.253354,
					0.395871,
					-0.163006,
					0.12,
					0.415532,
					-0.103944,
					0.118887,
					0.314676,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.331254,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.345985,
					-0.020961,
					-0.220536,
					0.277409,
					-0.06128,
					-0.162758,
					0.304759,
					-0.114297,
					-0.191262,
					0.323328,
					-0.166915,
					-0.230756,
					0.333789,
					-0.214756,
					-0.265984,
					0.338473,
					-0.256922,
					-0.295368,
					0.362226,
					-0.068405,
					-0.251188,
					0.366888,
					-0.121175,
					-0.293244,
					0.370468,
					-0.165309,
					-0.33172,
					0.371912,
					-0.204505,
					-0.363676,
					0.299319,
					0.110088,
					-0.203538,
					0.124979,
					-0.127185,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.11101,
					-0.373207,
					-0.086188,
					0.179534,
					0.238833,
					-0.07489,
					0.284719,
					0.130179,
					-0.165714,
					0.27399,
					0.112037,
					-0.175392,
					0.272797,
					0.110788,
					-0.177329,
					0.106631,
					-0.366109,
					-0.094343,
					0,
					-0.605289,
					-0.070169,
					0.071127,
					-0.408695,
					-0.050584,
					0.067721,
					-0.389327,
					-0.055536,
					0,
					-0.415177,
					-0.022688,
					0,
					-0.391953,
					-0.027089,
					0,
					-0.382922,
					-0.038809,
					0.066305,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.234283,
					-0.085533,
					-0.138323,
					-0.176093,
					-0.132913,
					-0.113097,
					-0.221874,
					-0.230809,
					-0.144174,
					-0.306483,
					-0.240744,
					-0.22545,
					-0.241987,
					-0.279391,
					-0.157915,
					-0.290564,
					-0.191496,
					-0.196317,
					-0.172963,
					-0.257925,
					-0.113391,
					-0.193472,
					-0.303309,
					-0.119153,
					-0.200158,
					-0.18028,
					-0.128637,
					-0.268343,
					-0.139532,
					-0.163265,
					-0.153183,
					-0.207138,
					-0.106757,
					-0.316047,
					-0.286909,
					-0.248207,
					-0.256453,
					-0.324421,
					-0.170077,
					-0.206227,
					-0.339919,
					-0.126553,
					-0.320751,
					-0.358534,
					-0.27881,
					-0.238439,
					-0.412053,
					-0.167834,
					-0.194203,
					-0.398041,
					-0.122565,
					-0.1389,
					-0.319522,
					-0.073007,
					-0.144112,
					-0.294698,
					-0.079721,
					-0.149351,
					-0.339445,
					-0.104638,
					-0.167479,
					-0.324306,
					-0.103252,
					-0.077238,
					-0.429326,
					-0.06353,
					-0.095841,
					-0.470373,
					-0.075102,
					-0.126596,
					-0.408323,
					-0.084668,
					-0.147383,
					-0.353823,
					-0.114221,
					-0.167924,
					-0.375573,
					-0.111517,
					-0.115996,
					-0.384963,
					-0.081272,
					-0.075563,
					-0.304321,
					-0.021487,
					-0.089321,
					-0.289214,
					-0.036301,
					-0.165999,
					-0.347759,
					-0.116507,
					-0.181297,
					-0.344482,
					-0.117068,
					-0.15415,
					-0.345961,
					-0.118449,
					-0.141856,
					-0.352417,
					-0.12046,
					-0.121892,
					-0.336462,
					-0.092747,
					-0.132517,
					-0.328741,
					-0.079014,
					-0.14114,
					-0.341957,
					-0.113448,
					-0.0726,
					-0.32102,
					-0.028674,
					-0.066498,
					-0.330196,
					-0.049199,
					-0.12501,
					-0.219718,
					-0.086196,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.107404,
					-0.175854,
					-0.0861,
					-0.134935,
					-0.163211,
					-0.102034,
					-0.118593,
					-0.151122,
					-0.086707,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.510218,
					-0.208261,
					-0.318452,
					-0.428674,
					-0.312063,
					-0.345195,
					-0.320538,
					-0.332002,
					-0.350139,
					-0.383595,
					-0.367148,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.374865,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.284991,
					-0.064413,
					-0.162758,
					-0.308989,
					-0.116614,
					-0.191262,
					-0.324462,
					-0.168301,
					-0.230756,
					-0.333789,
					-0.214756,
					-0.265984,
					-0.338473,
					-0.256922,
					-0.295368,
					-0.363227,
					-0.069628,
					-0.251188,
					-0.367015,
					-0.12133,
					-0.293244,
					-0.370468,
					-0.165309,
					-0.33172,
					-0.371912,
					-0.204505,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.124979,
					-0.127185,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.11101,
					-0.373207,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.106631,
					-0.366109,
					-0.094343,
					-0.071127,
					-0.408695,
					-0.050584,
					-0.067721,
					-0.389327,
					-0.055536,
					-0.066305,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.096458,
					-0.2017,
					-0.305157,
					0.125845,
					-0.206538,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.152735,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "eye-left-close",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.234283,
					-0.085533,
					-0.138323,
					0.176093,
					-0.132913,
					-0.113097,
					0.221874,
					-0.230809,
					-0.144174,
					0.241987,
					-0.279391,
					-0.157915,
					0.306483,
					-0.240744,
					-0.22545,
					0.290564,
					-0.191496,
					-0.196317,
					0.172963,
					-0.257925,
					-0.113391,
					0.193472,
					-0.303309,
					-0.119153,
					0.268343,
					-0.139532,
					-0.163265,
					0.200158,
					-0.18028,
					-0.128637,
					0.153183,
					-0.207138,
					-0.106757,
					0.316047,
					-0.286909,
					-0.248207,
					0.256453,
					-0.324421,
					-0.170077,
					0.206227,
					-0.339919,
					-0.126553,
					0.320751,
					-0.358534,
					-0.27881,
					0.238439,
					-0.412053,
					-0.167834,
					0.194203,
					-0.398041,
					-0.122565,
					0.1389,
					-0.319522,
					-0.073007,
					0.149351,
					-0.339445,
					-0.104638,
					0.144112,
					-0.294698,
					-0.079721,
					0.167479,
					-0.324306,
					-0.103252,
					0.077238,
					-0.429326,
					-0.06353,
					0,
					-0.440253,
					-0.035507,
					0.095841,
					-0.470373,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.126596,
					-0.408323,
					-0.084668,
					0.147383,
					-0.353823,
					-0.114221,
					0.115996,
					-0.384963,
					-0.081272,
					0.167924,
					-0.375573,
					-0.111517,
					0.075563,
					-0.304321,
					-0.021487,
					0.089321,
					-0.289214,
					-0.036301,
					0.165999,
					-0.347759,
					-0.116507,
					0.181297,
					-0.344482,
					-0.117068,
					0.15415,
					-0.345961,
					-0.118449,
					0.141856,
					-0.352417,
					-0.12046,
					0.121892,
					-0.336462,
					-0.092747,
					0.14114,
					-0.341957,
					-0.113448,
					0.132517,
					-0.328741,
					-0.079014,
					0.0726,
					-0.32102,
					-0.028674,
					0.066498,
					-0.330196,
					-0.049199,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.12501,
					-0.219718,
					-0.086196,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.107404,
					-0.175854,
					-0.0861,
					0.134935,
					-0.163211,
					-0.102034,
					0,
					-0.242487,
					-0.027512,
					0.118593,
					-0.151122,
					-0.086707,
					0,
					-0.52733,
					-0.039309,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.510218,
					-0.208261,
					0.318452,
					-0.428674,
					-0.312063,
					0.350139,
					-0.383595,
					-0.367148,
					0.345195,
					-0.320538,
					-0.332002,
					0.382181,
					-0.311069,
					-0.446371,
					0.374865,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243331,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.331254,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.284991,
					-0.064413,
					-0.162758,
					0.308989,
					-0.116614,
					-0.191262,
					0.324462,
					-0.168301,
					-0.230756,
					0.333789,
					-0.214756,
					-0.265984,
					0.338473,
					-0.256922,
					-0.295368,
					0.363227,
					-0.069628,
					-0.251188,
					0.367015,
					-0.12133,
					-0.293244,
					0.370468,
					-0.165309,
					-0.33172,
					0.371912,
					-0.204505,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.124979,
					-0.127185,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.11101,
					-0.373207,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.106631,
					-0.366109,
					-0.094343,
					0,
					-0.605289,
					-0.070169,
					0.071127,
					-0.408695,
					-0.050584,
					0.067721,
					-0.389327,
					-0.055536,
					0,
					-0.415177,
					-0.022688,
					0,
					-0.391953,
					-0.027089,
					0,
					-0.382922,
					-0.038809,
					0.066305,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.120752,
					-0.054697,
					-0.100737,
					-0.169566,
					0.005143,
					-0.129515,
					-0.221862,
					-0.074005,
					-0.138323,
					-0.175003,
					-0.131898,
					-0.113097,
					-0.221874,
					-0.230809,
					-0.144174,
					-0.306483,
					-0.240744,
					-0.22545,
					-0.241987,
					-0.279391,
					-0.157915,
					-0.289558,
					-0.190267,
					-0.196317,
					-0.172963,
					-0.257925,
					-0.113391,
					-0.193472,
					-0.303309,
					-0.119153,
					-0.199559,
					-0.179549,
					-0.128637,
					-0.264725,
					-0.137389,
					-0.163265,
					-0.153183,
					-0.207138,
					-0.106757,
					-0.316047,
					-0.286909,
					-0.248207,
					-0.256453,
					-0.324421,
					-0.170077,
					-0.206227,
					-0.339919,
					-0.126553,
					-0.320751,
					-0.358534,
					-0.27881,
					-0.238439,
					-0.412053,
					-0.167834,
					-0.194203,
					-0.398041,
					-0.122565,
					-0.1389,
					-0.319522,
					-0.073007,
					-0.144112,
					-0.294698,
					-0.079721,
					-0.149351,
					-0.339445,
					-0.104638,
					-0.167479,
					-0.324306,
					-0.103252,
					-0.077238,
					-0.429326,
					-0.06353,
					-0.095841,
					-0.470373,
					-0.075102,
					-0.126596,
					-0.408323,
					-0.084668,
					-0.147383,
					-0.353823,
					-0.114221,
					-0.167924,
					-0.375573,
					-0.111517,
					-0.115996,
					-0.384963,
					-0.081272,
					-0.075563,
					-0.304321,
					-0.021487,
					-0.089321,
					-0.289214,
					-0.036301,
					-0.165999,
					-0.347759,
					-0.116507,
					-0.181297,
					-0.344482,
					-0.117068,
					-0.15415,
					-0.345961,
					-0.118449,
					-0.141856,
					-0.352417,
					-0.12046,
					-0.121892,
					-0.336462,
					-0.092747,
					-0.132517,
					-0.328741,
					-0.079014,
					-0.14114,
					-0.341957,
					-0.113448,
					-0.0726,
					-0.32102,
					-0.028674,
					-0.066498,
					-0.330196,
					-0.049199,
					-0.12501,
					-0.219718,
					-0.086196,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.107404,
					-0.175854,
					-0.0861,
					-0.134927,
					-0.163201,
					-0.102034,
					-0.118593,
					-0.151122,
					-0.086707,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.510218,
					-0.208261,
					-0.318452,
					-0.428674,
					-0.312063,
					-0.345195,
					-0.320538,
					-0.332002,
					-0.350139,
					-0.383595,
					-0.367148,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.374865,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.370177,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.133677,
					0.121253,
					-0.156775,
					-0.089098,
					0.112842,
					-0.142426,
					-0.121426,
					0.137054,
					-0.128418,
					-0.107971,
					0.112577,
					-0.159768,
					-0.15565,
					0.074404,
					-0.142779,
					-0.128791,
					0.100411,
					-0.156371,
					-0.160395,
					0.099236,
					-0.1491,
					-0.109738,
					0.083461,
					-0.143303,
					-0.211517,
					0.098313,
					-0.146254,
					-0.222728,
					0.069773,
					-0.159357,
					-0.279489,
					0.104092,
					-0.182243,
					-0.331372,
					0.105557,
					-0.242429,
					-0.290012,
					0.07863,
					-0.196596,
					-0.317157,
					0.11243,
					-0.229575,
					-0.32908,
					0.129018,
					-0.199395,
					-0.314885,
					0.119226,
					-0.204649,
					-0.308259,
					0.253837,
					-0.150639,
					-0.145253,
					0.111279,
					-0.16211,
					-0.124276,
					0.112223,
					-0.166998,
					-0.142809,
					0.111346,
					-0.162014,
					-0.167581,
					0.109095,
					-0.154253,
					-0.212555,
					0.109312,
					-0.150055,
					-0.306874,
					0.112429,
					-0.221211,
					-0.276869,
					0.112514,
					-0.183553,
					-0.137823,
					0.110611,
					-0.173797,
					-0.213199,
					0.115534,
					-0.147758,
					-0.214586,
					0.109473,
					-0.150717,
					-0.168097,
					0.116808,
					-0.151314,
					-0.170437,
					0.109155,
					-0.153914,
					-0.248641,
					0.198004,
					-0.104641,
					-0.230065,
					0.14049,
					-0.132203,
					-0.185157,
					0.179803,
					-0.088473,
					-0.174076,
					0.134525,
					-0.130817,
					-0.108741,
					0.169151,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.241641,
					0.009488,
					-0.154481,
					-0.313552,
					0.034642,
					-0.206869,
					-0.359238,
					0.09259,
					-0.258711,
					-0.349377,
					0.164189,
					-0.192909,
					-0.253033,
					0.261234,
					-0.101722,
					-0.298693,
					0.191502,
					-0.141058,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.229285,
					-0.047672,
					-0.370456,
					0.212669,
					-0.248551,
					-0.251983,
					0.315372,
					-0.119951,
					-0.12,
					0.415532,
					-0.103944,
					-0.253354,
					0.395871,
					-0.163006,
					-0.118887,
					0.314676,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.345985,
					-0.020961,
					-0.220536,
					-0.277409,
					-0.06128,
					-0.162758,
					-0.304759,
					-0.114297,
					-0.191262,
					-0.323328,
					-0.166915,
					-0.230756,
					-0.333789,
					-0.214756,
					-0.265984,
					-0.338473,
					-0.256922,
					-0.295368,
					-0.362226,
					-0.068405,
					-0.251188,
					-0.366888,
					-0.121175,
					-0.293244,
					-0.370468,
					-0.165309,
					-0.33172,
					-0.371912,
					-0.204505,
					-0.363676,
					-0.299319,
					0.110088,
					-0.203538,
					-0.124979,
					-0.127185,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.11101,
					-0.373207,
					-0.086188,
					-0.179534,
					0.238833,
					-0.07489,
					-0.284719,
					0.130179,
					-0.165714,
					-0.27399,
					0.112037,
					-0.175392,
					-0.272797,
					0.110788,
					-0.177329,
					-0.106631,
					-0.366109,
					-0.094343,
					-0.071127,
					-0.408695,
					-0.050584,
					-0.067721,
					-0.389327,
					-0.055536,
					-0.066305,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "mouth-close",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.191515,
					0.009363,
					0,
					-0.198397,
					0.010965,
					0.030795,
					-0.201793,
					-0.023699,
					0,
					-0.209853,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.234283,
					-0.085533,
					-0.138323,
					0.176093,
					-0.132913,
					-0.113097,
					0.221874,
					-0.226988,
					-0.144174,
					0.241987,
					-0.270049,
					-0.157915,
					0.306483,
					-0.240744,
					-0.22545,
					0.290564,
					-0.191496,
					-0.196317,
					0.172963,
					-0.25617,
					-0.113391,
					0.193472,
					-0.290515,
					-0.119153,
					0.268343,
					-0.139532,
					-0.163265,
					0.200158,
					-0.18028,
					-0.128637,
					0.153183,
					-0.206496,
					-0.106757,
					0.316047,
					-0.286909,
					-0.248207,
					0.256453,
					-0.312061,
					-0.170077,
					0.206227,
					-0.319527,
					-0.126553,
					0.320751,
					-0.356303,
					-0.27881,
					0.238439,
					-0.39146,
					-0.167834,
					0.194203,
					-0.370835,
					-0.122565,
					0.1389,
					-0.30973,
					-0.073007,
					0.149351,
					-0.319748,
					-0.104638,
					0.144112,
					-0.291129,
					-0.079721,
					0.167479,
					-0.311542,
					-0.103252,
					0.077238,
					-0.358496,
					-0.06353,
					0,
					-0.37288,
					-0.035507,
					0.095841,
					-0.410535,
					-0.075102,
					0,
					-0.411295,
					-0.049614,
					0.126596,
					-0.354167,
					-0.084668,
					0.147383,
					-0.323964,
					-0.114221,
					0.115996,
					-0.332569,
					-0.081272,
					0.167924,
					-0.34481,
					-0.111517,
					0.075563,
					-0.309488,
					-0.021487,
					0.089321,
					-0.29437,
					-0.036301,
					0.165999,
					-0.319923,
					-0.119365,
					0.181297,
					-0.321031,
					-0.117068,
					0.15415,
					-0.32027,
					-0.118449,
					0.141856,
					-0.324434,
					-0.12046,
					0.121892,
					-0.322119,
					-0.092747,
					0.14114,
					-0.322113,
					-0.113448,
					0.132517,
					-0.316243,
					-0.079014,
					0.0726,
					-0.319769,
					-0.028674,
					0.066498,
					-0.324863,
					-0.049199,
					0,
					-0.325455,
					-0.008766,
					0,
					-0.315331,
					-0.005393,
					0,
					-0.329158,
					-0.030311,
					0.12501,
					-0.220993,
					-0.086196,
					0.055363,
					-0.244698,
					-0.037596,
					0.040271,
					-0.295018,
					-0.020561,
					0,
					-0.300898,
					-0.013667,
					0.107404,
					-0.175854,
					-0.0861,
					0.134935,
					-0.163211,
					-0.102034,
					0,
					-0.254475,
					-0.027512,
					0.118593,
					-0.151122,
					-0.086707,
					0,
					-0.483721,
					-0.039309,
					0.113613,
					-0.482564,
					-0.077045,
					0.229002,
					-0.494514,
					-0.208261,
					0.318452,
					-0.428576,
					-0.312063,
					0.350139,
					-0.383595,
					-0.367148,
					0.345195,
					-0.320538,
					-0.332002,
					0.382181,
					-0.311069,
					-0.446371,
					0.374865,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.56025,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.284991,
					-0.064413,
					-0.162758,
					0.308989,
					-0.116614,
					-0.191262,
					0.324462,
					-0.168301,
					-0.230756,
					0.333789,
					-0.214756,
					-0.265984,
					0.338473,
					-0.256922,
					-0.295368,
					0.363227,
					-0.069628,
					-0.251188,
					0.367015,
					-0.12133,
					-0.293244,
					0.370468,
					-0.165309,
					-0.33172,
					0.371912,
					-0.204505,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.124979,
					-0.127185,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.11101,
					-0.324263,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.106631,
					-0.322998,
					-0.094343,
					0,
					-0.576683,
					-0.070169,
					0.071127,
					-0.337784,
					-0.050584,
					0.067721,
					-0.326992,
					-0.055536,
					0,
					-0.352715,
					-0.022688,
					0,
					-0.332777,
					-0.027089,
					0,
					-0.329725,
					-0.038809,
					0.066305,
					-0.324232,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.192111,
					0.009363,
					-0.030795,
					-0.20285,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.234283,
					-0.085533,
					-0.138323,
					-0.176093,
					-0.132913,
					-0.113097,
					-0.221874,
					-0.226157,
					-0.144174,
					-0.306483,
					-0.240744,
					-0.22545,
					-0.241987,
					-0.270184,
					-0.157915,
					-0.290564,
					-0.191496,
					-0.196317,
					-0.172963,
					-0.254849,
					-0.113391,
					-0.193472,
					-0.290755,
					-0.119153,
					-0.200158,
					-0.18028,
					-0.128637,
					-0.268343,
					-0.139532,
					-0.163265,
					-0.153183,
					-0.206041,
					-0.106757,
					-0.316047,
					-0.286909,
					-0.248207,
					-0.256453,
					-0.312111,
					-0.170077,
					-0.206227,
					-0.320041,
					-0.126553,
					-0.320751,
					-0.356301,
					-0.27881,
					-0.238439,
					-0.391441,
					-0.167834,
					-0.194203,
					-0.369719,
					-0.122565,
					-0.1389,
					-0.312427,
					-0.073007,
					-0.144112,
					-0.293497,
					-0.079721,
					-0.149351,
					-0.32103,
					-0.104638,
					-0.167479,
					-0.313599,
					-0.103252,
					-0.077238,
					-0.357702,
					-0.06353,
					-0.095841,
					-0.409096,
					-0.075102,
					-0.126596,
					-0.35419,
					-0.084668,
					-0.147383,
					-0.324818,
					-0.114221,
					-0.167924,
					-0.34558,
					-0.111517,
					-0.115996,
					-0.333178,
					-0.081272,
					-0.075563,
					-0.312525,
					-0.021487,
					-0.089321,
					-0.297728,
					-0.036301,
					-0.165999,
					-0.320891,
					-0.119365,
					-0.181297,
					-0.321882,
					-0.117068,
					-0.15415,
					-0.321169,
					-0.118449,
					-0.141856,
					-0.325236,
					-0.12046,
					-0.121892,
					-0.325192,
					-0.092747,
					-0.132517,
					-0.318075,
					-0.079014,
					-0.14114,
					-0.323664,
					-0.113448,
					-0.0726,
					-0.322698,
					-0.028674,
					-0.066498,
					-0.327586,
					-0.049199,
					-0.12501,
					-0.223467,
					-0.086196,
					-0.055363,
					-0.246482,
					-0.037596,
					-0.040271,
					-0.295146,
					-0.020561,
					-0.107404,
					-0.175854,
					-0.0861,
					-0.134935,
					-0.163211,
					-0.102034,
					-0.118593,
					-0.151122,
					-0.086707,
					-0.113613,
					-0.482564,
					-0.077045,
					-0.229002,
					-0.494498,
					-0.208261,
					-0.318452,
					-0.428549,
					-0.312063,
					-0.345195,
					-0.320538,
					-0.332002,
					-0.350139,
					-0.383595,
					-0.367148,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.374865,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.56025,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.284991,
					-0.064413,
					-0.162758,
					-0.308989,
					-0.116614,
					-0.191262,
					-0.324462,
					-0.168301,
					-0.230756,
					-0.333789,
					-0.214756,
					-0.265984,
					-0.338473,
					-0.256922,
					-0.295368,
					-0.363227,
					-0.069628,
					-0.251188,
					-0.367015,
					-0.12133,
					-0.293244,
					-0.370468,
					-0.165309,
					-0.33172,
					-0.371912,
					-0.204505,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.124979,
					-0.127185,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.11101,
					-0.324586,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.106631,
					-0.322207,
					-0.094343,
					-0.071127,
					-0.336976,
					-0.050584,
					-0.067721,
					-0.325898,
					-0.055536,
					-0.066305,
					-0.324332,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "mouth-smile",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.128146,
					0.234871,
					-0.058242,
					-0.113488,
					0.176093,
					-0.115767,
					-0.101941,
					0.234642,
					-0.209057,
					-0.159825,
					0.254609,
					-0.245255,
					-0.199847,
					0.32013,
					-0.209607,
					-0.241839,
					0.291647,
					-0.145127,
					-0.143767,
					0.188317,
					-0.222382,
					-0.15483,
					0.215675,
					-0.245317,
					-0.177786,
					0.269439,
					-0.086123,
					-0.116046,
					0.201078,
					-0.155363,
					-0.110911,
					0.155099,
					-0.190895,
					-0.123516,
					0.320523,
					-0.263207,
					-0.280538,
					0.268054,
					-0.274274,
					-0.219671,
					0.22911,
					-0.265545,
					-0.195932,
					0.294051,
					-0.337381,
					-0.311334,
					0.231698,
					-0.374937,
					-0.189786,
					0.194112,
					-0.349869,
					-0.150628,
					0.141744,
					-0.28822,
					-0.10311,
					0.154182,
					-0.288354,
					-0.150085,
					0.147497,
					-0.253468,
					-0.115006,
					0.1839,
					-0.257627,
					-0.168789,
					0.076841,
					-0.429326,
					-0.06353,
					0,
					-0.440253,
					-0.035507,
					0.09473,
					-0.470373,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.125876,
					-0.388792,
					-0.092223,
					0.150925,
					-0.308423,
					-0.151839,
					0.116663,
					-0.364645,
					-0.093498,
					0.171516,
					-0.323769,
					-0.152085,
					0.075695,
					-0.304321,
					-0.022413,
					0.089795,
					-0.28772,
					-0.043074,
					0.172928,
					-0.294226,
					-0.167327,
					0.199359,
					-0.275208,
					-0.193697,
					0.158608,
					-0.299449,
					-0.159892,
					0.144559,
					-0.313111,
					-0.151621,
					0.12395,
					-0.312698,
					-0.114925,
					0.144751,
					-0.299226,
					-0.149626,
					0.135261,
					-0.297737,
					-0.108336,
					0.072787,
					-0.32102,
					-0.030646,
					0.06671,
					-0.330196,
					-0.05192,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.126314,
					-0.212467,
					-0.103025,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.107404,
					-0.17443,
					-0.086042,
					0.134935,
					-0.158204,
					-0.102539,
					0,
					-0.242487,
					-0.027512,
					0.118593,
					-0.150778,
					-0.086865,
					0,
					-0.52733,
					-0.039309,
					0.111778,
					-0.519425,
					-0.077045,
					0.210791,
					-0.509469,
					-0.20953,
					0.282548,
					-0.402865,
					-0.344628,
					0.314026,
					-0.348412,
					-0.4024,
					0.312043,
					-0.284458,
					-0.369822,
					0.348484,
					-0.266565,
					-0.485054,
					0.343472,
					-0.218828,
					-0.441401,
					0.4374,
					0.146236,
					-0.595903,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.417003,
					0.054536,
					-0.409765,
					0.435497,
					0.069129,
					-0.605756,
					0.410087,
					-0.016392,
					-0.44518,
					0.399171,
					-0.067908,
					-0.477536,
					0.391824,
					-0.110901,
					-0.501994,
					0.415173,
					-0.077843,
					-0.576863,
					0.426427,
					0.002402,
					-0.598757,
					0.386214,
					-0.171067,
					-0.550482,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.115325,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.159584,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.198622,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					0.00339,
					-0.147734,
					0.318923,
					0.027415,
					-0.209714,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.389218,
					0.058426,
					-0.287901,
					0.350522,
					-0.021632,
					-0.224083,
					0.285878,
					-0.038739,
					-0.143308,
					0.310334,
					-0.070533,
					-0.160619,
					0.334144,
					-0.119395,
					-0.201597,
					0.350269,
					-0.179866,
					-0.279843,
					0.332057,
					-0.22634,
					-0.326835,
					0.3643,
					-0.054971,
					-0.255309,
					0.373368,
					-0.093184,
					-0.306256,
					0.369965,
					-0.134766,
					-0.357644,
					0.353055,
					-0.168719,
					-0.396888,
					0.305157,
					0.125845,
					-0.201761,
					0.124979,
					-0.124033,
					-0.097081,
					0.087979,
					-0.090294,
					-0.036241,
					0.112162,
					-0.352051,
					-0.101275,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.107969,
					-0.343615,
					-0.111135,
					0,
					-0.605289,
					-0.070169,
					0.070992,
					-0.408695,
					-0.050584,
					0.067721,
					-0.389327,
					-0.055536,
					0,
					-0.415177,
					-0.022688,
					0,
					-0.391953,
					-0.027089,
					0,
					-0.382922,
					-0.038809,
					0.066305,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.128179,
					-0.234923,
					-0.055807,
					-0.117147,
					-0.176093,
					-0.11724,
					-0.101213,
					-0.230735,
					-0.192223,
					-0.169343,
					-0.319711,
					-0.210129,
					-0.241768,
					-0.26187,
					-0.23023,
					-0.217044,
					-0.292021,
					-0.146166,
					-0.142802,
					-0.179462,
					-0.208026,
					-0.154908,
					-0.215707,
					-0.232766,
					-0.19028,
					-0.201254,
					-0.152848,
					-0.117011,
					-0.26965,
					-0.085439,
					-0.118378,
					-0.155097,
					-0.19181,
					-0.124047,
					-0.31956,
					-0.265032,
					-0.281725,
					-0.268121,
					-0.266037,
					-0.227546,
					-0.231902,
					-0.254636,
					-0.205944,
					-0.2932,
					-0.338373,
					-0.311495,
					-0.231871,
					-0.375529,
					-0.18929,
					-0.194207,
					-0.349525,
					-0.150069,
					-0.141744,
					-0.289685,
					-0.102424,
					-0.147624,
					-0.255909,
					-0.113543,
					-0.154303,
					-0.288159,
					-0.149779,
					-0.181728,
					-0.257466,
					-0.169112,
					-0.076859,
					-0.429326,
					-0.06353,
					-0.094766,
					-0.470373,
					-0.075102,
					-0.125929,
					-0.388792,
					-0.092223,
					-0.15109,
					-0.306817,
					-0.15254,
					-0.171649,
					-0.323074,
					-0.152549,
					-0.116698,
					-0.364645,
					-0.093498,
					-0.075672,
					-0.304321,
					-0.022016,
					-0.089789,
					-0.289214,
					-0.042024,
					-0.172755,
					-0.288014,
					-0.173393,
					-0.200758,
					-0.275251,
					-0.194005,
					-0.158698,
					-0.296051,
					-0.163219,
					-0.144707,
					-0.311534,
					-0.152504,
					-0.12394,
					-0.312892,
					-0.114779,
					-0.135282,
					-0.298506,
					-0.107967,
					-0.14491,
					-0.298266,
					-0.150104,
					-0.072745,
					-0.32102,
					-0.029903,
					-0.066665,
					-0.330196,
					-0.051033,
					-0.126286,
					-0.213151,
					-0.102627,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.107404,
					-0.174621,
					-0.086895,
					-0.134935,
					-0.158506,
					-0.102408,
					-0.118593,
					-0.151076,
					-0.086737,
					-0.111845,
					-0.519425,
					-0.077045,
					-0.210939,
					-0.510218,
					-0.208261,
					-0.282021,
					-0.404061,
					-0.343798,
					-0.310298,
					-0.285223,
					-0.370329,
					-0.312383,
					-0.34744,
					-0.401014,
					-0.345219,
					-0.267397,
					-0.485497,
					-0.340427,
					-0.218744,
					-0.442822,
					-0.4374,
					0.147032,
					-0.596177,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.231084,
					-0.572927,
					-0.415135,
					0.053507,
					-0.411713,
					-0.429569,
					0.068289,
					-0.603204,
					-0.40858,
					-0.016426,
					-0.445126,
					-0.396118,
					-0.067619,
					-0.477278,
					-0.411135,
					-0.074865,
					-0.581483,
					-0.387652,
					-0.110253,
					-0.50227,
					-0.423305,
					0.001115,
					-0.596421,
					-0.380958,
					-0.171173,
					-0.5496,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.11534,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.159771,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.198686,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					0.00339,
					-0.147944,
					-0.318923,
					0.027889,
					-0.20957,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.389305,
					0.058426,
					-0.287901,
					-0.350706,
					-0.021441,
					-0.224209,
					-0.286023,
					-0.040408,
					-0.141439,
					-0.310614,
					-0.074993,
					-0.154674,
					-0.334457,
					-0.118582,
					-0.202421,
					-0.349239,
					-0.175234,
					-0.284744,
					-0.330402,
					-0.223716,
					-0.331234,
					-0.364677,
					-0.054781,
					-0.25481,
					-0.372875,
					-0.093195,
					-0.306203,
					-0.368249,
					-0.1348,
					-0.357709,
					-0.350334,
					-0.168856,
					-0.397131,
					-0.305157,
					0.125845,
					-0.201761,
					-0.124979,
					-0.126188,
					-0.095691,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.112201,
					-0.352051,
					-0.101275,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.108008,
					-0.343615,
					-0.111135,
					-0.07101,
					-0.408695,
					-0.050584,
					-0.067721,
					-0.389327,
					-0.055536,
					-0.066305,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "moth-contract",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.152604,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047237,
					0.031933,
					-0.1775,
					0.034778,
					0.077953,
					-0.17349,
					-0.007969,
					0.012107,
					-0.19026,
					0.011268,
					0,
					-0.195266,
					0.013416,
					0.022675,
					-0.200985,
					-0.020735,
					0,
					-0.208472,
					-0.012846,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.234283,
					-0.085533,
					-0.138323,
					0.174884,
					-0.132913,
					-0.113097,
					0.207634,
					-0.231549,
					-0.134471,
					0.226213,
					-0.284505,
					-0.129715,
					0.303646,
					-0.249765,
					-0.187032,
					0.287253,
					-0.199357,
					-0.174588,
					0.148692,
					-0.257925,
					-0.102072,
					0.137487,
					-0.303309,
					-0.093105,
					0.268343,
					-0.14019,
					-0.15932,
					0.190995,
					-0.18047,
					-0.1275,
					0.139262,
					-0.213111,
					-0.106757,
					0.30902,
					-0.299777,
					-0.206137,
					0.226345,
					-0.32912,
					-0.136539,
					0.141906,
					-0.339919,
					-0.095351,
					0.310345,
					-0.372472,
					-0.227977,
					0.222655,
					-0.414049,
					-0.140283,
					0.141797,
					-0.398041,
					-0.097986,
					0.058895,
					-0.319185,
					-0.033172,
					0.054644,
					-0.338214,
					-0.043789,
					0.078456,
					-0.294698,
					-0.051931,
					0.095994,
					-0.324306,
					-0.06354,
					0.037057,
					-0.427939,
					-0.039633,
					0,
					-0.441917,
					-0.022979,
					0.077005,
					-0.469724,
					-0.070765,
					0,
					-0.472511,
					-0.044164,
					0.060377,
					-0.405885,
					-0.048496,
					0.053853,
					-0.351998,
					-0.046806,
					0.043708,
					-0.38162,
					-0.025956,
					0.08371,
					-0.374826,
					-0.068656,
					0.027502,
					-0.304871,
					0.004122,
					0.037614,
					-0.289311,
					-0.014279,
					0.069324,
					-0.346847,
					-0.06244,
					0.097564,
					-0.344482,
					-0.075445,
					0.05771,
					-0.344507,
					-0.056991,
					0.054333,
					-0.350539,
					-0.057833,
					0.041103,
					-0.335142,
					-0.032629,
					0.050734,
					-0.340344,
					-0.049884,
					0.049733,
					-0.328087,
					-0.029611,
					0.023524,
					-0.321632,
					0.00451,
					0.018537,
					-0.331218,
					-0.006712,
					0,
					-0.320184,
					0.01854,
					0,
					-0.305455,
					0.016891,
					0,
					-0.330714,
					0.001971,
					0.108069,
					-0.229274,
					-0.086196,
					0.032265,
					-0.234699,
					-0.032338,
					0.011562,
					-0.282897,
					-0.007642,
					0,
					-0.28923,
					0.002456,
					0.107404,
					-0.194966,
					-0.0861,
					0.134935,
					-0.17874,
					-0.102034,
					0,
					-0.242487,
					-0.020033,
					0.118593,
					-0.160678,
					-0.086707,
					0,
					-0.5272,
					-0.038304,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.510218,
					-0.208261,
					0.314735,
					-0.43144,
					-0.300998,
					0.346307,
					-0.386706,
					-0.354705,
					0.334428,
					-0.334216,
					-0.288882,
					0.382181,
					-0.311069,
					-0.446371,
					0.374865,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.284991,
					-0.064413,
					-0.162758,
					0.308989,
					-0.117005,
					-0.188915,
					0.320874,
					-0.176181,
					-0.212989,
					0.329773,
					-0.224885,
					-0.230996,
					0.331519,
					-0.269516,
					-0.252437,
					0.363227,
					-0.069628,
					-0.251188,
					0.367015,
					-0.12133,
					-0.293244,
					0.370468,
					-0.16694,
					-0.329129,
					0.371912,
					-0.205758,
					-0.361686,
					0.305157,
					0.125845,
					-0.201761,
					0.124979,
					-0.133158,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.037825,
					-0.368967,
					-0.024234,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.035566,
					-0.361747,
					-0.026292,
					0,
					-0.605289,
					-0.070169,
					0.030412,
					-0.408611,
					-0.019017,
					0.024459,
					-0.389492,
					-0.015937,
					0,
					-0.422288,
					-0.002576,
					0,
					-0.40032,
					0.001325,
					0,
					-0.384996,
					-0.004356,
					0.021466,
					-0.377849,
					-0.019605,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.152604,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.031933,
					-0.1775,
					0.034778,
					-0.077953,
					-0.17349,
					-0.007969,
					-0.012107,
					-0.19026,
					0.011268,
					-0.022675,
					-0.200985,
					-0.020735,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.234283,
					-0.085533,
					-0.138323,
					-0.174884,
					-0.132913,
					-0.113097,
					-0.207634,
					-0.231549,
					-0.134471,
					-0.303646,
					-0.249765,
					-0.187032,
					-0.226213,
					-0.284505,
					-0.129715,
					-0.287253,
					-0.199357,
					-0.174588,
					-0.148692,
					-0.257925,
					-0.102072,
					-0.137487,
					-0.303309,
					-0.093105,
					-0.190995,
					-0.18047,
					-0.1275,
					-0.268343,
					-0.14019,
					-0.15932,
					-0.139262,
					-0.213111,
					-0.106757,
					-0.30902,
					-0.299777,
					-0.206137,
					-0.226345,
					-0.32912,
					-0.136539,
					-0.141906,
					-0.339919,
					-0.095351,
					-0.310345,
					-0.372472,
					-0.227977,
					-0.222655,
					-0.414049,
					-0.140283,
					-0.141797,
					-0.398041,
					-0.097986,
					-0.058895,
					-0.319185,
					-0.033172,
					-0.078456,
					-0.294698,
					-0.051931,
					-0.054644,
					-0.338214,
					-0.043789,
					-0.095994,
					-0.324306,
					-0.06354,
					-0.037057,
					-0.427939,
					-0.039633,
					-0.077005,
					-0.469724,
					-0.070765,
					-0.060377,
					-0.405885,
					-0.048496,
					-0.053853,
					-0.351998,
					-0.046806,
					-0.08371,
					-0.374826,
					-0.068656,
					-0.043708,
					-0.38162,
					-0.025956,
					-0.027502,
					-0.304871,
					0.004122,
					-0.037614,
					-0.289311,
					-0.014279,
					-0.069324,
					-0.346847,
					-0.06244,
					-0.097564,
					-0.344482,
					-0.075445,
					-0.05771,
					-0.344507,
					-0.056991,
					-0.054333,
					-0.350539,
					-0.057833,
					-0.041103,
					-0.335142,
					-0.032629,
					-0.049733,
					-0.328087,
					-0.029611,
					-0.050734,
					-0.340344,
					-0.049884,
					-0.023524,
					-0.321632,
					0.00451,
					-0.018537,
					-0.331218,
					-0.006712,
					-0.108069,
					-0.229274,
					-0.086196,
					-0.032265,
					-0.234699,
					-0.032338,
					-0.011562,
					-0.282897,
					-0.007642,
					-0.107404,
					-0.194966,
					-0.0861,
					-0.134935,
					-0.17874,
					-0.102034,
					-0.118593,
					-0.160678,
					-0.086707,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.510218,
					-0.208261,
					-0.314735,
					-0.43144,
					-0.300998,
					-0.334428,
					-0.334216,
					-0.288882,
					-0.346307,
					-0.386706,
					-0.354705,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.374865,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.284991,
					-0.064413,
					-0.162758,
					-0.308989,
					-0.117005,
					-0.188915,
					-0.320874,
					-0.176181,
					-0.212989,
					-0.329773,
					-0.224885,
					-0.230996,
					-0.331519,
					-0.269516,
					-0.252437,
					-0.363227,
					-0.069628,
					-0.251188,
					-0.367015,
					-0.12133,
					-0.293244,
					-0.370468,
					-0.16694,
					-0.329129,
					-0.371912,
					-0.205758,
					-0.361686,
					-0.305157,
					0.125845,
					-0.201761,
					-0.124979,
					-0.133158,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.037825,
					-0.368967,
					-0.024234,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.035566,
					-0.361747,
					-0.026292,
					-0.030412,
					-0.408611,
					-0.019017,
					-0.024459,
					-0.389492,
					-0.015937,
					-0.021466,
					-0.377849,
					-0.019605
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "mouth-eh",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.122066,
					-0.052976,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.239175,
					-0.078209,
					-0.138323,
					0.18166,
					-0.122882,
					-0.113097,
					0.240403,
					-0.196397,
					-0.153569,
					0.268936,
					-0.244042,
					-0.173611,
					0.321958,
					-0.22702,
					-0.23226,
					0.306164,
					-0.175438,
					-0.202607,
					0.19984,
					-0.222931,
					-0.137063,
					0.231889,
					-0.260959,
					-0.147527,
					0.278642,
					-0.126436,
					-0.165216,
					0.206916,
					-0.16255,
					-0.130357,
					0.161635,
					-0.187758,
					-0.111603,
					0.330048,
					-0.278031,
					-0.252123,
					0.274442,
					-0.309888,
					-0.178593,
					0.235749,
					-0.304745,
					-0.159783,
					0.32413,
					-0.356554,
					-0.280919,
					0.266956,
					-0.381124,
					-0.208303,
					0.237713,
					-0.366575,
					-0.185178,
					0.169403,
					-0.304026,
					-0.134118,
					0.186307,
					-0.302794,
					-0.178342,
					0.173339,
					-0.265699,
					-0.142818,
					0.204414,
					-0.288771,
					-0.163284,
					0.100163,
					-0.428606,
					-0.078018,
					0,
					-0.444429,
					-0.049663,
					0.115203,
					-0.461692,
					-0.076805,
					0,
					-0.477273,
					-0.056873,
					0.148671,
					-0.390695,
					-0.153768,
					0.185785,
					-0.312269,
					-0.195421,
					0.146311,
					-0.367973,
					-0.147587,
					0.207854,
					-0.339181,
					-0.187923,
					0.077979,
					-0.303404,
					-0.032232,
					0.093755,
					-0.284624,
					-0.054397,
					0.197033,
					-0.310276,
					-0.182915,
					0.207517,
					-0.30914,
					-0.176941,
					0.19424,
					-0.303754,
					-0.194643,
					0.178873,
					-0.30647,
					-0.202077,
					0.150087,
					-0.312066,
					-0.159936,
					0.177443,
					-0.301398,
					-0.190693,
					0.16304,
					-0.312208,
					-0.143359,
					0.075702,
					-0.317599,
					-0.047937,
					0.070243,
					-0.32659,
					-0.078264,
					0,
					-0.32361,
					-0.038674,
					0,
					-0.307859,
					-0.022071,
					0,
					-0.328828,
					-0.054869,
					0.131927,
					-0.207984,
					-0.09501,
					0.055363,
					-0.234589,
					-0.037596,
					0.040271,
					-0.28186,
					-0.02608,
					0,
					-0.288589,
					-0.024455,
					0.10975,
					-0.168444,
					-0.0861,
					0.138842,
					-0.153579,
					-0.099824,
					0,
					-0.242487,
					-0.027512,
					0.121417,
					-0.143367,
					-0.086707,
					0,
					-0.52733,
					-0.039309,
					0.125105,
					-0.503421,
					-0.077045,
					0.229002,
					-0.510218,
					-0.208261,
					0.31843,
					-0.428674,
					-0.312063,
					0.350098,
					-0.383595,
					-0.367148,
					0.348293,
					-0.319041,
					-0.333746,
					0.38216,
					-0.311069,
					-0.446371,
					0.375427,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253955,
					-0.003183,
					-0.154543,
					0.319209,
					0.027919,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.3517,
					-0.019874,
					-0.220536,
					0.288002,
					-0.05894,
					-0.162758,
					0.319142,
					-0.104172,
					-0.19377,
					0.340042,
					-0.153156,
					-0.236671,
					0.348918,
					-0.201874,
					-0.272379,
					0.348906,
					-0.250221,
					-0.300426,
					0.368708,
					-0.061805,
					-0.251188,
					0.377118,
					-0.113288,
					-0.294048,
					0.378139,
					-0.1616,
					-0.332586,
					0.374764,
					-0.204505,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.127985,
					-0.119661,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.142808,
					-0.354216,
					-0.154122,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.136719,
					-0.34266,
					-0.162417,
					0,
					-0.605289,
					-0.070169,
					0.087275,
					-0.409525,
					-0.07094,
					0.077696,
					-0.393213,
					-0.083089,
					0,
					-0.427842,
					-0.051845,
					0,
					-0.413109,
					-0.05801,
					0,
					-0.402147,
					-0.066091,
					0.076809,
					-0.38587,
					-0.099848,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.122061,
					-0.052988,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.239165,
					-0.078224,
					-0.138323,
					-0.18166,
					-0.122951,
					-0.113097,
					-0.240366,
					-0.196635,
					-0.153459,
					-0.321952,
					-0.227158,
					-0.23226,
					-0.268285,
					-0.244198,
					-0.173424,
					-0.306158,
					-0.17555,
					-0.202606,
					-0.198364,
					-0.223657,
					-0.136958,
					-0.22998,
					-0.262417,
					-0.147382,
					-0.206913,
					-0.162777,
					-0.130242,
					-0.27863,
					-0.12645,
					-0.165209,
					-0.161639,
					-0.187686,
					-0.111638,
					-0.330044,
					-0.27817,
					-0.252123,
					-0.273846,
					-0.309735,
					-0.17858,
					-0.238328,
					-0.304847,
					-0.159959,
					-0.324114,
					-0.356728,
					-0.280914,
					-0.265911,
					-0.380839,
					-0.208299,
					-0.236667,
					-0.366716,
					-0.185186,
					-0.169675,
					-0.303747,
					-0.134245,
					-0.173588,
					-0.265771,
					-0.142644,
					-0.180895,
					-0.302551,
					-0.178471,
					-0.204147,
					-0.288931,
					-0.162553,
					-0.100163,
					-0.428693,
					-0.078018,
					-0.115203,
					-0.461918,
					-0.076805,
					-0.148509,
					-0.390595,
					-0.153766,
					-0.182734,
					-0.31226,
					-0.195434,
					-0.207805,
					-0.339098,
					-0.18805,
					-0.146235,
					-0.367903,
					-0.147585,
					-0.077979,
					-0.30315,
					-0.032568,
					-0.093755,
					-0.284444,
					-0.054397,
					-0.191523,
					-0.310273,
					-0.182796,
					-0.211611,
					-0.309007,
					-0.177024,
					-0.185538,
					-0.303748,
					-0.194655,
					-0.178982,
					-0.306471,
					-0.202077,
					-0.15039,
					-0.312187,
					-0.159938,
					-0.163301,
					-0.31231,
					-0.14336,
					-0.17761,
					-0.301428,
					-0.190694,
					-0.075702,
					-0.317455,
					-0.047937,
					-0.070243,
					-0.32645,
					-0.078264,
					-0.132234,
					-0.207857,
					-0.095125,
					-0.055363,
					-0.234325,
					-0.037596,
					-0.040271,
					-0.28151,
					-0.026082,
					-0.109753,
					-0.168284,
					-0.0861,
					-0.138843,
					-0.153556,
					-0.099752,
					-0.121418,
					-0.143261,
					-0.086707,
					-0.125105,
					-0.503421,
					-0.077045,
					-0.229002,
					-0.510218,
					-0.208261,
					-0.31843,
					-0.428674,
					-0.312063,
					-0.348296,
					-0.319038,
					-0.33375,
					-0.350098,
					-0.383595,
					-0.367148,
					-0.38216,
					-0.311069,
					-0.446371,
					-0.375427,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253955,
					-0.003183,
					-0.154543,
					-0.319208,
					0.027919,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.351704,
					-0.019867,
					-0.220536,
					-0.287999,
					-0.058946,
					-0.162758,
					-0.319122,
					-0.104186,
					-0.19376,
					-0.340038,
					-0.15316,
					-0.236667,
					-0.348916,
					-0.201876,
					-0.272378,
					-0.34892,
					-0.250202,
					-0.300425,
					-0.368708,
					-0.061806,
					-0.251188,
					-0.37711,
					-0.113296,
					-0.294039,
					-0.378162,
					-0.161566,
					-0.33258,
					-0.374763,
					-0.204505,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.127983,
					-0.119596,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.142771,
					-0.354179,
					-0.154129,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.136713,
					-0.342653,
					-0.16237,
					-0.087275,
					-0.40961,
					-0.07094,
					-0.077696,
					-0.393287,
					-0.083089,
					-0.07669,
					-0.3858,
					-0.099846
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.146966,
					-0.161883,
					0.279699,
					0.142791,
					-0.18889,
					0.277173,
					0.17785,
					-0.180998,
					0.232182,
					0.177877,
					-0.1574,
					0.183143,
					0.17287,
					-0.159898,
					0.185716,
					0.14379,
					-0.156667,
					0.151382,
					0.15554,
					-0.162529,
					0.309714,
					0.146343,
					-0.22245,
					0.305157,
					0.158261,
					-0.201761,
					0.142249,
					0.139745,
					-0.175351,
					0.15112,
					0.137022,
					-0.165163,
					-0.185716,
					0.14379,
					-0.156667,
					-0.151382,
					0.15554,
					-0.162529,
					-0.183143,
					0.17287,
					-0.159898,
					-0.279699,
					0.142791,
					-0.18889,
					-0.305157,
					0.158261,
					-0.201761,
					-0.309714,
					0.146343,
					-0.22245,
					-0.142249,
					0.139745,
					-0.175351,
					-0.15112,
					0.137022,
					-0.165163,
					-0.277173,
					0.17785,
					-0.180998,
					-0.232182,
					0.177877,
					-0.1574,
					-0.2297,
					0.146966,
					-0.161883
				]
			},
			"name": "emo-glad",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.049658,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.121243,
					-0.044789,
					-0.09405,
					0.183153,
					0.04387,
					-0.116559,
					0.234304,
					0.018031,
					-0.115074,
					0.176093,
					-0.091314,
					-0.121831,
					0.221874,
					-0.219209,
					-0.164294,
					0.241987,
					-0.277888,
					-0.157915,
					0.306483,
					-0.199888,
					-0.23212,
					0.290564,
					-0.137528,
					-0.203997,
					0.172963,
					-0.257925,
					-0.120296,
					0.193472,
					-0.303309,
					-0.119153,
					0.269511,
					-0.02655,
					-0.139449,
					0.200158,
					-0.145874,
					-0.172258,
					0.153183,
					-0.200764,
					-0.129313,
					0.316047,
					-0.223928,
					-0.255099,
					0.256453,
					-0.313732,
					-0.170077,
					0.206227,
					-0.339919,
					-0.126553,
					0.313136,
					-0.308127,
					-0.27959,
					0.238439,
					-0.404274,
					-0.178247,
					0.194203,
					-0.394719,
					-0.127012,
					0.1389,
					-0.319522,
					-0.073007,
					0.149351,
					-0.339445,
					-0.104638,
					0.144112,
					-0.294698,
					-0.079721,
					0.167479,
					-0.324306,
					-0.103252,
					0.077238,
					-0.429326,
					-0.06353,
					0,
					-0.440253,
					-0.035507,
					0.095841,
					-0.470373,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.126596,
					-0.408323,
					-0.084668,
					0.147383,
					-0.353823,
					-0.114221,
					0.115996,
					-0.384963,
					-0.081272,
					0.167924,
					-0.375474,
					-0.11165,
					0.075563,
					-0.304321,
					-0.021487,
					0.089321,
					-0.289214,
					-0.036301,
					0.165999,
					-0.347759,
					-0.116507,
					0.181297,
					-0.344482,
					-0.117068,
					0.15415,
					-0.345961,
					-0.118449,
					0.141856,
					-0.352417,
					-0.12046,
					0.121892,
					-0.336462,
					-0.092747,
					0.14114,
					-0.341957,
					-0.113448,
					0.132517,
					-0.328741,
					-0.079014,
					0.0726,
					-0.32102,
					-0.028674,
					0.066498,
					-0.330196,
					-0.049199,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.12501,
					-0.219718,
					-0.094915,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.107404,
					-0.175854,
					-0.097579,
					0.134935,
					-0.153467,
					-0.126563,
					0,
					-0.242487,
					-0.027512,
					0.118593,
					-0.145811,
					-0.103781,
					0,
					-0.52733,
					-0.039309,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.502439,
					-0.218674,
					0.311859,
					-0.415848,
					-0.312063,
					0.341718,
					-0.36556,
					-0.369803,
					0.338482,
					-0.268555,
					-0.336828,
					0.382181,
					-0.294632,
					-0.456609,
					0.374603,
					-0.235166,
					-0.412506,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.158656,
					-0.156835,
					0.122035,
					0.159994,
					-0.128418,
					0.089221,
					0.121024,
					-0.142426,
					0.110219,
					0.124473,
					-0.159984,
					0.189081,
					0.095116,
					-0.145002,
					0.186106,
					0.118347,
					-0.151745,
					0.136326,
					0.114549,
					-0.157315,
					0.120067,
					0.089555,
					-0.143441,
					0.232322,
					0.12874,
					-0.160961,
					0.238084,
					0.11108,
					-0.149546,
					0.284292,
					0.130235,
					-0.190588,
					0.29484,
					0.121034,
					-0.197803,
					0.336938,
					0.127028,
					-0.243338,
					0.321543,
					0.136284,
					-0.231047,
					0.331825,
					0.16447,
					-0.200533,
					0.318381,
					0.161581,
					-0.204874,
					0.309939,
					0.262756,
					-0.150639,
					0.151382,
					0.15554,
					-0.162529,
					0.128763,
					0.130528,
					-0.167775,
					0.185716,
					0.14379,
					-0.156667,
					0.15112,
					0.137022,
					-0.165163,
					0.2297,
					0.147133,
					-0.161883,
					0.309714,
					0.146343,
					-0.22245,
					0.279699,
					0.142791,
					-0.18889,
					0.142249,
					0.139745,
					-0.175351,
					0.233523,
					0.187096,
					-0.155951,
					0.182252,
					0.179401,
					-0.156366,
					0.232182,
					0.177877,
					-0.1574,
					0.183143,
					0.17287,
					-0.159898,
					0.252282,
					0.227877,
					-0.104641,
					0.185157,
					0.211468,
					-0.088473,
					0.239806,
					0.194763,
					-0.134133,
					0.181263,
					0.183815,
					-0.131359,
					0.108741,
					0.175505,
					-0.080994,
					0.065585,
					0.120838,
					-0.100974,
					0.253825,
					0.095419,
					-0.154543,
					0.320375,
					0.09618,
					-0.206963,
					0.363079,
					0.106107,
					-0.259092,
					0.352279,
					0.189356,
					-0.19306,
					0.304534,
					0.216918,
					-0.141132,
					0.253892,
					0.287939,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212633,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.390015,
					0.066384,
					-0.287901,
					0.35329,
					0.050328,
					-0.220536,
					0.286192,
					0.061765,
					-0.15863,
					0.312051,
					-0.008036,
					-0.183557,
					0.324614,
					-0.101655,
					-0.23507,
					0.333789,
					-0.146441,
					-0.276818,
					0.338473,
					-0.184693,
					-0.302885,
					0.36646,
					-0.010848,
					-0.251188,
					0.367015,
					-0.058784,
					-0.29674,
					0.370468,
					-0.102499,
					-0.335846,
					0.371912,
					-0.156097,
					-0.368885,
					0.305157,
					0.158261,
					-0.201761,
					0.124979,
					-0.116616,
					-0.114989,
					0.087979,
					-0.090294,
					-0.036241,
					0.11101,
					-0.373207,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.187172,
					-0.167135,
					0.279843,
					0.186325,
					-0.179454,
					0.277173,
					0.17785,
					-0.180998,
					0.106631,
					-0.366109,
					-0.094343,
					0,
					-0.605289,
					-0.070169,
					0.071127,
					-0.408695,
					-0.050584,
					0.067721,
					-0.389327,
					-0.055536,
					0,
					-0.415177,
					-0.022688,
					0,
					-0.391953,
					-0.027089,
					0,
					-0.382922,
					-0.038809,
					0.066305,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.049658,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.044789,
					-0.09405,
					-0.183153,
					0.04387,
					-0.116559,
					-0.234304,
					0.018031,
					-0.115074,
					-0.176093,
					-0.091314,
					-0.121831,
					-0.221874,
					-0.219209,
					-0.164294,
					-0.306483,
					-0.199888,
					-0.23212,
					-0.241987,
					-0.277888,
					-0.157915,
					-0.290564,
					-0.137528,
					-0.203997,
					-0.172963,
					-0.257925,
					-0.120296,
					-0.193472,
					-0.303309,
					-0.119153,
					-0.200158,
					-0.145874,
					-0.172258,
					-0.269511,
					-0.02655,
					-0.139449,
					-0.153183,
					-0.200764,
					-0.129313,
					-0.316047,
					-0.223927,
					-0.255099,
					-0.256453,
					-0.313732,
					-0.170077,
					-0.206227,
					-0.339919,
					-0.126553,
					-0.328366,
					-0.308127,
					-0.27959,
					-0.238439,
					-0.404274,
					-0.178247,
					-0.194203,
					-0.394719,
					-0.127012,
					-0.1389,
					-0.319522,
					-0.073007,
					-0.144112,
					-0.294698,
					-0.079721,
					-0.149351,
					-0.339445,
					-0.104638,
					-0.167479,
					-0.324306,
					-0.103252,
					-0.077238,
					-0.429326,
					-0.06353,
					-0.095841,
					-0.470373,
					-0.075102,
					-0.126596,
					-0.408323,
					-0.084668,
					-0.147383,
					-0.353823,
					-0.114221,
					-0.167924,
					-0.375474,
					-0.11165,
					-0.115996,
					-0.384963,
					-0.081272,
					-0.075563,
					-0.304321,
					-0.021487,
					-0.089321,
					-0.289214,
					-0.036301,
					-0.165999,
					-0.347759,
					-0.116507,
					-0.181297,
					-0.344482,
					-0.117068,
					-0.15415,
					-0.345961,
					-0.118449,
					-0.141856,
					-0.352417,
					-0.12046,
					-0.121892,
					-0.336462,
					-0.092747,
					-0.132517,
					-0.328741,
					-0.079014,
					-0.14114,
					-0.341957,
					-0.113448,
					-0.0726,
					-0.32102,
					-0.028674,
					-0.066498,
					-0.330196,
					-0.049199,
					-0.12501,
					-0.219718,
					-0.094915,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.107404,
					-0.175854,
					-0.097579,
					-0.134935,
					-0.153467,
					-0.126563,
					-0.118593,
					-0.145811,
					-0.103781,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.502439,
					-0.218674,
					-0.325045,
					-0.415848,
					-0.312063,
					-0.351908,
					-0.266731,
					-0.337289,
					-0.35856,
					-0.364826,
					-0.370261,
					-0.382181,
					-0.294627,
					-0.456612,
					-0.375127,
					-0.235166,
					-0.412509,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.06247,
					-0.567515,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.158656,
					-0.156835,
					-0.089221,
					0.121024,
					-0.142426,
					-0.122035,
					0.159994,
					-0.128418,
					-0.110219,
					0.124473,
					-0.159984,
					-0.189081,
					0.095116,
					-0.145002,
					-0.136326,
					0.114549,
					-0.157315,
					-0.186106,
					0.118347,
					-0.151745,
					-0.120067,
					0.089555,
					-0.143441,
					-0.232322,
					0.12874,
					-0.160961,
					-0.238084,
					0.11108,
					-0.149546,
					-0.284292,
					0.130235,
					-0.190588,
					-0.336938,
					0.127028,
					-0.243338,
					-0.29484,
					0.121034,
					-0.197803,
					-0.321543,
					0.136284,
					-0.231047,
					-0.331825,
					0.16447,
					-0.200533,
					-0.318381,
					0.161581,
					-0.204874,
					-0.309939,
					0.262756,
					-0.150639,
					-0.151382,
					0.15554,
					-0.162529,
					-0.128763,
					0.130528,
					-0.167775,
					-0.15112,
					0.137022,
					-0.165163,
					-0.185716,
					0.14379,
					-0.156667,
					-0.2297,
					0.147133,
					-0.161883,
					-0.309714,
					0.146343,
					-0.22245,
					-0.279699,
					0.142791,
					-0.18889,
					-0.142249,
					0.139745,
					-0.175351,
					-0.233523,
					0.187096,
					-0.155951,
					-0.232182,
					0.177877,
					-0.1574,
					-0.182252,
					0.179401,
					-0.156366,
					-0.183143,
					0.17287,
					-0.159898,
					-0.252282,
					0.227877,
					-0.104641,
					-0.239806,
					0.194763,
					-0.134133,
					-0.185157,
					0.211468,
					-0.088473,
					-0.181263,
					0.183815,
					-0.131359,
					-0.108741,
					0.175505,
					-0.080994,
					-0.065585,
					0.120838,
					-0.100974,
					-0.253825,
					0.095419,
					-0.154543,
					-0.320375,
					0.09618,
					-0.206963,
					-0.363079,
					0.106107,
					-0.259092,
					-0.352279,
					0.189356,
					-0.19306,
					-0.253892,
					0.287939,
					-0.101722,
					-0.304534,
					0.216918,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212633,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.390015,
					0.066384,
					-0.287901,
					-0.35329,
					0.050328,
					-0.220536,
					-0.286192,
					0.061765,
					-0.15863,
					-0.312051,
					-0.008036,
					-0.183557,
					-0.324614,
					-0.101655,
					-0.23507,
					-0.333789,
					-0.14644,
					-0.276818,
					-0.338473,
					-0.184692,
					-0.302885,
					-0.36646,
					-0.010848,
					-0.251188,
					-0.367015,
					-0.058784,
					-0.29674,
					-0.370468,
					-0.102499,
					-0.335846,
					-0.371912,
					-0.1561,
					-0.368883,
					-0.305157,
					0.158261,
					-0.201761,
					-0.124979,
					-0.116616,
					-0.114989,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.11101,
					-0.373207,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.187172,
					-0.167135,
					-0.279843,
					0.186325,
					-0.179454,
					-0.277173,
					0.17785,
					-0.180998,
					-0.106631,
					-0.366109,
					-0.094343,
					-0.071127,
					-0.408695,
					-0.050584,
					-0.067721,
					-0.389327,
					-0.055536,
					-0.066305,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "nose-inflated",
			"face": {
				"vertices": [
					0.038579,
					-0.083201,
					0.013234,
					0,
					-0.056326,
					0.031237,
					0,
					-0.104467,
					0.069954,
					0.039984,
					-0.105291,
					0.022372,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					-0.004204,
					-0.005352,
					0.042429,
					-0.008568,
					-0.030804,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.059897,
					0,
					-0.145772,
					0.071614,
					0.046919,
					-0.143418,
					0.038372,
					0.117429,
					-0.142084,
					-0.031347,
					0.112554,
					-0.119867,
					-0.041413,
					0,
					-0.163983,
					0.047131,
					0.039695,
					-0.171343,
					0.047475,
					0.097358,
					-0.160734,
					-0.007969,
					0.014672,
					-0.18745,
					0.009363,
					0,
					-0.190329,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.206996,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.234283,
					-0.085533,
					-0.147597,
					0.176093,
					-0.132913,
					-0.113097,
					0.221874,
					-0.230809,
					-0.144174,
					0.241987,
					-0.279391,
					-0.157915,
					0.306483,
					-0.240744,
					-0.22545,
					0.290564,
					-0.191496,
					-0.196317,
					0.172963,
					-0.257925,
					-0.113391,
					0.193472,
					-0.303309,
					-0.119153,
					0.268343,
					-0.139532,
					-0.163265,
					0.200158,
					-0.18028,
					-0.128637,
					0.153183,
					-0.207138,
					-0.106757,
					0.316047,
					-0.286909,
					-0.248207,
					0.256453,
					-0.324421,
					-0.170077,
					0.206227,
					-0.339919,
					-0.126553,
					0.320751,
					-0.358534,
					-0.27881,
					0.238439,
					-0.412053,
					-0.167834,
					0.194203,
					-0.398041,
					-0.122565,
					0.1389,
					-0.319522,
					-0.073007,
					0.149351,
					-0.339445,
					-0.104638,
					0.144112,
					-0.294698,
					-0.079721,
					0.167479,
					-0.324306,
					-0.103252,
					0.077238,
					-0.429326,
					-0.06353,
					0,
					-0.440253,
					-0.035507,
					0.095841,
					-0.470373,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.126596,
					-0.408323,
					-0.084668,
					0.147383,
					-0.353823,
					-0.114221,
					0.115996,
					-0.384963,
					-0.081272,
					0.167924,
					-0.375573,
					-0.111517,
					0.075563,
					-0.304321,
					-0.021487,
					0.089321,
					-0.289214,
					-0.036301,
					0.165999,
					-0.347759,
					-0.116507,
					0.181297,
					-0.344482,
					-0.117068,
					0.15415,
					-0.345961,
					-0.118449,
					0.141856,
					-0.352417,
					-0.12046,
					0.121892,
					-0.336462,
					-0.092747,
					0.14114,
					-0.341957,
					-0.113448,
					0.132517,
					-0.328741,
					-0.079014,
					0.0726,
					-0.32102,
					-0.028674,
					0.066498,
					-0.330196,
					-0.049199,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.12501,
					-0.219718,
					-0.086196,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.115638,
					-0.175629,
					-0.056826,
					0.134935,
					-0.163211,
					-0.102034,
					0,
					-0.242487,
					-0.027512,
					0.113329,
					-0.141797,
					-0.086707,
					0,
					-0.52733,
					-0.039309,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.510218,
					-0.208261,
					0.318452,
					-0.428674,
					-0.312063,
					0.350139,
					-0.383595,
					-0.367148,
					0.345195,
					-0.320538,
					-0.332002,
					0.382181,
					-0.311069,
					-0.446371,
					0.374865,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408718,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.284991,
					-0.064413,
					-0.162758,
					0.308989,
					-0.116614,
					-0.191262,
					0.324462,
					-0.168301,
					-0.230756,
					0.333789,
					-0.214756,
					-0.265984,
					0.338473,
					-0.256922,
					-0.295368,
					0.363227,
					-0.069628,
					-0.251188,
					0.367015,
					-0.12133,
					-0.293244,
					0.370468,
					-0.165309,
					-0.33172,
					0.371912,
					-0.204505,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.128261,
					-0.127185,
					-0.096468,
					0.078925,
					-0.092856,
					-0.02128,
					0.11101,
					-0.373207,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.106631,
					-0.366109,
					-0.094343,
					0,
					-0.605289,
					-0.070169,
					0.071127,
					-0.408695,
					-0.050584,
					0.067721,
					-0.389327,
					-0.055536,
					0,
					-0.415177,
					-0.022688,
					0,
					-0.391953,
					-0.027089,
					0,
					-0.382922,
					-0.038809,
					0.066305,
					-0.381269,
					-0.067569,
					-0.038579,
					-0.083201,
					0.013234,
					-0.039984,
					-0.105291,
					0.022372,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.030804,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.059897,
					-0.046919,
					-0.143418,
					0.038372,
					-0.117429,
					-0.142084,
					-0.031347,
					-0.112554,
					-0.119867,
					-0.041413,
					-0.039695,
					-0.171343,
					0.047475,
					-0.097358,
					-0.160734,
					-0.007969,
					-0.014672,
					-0.18745,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.234283,
					-0.085533,
					-0.138323,
					-0.176093,
					-0.132913,
					-0.113097,
					-0.221874,
					-0.230809,
					-0.144174,
					-0.306483,
					-0.240744,
					-0.22545,
					-0.241987,
					-0.279391,
					-0.157915,
					-0.290564,
					-0.191496,
					-0.196317,
					-0.172963,
					-0.257925,
					-0.113391,
					-0.193472,
					-0.303309,
					-0.119153,
					-0.200158,
					-0.18028,
					-0.128637,
					-0.268343,
					-0.139532,
					-0.163265,
					-0.153183,
					-0.207138,
					-0.106757,
					-0.316047,
					-0.286909,
					-0.248207,
					-0.256453,
					-0.324421,
					-0.170077,
					-0.206227,
					-0.339919,
					-0.126553,
					-0.320751,
					-0.358534,
					-0.27881,
					-0.238439,
					-0.412053,
					-0.167834,
					-0.194203,
					-0.398041,
					-0.122565,
					-0.1389,
					-0.319522,
					-0.073007,
					-0.144112,
					-0.294698,
					-0.079721,
					-0.149351,
					-0.339445,
					-0.104638,
					-0.167479,
					-0.324306,
					-0.103252,
					-0.077238,
					-0.429326,
					-0.06353,
					-0.095841,
					-0.470373,
					-0.075102,
					-0.126596,
					-0.408323,
					-0.084668,
					-0.147383,
					-0.353823,
					-0.114221,
					-0.167924,
					-0.375573,
					-0.111517,
					-0.115996,
					-0.384963,
					-0.081272,
					-0.075563,
					-0.304321,
					-0.021487,
					-0.089321,
					-0.289214,
					-0.036301,
					-0.165999,
					-0.347759,
					-0.116507,
					-0.181297,
					-0.344482,
					-0.117068,
					-0.15415,
					-0.345961,
					-0.118449,
					-0.141856,
					-0.352417,
					-0.12046,
					-0.121892,
					-0.336462,
					-0.092747,
					-0.132517,
					-0.328741,
					-0.079014,
					-0.14114,
					-0.341957,
					-0.113448,
					-0.0726,
					-0.32102,
					-0.028674,
					-0.066498,
					-0.330196,
					-0.049199,
					-0.12501,
					-0.219718,
					-0.086196,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.115638,
					-0.175629,
					-0.056826,
					-0.134935,
					-0.163211,
					-0.102034,
					-0.113329,
					-0.141797,
					-0.086707,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.510218,
					-0.208261,
					-0.318452,
					-0.428674,
					-0.312063,
					-0.345195,
					-0.320538,
					-0.332002,
					-0.350139,
					-0.383595,
					-0.367148,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.374865,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408718,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.284991,
					-0.064413,
					-0.162758,
					-0.308989,
					-0.116614,
					-0.191262,
					-0.324462,
					-0.168301,
					-0.230756,
					-0.333789,
					-0.214756,
					-0.265984,
					-0.338473,
					-0.256922,
					-0.295368,
					-0.363227,
					-0.069628,
					-0.251188,
					-0.367015,
					-0.12133,
					-0.293244,
					-0.370468,
					-0.165309,
					-0.33172,
					-0.371912,
					-0.204505,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.128261,
					-0.127185,
					-0.096468,
					-0.078925,
					-0.092856,
					-0.02128,
					-0.11101,
					-0.373207,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.106631,
					-0.366109,
					-0.094343,
					-0.071127,
					-0.408695,
					-0.050584,
					-0.067721,
					-0.389327,
					-0.055536,
					-0.066305,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "chin-move-right",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.092123,
					-0.151409,
					-0.011075,
					0.093206,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080837,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.031622,
					-0.200985,
					-0.023699,
					0.000631,
					-0.208472,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.235021,
					-0.085533,
					-0.138323,
					0.178315,
					-0.132913,
					-0.113097,
					0.232534,
					-0.230809,
					-0.144174,
					0.264565,
					-0.279391,
					-0.157915,
					0.320247,
					-0.240744,
					-0.22545,
					0.300144,
					-0.191496,
					-0.196317,
					0.189637,
					-0.257925,
					-0.113391,
					0.229286,
					-0.303309,
					-0.119153,
					0.274166,
					-0.139532,
					-0.163265,
					0.206578,
					-0.18028,
					-0.128637,
					0.159417,
					-0.207138,
					-0.106757,
					0.332786,
					-0.286909,
					-0.248207,
					0.291464,
					-0.324421,
					-0.170077,
					0.253664,
					-0.339919,
					-0.126553,
					0.339068,
					-0.358534,
					-0.27881,
					0.297914,
					-0.412053,
					-0.167834,
					0.255344,
					-0.398041,
					-0.122565,
					0.168891,
					-0.319522,
					-0.073007,
					0.196859,
					-0.339445,
					-0.104638,
					0.172275,
					-0.294698,
					-0.079721,
					0.208788,
					-0.324306,
					-0.103252,
					0.151706,
					-0.429326,
					-0.06353,
					0.076729,
					-0.440253,
					-0.035507,
					0.177051,
					-0.470373,
					-0.075102,
					0.080015,
					-0.475131,
					-0.049614,
					0.194397,
					-0.408323,
					-0.084668,
					0.202187,
					-0.353823,
					-0.114221,
					0.183082,
					-0.384963,
					-0.081272,
					0.225429,
					-0.375573,
					-0.111517,
					0.081964,
					-0.304321,
					-0.021487,
					0.096174,
					-0.289214,
					-0.036301,
					0.21877,
					-0.347759,
					-0.116507,
					0.232663,
					-0.344482,
					-0.117068,
					0.205975,
					-0.345961,
					-0.118449,
					0.18977,
					-0.352417,
					-0.12046,
					0.150963,
					-0.336462,
					-0.092747,
					0.186208,
					-0.341957,
					-0.113448,
					0.165297,
					-0.328741,
					-0.079014,
					0.079741,
					-0.32102,
					-0.028674,
					0.07612,
					-0.330196,
					-0.049199,
					0.002456,
					-0.321081,
					-0.008766,
					0.001657,
					-0.306744,
					-0.005393,
					0.002708,
					-0.329258,
					-0.030311,
					0.130201,
					-0.219718,
					-0.086196,
					0.057418,
					-0.234699,
					-0.037596,
					0.042369,
					-0.281992,
					-0.020561,
					0.001389,
					-0.288915,
					-0.013667,
					0.109833,
					-0.175854,
					-0.0861,
					0.137919,
					-0.163211,
					-0.102034,
					0.001124,
					-0.242487,
					-0.027512,
					0.120571,
					-0.151122,
					-0.086707,
					0.078784,
					-0.52733,
					-0.039309,
					0.19591,
					-0.519425,
					-0.077045,
					0.293943,
					-0.510218,
					-0.208261,
					0.339534,
					-0.428674,
					-0.312063,
					0.367371,
					-0.383595,
					-0.367148,
					0.362357,
					-0.320538,
					-0.332002,
					0.39425,
					-0.311069,
					-0.446371,
					0.387598,
					-0.262788,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.415351,
					-0.027461,
					-0.427616,
					0.412529,
					-0.081674,
					-0.455694,
					0.41263,
					-0.12543,
					-0.47894,
					0.429635,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.415705,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.198472,
					-0.589743,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.285876,
					-0.064413,
					-0.162758,
					0.314657,
					-0.116614,
					-0.191262,
					0.333451,
					-0.168301,
					-0.230756,
					0.346766,
					-0.214756,
					-0.265984,
					0.353341,
					-0.256922,
					-0.295368,
					0.366205,
					-0.069628,
					-0.251188,
					0.373868,
					-0.12133,
					-0.293244,
					0.379067,
					-0.165309,
					-0.33172,
					0.38189,
					-0.204505,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.126462,
					-0.127185,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.175897,
					-0.373207,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.164719,
					-0.366109,
					-0.094343,
					0.07574,
					-0.605289,
					-0.070169,
					0.155113,
					-0.408695,
					-0.050584,
					0.142824,
					-0.389327,
					-0.055536,
					0.08629,
					-0.415177,
					-0.022688,
					0.087636,
					-0.391953,
					-0.027089,
					0.079701,
					-0.382922,
					-0.038809,
					0.135208,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.090545,
					-0.151409,
					-0.011075,
					-0.092483,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.079377,
					-0.171101,
					-0.007969,
					-0.014663,
					-0.19026,
					0.009363,
					-0.029724,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.234237,
					-0.085533,
					-0.138323,
					-0.174349,
					-0.132913,
					-0.113097,
					-0.209053,
					-0.227316,
					-0.144174,
					-0.284249,
					-0.233854,
					-0.22545,
					-0.215446,
					-0.27348,
					-0.157915,
					-0.276028,
					-0.18703,
					-0.196317,
					-0.15628,
					-0.255454,
					-0.113391,
					-0.157381,
					-0.299121,
					-0.119153,
					-0.197092,
					-0.180057,
					-0.128637,
					-0.266771,
					-0.139181,
					-0.163265,
					-0.149565,
					-0.207138,
					-0.106757,
					-0.287451,
					-0.278326,
					-0.248207,
					-0.2184,
					-0.317208,
					-0.170077,
					-0.154242,
					-0.335018,
					-0.126553,
					-0.286369,
					-0.348822,
					-0.27881,
					-0.184006,
					-0.406183,
					-0.167834,
					-0.132294,
					-0.393787,
					-0.122565,
					-0.115895,
					-0.319425,
					-0.073007,
					-0.122393,
					-0.293396,
					-0.079721,
					-0.107553,
					-0.337517,
					-0.104638,
					-0.128873,
					-0.321213,
					-0.103252,
					-0.003614,
					-0.429326,
					-0.06353,
					-0.023529,
					-0.470373,
					-0.075102,
					-0.06798,
					-0.408323,
					-0.084668,
					-0.098674,
					-0.352287,
					-0.114221,
					-0.111932,
					-0.373212,
					-0.111517,
					-0.04874,
					-0.384963,
					-0.081272,
					-0.070458,
					-0.304321,
					-0.021487,
					-0.083753,
					-0.289214,
					-0.036301,
					-0.117454,
					-0.34551,
					-0.116507,
					-0.130734,
					-0.341231,
					-0.117068,
					-0.108386,
					-0.344412,
					-0.118449,
					-0.099454,
					-0.351723,
					-0.12046,
					-0.097504,
					-0.336462,
					-0.092747,
					-0.106588,
					-0.328569,
					-0.079014,
					-0.102324,
					-0.340609,
					-0.113448,
					-0.06572,
					-0.32102,
					-0.028674,
					-0.058681,
					-0.330196,
					-0.049199,
					-0.121319,
					-0.219718,
					-0.086196,
					-0.053097,
					-0.234699,
					-0.037596,
					-0.037969,
					-0.281992,
					-0.020561,
					-0.104631,
					-0.175854,
					-0.0861,
					-0.132365,
					-0.163211,
					-0.102034,
					-0.116363,
					-0.151122,
					-0.086707,
					-0.038517,
					-0.519425,
					-0.077045,
					-0.168939,
					-0.50384,
					-0.208261,
					-0.284831,
					-0.419142,
					-0.312063,
					-0.311699,
					-0.311093,
					-0.332002,
					-0.315731,
					-0.373882,
					-0.367148,
					-0.356083,
					-0.303186,
					-0.446371,
					-0.349517,
					-0.254971,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.41459,
					-0.027461,
					-0.427616,
					-0.409743,
					-0.081674,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.408659,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.404638,
					-0.184467,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.050708,
					-0.590351,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.284991,
					-0.064413,
					-0.162758,
					-0.306636,
					-0.11589,
					-0.191262,
					-0.310441,
					-0.163782,
					-0.230756,
					-0.311943,
					-0.207724,
					-0.265984,
					-0.311253,
					-0.24858,
					-0.295368,
					-0.363227,
					-0.069628,
					-0.251188,
					-0.357977,
					-0.118224,
					-0.293244,
					-0.355703,
					-0.160151,
					-0.33172,
					-0.353558,
					-0.198186,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.123252,
					-0.127185,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.048811,
					-0.373207,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.053589,
					-0.366109,
					-0.094343,
					0.011869,
					-0.408695,
					-0.050584,
					0.006862,
					-0.389327,
					-0.055536,
					-0.001179,
					-0.381269,
					-0.067569
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.228749,
					0.079647,
					-0.164494,
					0.279699,
					0.083535,
					-0.198261,
					0.276785,
					0.132379,
					-0.188431,
					0.231036,
					0.150529,
					-0.161634,
					0.179227,
					0.142175,
					-0.159626,
					0.184589,
					0.088702,
					-0.159664,
					0.150955,
					0.126113,
					-0.164007,
					0.309714,
					0.108075,
					-0.23418,
					0.305157,
					0.112242,
					-0.22066,
					0.140841,
					0.114716,
					-0.177979,
					0.150029,
					0.104596,
					-0.16816,
					-0.184589,
					0.088702,
					-0.159664,
					-0.150955,
					0.126113,
					-0.164007,
					-0.179227,
					0.142175,
					-0.159626,
					-0.279699,
					0.083535,
					-0.198261,
					-0.305157,
					0.112242,
					-0.22066,
					-0.309714,
					0.108075,
					-0.23418,
					-0.140841,
					0.114716,
					-0.177979,
					-0.150029,
					0.104596,
					-0.16816,
					-0.276785,
					0.132379,
					-0.188431,
					-0.231036,
					0.150529,
					-0.161634,
					-0.228749,
					0.079647,
					-0.164494
				]
			},
			"name": "emo-sad",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045288,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.091498,
					-0.151409,
					-0.011075,
					0.092976,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.080272,
					-0.171101,
					-0.007969,
					0.014672,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.030795,
					-0.200985,
					-0.023699,
					0,
					-0.208472,
					-0.01697,
					0.121243,
					-0.057612,
					-0.100737,
					0.183153,
					-0.009665,
					-0.129515,
					0.234283,
					-0.098333,
					-0.138323,
					0.176093,
					-0.14157,
					-0.113097,
					0.221874,
					-0.249241,
					-0.144174,
					0.241987,
					-0.301328,
					-0.157915,
					0.30857,
					-0.274012,
					-0.22545,
					0.290795,
					-0.224363,
					-0.196317,
					0.174966,
					-0.265832,
					-0.113544,
					0.208461,
					-0.345423,
					-0.123153,
					0.268343,
					-0.159185,
					-0.163265,
					0.200158,
					-0.194109,
					-0.128637,
					0.153183,
					-0.210248,
					-0.106757,
					0.317684,
					-0.313991,
					-0.248207,
					0.256036,
					-0.358042,
					-0.171484,
					0.208649,
					-0.392039,
					-0.13107,
					0.320751,
					-0.367143,
					-0.27881,
					0.230334,
					-0.443219,
					-0.169834,
					0.182524,
					-0.435915,
					-0.123716,
					0.159295,
					-0.333348,
					-0.072181,
					0.159503,
					-0.361528,
					-0.103621,
					0.167805,
					-0.311792,
					-0.080009,
					0.181371,
					-0.358162,
					-0.104703,
					0.075078,
					-0.419865,
					-0.062091,
					0,
					-0.439903,
					-0.035507,
					0.095841,
					-0.469362,
					-0.075102,
					0,
					-0.475131,
					-0.049614,
					0.12119,
					-0.409151,
					-0.081107,
					0.151464,
					-0.373877,
					-0.11232,
					0.116531,
					-0.381944,
					-0.076465,
					0.163295,
					-0.405262,
					-0.110934,
					0.075563,
					-0.304321,
					-0.021487,
					0.089321,
					-0.289351,
					-0.036301,
					0.170473,
					-0.378465,
					-0.116759,
					0.185458,
					-0.384432,
					-0.119036,
					0.160125,
					-0.368969,
					-0.117553,
					0.146429,
					-0.367321,
					-0.118083,
					0.13629,
					-0.342823,
					-0.08975,
					0.150218,
					-0.357936,
					-0.11146,
					0.150321,
					-0.340524,
					-0.077172,
					0.07448,
					-0.321603,
					-0.028654,
					0.072206,
					-0.329123,
					-0.047942,
					0,
					-0.321081,
					-0.008766,
					0,
					-0.306744,
					-0.005393,
					0,
					-0.329258,
					-0.030311,
					0.12501,
					-0.219718,
					-0.086196,
					0.055363,
					-0.234699,
					-0.037596,
					0.040271,
					-0.281992,
					-0.020561,
					0,
					-0.288915,
					-0.013667,
					0.107404,
					-0.175854,
					-0.0861,
					0.134935,
					-0.167088,
					-0.102034,
					0,
					-0.242487,
					-0.027512,
					0.118593,
					-0.152042,
					-0.086707,
					0,
					-0.52733,
					-0.039309,
					0.113613,
					-0.519425,
					-0.077045,
					0.229002,
					-0.520005,
					-0.208261,
					0.318452,
					-0.428674,
					-0.312063,
					0.350139,
					-0.383595,
					-0.367148,
					0.345195,
					-0.3289,
					-0.332002,
					0.382181,
					-0.311069,
					-0.446371,
					0.379236,
					-0.265881,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.415485,
					-0.028094,
					-0.427616,
					0.416331,
					-0.086335,
					-0.455694,
					0.409469,
					-0.125961,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.410397,
					-0.186291,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.118192,
					-0.589743,
					-0.105229,
					0.138419,
					0.133282,
					-0.157286,
					0.122035,
					0.141836,
					-0.128775,
					0.089221,
					0.10976,
					-0.142627,
					0.110219,
					0.108482,
					-0.160295,
					0.189081,
					0.043262,
					-0.145002,
					0.186106,
					0.071784,
					-0.151745,
					0.136326,
					0.091457,
					-0.157564,
					0.120067,
					0.072746,
					-0.143522,
					0.232322,
					0.066187,
					-0.160961,
					0.238084,
					0.038902,
					-0.162214,
					0.283858,
					0.081998,
					-0.190237,
					0.294716,
					0.061287,
					-0.197803,
					0.33326,
					0.099243,
					-0.242789,
					0.313787,
					0.102093,
					-0.229776,
					0.322869,
					0.128506,
					-0.198985,
					0.308565,
					0.121529,
					-0.20321,
					0.286745,
					0.212204,
					-0.150702,
					0.151382,
					0.125958,
					-0.162995,
					0.128763,
					0.109465,
					-0.16815,
					0.185716,
					0.098593,
					-0.156667,
					0.15112,
					0.109387,
					-0.165486,
					0.2297,
					0.093108,
					-0.161883,
					0.300575,
					0.106532,
					-0.216024,
					0.278323,
					0.09884,
					-0.188449,
					0.142249,
					0.114489,
					-0.175759,
					0.224702,
					0.150915,
					-0.154405,
					0.177714,
					0.147578,
					-0.155684,
					0.222998,
					0.143378,
					-0.155836,
					0.178579,
					0.139403,
					-0.159214,
					0.242457,
					0.183845,
					-0.105061,
					0.184939,
					0.180356,
					-0.088898,
					0.233874,
					0.148985,
					-0.133105,
					0.180495,
					0.15446,
					-0.131367,
					0.108741,
					0.170312,
					-0.08118,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.006903,
					-0.154543,
					0.320998,
					0.0257,
					-0.206963,
					0.363852,
					0.083668,
					-0.259092,
					0.339265,
					0.15901,
					-0.217398,
					0.294287,
					0.170297,
					-0.141482,
					0.224533,
					0.211373,
					-0.102034,
					0.034089,
					0.128873,
					-0.062444,
					0.063248,
					0.225386,
					-0.047672,
					0.339527,
					0.197006,
					-0.233595,
					0,
					0.13125,
					-0.051931,
					0.000003,
					0.231103,
					-0.043212,
					0.217434,
					0.259542,
					-0.119951,
					0.230721,
					0.343012,
					-0.163006,
					0.104816,
					0.400676,
					-0.103944,
					0.094458,
					0.313177,
					-0.067855,
					0.000003,
					0.403975,
					-0.091933,
					-0.005902,
					0.316431,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.393755,
					0.051683,
					-0.287901,
					0.359248,
					-0.039031,
					-0.220536,
					0.289511,
					-0.081585,
					-0.162758,
					0.31671,
					-0.14636,
					-0.191262,
					0.338458,
					-0.212846,
					-0.230756,
					0.351677,
					-0.253656,
					-0.265984,
					0.354334,
					-0.291472,
					-0.295368,
					0.373517,
					-0.084236,
					-0.251188,
					0.397181,
					-0.151252,
					-0.293244,
					0.393264,
					-0.188183,
					-0.33172,
					0.393902,
					-0.221426,
					-0.363676,
					0.294457,
					0.112459,
					-0.199994,
					0.124979,
					-0.130273,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.11467,
					-0.367935,
					-0.081066,
					0.150182,
					0.215169,
					-0.07507,
					0.282274,
					0.138206,
					-0.1657,
					0.2695,
					0.136935,
					-0.177653,
					0.266588,
					0.130225,
					-0.179194,
					0.111751,
					-0.360457,
					-0.08893,
					0,
					-0.605289,
					-0.070169,
					0.070413,
					-0.387631,
					-0.048101,
					0.068904,
					-0.366847,
					-0.052181,
					0,
					-0.403661,
					-0.022688,
					0,
					-0.374678,
					-0.027089,
					0,
					-0.365584,
					-0.038809,
					0.068822,
					-0.357973,
					-0.063105,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045288,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.091498,
					-0.151409,
					-0.011075,
					-0.092976,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080272,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.030795,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.057612,
					-0.100737,
					-0.183153,
					-0.009665,
					-0.129515,
					-0.234283,
					-0.098333,
					-0.138323,
					-0.176093,
					-0.14157,
					-0.113097,
					-0.221874,
					-0.249241,
					-0.144174,
					-0.30857,
					-0.274012,
					-0.22545,
					-0.241987,
					-0.301328,
					-0.157915,
					-0.290795,
					-0.224363,
					-0.196317,
					-0.174966,
					-0.265832,
					-0.113544,
					-0.208461,
					-0.345423,
					-0.123153,
					-0.200158,
					-0.194109,
					-0.128637,
					-0.268343,
					-0.159185,
					-0.163265,
					-0.153183,
					-0.210248,
					-0.106757,
					-0.317684,
					-0.313991,
					-0.248207,
					-0.256036,
					-0.358042,
					-0.171484,
					-0.208649,
					-0.392039,
					-0.13107,
					-0.320751,
					-0.367143,
					-0.27881,
					-0.230334,
					-0.443219,
					-0.169834,
					-0.182524,
					-0.435915,
					-0.123716,
					-0.159295,
					-0.333348,
					-0.072181,
					-0.167805,
					-0.311792,
					-0.080009,
					-0.159503,
					-0.361528,
					-0.103621,
					-0.181371,
					-0.358162,
					-0.104703,
					-0.075078,
					-0.419865,
					-0.062091,
					-0.095841,
					-0.469362,
					-0.075102,
					-0.12119,
					-0.409151,
					-0.081107,
					-0.151464,
					-0.373877,
					-0.11232,
					-0.163295,
					-0.405262,
					-0.110934,
					-0.116531,
					-0.381944,
					-0.076465,
					-0.075563,
					-0.304321,
					-0.021487,
					-0.089321,
					-0.289351,
					-0.036301,
					-0.170473,
					-0.378465,
					-0.116759,
					-0.185458,
					-0.384432,
					-0.119036,
					-0.160125,
					-0.368969,
					-0.117553,
					-0.146429,
					-0.367321,
					-0.118083,
					-0.13629,
					-0.342823,
					-0.08975,
					-0.150321,
					-0.340524,
					-0.077172,
					-0.150218,
					-0.357936,
					-0.11146,
					-0.07448,
					-0.321603,
					-0.028654,
					-0.072206,
					-0.329123,
					-0.047942,
					-0.12501,
					-0.219718,
					-0.086196,
					-0.055363,
					-0.234699,
					-0.037596,
					-0.040271,
					-0.281992,
					-0.020561,
					-0.107404,
					-0.175854,
					-0.0861,
					-0.134935,
					-0.167088,
					-0.102034,
					-0.118593,
					-0.152042,
					-0.086707,
					-0.113613,
					-0.519425,
					-0.077045,
					-0.229002,
					-0.520005,
					-0.208261,
					-0.318452,
					-0.428674,
					-0.312063,
					-0.345195,
					-0.3289,
					-0.332002,
					-0.350139,
					-0.383595,
					-0.367148,
					-0.382181,
					-0.311069,
					-0.446371,
					-0.379236,
					-0.265881,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.415485,
					-0.028094,
					-0.427616,
					-0.416331,
					-0.086335,
					-0.455694,
					-0.428942,
					-0.089156,
					-0.558807,
					-0.409469,
					-0.125961,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.410397,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.118192,
					-0.589743,
					-0.105229,
					-0.138419,
					0.133282,
					-0.157286,
					-0.089221,
					0.10976,
					-0.142627,
					-0.122035,
					0.141836,
					-0.128775,
					-0.110219,
					0.108482,
					-0.160295,
					-0.189081,
					0.043262,
					-0.145002,
					-0.136326,
					0.091457,
					-0.157564,
					-0.186106,
					0.071784,
					-0.151745,
					-0.120067,
					0.072746,
					-0.143522,
					-0.232322,
					0.066187,
					-0.160961,
					-0.238084,
					0.038902,
					-0.162214,
					-0.283858,
					0.081998,
					-0.190237,
					-0.33326,
					0.099243,
					-0.242789,
					-0.294716,
					0.061287,
					-0.197803,
					-0.313787,
					0.102093,
					-0.229776,
					-0.322869,
					0.128506,
					-0.198985,
					-0.308565,
					0.121529,
					-0.20321,
					-0.286745,
					0.212204,
					-0.150702,
					-0.151382,
					0.125958,
					-0.162995,
					-0.128763,
					0.109465,
					-0.16815,
					-0.15112,
					0.109387,
					-0.165486,
					-0.185716,
					0.098593,
					-0.156667,
					-0.2297,
					0.093108,
					-0.161883,
					-0.300575,
					0.106532,
					-0.216024,
					-0.278323,
					0.09884,
					-0.188449,
					-0.142249,
					0.114489,
					-0.175759,
					-0.224702,
					0.150915,
					-0.154405,
					-0.222998,
					0.143378,
					-0.155836,
					-0.177714,
					0.147578,
					-0.155684,
					-0.178579,
					0.139403,
					-0.159214,
					-0.242457,
					0.183845,
					-0.105061,
					-0.233874,
					0.148985,
					-0.133105,
					-0.184939,
					0.180356,
					-0.088898,
					-0.180495,
					0.15446,
					-0.131367,
					-0.108741,
					0.170312,
					-0.08118,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.006903,
					-0.154543,
					-0.320998,
					0.0257,
					-0.206963,
					-0.363852,
					0.083668,
					-0.259092,
					-0.339265,
					0.15901,
					-0.217398,
					-0.224533,
					0.211373,
					-0.102034,
					-0.294287,
					0.170297,
					-0.141482,
					-0.034089,
					0.128873,
					-0.062444,
					-0.063248,
					0.225386,
					-0.047672,
					-0.339527,
					0.197006,
					-0.233595,
					-0.217434,
					0.259542,
					-0.119951,
					-0.104816,
					0.400676,
					-0.103944,
					-0.230721,
					0.343012,
					-0.163006,
					-0.094458,
					0.313177,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.393755,
					0.051683,
					-0.287901,
					-0.359248,
					-0.039031,
					-0.220536,
					-0.289511,
					-0.081585,
					-0.162758,
					-0.31671,
					-0.14636,
					-0.191262,
					-0.338458,
					-0.212846,
					-0.230756,
					-0.351677,
					-0.253656,
					-0.265984,
					-0.354334,
					-0.291472,
					-0.295368,
					-0.373517,
					-0.084236,
					-0.251188,
					-0.397181,
					-0.151252,
					-0.293244,
					-0.393264,
					-0.188183,
					-0.33172,
					-0.393902,
					-0.221426,
					-0.363676,
					-0.294457,
					0.112459,
					-0.199994,
					-0.124979,
					-0.130273,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.11467,
					-0.367935,
					-0.081066,
					-0.150182,
					0.215169,
					-0.07507,
					-0.282274,
					0.138206,
					-0.1657,
					-0.2695,
					0.136935,
					-0.177653,
					-0.266588,
					0.130225,
					-0.179194,
					-0.111751,
					-0.360457,
					-0.08893,
					-0.070413,
					-0.387631,
					-0.048101,
					-0.068904,
					-0.366847,
					-0.052181,
					-0.068822,
					-0.357973,
					-0.063105
				]
			}
		},
		{
			"eyemouth": {
				"vertices": [
					0.2297,
					0.086897,
					-0.161883,
					0.279699,
					0.095986,
					-0.18889,
					0.277173,
					0.145921,
					-0.180998,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.185716,
					0.092715,
					-0.156667,
					0.151382,
					0.127287,
					-0.162529,
					0.309714,
					0.116233,
					-0.22245,
					0.305157,
					0.125845,
					-0.201761,
					0.142249,
					0.113507,
					-0.175351,
					0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.151382,
					0.127287,
					-0.162529,
					-0.183143,
					0.147974,
					-0.159898,
					-0.279699,
					0.095986,
					-0.18889,
					-0.305157,
					0.125845,
					-0.201761,
					-0.309714,
					0.116233,
					-0.22245,
					-0.142249,
					0.113507,
					-0.175351,
					-0.15112,
					0.106789,
					-0.165163,
					-0.277173,
					0.145921,
					-0.180998,
					-0.232182,
					0.156804,
					-0.1574,
					-0.2297,
					0.086897,
					-0.161883
				]
			},
			"name": "chin-move-left",
			"face": {
				"vertices": [
					0.038152,
					-0.063653,
					0.023119,
					0,
					-0.059517,
					0.039227,
					0,
					-0.103534,
					0.069954,
					0.038493,
					-0.104621,
					0.052808,
					0.036195,
					0.081635,
					-0.052848,
					0,
					0.088374,
					-0.040325,
					0,
					0,
					0,
					0.042429,
					-0.008568,
					-0.0141,
					0.074965,
					0.045805,
					-0.096762,
					0.076827,
					-0.041401,
					-0.071837,
					0,
					-0.153536,
					0.071614,
					0.038533,
					-0.14896,
					0.056111,
					0.090545,
					-0.151409,
					-0.011075,
					0.092483,
					-0.119867,
					-0.021141,
					0,
					-0.184766,
					0.047131,
					0.033863,
					-0.1775,
					0.034778,
					0.079377,
					-0.171101,
					-0.007969,
					0.014663,
					-0.19026,
					0.009363,
					0,
					-0.195266,
					0.010965,
					0.029724,
					-0.200985,
					-0.023699,
					-0.000631,
					-0.208472,
					-0.01697,
					0.121243,
					-0.054658,
					-0.100737,
					0.183153,
					-0.01051,
					-0.129515,
					0.234237,
					-0.085533,
					-0.138323,
					0.174349,
					-0.132913,
					-0.113097,
					0.209053,
					-0.227316,
					-0.144174,
					0.215446,
					-0.27348,
					-0.157915,
					0.284249,
					-0.233854,
					-0.22545,
					0.276028,
					-0.18703,
					-0.196317,
					0.15628,
					-0.255454,
					-0.113391,
					0.157381,
					-0.299121,
					-0.119153,
					0.266771,
					-0.139181,
					-0.163265,
					0.197092,
					-0.180057,
					-0.128637,
					0.149565,
					-0.207138,
					-0.106757,
					0.287451,
					-0.278326,
					-0.248207,
					0.2184,
					-0.317208,
					-0.170077,
					0.154242,
					-0.335018,
					-0.126553,
					0.286369,
					-0.348822,
					-0.27881,
					0.184006,
					-0.406183,
					-0.167834,
					0.132294,
					-0.393787,
					-0.122565,
					0.115895,
					-0.319425,
					-0.073007,
					0.107553,
					-0.337517,
					-0.104638,
					0.122393,
					-0.293396,
					-0.079721,
					0.128873,
					-0.321213,
					-0.103252,
					0.003614,
					-0.429326,
					-0.06353,
					-0.076729,
					-0.440253,
					-0.035507,
					0.023529,
					-0.470373,
					-0.075102,
					-0.080015,
					-0.475131,
					-0.049614,
					0.06798,
					-0.408323,
					-0.084668,
					0.098674,
					-0.352287,
					-0.114221,
					0.04874,
					-0.384963,
					-0.081272,
					0.111932,
					-0.373212,
					-0.111517,
					0.070458,
					-0.304321,
					-0.021487,
					0.083753,
					-0.289214,
					-0.036301,
					0.117454,
					-0.34551,
					-0.116507,
					0.130734,
					-0.341231,
					-0.117068,
					0.108386,
					-0.344412,
					-0.118449,
					0.099454,
					-0.351723,
					-0.12046,
					0.097504,
					-0.336462,
					-0.092747,
					0.102324,
					-0.340609,
					-0.113448,
					0.106588,
					-0.328569,
					-0.079014,
					0.06572,
					-0.32102,
					-0.028674,
					0.058681,
					-0.330196,
					-0.049199,
					-0.002456,
					-0.321081,
					-0.008766,
					-0.001657,
					-0.306744,
					-0.005393,
					-0.002708,
					-0.329258,
					-0.030311,
					0.121319,
					-0.219718,
					-0.086196,
					0.053097,
					-0.234699,
					-0.037596,
					0.037969,
					-0.281992,
					-0.020561,
					-0.001389,
					-0.288915,
					-0.013667,
					0.104631,
					-0.175854,
					-0.0861,
					0.132365,
					-0.163211,
					-0.102034,
					-0.001124,
					-0.242487,
					-0.027512,
					0.116363,
					-0.151122,
					-0.086707,
					-0.078784,
					-0.52733,
					-0.039309,
					0.038517,
					-0.519425,
					-0.077045,
					0.168939,
					-0.50384,
					-0.208261,
					0.284831,
					-0.419142,
					-0.312063,
					0.315731,
					-0.373882,
					-0.367148,
					0.311699,
					-0.311093,
					-0.332002,
					0.356083,
					-0.303186,
					-0.446371,
					0.349517,
					-0.254971,
					-0.402268,
					0.4374,
					0.136356,
					-0.579237,
					0.429268,
					0.230814,
					-0.572498,
					0.396799,
					0.238236,
					-0.364573,
					0.416582,
					0.045594,
					-0.399157,
					0.438263,
					0.053781,
					-0.580183,
					0.41459,
					-0.027461,
					-0.427616,
					0.409743,
					-0.081674,
					-0.455694,
					0.408659,
					-0.12543,
					-0.47894,
					0.428942,
					-0.089156,
					-0.558807,
					0.436235,
					-0.014008,
					-0.572424,
					0.404638,
					-0.184467,
					-0.529966,
					0.356352,
					0.3587,
					-0.36533,
					0.41256,
					0.345047,
					-0.549472,
					0.390805,
					0.446999,
					-0.515934,
					0.325277,
					0.475826,
					-0.388484,
					0.050708,
					-0.590351,
					-0.105229,
					0.138419,
					0.136589,
					-0.156835,
					0.122035,
					0.145683,
					-0.128418,
					0.089221,
					0.110177,
					-0.142426,
					0.110219,
					0.10748,
					-0.159984,
					0.189081,
					0.040545,
					-0.145002,
					0.186106,
					0.067243,
					-0.151745,
					0.136326,
					0.088892,
					-0.157315,
					0.120067,
					0.069882,
					-0.143441,
					0.232322,
					0.061815,
					-0.160961,
					0.238084,
					0.035599,
					-0.162214,
					0.284292,
					0.077634,
					-0.190588,
					0.294716,
					0.056692,
					-0.197803,
					0.33674,
					0.102368,
					-0.243338,
					0.321543,
					0.110253,
					-0.231047,
					0.331825,
					0.142094,
					-0.200533,
					0.318381,
					0.134581,
					-0.204874,
					0.309939,
					0.263023,
					-0.150639,
					0.151382,
					0.127287,
					-0.162529,
					0.128763,
					0.108124,
					-0.167775,
					0.185716,
					0.092715,
					-0.156667,
					0.15112,
					0.106789,
					-0.165163,
					0.2297,
					0.086897,
					-0.161883,
					0.309714,
					0.116233,
					-0.22245,
					0.279699,
					0.095986,
					-0.18889,
					0.142249,
					0.113507,
					-0.175351,
					0.233523,
					0.170065,
					-0.155951,
					0.182252,
					0.159993,
					-0.156366,
					0.232182,
					0.156804,
					-0.1574,
					0.183143,
					0.147974,
					-0.159898,
					0.252282,
					0.216997,
					-0.104641,
					0.185157,
					0.201684,
					-0.088473,
					0.239806,
					0.174021,
					-0.134133,
					0.181263,
					0.164348,
					-0.131359,
					0.108741,
					0.172508,
					-0.080994,
					0.065585,
					0.119462,
					-0.100974,
					0.253825,
					-0.003445,
					-0.154543,
					0.318923,
					0.027415,
					-0.206963,
					0.362239,
					0.086195,
					-0.259092,
					0.352279,
					0.17682,
					-0.19306,
					0.304534,
					0.203156,
					-0.141132,
					0.253892,
					0.288032,
					-0.101722,
					0.034089,
					0.128873,
					-0.062444,
					0.072843,
					0.239325,
					-0.047672,
					0.37007,
					0.212799,
					-0.248551,
					0,
					0.13125,
					-0.051931,
					0,
					0.243711,
					-0.043212,
					0.251058,
					0.335162,
					-0.119951,
					0.253284,
					0.397936,
					-0.163006,
					0.12,
					0.417536,
					-0.103944,
					0.118887,
					0.335748,
					-0.067855,
					0,
					0.419184,
					-0.091933,
					0,
					0.332601,
					-0.06122,
					0.123493,
					0.527591,
					-0.188838,
					0.244879,
					0.511883,
					-0.250066,
					0,
					0.53588,
					-0.173559,
					0.328603,
					0.551081,
					-0.438663,
					0.238096,
					0.605111,
					-0.367836,
					0,
					0.636507,
					-0.295534,
					0.119531,
					0.629772,
					-0.317195,
					0.388782,
					0.058426,
					-0.287901,
					0.349565,
					-0.02266,
					-0.220536,
					0.284991,
					-0.064413,
					-0.162758,
					0.306636,
					-0.11589,
					-0.191262,
					0.310441,
					-0.163782,
					-0.230756,
					0.311943,
					-0.207724,
					-0.265984,
					0.311253,
					-0.24858,
					-0.295368,
					0.363227,
					-0.069628,
					-0.251188,
					0.357977,
					-0.118224,
					-0.293244,
					0.355703,
					-0.160151,
					-0.33172,
					0.353558,
					-0.198186,
					-0.363676,
					0.305157,
					0.125845,
					-0.201761,
					0.123252,
					-0.127185,
					-0.096468,
					0.087979,
					-0.090294,
					-0.036241,
					0.048811,
					-0.373207,
					-0.086188,
					0.179534,
					0.277732,
					-0.07489,
					0.290459,
					0.161487,
					-0.167135,
					0.279843,
					0.15831,
					-0.179454,
					0.277173,
					0.145921,
					-0.180998,
					0.053589,
					-0.366109,
					-0.094343,
					-0.07574,
					-0.605289,
					-0.070169,
					-0.011869,
					-0.408695,
					-0.050584,
					-0.006862,
					-0.389327,
					-0.055536,
					-0.08629,
					-0.415177,
					-0.022688,
					-0.087636,
					-0.391953,
					-0.027089,
					-0.079701,
					-0.382922,
					-0.038809,
					0.001179,
					-0.381269,
					-0.067569,
					-0.038152,
					-0.063653,
					0.023119,
					-0.038493,
					-0.104621,
					0.052808,
					-0.036195,
					0.081635,
					-0.052848,
					-0.042429,
					-0.008568,
					-0.0141,
					-0.074965,
					0.045805,
					-0.096762,
					-0.076827,
					-0.041401,
					-0.071837,
					-0.038533,
					-0.14896,
					0.056111,
					-0.092123,
					-0.151409,
					-0.011075,
					-0.093206,
					-0.119867,
					-0.021141,
					-0.033863,
					-0.1775,
					0.034778,
					-0.080837,
					-0.171101,
					-0.007969,
					-0.014672,
					-0.19026,
					0.009363,
					-0.031622,
					-0.200985,
					-0.023699,
					-0.121243,
					-0.054658,
					-0.100737,
					-0.183153,
					-0.01051,
					-0.129515,
					-0.235021,
					-0.085533,
					-0.138323,
					-0.178315,
					-0.132913,
					-0.113097,
					-0.232534,
					-0.230809,
					-0.144174,
					-0.320247,
					-0.240744,
					-0.22545,
					-0.264565,
					-0.279391,
					-0.157915,
					-0.300144,
					-0.191496,
					-0.196317,
					-0.189637,
					-0.257925,
					-0.113391,
					-0.229286,
					-0.303309,
					-0.119153,
					-0.206578,
					-0.18028,
					-0.128637,
					-0.274166,
					-0.139532,
					-0.163265,
					-0.159417,
					-0.207138,
					-0.106757,
					-0.332786,
					-0.286909,
					-0.248207,
					-0.291464,
					-0.324421,
					-0.170077,
					-0.253664,
					-0.339919,
					-0.126553,
					-0.339068,
					-0.358534,
					-0.27881,
					-0.297914,
					-0.412053,
					-0.167834,
					-0.255344,
					-0.398041,
					-0.122565,
					-0.168891,
					-0.319522,
					-0.073007,
					-0.172275,
					-0.294698,
					-0.079721,
					-0.196859,
					-0.339445,
					-0.104638,
					-0.208788,
					-0.324306,
					-0.103252,
					-0.151706,
					-0.429326,
					-0.06353,
					-0.177051,
					-0.470373,
					-0.075102,
					-0.194397,
					-0.408323,
					-0.084668,
					-0.202187,
					-0.353823,
					-0.114221,
					-0.225429,
					-0.375573,
					-0.111517,
					-0.183082,
					-0.384963,
					-0.081272,
					-0.081964,
					-0.304321,
					-0.021487,
					-0.096174,
					-0.289214,
					-0.036301,
					-0.21877,
					-0.347759,
					-0.116507,
					-0.232663,
					-0.344482,
					-0.117068,
					-0.205975,
					-0.345961,
					-0.118449,
					-0.18977,
					-0.352417,
					-0.12046,
					-0.150963,
					-0.336462,
					-0.092747,
					-0.165297,
					-0.328741,
					-0.079014,
					-0.186208,
					-0.341957,
					-0.113448,
					-0.079741,
					-0.32102,
					-0.028674,
					-0.07612,
					-0.330196,
					-0.049199,
					-0.130201,
					-0.219718,
					-0.086196,
					-0.057418,
					-0.234699,
					-0.037596,
					-0.042369,
					-0.281992,
					-0.020561,
					-0.109833,
					-0.175854,
					-0.0861,
					-0.137919,
					-0.163211,
					-0.102034,
					-0.120571,
					-0.151122,
					-0.086707,
					-0.19591,
					-0.519425,
					-0.077045,
					-0.293943,
					-0.510218,
					-0.208261,
					-0.339534,
					-0.428674,
					-0.312063,
					-0.362357,
					-0.320538,
					-0.332002,
					-0.367371,
					-0.383595,
					-0.367148,
					-0.39425,
					-0.311069,
					-0.446371,
					-0.387598,
					-0.262788,
					-0.402268,
					-0.4374,
					0.136356,
					-0.579237,
					-0.396799,
					0.238236,
					-0.364573,
					-0.429268,
					0.230814,
					-0.572498,
					-0.416582,
					0.045594,
					-0.399157,
					-0.438263,
					0.053781,
					-0.580183,
					-0.415351,
					-0.027461,
					-0.427616,
					-0.412529,
					-0.081674,
					-0.455694,
					-0.429635,
					-0.089156,
					-0.558807,
					-0.41263,
					-0.12543,
					-0.47894,
					-0.436235,
					-0.014008,
					-0.572424,
					-0.415705,
					-0.186291,
					-0.529966,
					-0.356352,
					0.3587,
					-0.36533,
					-0.41256,
					0.345047,
					-0.549472,
					-0.390805,
					0.446999,
					-0.515934,
					-0.325277,
					0.475826,
					-0.388484,
					-0.198472,
					-0.589743,
					-0.105229,
					-0.138419,
					0.136589,
					-0.156835,
					-0.089221,
					0.110177,
					-0.142426,
					-0.122035,
					0.145683,
					-0.128418,
					-0.110219,
					0.10748,
					-0.159984,
					-0.189081,
					0.040545,
					-0.145002,
					-0.136326,
					0.088892,
					-0.157315,
					-0.186106,
					0.067243,
					-0.151745,
					-0.120067,
					0.069882,
					-0.143441,
					-0.232322,
					0.061815,
					-0.160961,
					-0.238084,
					0.035599,
					-0.162214,
					-0.284292,
					0.077634,
					-0.190588,
					-0.33674,
					0.102368,
					-0.243338,
					-0.294716,
					0.056692,
					-0.197803,
					-0.321543,
					0.110253,
					-0.231047,
					-0.331825,
					0.142094,
					-0.200533,
					-0.318381,
					0.134581,
					-0.204874,
					-0.309939,
					0.263023,
					-0.150639,
					-0.151382,
					0.127287,
					-0.162529,
					-0.128763,
					0.108124,
					-0.167775,
					-0.15112,
					0.106789,
					-0.165163,
					-0.185716,
					0.092715,
					-0.156667,
					-0.2297,
					0.086897,
					-0.161883,
					-0.309714,
					0.116233,
					-0.22245,
					-0.279699,
					0.095986,
					-0.18889,
					-0.142249,
					0.113507,
					-0.175351,
					-0.233523,
					0.170065,
					-0.155951,
					-0.232182,
					0.156804,
					-0.1574,
					-0.182252,
					0.159993,
					-0.156366,
					-0.183143,
					0.147974,
					-0.159898,
					-0.252282,
					0.216997,
					-0.104641,
					-0.239806,
					0.174021,
					-0.134133,
					-0.185157,
					0.201684,
					-0.088473,
					-0.181263,
					0.164348,
					-0.131359,
					-0.108741,
					0.172508,
					-0.080994,
					-0.065585,
					0.119462,
					-0.100974,
					-0.253825,
					-0.003445,
					-0.154543,
					-0.318923,
					0.027415,
					-0.206963,
					-0.362239,
					0.086195,
					-0.259092,
					-0.352279,
					0.17682,
					-0.19306,
					-0.253892,
					0.288032,
					-0.101722,
					-0.304534,
					0.203156,
					-0.141132,
					-0.034089,
					0.128873,
					-0.062444,
					-0.072843,
					0.239325,
					-0.047672,
					-0.37007,
					0.212799,
					-0.248551,
					-0.251058,
					0.335162,
					-0.119951,
					-0.12,
					0.417536,
					-0.103944,
					-0.253284,
					0.397936,
					-0.163006,
					-0.118887,
					0.335748,
					-0.067855,
					-0.123493,
					0.527591,
					-0.188838,
					-0.244879,
					0.511883,
					-0.250066,
					-0.328603,
					0.551081,
					-0.438663,
					-0.238096,
					0.605111,
					-0.367836,
					-0.119531,
					0.629772,
					-0.317195,
					-0.388782,
					0.058426,
					-0.287901,
					-0.349565,
					-0.02266,
					-0.220536,
					-0.285876,
					-0.064413,
					-0.162758,
					-0.314657,
					-0.116614,
					-0.191262,
					-0.333451,
					-0.168301,
					-0.230756,
					-0.346766,
					-0.214756,
					-0.265984,
					-0.353341,
					-0.256922,
					-0.295368,
					-0.366205,
					-0.069628,
					-0.251188,
					-0.373868,
					-0.12133,
					-0.293244,
					-0.379067,
					-0.165309,
					-0.33172,
					-0.38189,
					-0.204505,
					-0.363676,
					-0.305157,
					0.125845,
					-0.201761,
					-0.126462,
					-0.127185,
					-0.096468,
					-0.087979,
					-0.090294,
					-0.036241,
					-0.175897,
					-0.373207,
					-0.086188,
					-0.179534,
					0.277732,
					-0.07489,
					-0.290459,
					0.161487,
					-0.167135,
					-0.279843,
					0.15831,
					-0.179454,
					-0.277173,
					0.145921,
					-0.180998,
					-0.164719,
					-0.366109,
					-0.094343,
					-0.155113,
					-0.408695,
					-0.050584,
					-0.142824,
					-0.389327,
					-0.055536,
					-0.135208,
					-0.381269,
					-0.067569
				]
			}
		}
	];

/***/ }
/******/ ]);