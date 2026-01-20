const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
const SUPABASE_KEY = "TU_ANON_KEY_AQUI";

let username = "";
let hearts = 100;
let level = 1;

const levels = [
  {
    instruction: "¿Cuál necesita energía?",
    energy: "🔋",
    objects: [
      { icon: "📺", name: "Televisor", correct: true },
      { icon: "🪑", name: "Silla", correct: false }
    ]
  },
  {
    instruction: "¿Cuál NO necesita energía?",
    energy: "⚡",
    objects: [
      { icon: "💡", name: "Lámpara", correct: false },
      { icon: "📖", name: "Libro", correct: true }
    ]
  }
];

// LOGIN
document.getElementById("startBtn").onclick = () => {
  const input = document.getElementById("nicknameInput").value.trim();
  if (!input) return alert("Escribe un nickname");

  username = input;
  document.getElementById("playerName").textContent = username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadLevel();
  loadRanking();
};

function loadLevel() {
  const data = levels[level - 1];
  document.getElementById("instruction").textContent = data.instruction;
  document.getElementById("energyIcon").textContent = data.energy;
  document.getElementById("level").textContent = level;

  const zone = document.getElementById("objectsZone");
  zone.innerHTML = "";

  data.objects.forEach(obj => {
    const div = document.createElement("div");
    div.className = "object";
    div.innerHTML = `${obj.icon}<span>${obj.name}</span>`;
    div.onclick = () => handleAnswer(obj.correct);
    zone.appendChild(div);
  });
}

async function handleAnswer(correct) {
  if (!correct) {
    hearts -= 10;
    document.getElementById("hearts").textContent = hearts;
  } else {
    level++;
    if (level > levels.length) level = 1;
    loadLevel();
  }
  await saveScore();
  loadRanking();
}

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
      lw_user_id: username,
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
  const list = document.getElementById("rankingList");
  list.innerHTML = "";
  data.forEach((u, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${u.lw_user_id} - ${u.total_points}`;
    list.appendChild(li);
  });
}
