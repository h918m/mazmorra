let draggingItem = null
  , draggingFrom = null

export default class ItemSlot extends THREE.Object3D {
  static DEFAULT_OPACITY = 0.6;

  constructor (options = { accepts: null }) {
    super()

    this._item = null

    this.accepts = options.accepts

    var freeTex = ResourceManager.get("hud-item-slot-free")
    this.free = new THREE.Sprite(new THREE.SpriteMaterial({ map: freeTex, transparent: true }))
    this.free.scale.set(freeTex.frame.w *  config.HUD_SCALE, freeTex.frame.h *  config.HUD_SCALE, 1)
    this.add(this.free)

    var useTex = ResourceManager.get("hud-item-slot-use")
    this.use = new THREE.Sprite(new THREE.SpriteMaterial({ map: useTex, transparent: true }))
    this.use.scale.set(useTex.frame.w *  config.HUD_SCALE, useTex.frame.h *  config.HUD_SCALE, 1)

    this.free.material.opacity = ItemSlot.DEFAULT_OPACITY

    this.width = useTex.frame.w *  config.HUD_SCALE
    this.height = useTex.frame.h *  config.HUD_SCALE

    // mouse-over / mouse-out
    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))

    // drag start
    this.addEventListener('mousedown', this.onDragStart.bind(this))
    this.addEventListener('touchstart', this.onDragStart.bind(this))

    // drag end
    this.addEventListener('mouseup', this.onDragEnd.bind(this))
    this.addEventListener('touchend', this.onDragEnd.bind(this))
  }

  hasItem () {
    return this._item
  }

  isAccepted ( item ) {
  }

  onMouseOver ( e ) {

    if (this._item || draggingItem) {
      App.tweens.remove(this.scale)
      App.tweens.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
    }

  }

  onMouseOut () {

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)

  }

  set item ( item ) {

    if ( item ) {

      this.add( this.use )
      this.remove( this.free )

      item.position.x = 0
      item.position.y = 0
      item.position.z = 1

      this.add(item)

    } else {

      if (this._item) {

        this.remove(this._item)

      }

      this.remove(this.use)
      this.add(this.free)
    }

    this._item = item

  }

  get item () {

    return this._item

  }

  get material () {

    return this._item ? this.use.material : this.free.material

  }

  onDragStart (e) {

    let targetSlot = e.target.parent

    if ( targetSlot.item ) {

      draggingItem = targetSlot.item
      draggingFrom = targetSlot

      // setup initialScale variable for the first time
      if ( draggingItem.initialScale === undefined ) {
        draggingItem.initialScale = draggingItem.scale.clone()
      }

      targetSlot.item = null

      App.cursor.dispatchEvent({
        type: "drag",
        item: draggingItem
      })

      App.tweens.add(draggingItem.scale).to({
        x: draggingItem.initialScale.x + (2 * config.HUD_SCALE),
        y: draggingItem.initialScale.y + (2 * config.HUD_SCALE)
      }, 300, Tweener.ease.quintOut)

    }

  }

  onDragEnd (e) {

    let targetSlot = e.target.parent

    if ( !targetSlot.item ) {

      targetSlot.item = draggingItem

      App.cursor.dispatchEvent({
        type: "drag",
        item: false
      })

      App.tweens.remove(draggingItem.scale)
      App.tweens.add(draggingItem.scale).to(draggingItem.initialScale, 300, Tweener.ease.quintOut)

      draggingItem = null

      console.log("drag end!", targetSlot)

    }

  }

}