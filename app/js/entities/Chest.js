'use strict';

import Openable from '../behaviors/Openable'

export default class Chest extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.head = ResourceManager.getSprite( `interactive-${ data.kind }-head` )
    this.add(this.head)

    this.body = ResourceManager.getSprite( `interactive-${ data.kind }-body` )
    this.add(this.body)

    this.openableBehaviour = new Openable
    this.addBehaviour(this.openableBehaviour)
  }

  get label () {
    let status = (this.openableBehaviour.isOpen) ?  "Open " : ""
    return `${status}Chest`
  }

}
