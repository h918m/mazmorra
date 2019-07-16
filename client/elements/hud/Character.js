import { MeshText2D, textAlign } from 'three-text2d'
import { MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT } from '../character/HeroSkinBuilder'
import { HeroSkinBuilder } from "../character/HeroSkinBuilder";
import LevelUpButton from './LevelUpButton';
import { humanize } from '../../utils';
import hint from './Hint';

// export const BASE_MOVEMENT_SPEED = 550;
// export const MOVEMENT_SPEED_RATIO = 30;

export default class Character extends THREE.Object3D {

  constructor () {
    super()
    this.userData.hud = true;
    this.addEventListener("mouseover", (e) => this.onMouseOver(e));
    this.addEventListener("mouseout", (e) => this.onMouseOut(e))

    const margin = config.HUD_MARGIN * 2 + 1;
    this.width = (MAX_CHAR_WIDTH *  config.HUD_SCALE)
    this.height = (MAX_CHAR_HEIGHT *  config.HUD_SCALE)

    this.stairsIcon = ResourceManager.getHUDElement("icons-stairs");
    this.stairsIcon.position.y = this.stairsIcon.height / 2;

    this.stairsText = new MeshText2D(" ", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.stairsText.position.x = margin * config.HUD_SCALE;
    this.stairsText.position.y = this.stairsText.height - margin;

    this.levelIcon = ResourceManager.getHUDElement("character-body-0-hud-face")
    this.levelIcon.position.y = -this.stairsIcon.height * 1.5;
    delete this.levelIcon.userData.hud;

    this.levelText = new MeshText2D(" ", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#d0c01c',
      antialias: false
    })
    this.levelText.position.x = margin * config.HUD_SCALE;
    this.levelText.position.y = this.levelIcon.position.y + this.levelText.height - config.HUD_MARGIN;

    // Damage
    this.damageIcon = ResourceManager.getHUDElement("icons-damage");
    this.damageIcon.position.y = this.levelIcon.position.y - this.levelIcon.height - margin;
    this.damageIcon.userData.label = "Damage";

    this.damageText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.damageText.position.x = margin * config.HUD_SCALE;
    this.damageText.position.y = this.damageIcon.position.y + this.damageIcon.height / 2;

    // Armor
    this.armorIcon = ResourceManager.getHUDElement("icons-armor");
    this.armorIcon.position.y = this.damageIcon.position.y - this.damageIcon.height - margin;
    this.armorIcon.userData.label = "Armor";

    this.armorText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.armorText.position.x = margin * config.HUD_SCALE;
    this.armorText.position.y = this.armorIcon.position.y + this.armorIcon.height / 2;

    // Attack speed
    this.attackSpeedIcon = ResourceManager.getHUDElement("icons-attack-speed");
    this.attackSpeedIcon.position.y = this.armorIcon.position.y - this.armorIcon.height - margin;
    this.attackSpeedIcon.userData.label = "Attack speed";

    this.attackSpeedText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.attackSpeedText.position.x = margin * config.HUD_SCALE;
    this.attackSpeedText.position.y = this.attackSpeedIcon.position.y + this.attackSpeedIcon.height / 2;

    // Movement speed
    this.movementSpeedIcon = ResourceManager.getHUDElement("icons-movement-speed");
    this.movementSpeedIcon.position.y = this.attackSpeedIcon.position.y - this.attackSpeedIcon.height - margin;
    this.movementSpeedIcon.userData.label = "Movement speed";

    this.movementSpeedText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.movementSpeedText.position.x = margin * config.HUD_SCALE;
    this.movementSpeedText.position.y = this.movementSpeedIcon.position.y + this.movementSpeedIcon.height / 2;

    // Attack distance
    this.attackDistanceIcon = ResourceManager.getHUDElement("icons-attack-distance");
    this.attackDistanceIcon.position.y = this.movementSpeedIcon.position.y - this.movementSpeedIcon.height - margin;
    this.attackDistanceIcon.userData.label = "Attack distance";

    this.attackDistanceText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#dce1e2',
      antialias: false
    });
    this.attackDistanceText.position.x = margin * config.HUD_SCALE;
    this.attackDistanceText.position.y = this.attackDistanceIcon.position.y + this.attackDistanceIcon.height / 2;

    // Level up button
    this.lvlUpButton = new LevelUpButton();
    this.lvlUpButton.position.y = this.attackDistanceIcon.position.y - this.attackDistanceIcon.height - (margin * 2);
    this.lvlUpButton.addEventListener("click", () => this.onLevelUpClick());
    this.lvlUpButton.userData.hint = "Level up!"

    // Strength
    this.strIcon = ResourceManager.getHUDElement("icons-red");
    this.strIcon.position.y = this.attackDistanceIcon.position.y - this.attackDistanceIcon.height - (margin * 2);
    this.strIcon.userData.label = "Strength";

    this.strText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#d00000',
      antialias: false
    });
    this.strText.position.x = margin * config.HUD_SCALE;
    this.strText.position.y = this.strIcon.position.y + this.strIcon.height / 2;

    // Agility
    this.agiIcon = ResourceManager.getHUDElement("icons-green");
    this.agiIcon.position.y = this.strIcon.position.y - this.strIcon.height - margin;
    this.agiIcon.userData.label = "Agility";

    this.agiText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#7cac20',
      antialias: false
    });
    this.agiText.position.x = margin * config.HUD_SCALE;
    this.agiText.position.y = this.agiIcon.position.y + this.agiIcon.height / 2;

    // Intelligence
    this.intIcon = ResourceManager.getHUDElement("icons-blue");
    this.intIcon.position.y = this.agiIcon.position.y - this.agiIcon.height - margin;
    this.intIcon.userData.label = "Intelligence";

    this.intText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#1c80e4',
      antialias: false
    });
    this.intText.position.x = margin * config.HUD_SCALE;
    this.intText.position.y = this.intIcon.position.y + this.intIcon.height / 2;

    // Available points
    this.pointsToDistributeIcon = ResourceManager.getHUDElement("icons-points-to-distribute");
    this.pointsToDistributeIcon.position.y = this.intIcon.position.y - this.intIcon.height - margin;
    this.pointsToDistributeIcon.userData.label = "Points to distribute";

    this.pointsToDistributeText = new MeshText2D("0", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#d0c01c',
      antialias: false
    });
    this.pointsToDistributeText.position.x = margin * config.HUD_SCALE;
    this.pointsToDistributeText.position.y = this.pointsToDistributeIcon.position.y + this.pointsToDistributeIcon.height / 2;

    // Atribute lvl ups
    this.strUpButton = new LevelUpButton();
    this.strUpButton.position.y = this.strText.position.y - this.strIcon.height / 2;
    this.strUpButton.addEventListener("click", this.onIncreaseAttribute.bind(this, 'strength'));

    this.agiUpButton = new LevelUpButton();
    this.agiUpButton.position.y = this.agiText.position.y - this.agiIcon.height / 2;
    this.agiUpButton.addEventListener("click", this.onIncreaseAttribute.bind(this, 'agility'));

    this.intUpButton = new LevelUpButton();
    this.intUpButton.position.y = this.intText.position.y - this.intIcon.height / 2;
    this.intUpButton.addEventListener("click", this.onIncreaseAttribute.bind(this, 'intelligence'));

    this.add(this.stairsIcon);
    this.add(this.stairsText);

    this.add(this.levelIcon)
    this.add(this.levelText);

    this.add(this.damageIcon)
    this.add(this.damageText);
    this.add(this.armorIcon)
    this.add(this.armorText);
    this.add(this.attackSpeedIcon)
    this.add(this.attackSpeedText);
    this.add(this.movementSpeedIcon)
    this.add(this.movementSpeedText);
    this.add(this.attackDistanceIcon)
    this.add(this.attackDistanceText);

    // lvl up buttons
    this.add(this.lvlUpButton);
    this.add(this.strUpButton);
    this.add(this.agiUpButton);
    this.add(this.intUpButton);
  }

  onMouseOver(e) {
    const icon = e.path.find(path => path.object.userData.label);
    if (icon) {
      hint.show(icon.object.userData.label, icon.object)
    }
  }

  onMouseOut(e) {
    hint.hide();
  }

  getDamageAttribute() {
    return (
      player.userData.equipedItems.slots.left &&
      player.userData.equipedItems.slots.left.damageAttribute ||
      player.userData.primaryAttribute
    );
  }

  update (data) {
    if (!data) { return; }

    const statsModifiers = {
      hp: 0,
      mp: 0,

      strength: 0,
      agility: 0,
      intelligence: 0,

      armor: 0,
      damage: 0,

      movementSpeed: 0,
      attackDistance: 0,
      attackSpeed: 0,

      evasion: 0,
      criticalStrikeChance: 0,
    };

    for (const slotName in data.equipedItems.slots) {
      const item = data.equipedItems.slots[slotName];
      if (item) {
        item.modifiers.forEach(modifier => {
          statsModifiers[modifier.attr] += modifier.modifier;
        });
      }
    }

    // Level up hints!
    this.strUpButton.userData.hint = `<strong class="strength">Strength${(data.primaryAttribute === "strength") ? " (primary)" : ""}:</strong><br />
      ${(data.primaryAttribute === "strength") ? "Increase damage (+1)<br/>" : ""}
      Increase max hp (+4)<br />
    `;
    this.agiUpButton.userData.hint = `<strong class="agility">Agility${(data.primaryAttribute === "agility") ? " (primary)" : ""}:</strong><br/>
      ${(data.primaryAttribute === "agility") ? "Increase damage (+1)<br/>" : ""}
    `;
      // Increase attack speed (+0.5)<br/>
    this.intUpButton.userData.hint = `<strong class="intelligence">Intelligence${(data.primaryAttribute === "intelligence") ? " (primary)" : ""}:</strong><br/>
      ${(data.primaryAttribute === "intelligence") ? "Increase damage (+1)<br/>" : ""}
      Increase max mp (+3)<br/>
      Increase magical damage (+0.1)<br/>
    `;

    // var hpMax = (data.attributes.strength + statsModifiers['strength']) * 5;
    // var mpMax = (data.attributes.intelligence + statsModifiers['intelligence']) * 3;
    this.stairsText.text = `${player.parent.progress.toString()} - ${humanize(player.parent.mapkind)}`;

    this.levelText.text = `${data.name} (Level ${data.lvl})`;

    // const movementSpeed = BASE_MOVEMENT_SPEED - (statsModifiers.movementSpeed * MOVEMENT_SPEED_RATIO);
    // this.movementSpeedText.text = `${statsModifiers.movementSpeed} (${(1000 / movementSpeed).toFixed(1)}/s)`;

    this.movementSpeedText.text = `${statsModifiers.movementSpeed}`;
    // this.attackSpeedText.text = (data.attributes.agility * 0.5 + statsModifiers.attackSpeed).toFixed(1);
    this.attackSpeedText.text = (statsModifiers.attackSpeed).toFixed(1);

    this.attackDistanceText.text = statsModifiers.attackDistance.toString();

    // damage
    const damageAttribute = this.getDamageAttribute();
    let damage = data.attributes[damageAttribute] + statsModifiers[damageAttribute];
    if (statsModifiers.damage) { damage = `${damage}-${damage + statsModifiers.damage}` }
    this.damageText.text = damage;

    const baseArmor = { strength: 0, agility: -1, intelligence: -1.5 };
    this.armorText.text = (statsModifiers.armor + baseArmor[data.primaryAttribute]).toFixed(1);

    // base attributes
    let strength = data.attributes.strength;
    if (statsModifiers.strength) { strength += `+${statsModifiers.strength}` }
    this.strText.text = strength;

    let agility = data.attributes.agility;
    if (statsModifiers.agility) { agility += `+${statsModifiers.agility}` }
    this.agiText.text = agility;

    let intelligence = data.attributes.intelligence;
    if (statsModifiers.intelligence) { intelligence += `+${statsModifiers.intelligence}` }
    this.intText.text = intelligence;

    this.updateLevelUpButtons();
    this.pointsToDistributeText.text = data.pointsToDistribute.toString();
  }

  onLevelUpClick () {
    const hud = this.parent;

    if (!hud.inventory.isOpen) {
      hud.onToggleInventory();
    }
  }

  onIncreaseAttribute (attribute) {
    App.cursor.dispatchEvent({
      type: "distribute-point",
      attribute
    });
  }

  onOpenInventory () {
    this.add(this.strIcon)
    this.add(this.strText);
    this.add(this.agiIcon)
    this.add(this.agiText);
    this.add(this.intIcon)
    this.add(this.intText);
    this.add(this.pointsToDistributeIcon)
    this.add(this.pointsToDistributeText);

    this.updateLevelUpButtons();

    // this.add(this.attackSpeedIcon)
    // this.add(this.attackSpeedText);
    // this.add(this.movementSpeedIcon)
    // this.add(this.movementSpeedText);
    // this.add(this.attackDistanceIcon)
    // this.add(this.attackDistanceText);
  }

  updateLevelUpButtons (){
    if (!player) return;

    const hud = this.parent;

    const hasPointsToDistribute = (player.userData.pointsToDistribute > 0);
    if (!hasPointsToDistribute) {
      this.lvlUpButton.hide();
      this.strUpButton.hide();
      this.agiUpButton.hide();
      this.intUpButton.hide();

    } else {
      if (hud.inventory.isOpen) {
        this.lvlUpButton.hide();

        this.strUpButton.position.x = this.strText.position.x + this.strText.width + ((config.HUD_MARGIN * 2.5) * config.HUD_SCALE);
        this.agiUpButton.position.x = this.agiText.position.x + this.agiText.width + ((config.HUD_MARGIN * 2.5) * config.HUD_SCALE);
        this.intUpButton.position.x = this.intText.position.x + this.intText.width + ((config.HUD_MARGIN * 2.5) * config.HUD_SCALE);

        this.strUpButton.show();
        this.agiUpButton.show();
        this.intUpButton.show();

      } else {
        this.lvlUpButton.show();
        this.strUpButton.hide();
        this.agiUpButton.hide();
        this.intUpButton.hide();
      }
    }
  }

  onCloseInventory() {
    this.remove(this.strIcon)
    this.remove(this.strText);
    this.remove(this.agiIcon)
    this.remove(this.agiText);
    this.remove(this.intIcon)
    this.remove(this.intText);
    this.remove(this.pointsToDistributeIcon)
    this.remove(this.pointsToDistributeText);

    this.updateLevelUpButtons();
  }

  set composition (instance) {
    this.levelIcon.material.map = HeroSkinBuilder.get(instance, 'hud-face')
    this.levelIcon.scale.normalizeWithHUDTexture(this.levelIcon.material.map)
  }

}
