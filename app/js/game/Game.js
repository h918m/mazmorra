import Clock from 'clock.js'
import Level from './Level'
import HUD from './HUD'

import { createComponentSystem } from 'behaviour.js'

window.TILE_SIZE = 3

// list of colors (for highlight)
window.COLOR_RED = 0xd00000
window.COLOR_GREEN = 0x6ca018

// window.CLEAR_COLOR = 0x440000 // red / inferno
window.CLEAR_COLOR = 0x002a0d // green / forest
// window.CLEAR_COLOR = 0x000c4c // blue / ice

window.clock = new Clock();
window.ZOOM = 23
window.IS_DAY = true

// Dark / Caves
if (!window.IS_DAY) window.CLEAR_COLOR = 0x000

// sprite scales based on the texture size
window.SCALES = {
  32: 6,
  16: 3,
  8: 1.5,
  4: 0.75
}

export default class Game {

  constructor (container) {
    this.componentSystem = createComponentSystem(THREE.Object3D)

    this.container = container
    this.container.innerHTML = "";

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1, 100 );
    this.camera.zoom = ZOOM
    this.camera.updateProjectionMatrix()
    this.scene.rotateY(-0.4)

    window.scene = this.scene;

    // this.camera.position.y = 10;
    // this.camera.position.y = 15;
    // this.camera.position.y = 30;
    this.camera.position.y = 40;
    // this.camera.position.z = 10;
    // this.camera.position.z = 20
    // this.camera.position.z = 30;
    this.camera.position.z = 50;

    window.camera = this.camera

    this.hud = new HUD()

    this.level = new Level(this.scene, this.hud, this.camera)
    this.level.on('setup', this.onSetupLevel.bind(this))

    this.updateInterval = setInterval(this.update.bind(this), 1000 / 60)
    this.container.appendChild( this.renderer.domElement );

    window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false )
    window.addEventListener( 'click', this.onClick.bind(this), false )
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    // stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );
  }

  onSetupLevel (state) {
    var colors = {
      'grass': 0x002a0d,   // green
      'rock': 0x343434,    // gray
      'ice': 0x000c4c,     // blue
      'inferno': 0x440000, // red
      'dark': 0x000000     // red
    }

    window.CLEAR_COLOR = (state.daylight) ? colors[ state.mapkind ] : colors.dark

    this.renderer.setClearColor( CLEAR_COLOR );
    this.scene.fog = new THREE.FogExp2( CLEAR_COLOR, 1 );
  }

  onWindowResize () {
    this.hud.resize()

    // update camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.cameraController.handleResize();
  }

  onMouseMove (e) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  }

  onClick (e) {
    e.preventDefault()
    this.level.playerAction()
  }

  update () {
    clock.tick()
    tweener.update(clock.deltaTime)

    this.componentSystem.update()

    // update camera position
    // let position = this.level.players[0].position
    // this.camera.position.set(position.x, position.y, position.z)
    // this.camera.lookAt(position)

    this.stats.update()
  }

  render () {
    requestAnimationFrame( this.render.bind(this) );

    if (this.level)
      this.raycast()

    this.renderer.clear()
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();

    if (this.hud)
      this.renderer.render( this.hud.scene, this.hud.camera )
  }

  raycast () {
    this.raycaster.setFromCamera( this.mouse, this.camera );

    var intersects = this.raycaster.intersectObjects( this.level.generator.ground );
    if (intersects.length == 0) {
      this.level.setTileSelection(null)
    } else {
      this.level.setTileSelection(intersects[0].object)
    }
  }

}
