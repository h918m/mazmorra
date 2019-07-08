import { isMobile } from "../utils/device";

export function isTutorialComplete() {
  return isMobile || window.localStorage.getItem("tutorial") || false;
}

export function showTutorial() {
  const div = document.createElement("div");
  div.id = "tutorial";
  div.classList.add("modal");
  div.classList.add("active");

  let currentStep = 1;
  div.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  })

  div.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const contents = div.querySelector(".contents");
    const pages = div.querySelector("span.pages");

    if (e.target.classList.contains("last")) {
      document.body.removeChild(div);
      window.localStorage.setItem("tutorial", true);

    } else if (e.target.classList.contains("right")) {
      contents.classList.remove(`step-${currentStep}`);
      currentStep++;
      contents.classList.add(`step-${currentStep}`);

    } else if (e.target.classList.contains("left")) {
      contents.classList.remove(`step-${currentStep}`);
      currentStep--;
      contents.classList.add(`step-${currentStep}`);
    }

    pages.innerHTML = `${currentStep}/9`;
  });

  div.innerHTML = `
  <h2>How to play (<span class="pages">1/9</span>)</h2>
  <div class="contents step-1">
    <a class="nav left" href="#">« Previous</a>
    <a class="nav right" href="#">Next »</a>
    <a class="nav last" href="#">Play!</a>

    <div class="step-1">
      <img src="images/tutorial/move.png" alt="How to move" />
      <p>Left click or touch to move</p>
    </div>

    <div class="step-2">
      <img src="images/tutorial/chests.png" alt="Opening chests" />
      <p>Chests can give you potions, gold, and items to equip</p>
    </div>

    <div class="step-3">
      <img src="images/tutorial/enemies.png" alt="Killing enemies" />
      <p>Right click on enemies to attack them</p>
    </div>

    <div class="step-4">
      <img src="images/tutorial/level-up-1.png" alt="Level up button" />
      <p>When you level up, you can increase your hero's stats</p>
    </div>

    <div class="step-5">
      <img src="images/tutorial/level-up-2.png" alt="Level up button" />
      <p>Choose wisely which stat to increase</p>
    </div>

    <div class="step-6">
      <img src="images/tutorial/inventory-1.png" alt="Inventory: Toggle" />
      <p>Click on the bag, or press "I" or "B" to open inventory</p>
    </div>

    <div class="step-7">
      <img src="images/tutorial/inventory-2.png" alt="Inventory: Bag" />
      <p>Consume, equip or trade items from the bag</p>
    </div>

    <div class="step-8">
      <img src="images/tutorial/inventory-3.png" alt="Inventory: Equipped Items" />
      <p>Equipped items can increase your stats, and improve your hero</p>
    </div>

    <div class="step-9">
      <img src="images/tutorial/inventory-4.png" alt="Inventory: Quick access" />
      <p>Number keys (1, 2, 3, etc.) will consume items on quick area</p>
    </div>

  </div>
`;

  document.body.appendChild(div);
}
