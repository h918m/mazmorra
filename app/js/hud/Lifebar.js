
export default class Lifebar extends THREE.Object3D {

  constructor (type = 'life') {
    super()

    this.blankPixelArea = 4 // 4 blank pixels

    this.fg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-" + type + "-bar-fill"),
      transparent: true
    }))
    this.fg.material.opacity = 0.85
    this.add(this.fg)

    this.bg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-bar-bg"),
      transparent: true
    }))
    this.bg.material.opacity = 0.5
    this.add(this.bg)

    this.scale.set(this.bg.material.map.image.width * HUD_SCALE, this.bg.material.map.image.height * HUD_SCALE, 1)

    this.width = (this.bg.material.map.image.width * HUD_SCALE) / 2
    this.height = (this.bg.material.map.image.height * HUD_SCALE) / 2
  }

  set (percentage) {
    var totalHeight = this.bg.material.map.image.height
      , unusableHeight = blankPixelArea
      , usableHeight = totalHeight - unusableHeight
      , usableRatio = ((totalHeight - unusableHeight * 2)/totalHeight)

    // (1 - %)
    var percentage = Math.random()
    var finalPercentage = (unusableHeight/totalHeight) + (usableRatio - (percentage * usableRatio)) // (unusableHeight/totalHeight) // - (0.6*usableRatio)

    tweener.
      add(this.fg.material.map.offset).
      to({ y: -finalPercentage }, 400, Tweener.ease.cubicOut)
    tweener.
      add(this.fg.position).
      to({ y: -finalPercentage }, 400, Tweener.ease.cubicOut)
  }

}

