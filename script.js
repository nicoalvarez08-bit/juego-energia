let bateria = document.getElementById("bateria");
let objetos = document.querySelectorAll(".objeto");
let mensaje = document.getElementById("mensaje");
let vidas = 100;
let intentos = {}; // para controlar intentos por objeto

document.getElementById("vidas").textContent = vidas;

// Drag & Drop
bateria.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text", e.target.id);
});

objetos.forEach(obj => {
  obj.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  obj.addEventListener("drop", (e) => {
    e.preventDefault();
    let idBateria = e.dataTransfer.getData("text");
    let necesita = obj.getAttribute("data-necesita");
    
    if (!intentos[obj.id]) intentos[obj.id] = 1;
    else intentos[obj.id]++;

    if (necesita === "si") {
      if (intentos[obj.id] === 1) {
        mensaje.textContent = "¡Correcto al primer intento!";
        // vidas no cambian si ya tiene 100
      } else if (intentos[obj.id] === 2) {
        mensaje.textContent = "¡Correcto al segundo intento!";
        vidas += 10;
        if (vidas > 100) vidas = 100;
      }
    } else {
      mensaje.textContent = "¡Incorrecto!";
      if (intentos[obj.id] === 1) {
        vidas -= 10;
        if (vidas < 0) vidas = 0;
      }
    }

    document.getElementById("vidas").textContent = vidas;
  });
});
