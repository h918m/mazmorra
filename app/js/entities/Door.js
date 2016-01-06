'use strict';

export default class Door extends THREE.Object3D {

  constructor (type = 'door-night') { // door-day
    super()

    var material = new THREE.MeshPhongMaterial( {
        shading: THREE.FlatShading,
        map: ResourceManager.get('billboards-' + type),
        side: THREE.FrontSide,
        transparent: true
      })
      , geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
      , mesh = new THREE.Mesh(geometry, material)

    mesh.position.y = 0.6

    // TODO: automate a good-looking position based on door direction
    mesh.position.z -= 1.499

    mesh.scale.set(1, 1, 1)
    this.add(mesh)


    var lightColor = 0xfcfcfc
      , light = new THREE.PointLight(lightColor, 1.5, 5); // Spotlight would be better here

    light.position.set(0, 0.7, -0.25)
    this.add(light)

    this.getEntity().on('mouseover', this.onMouseOver.bind(this))
    this.getEntity().on('mouseout', this.onMouseOut.bind(this))
  }

  get label () {
    return "Door"
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

}

