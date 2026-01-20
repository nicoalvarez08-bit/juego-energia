/* =====================
   LOGIN
===================== */
function login() {
  const name = document.getElementById("nickname").value.trim();
  if (!name) {
    alert("Escribe un nombre");
    return;
  }
  localStorage.setItem("playerName", name);
  window.location.href = "game.html";
}

/* =====================
   JUEGO
===================== */
if (document.body.id === "game") {

  const name = localStorage.getItem("playerName");
  if (!name) {
    window.location.href = "index.html";
  }

  document.getElementById("playerName").textContent = name;

  let hearts = 100;
  let points = 0;

  function correct() {
    points += 10;
    document.getElementById("message").textContent = "✅ Correcto +10 puntos";
    updateRanking();
  }

  function wrong() {
    hearts -= 10;
    document.getElementById("hearts").textContent = hearts;
    document.getElementById("message").textContent = "❌ Incorrecto -10 corazones";
  }

  function updateRanking() {
    const list = document.getElementById("rankingList");
    list.innerHTML = `<li>${name} — ${points} pts</li>`;
  }

  updateRanking();
}
