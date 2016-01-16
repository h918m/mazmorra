'use strict';

var Entity = require('./Entity')
var Bar = require('../core/Bar')
var Movement = require('../core/Movement')

// Actions
var BattleAction = require('../actions/BattleAction')

class Unit extends Entity {

  constructor (id) {
    super(id)

    this.position = new Movement(this)
    this.direction = 'bottom'

    this.action = null

    this.hp = new Bar(50)
    this.mp = new Bar(0)
    this.xp = new Bar(0, 10)

    this.attributes = {
      strenght: 1,
      dexterity: 1,
      intelligence: 1,
      vitality: 1
    }

    this.armor = 1
    this.damage = 1
    this.damageAttribute = 'strenght'
    this.criticalBonus = 1.5 // damage * criticalBonus (on critical)

    // walking attributes
    this.walkSpeed = 1000

    // attack attributes
    this.attackDistance = 1
    this.attackSpeed = 2000
  }

  get isAlive () { return this.hp.current > 0 }

  update (currentTime) {
    // a dead unit can't do much, I guess
    if (!this.isAlive) return

    if (this.action && this.action.isEligible)  {
      this.action.update(currentTime)
      this.position.touch(currentTime)

    } else {
      this.position.update(currentTime)
    }
  }

  drop () {
    if (!this.state) return

    this.state.dropItemFrom(this)
  }

  attack (defender) {
    if (defender === null || !defender.isAlive) {
      this.action = null

    } else if (!this.isBattlingAgainst(defender)) {
      this.action = new BattleAction(this, defender)
    }
  }

  isBattlingAgainst (unit) {
    return this.action && (this.action instanceof BattleAction && this.action.defender === unit)
  }

  takeDamage (battleAction) {
    var damageTaken = battleAction.damage

    // TODO: consider attributes to reduce damage
    this.hp.current -= damageTaken

    return damageTaken
  }

  onKill (unit) {
    // compute experience this unit received by killing another one
    // var xp =  unit.lvl / (this.lvl / 2)
    var xp =  unit.lvl / (this.lvl / 4)

    // level up!
    if (this.xp.current + xp > this.xp.max) {
      xp = (this.xp.current + xp) - this.xp.max
      this.levelUp()
    }

    // killed unit may drop something
    if (unit.state) {
      unit.drop();
    }

    this.xp.current += xp
  }

  levelUp () {
    this.lvl ++

    for (let attr in this.attributes) {
      this.attributes[ attr ]++
    }

    this.hp.current = this.hp.max
    this.mp.current = this.mp.max
    this.xp.current = 0
  }


}

module.exports = Unit
