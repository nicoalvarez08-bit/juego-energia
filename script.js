let hearts = 100;
let level = 1;
let locked = false;

const heartsEl = document.getElementById("hearts");
const objectsEl = document.getElementById("objects");
const messageEl = document.getElementById("message");
const levelText = document.getElementById("level-text");
const battery = document.getElementById("battery");

const levels = {
  1: {
    title: "Nivel 1: Objetos simples",
    objects: [
      { icon: "🪑", name: "Silla", needsEnergy: false },
      { icon: "🚲", name: "Bicicleta", needsEnergy: false },
      { icon: "🚗", name: "Carro", needsEnergy: true }
    ]
  },
  2: {
    title: "Nivel 2: Objetos eléctricos",
    objects: [
      { icon: "📺", name: "Televisor", needsEnergy: true },
      { icon: "💡", name: "Lámpara", needsEnergy: true },
      { icon: "📖", name: "Libro", needsEnergy: false }
    ]
  }
};

battery.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", "battery");
});

function loadLevel() {
  locked = false;
  objectsEl.innerHTML = "";
  messageEl.textContent = "";
  levelText.textContent = levels[level].title;
  heartsEl.textContent = hearts;

  levels[level].objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.icon}<span>${obj.name}</span>`;

    div.addEventListener("dragover", e => e.preventDefault());

    div.addEventListener("drop", () => {
      if (locked) return;
      checkAnswer(obj.needsEnergy);
    });

    objectsEl.appendChild(div);
  });
}

function checkAnswer(correct) {
  if (correct) {
    locked = true;
    messageEl.textContent = "✅ ¡Muy bien! Este objeto sí necesita energía.";
    messageEl.style.color = "green";

    if (level < 2) {
      setTimeout(() => {
        level++;
        loadLevel();
      }, 1500);
    } else {
      setTimeout(() => {
        messageEl.textContent = "🎉 ¡Excelente! Terminaste el juego.";
      }, 1500);
    }

  } else {
    hearts -= 10;
    if (hearts < 50) hearts = 50;

    heartsEl.textContent = hearts;
    messageEl.textContent =
      "❌ Este objeto no necesita energía. Intenta de nuevo.";
    messageEl.style.color = "red";
  }
}

loadLevel();
