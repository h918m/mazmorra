import { Behaviour } from 'behaviour.js'
import helpers from '../../../shared/helpers'

export default class BattleBehaviour extends Behaviour {

  onAttach (generator) {
    this.togglePosition = false

    this.isAttacking = false
    this.attackingPoint = { x: 0, z: 0 }
    this.defender = null

    this.generator = generator

    this.on('attack', this.onAttack.bind(this))
    this.on('died', this.onDied.bind(this))
  }

  disable () {
    this.isAttacking = false
    this.togglePosition = false
  }

  onAttack (data) {
    this.togglePosition = true
    clock.setTimeout(() => { this.togglePosition = false }, 100)

    if (!data.type) { return this.disable(); }

    if (!this.isAttacking) {
      this.defender = this.generator.level.getEntityAt(data.position)

      this.attackingPoint = this.generator.fixTilePosition(this.object.position.clone(), data.position.y, data.position.x)
      this.onAttackStart(this.attackingPoint)
    }

    // show damage / miss / critical
    let text = `-${ data.damage }`
      , kind = 'attention'

    if (data.missed) {
      kind = 'warn'
      text = 'miss'
    }

    // create label entity
    this.generator.createEntity({
      type: helpers.ENTITIES.TEXT_EVENT,
      text: text,
      kind: kind,
      ttl: 100,
      special: data.critical,
      position: data.position
    })
  }

  onAttackStart (attackingPoint) {
    if (this.isAttacking) return false;

    this.isAttacking = true
    this.togglePosition = true
    this.attackingPoint = attackingPoint
  }

  onDied () {
    var initY = this.object.position.y
    tweener.add(this.object.position).
      to({ y: this.object.position.y + 1 }, 300, Tweener.ease.cubicOut).
      add(this.object.sprite.material).
      to({ rotation: Math.PI }, 150, Tweener.ease.cubicInOut).
      add(this.object.position).
      to({ y: initY }, 300, Tweener.ease.bounceOut).
      then(this.detach.bind(this))
  }

  onDetach () {
    this.disable()
  }

}

