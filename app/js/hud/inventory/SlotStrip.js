import ItemSlot from './ItemSlot'
import DraggableItem from './components/DraggableItem'

export default class SlotStrip extends THREE.Object3D {

  constructor (options = {}) {
    super()

    this.slots = []
    this.columns = options.columns || 4
    this.allowRemove = options.allowRemove || false

    this.lastItemsRef = null

    if (options.slots) {
      this.numSlots = options.slots
    }
  }

  clearItems () {
    for (let i=0; i<this.slots.length; i++) {
      if (this.slots[i].item) {
        this.slots[i].item.getEntity().detachAll()
        this.slots[i].item = null
      }
    }
  }

  updateItems (items) {
    // same items, do nothing
    if (items === this.lastItemsRef) {
      return
    }

    this.clearItems()

    let i = 0
    for (let itemId in items) {
      this.slots[i].item = ResourceManager.getHUDElement(`items-${ items[itemId].type }`)
      i++
    }

    this.lastItemsRef = items
  }

  set numSlots (total) {
    this._numSlots = total
    this.updateChildren()
  }
  get numSlots () { return this._numSlots }

  updateChildren () {
    let row, column
      , i = this.children.length
      , slot = null

    while (i--) { this.remove(this.children[i]) }

    this.slots = []
    for (i=0; i<this._numSlots; i++) {
      column = i % this.columns
      row = Math.floor(i / this.columns)

      slot = new ItemSlot()
      slot.position.x = (slot.width + HUD_SCALE) * column
      slot.position.y = (slot.height + HUD_SCALE) * row

      this.slots.push( slot )
      this.add(slot)
    }

    // add REMOVE slot
    if (this.allowRemove) {
      let x = slot.position.x + slot.width
        , y = slot.position.y

      slot = ResourceManager.getHUDElement('hud-item-slot-delete')
      slot.position.x = x + HUD_SCALE
      slot.position.y = y
      slot.material.opacity = 0.8

      this.slots.push(slot)
      this.add(slot)
    }

    this.width = slot.position.x + slot.width
    this.height = (slot.height + HUD_SCALE) * (row+1)
  }

  get slotSize () {
    return this.slots[0].width
  }

}
