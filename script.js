/********* SUPABASE *********/
const SUPABASE_URL = "https://gihfgjidbpfnsgwrvvxv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGZnamlkYnBmbnNnd3J2dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDI0MzUsImV4cCI6MjA4NDA3ODQzNX0.EvT6r8wN0Aw-MoTSr2-ENzTKAS41A22ATj7ktsqXAzw";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/********* ESTADO *********/
let username = "";
let score = 100;
let level = 1;

/********* LOGIN *********/
async function login() {
  const input = document.getElementById("usernameInput");
  username = input.value.trim();

  if (!username) return;

  localStorage.setItem("username", username);

  // crear usuario si no existe
  const { data } = await supabase
    .from("ranking")
    .select("*")
    .eq("username", username)
    .single();

  if (!data) {
    await supabase.from("ranking").insert({
      username,
      score: 100
    });
  } else {
    score = data.score;
  }

  iniciarJuego();
}

/********* INICIAR *********/
function iniciarJuego() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  document.getElementById("playerName").textContent = username;
  actualizarUI();
  cargarNivel();
  cargarRanking();
}

/********* NIVELES *********/
function cargarNivel() {
  const title = document.getElementById("levelTitle");
  const instruction = document.getElementById("instruction");
  const objects = document.getElementById("objects");

  objects.innerHTML = "";

  if (level === 1) {
    title.textContent = "Nivel 1";
    instruction.textContent = "¿Qué objeto necesita energía?";
    crearObjeto("🪑", false);
    crearObjeto("🚲", false);
    crearObjeto("🚗", true);
  }

  if (level === 2) {
    title.textContent = "Nivel 2";
    instruction.textContent = "¿Cuál NO necesita energía?";
    crearObjeto("💡", true);
    crearObjeto("📺", true);
    crearObjeto("📘", false);
  }
}

function crearObjeto(icono, necesitaEnergia) {
  const div = document.createElement("div");
  div.className = "object";
  div.textContent = icono;

  div.onclick = () => verificar(necesitaEnergia);
  document.getElementById("objects").appendChild(div);
}

/********* VERIFICAR *********/
async function verificar(correcto) {
  if (correcto) {
    mostrarMensaje("✅ ¡Correcto!");
    level++;
    setTimeout(cargarNivel, 1500);
  } else {
    score -= 10;
    if (score < 50) score = 50;

    await actualizarScore();
    actualizarUI();
    mostrarMensaje("❌ Incorrecto (-10)");
  }
}

/********* SCORE *********/
async function actualizarScore() {
  await supabase
    .from("ranking")
    .update({ score })
    .eq("username", username);

  cargarRanking();
}

function actualizarUI() {
  document.getElementById("score").textContent = score;
}

/********* MENSAJE *********/
function mostrarMensaje(texto) {
  const msg = document.getElementById("message");
  msg.textContent = texto;
  msg.classList.remove("hidden");

  setTimeout(() => msg.classList.add("hidden"), 2000);
}

/********* RANKING *********/
async function cargarRanking() {
  const { data } = await supabase
    .from("ranking")
    .select("username, score")
    .order("score", { ascending: false })
    .limit(5);

  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.username} — ${u.score}`;
    list.appendChild(li);
  });
}
