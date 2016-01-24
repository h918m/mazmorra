import LeftButton from '../buttons/LeftButton'
import RightButton from '../buttons/RightButton'
import { SpriteText2D, textAlign } from 'three-text2d'

export default class SelectBox extends THREE.Object3D {

  constructor (options, placeholder = "[none]") {
    super()

    this.placeholder = placeholder
    this.options = options
    this.selectedIndex = -1

    this.labelBackground = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get('gui-label-background'),
      transparent: true
    }))
    this.labelBackground.renderOrder = 0
    this.labelBackground.width = this.labelBackground.material.map.frame.w * HUD_SCALE
    this.labelBackground.scale.normalizeWithHUDTexture(this.labelBackground.material.map)

    this.leftButton = new LeftButton()
    this.leftButton.position.x -= this.labelBackground.width / 2 + this.leftButton.width / 2
    this.leftButton.addEventListener('click', this.onLeft.bind(this))

    this.rightButton = new RightButton()
    this.rightButton.position.x += this.labelBackground.width / 2 + this.leftButton.width / 2
    this.rightButton.addEventListener('click', this.onRight.bind(this))

    this.label = new SpriteText2D(this.placeholder, { align: textAlign.center, font: DEFAULT_FONT, fillStyle: '#fff', antialias: false })
    this.label.position.y += this.label.height / 4
    this.label.sprite.renderOrder = 1

    this.add(this.leftButton)
    this.add(this.labelBackground)
    this.add(this.rightButton)
    this.add(this.label)

    this.interactive = [ this.leftButton, this.rightButton ]
  }

  get height () {
    return this.labelBackground.material.map.frame.h * HUD_SCALE
  }

  onLeft () {
    if (this.selectedIndex - 1 < 0) this.selectedIndex = this.options.length;
    this.selectedIndex = (this.selectedIndex-1) % this.options.length

    this.onChange()
  }

  onRight () {
    this.selectedIndex = (this.selectedIndex+1) % this.options.length

    this.onChange()
  }

  onChange () {
    let text, value;

    if (typeof(this.options[this.selectedIndex]) === "string") {
      text = this.options[this.selectedIndex]
      value = this.options[this.selectedIndex]

    } else {
      text = this.options[this.selectedIndex].text
      value = this.options[this.selectedIndex].value
    }

    this.label.text = text;
    this.dispatchEvent({type: 'change', value: value })
  }

}
