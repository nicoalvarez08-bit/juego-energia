let points = 100;
const minPoints = 50;
const maxPoints = 100;

const pointsEl = document.getElementById("points");
const messageEl = document.getElementById("message");
const battery = document.getElementById("battery");
const objects = document.querySelectorAll(".object");

battery.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text", "battery");
});

objects.forEach(obj => {
  obj.addEventListener("dragover", e => e.preventDefault());

  obj.addEventListener("drop", () => {
    const needsEnergy = obj.dataset.energy === "yes";

    if (needsEnergy) {
      points = Math.min(points + 10, maxPoints);
      messageEl.textContent = "✅ ¡Correcto! El carro necesita energía.";
      messageEl.style.color = "green";
    } else {
      points = Math.max(points - 10, minPoints);
      messageEl.textContent = "❌ Incorrecto. Este objeto no necesita energía.";
      messageEl.style.color = "red";
    }

    pointsEl.textContent = points;
  });
});
