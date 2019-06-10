import { ConsumableItem } from "../ConsumableItem";
import helpers from "../../../../shared/helpers";
import { DBAttributeModifier } from "../../../db/Hero";
import { Bar } from "../../../core/Bar";

export class Potion extends ConsumableItem {

  constructor () {
    super();
  }

  addModifier(modifier: DBAttributeModifier) {
    if (modifier.attr == "hp") {

      if (modifier.modifier <= 10) {
        this.type = helpers.ENTITIES.HP_POTION_1;

      } else if (modifier.modifier <= 40) {
        this.type = helpers.ENTITIES.HP_POTION_2;

      } else if (modifier.modifier <= 80) {
        this.type = helpers.ENTITIES.HP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.HP_POTION_4;
      }

    } else if (modifier.attr == "mp") {
      if (modifier.modifier <= 10) {
        this.type = helpers.ENTITIES.MP_POTION_1;

      } else if (modifier.modifier <= 40) {
        this.type = helpers.ENTITIES.MP_POTION_2;

      } else if (modifier.modifier <= 80) {
        this.type = helpers.ENTITIES.MP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.MP_POTION_4;
      }

    } else if (modifier.attr == "xp") {
      if (modifier.modifier <= 10) {
        this.type = helpers.ENTITIES.XP_POTION_1;

      } else if (modifier.modifier <= 40) {
        this.type = helpers.ENTITIES.XP_POTION_2;

      } else if (modifier.modifier <= 80) {
        this.type = helpers.ENTITIES.XP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.XP_POTION_4;
      }

    } else {
      this.type = helpers.ENTITIES.ELIXIR_POTION_1;
    }

    super.addModifier(modifier);
  }

  use(player, state) {
    const attr = this.modifiers[0].attr;
    const amount = this.modifiers[0].modifier;

    const COLORS = {
      "hp": "red",
      "mp": "blue",
      "xp": "white"
    };

    if (player[attr] instanceof Bar) {
      (player[attr] as Bar).increment(amount);
    }

    state.createTextEvent(`+ ${amount} ${attr}`, player.position, COLORS[attr], 100);
    state.events.emit("sound", "potion", player);

    return true;
  }

}