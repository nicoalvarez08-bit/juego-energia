let hearts = 100;
let level = 1;

const heartsEl = document.getElementById("hearts");
const objectsEl = document.getElementById("objects");
const messageEl = document.getElementById("message");
const levelText = document.getElementById("level-text");
const battery = document.getElementById("battery");

const levels = {
  1: {
    text: "Nivel 1: Objetos cotidianos",
    objects: [
      { icon: "🪑", name: "Silla", energy: false },
      { icon: "🚲", name: "Bicicleta", energy: false },
      { icon: "🚗", name: "Carro", energy: true }
    ]
  },
  2: {
    text: "Nivel 2: Objetos eléctricos",
    objects: [
      { icon: "📺", name: "Televisor", energy: true },
      { icon: "💡", name: "Lámpara", energy: true },
      { icon: "📚", name: "Libro", energy: false }
    ]
  }
};

battery.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", "battery");
});

function loadLevel() {
  objectsEl.innerHTML = "";
  levelText.textContent = levels[level].text;
  messageEl.textContent = "";

  levels[level].objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.icon}<span>${obj.name}</span>`;
    div.dataset.energy = obj.energy;

    div.addEventListener("dragover", e => e.preventDefault());

    div.addEventListener("drop", () => handleDrop(obj.energy));

    objectsEl.appendChild(div);
  });
}

function handleDrop(needsEnergy) {
  if (needsEnergy) {
    messageEl.textContent = "✅ Correcto. Este objeto necesita energía.";
    messageEl.style.color = "green";

    if (level === 1) {
      level = 2;
      setTimeout(loadLevel, 1200);
    }
  } else {
    hearts -= 10;
    heartsEl.textContent = hearts;
    messageEl.textContent = "❌ Incorrecto. Este objeto no necesita energía.";
    messageEl.style.color = "red";
  }
}

loadLevel();
