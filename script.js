let hearts = 100;
let level = 1;
let locked = false;

const heartsEl = document.getElementById("hearts");
const objectsEl = document.getElementById("objects");
const messageEl = document.getElementById("message");
const levelText = document.getElementById("level-text");
const battery = document.getElementById("battery");
const instruction = document.getElementById("instruction");
const energyZone = document.getElementById("energy-zone");

const levels = {
  1: {
    title: "Nivel 1: ¿Quién necesita energía?",
    mode: "drag",
    instruction: "Arrastra la batería al objeto que necesita energía",
    objects: [
      { icon: "🪑", name: "Silla", needsEnergy: false },
      { icon: "🚲", name: "Bicicleta", needsEnergy: false },
      { icon: "🚗", name: "Carro", needsEnergy: true }
    ]
  },
  2: {
    title: "Nivel 2: ¿Quién NO necesita energía?",
    mode: "click",
    instruction: "Haz clic en el objeto que NO necesita energía",
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
  instruction.textContent = levels[level].instruction;
  heartsEl.textContent = hearts;

  // Mostrar u ocultar energía según nivel
  energyZone.style.display = levels[level].mode === "drag" ? "block" : "none";

  levels[level].objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.icon}<span>${obj.name}</span>`;

    if (levels[level].mode === "drag") {
      div.addEventListener("dragover", e => e.preventDefault());
      div.addEventListener("drop", () => {
        if (locked) return;
        checkAnswer(obj.needsEnergy, true);
      });
    } else {
      div.addEventListener("click", () => {
        if (locked) return;
        checkAnswer(!obj.needsEnergy, false);
      });
    }

    objectsEl.appendChild(div);
  });
}

function checkAnswer(correct, energyMode) {
  if (correct) {
    locked = true;
    messageEl.textContent = "✅ ¡Muy bien! Respuesta correcta.";
    messageEl.style.color = "green";

    setTimeout(() => {
      if (level < 2) {
        level++;
        loadLevel();
      } else {
        messageEl.textContent = "🎉 ¡Excelente! Terminaste el juego.";
      }
    }, 1500);

  } else {
    hearts -= 10;
    if (hearts < 50) hearts = 50;
    heartsEl.textContent = hearts;

    messageEl.textContent = "❌ No es correcto. Intenta de nuevo.";
    messageEl.style.color = "red";
  }
}

loadLevel();
