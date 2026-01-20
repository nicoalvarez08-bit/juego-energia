const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGZnamlkYnBmbnNnd3J2dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI0MzUsImV4cCI6MjA4NDA3ODQzNX0.EvT6r8wN0Aw-MoTSr2-ENzTKAS41A22ATj7ktsqXAzw";

let hearts = 100;
let username = prompt("Escribe tu nombre:");
document.getElementById("playerName").textContent = username;

async function saveUser() {
  await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
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
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  );

  const data = await res.json();
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  data.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${user.lw_user_id} - ${user.total_points}`;
    list.appendChild(li);
  });
}

document.querySelectorAll(".object").forEach(obj => {
  obj.addEventListener("click", async () => {
    const needsEnergy = obj.dataset.needsEnergy === "true";

    if (!needsEnergy) {
      hearts -= 10;
      document.getElementById("hearts").textContent = hearts;
    }

    await saveUser();
    await loadRanking();
  });
});

loadRanking();
