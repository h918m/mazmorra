export default class InventoryIcon extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false

    var closedMaterial = ResourceManager.get("hud-bag")
    this.closed = new THREE.Sprite(new THREE.SpriteMaterial({ map: closedMaterial, transparent: true }))
    this.closed.scale.set(closedMaterial.frame.w * HUD_SCALE, closedMaterial.frame.h * HUD_SCALE, 1)
    this.add(this.closed)

    var openMaterial = ResourceManager.get("hud-bag-open")
    this.open = new THREE.Sprite(new THREE.SpriteMaterial({ map: openMaterial, transparent: true }))
    this.open.scale.set(openMaterial.frame.w * HUD_SCALE, openMaterial.frame.h * HUD_SCALE, 1)

    this.openYOffset = openMaterial.frame.h - closedMaterial.frame.h - 2

    this.width = openMaterial.frame.w * HUD_SCALE
    this.height = openMaterial.frame.h * HUD_SCALE

    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
    this.addEventListener('click', this.onClick.bind(this))
  }

  onClick () {
    // toggle open

    if (this.isOpen) {
      this.add(this.closed)
      this.remove(this.open)
      tweener.add(this.closed.position).to({ y: this.closed.position.y + (this.openYOffset * HUD_SCALE) }, 200, Tweener.ease.quintOut)

    } else {
      clock.setTimeout(() => {
        this.add(this.open)
        this.remove(this.closed)
      }, 80)
      tweener.add(this.closed.position).to({ y: this.closed.position.y - (this.openYOffset * HUD_SCALE) }, 150, Tweener.ease.quintOut)
    }

    this.isOpen = !this.isOpen
  }

  onMouseOver () {
    tweener.remove(this.scale)
    tweener.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
  }

  onMouseOut () {
    tweener.remove(this.scale)
    tweener.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

}
