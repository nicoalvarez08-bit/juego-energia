const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
const SUPABASE_KEY = "TU_ANON_KEY_AQUI";

// PANTALLAS
const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("gameScreen");

// ESTADO
let playerName = "";
let hearts = 100;
let level = 1;

// NIVELES
const levels = [
  {
    question: "¿Cuál necesita energía?",
    objects: [
      { text: "Televisor 📺", correct: true },
      { text: "Silla 🪑", correct: false }
    ]
  },
  {
    question: "¿Cuál NO necesita energía?",
    objects: [
      { text: "Libro 📘", correct: true },
      { text: "Lámpara 💡", correct: false }
    ]
  }
];

// 👉 CAMBIO DE PANTALLA (COMO PASAR DE NIVEL)
function startGame() {
  const input = document.getElementById("playerNameInput").value.trim();
  if (!input) return alert("Escribe tu nombre");

  playerName = input;
  document.getElementById("playerName").textContent = playerName;

  loginScreen.classList.remove("active");
  gameScreen.classList.add("active");

  loadLevel();
  loadRanking();
}

// JUEGO
function loadLevel() {
  const data = levels[level - 1];
  document.getElementById("instruction").textContent = data.question;
  document.getElementById("levelTitle").textContent = `Nivel ${level}`;

  const container = document.getElementById("objects");
  container.innerHTML = "";

  data.objects.forEach(obj => {
    const btn = document.createElement("button");
    btn.textContent = obj.text;
    btn.onclick = () => answer(obj.correct);
    container.appendChild(btn);
  });
}

async function answer(correct) {
  if (!correct) {
    hearts -= 10;
    document.getElementById("hearts").textContent = hearts;
  } else {
    level++;
    if (level > levels.length) level = 1;
  }

  await saveScore();
  loadRanking();
  loadLevel();
}

// SUPABASE
async function saveScore() {
  await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      lw_user_id: playerName,
      total_points: hearts
    })
  });
}

async function loadRanking() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=lw_user_id,total_points&order=total_points.desc&limit=10`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  const list = document.getElementById("ranking");
  list.innerHTML = "";

  data.forEach((u, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${u.lw_user_id} - ${u.total_points}`;
    list.appendChild(li);
  });
}
