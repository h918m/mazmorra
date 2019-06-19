import { Item } from "../Item";
import { Player } from "../Player";

export class ConsumableItem extends Item {

  use(player, state, force: boolean = false) { return force; }

  pick (player: Player, state) {
    let success: boolean = false;

    if (player.quickInventory.hasAvailability()) {
      success = player.quickInventory.add(this);

    } else if (player.inventory.hasAvailability()) {
      success = player.inventory.add(this);
    }

    if (success) {
      state.events.emit("sound", "pickItem", player);
    }

    return success;
  }

}
