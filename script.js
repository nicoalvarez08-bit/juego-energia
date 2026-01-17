/*********** CONFIG SUPABASE ***********/
const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGZnamlkYnBmbnNnd3J2dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI0MzUsImV4cCI6MjA4NDA3ODQzNX0.EvT6r8wN0Aw-MoTSr2-ENzTKAS41A22ATj7ktsqXAzw";


const headers = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": "Bearer " + SUPABASE_ANON_KEY,
  "Content-Type": "application/json"
};

/*********** VARIABLES ***********/
let username = "";
let hearts = 100;
let level = 1;

/*********** NIVELES ***********/
const levels = [
  {
    instruction: "¿Cuál objeto NECESITA energía?",
    correct: "car",
    objects: [
      { id: "chair", emoji: "🪑", name: "Silla" },
      { id: "bike", emoji: "🚲", name: "Bicicleta" },
      { id: "car", emoji: "🚗", name: "Carro" }
    ]
  },
  {
    instruction: "¿Cuál objeto NO necesita energía?",
    correct: "book",
    objects: [
      { id: "lamp", emoji: "💡", name: "Lámpara" },
      { id: "tv", emoji: "📺", name: "Televisor" },
      { id: "book", emoji: "📘", name: "Libro" }
    ]
  }
];

/*********** INICIO ***********/
function startGame() {
  username = document.getElementById("usernameInput").value.trim();
  if (!username) {
    alert("Escribe tu nombre");
    return;
  }
  document.getElementById("nameScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  loadLevel();
}

/*********** CARGAR NIVEL ***********/
function loadLevel() {
  const lvl = levels[level - 1];
  document.getElementById("instruction").textContent = lvl.instruction;
  const zone = document.getElementById("objectsZone");
  zone.innerHTML = "";

  lvl.objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.emoji}<span>${obj.name}</span>`;
    div.onclick = () => checkAnswer(obj.id);
    zone.appendChild(div);
  });
}

/*********** RESPUESTA ***********/
function checkAnswer(selected) {
  const correct = levels[level - 1].correct;
  const msg = document.getElementById("message");

  if (selected === correct) {
    msg.textContent = "✅ ¡Correcto!";
    nextLevel();
  } else {
    hearts -= 10;
    if (hearts < 50) hearts = 50;
    document.getElementById("hearts").textContent = hearts;
    msg.textContent = "❌ Incorrecto (-10 corazones)";
  }
}

/*********** SIGUIENTE NIVEL ***********/
function nextLevel() {
  if (level < levels.length) {
    level++;
    setTimeout(loadLevel, 1000);
  } else {
    endGame();
  }
}

/*********** FINAL ***********/
async function endGame() {

  console.log("FIN DEL JUEGO - guardando puntos");
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("rankingScreen").classList.remove("hidden");

  await savePoints();
  await loadRanking();
}

/*********** SUPABASE ***********/
async function savePoints() {
  console.log("Intentando guardar puntos:", username, hearts);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?lw_user_id=eq.${username}`, {
    headers
  });
  const data = await res.json();

  if (data.length === 0) {
    await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ lw_user_id: username, total_points: hearts })
    });
  } else {
    const total = data[0].total_points + hearts;
    await fetch(`${SUPABASE_URL}/rest/v1/users?lw_user_id=eq.${username}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ total_points: total })
    });
  }
}

async function loadRanking() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=lw_user_id,total_points&order=total_points.desc&limit=10`, {
    headers
  });
  const data = await res.json();
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.lw_user_id} - ${u.total_points} pts`;
    list.appendChild(li);
  });
}
