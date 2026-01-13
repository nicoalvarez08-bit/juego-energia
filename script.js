let hearts = 100;
let level = 1;
let levelCompleted = false;

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

battery.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "battery");
});

function loadLevel() {
  levelCompleted = false;
  objectsEl.innerHTML = "";
  messageEl.textContent = "";
  levelText.textContent = levels[level].text;
  heartsEl.textContent = hearts;

  levels[level].objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.icon}<span>${obj.name}</span>`;
    div.dataset.energy = obj.energy;

    div.addEventListener("dragover", e => e.preventDefault());

    div.addEventListener("drop", () => {
      if (levelCompleted) return;
      handleDrop(obj.energy);
    });

    objectsEl.appendChild(div);
  });
}

function handleDrop(needsEnergy) {
  if (needsEnergy) {
    levelCompleted = true;
    messageEl.textContent = "✅ ¡Correcto! Nivel completado.";
    messageEl.style.color = "green";

    if (level === 1) {
      setTimeout(() => {
        level = 2;
        loadLevel();
      }, 1500);
    } else {
      setTimeout(() => {
        messageEl.textContent = "🎉 ¡Muy bien! Completaste el juego.";
      }, 1500);
    }

  } else {
    hearts -= 10;
    heartsEl.textContent = hearts;
    messageEl.textContent =
      "❌ Incorrecto. Este objeto no necesita energía.";
    messageEl.style.color = "red";
  }
}

loadLevel();
