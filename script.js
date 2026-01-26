document.addEventListener("DOMContentLoaded", () => {

  // ================= SUPABASE =================
  const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGZnamlkYnBmbnNnd3J2dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI0MzUsImV4cCI6MjA4NDA3ODQzNX0.EvT6r8wN0Aw-MoTSr2-ENzTKAS41A22ATj7ktsqXAzw";

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  // ================= ELEMENTOS =================
  const loginScreen = document.getElementById("login-screen");
  const gameScreen = document.getElementById("game-screen");

  const nicknameInput = document.getElementById("nicknameInput");
  const loginBtn = document.getElementById("loginBtn");
  const loginMessage = document.getElementById("loginMessage");

  const playerName = document.getElementById("playerName");
  const playerPoints = document.getElementById("playerPoints");
  const gameMessage = document.getElementById("gameMessage");

  const battery = document.querySelector(".battery");
  const objects = document.querySelectorAll(".object");
  const rankingList = document.getElementById("ranking");

  // ================= ESTADO =================
  let currentNickname = "";
  let points = 0;

  // ================= LOGIN =================
  loginBtn.addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();

    if (!nickname) {
      loginMessage.textContent = "Escribe un nickname";
      return;
    }

    loginMessage.textContent = "Cargando...";

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("nickname", nickname)
      .maybeSingle();

    if (error) {
      loginMessage.textContent = "Error con la base de datos";
      console.error(error);
      return;
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ nickname, total_points: 0 }]);

      if (insertError) {
        loginMessage.textContent = "No se pudo crear el usuario";
        console.error(insertError);
        return;
      }

      points = 0;
    } else {
      points = data.total_points || 0;
    }

    currentNickname = nickname;
    startGame();
  });

  // ================= INICIAR JUEGO =================
  function startGame() {
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    playerName.textContent = currentNickname;
    playerPoints.textContent = points;

    loadRanking();
  }

  // ================= DRAG & DROP =================
  battery.addEventListener("dragstart", () => {
    gameMessage.textContent = "Arrastra la batería al objeto correcto";
  });

  objects.forEach(obj => {
    obj.addEventListener("dragover", e => e.preventDefault());

    obj.addEventListener("drop", async () => {
      const needsEnergy = obj.dataset.energy === "true";

      if (needsEnergy) {
        points += 10;
        gameMessage.textContent = "✅ Correcto";
      } else {
        points = Math.max(0, points - 5);
        gameMessage.textContent = "❌ Incorrecto";
      }

      playerPoints.textContent = points;

      await supabase
        .from("users")
        .update({ total_points: points })
        .eq("nickname", currentNickname);

      loadRanking();
    });
  });

  // ================= RANKING =================
  async function loadRanking() {
    const { data, error } = await supabase
      .from("users")
      .select("nickname, total_points")
      .order("total_points", { ascending: false })
      .limit(5);

    if (error) return;

    rankingList.innerHTML = "";

    data.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.nickname} - ${user.total_points} pts`;
      rankingList.appendChild(li);
    });
  }

});
