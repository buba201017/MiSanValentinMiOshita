const photos = [
  { src: "assets/img1.jpeg", caption: "Momento #1: Iniciar con mi oshita el 2026 💖", pos: "50% 40%" },
  { src: "assets/img2.jpeg", caption: "Momento #2: Me encanta siempre como brillas ✨", pos: "50% 25%" },
  { src: "assets/img3.jpeg", caption: "Momento #3: Gracias por tantos momentos tan especiales 🥺", pos: "50% 40%" },
  { src: "assets/img4.jpeg", caption: "Momento #4: Disfruto mucho estar a su lado, ayudándola siempre 💘", pos: "50% 35%" },
  {
    src: "assets/img6.jpeg",
    caption: "Momento final 💖: Ahora sí mi amor… vayamos a lo más importante de todo esto. Dale click al botoncito de abajo 🥺💘",
    pos: "50% 15%"
  },
];

let i = 0;

const card = document.getElementById("card");
const photo = document.getElementById("photo");
const caption = document.getElementById("caption");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

const btnAsk = document.getElementById("btnAsk");
btnAsk.style.display = "none";

const question = document.getElementById("question");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const hint = document.getElementById("hint");

const final = document.getElementById("final");        // queda por si quieres
const btnReplay = document.getElementById("btnReplay");// queda por si quieres
const confetti = document.getElementById("confetti");  // queda por si quieres

// ✅ Overlay impactante
const overlay = document.getElementById("overlay");
overlay.classList.add("hidden");
const btnCloseOverlay = document.getElementById("btnCloseOverlay");
const btnReplay2 = document.getElementById("btnReplay2");

// ✅ Fireworks canvas
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fwRunning = false;
let fwParticles = [];
let fwBursts = 0;
let fwRAF = null;

function resizeCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function render() {
  // Imagen y texto
  photo.src = photos[i].src;
  caption.textContent = photos[i].caption;
  photo.style.objectPosition = photos[i].pos || "50% 50%";

  // Animación suave al cambiar imagen
  photo.animate(
    [
      { transform: "scale(1.03)", filter: "brightness(1.05)" },
      { transform: "scale(1.01)", filter: "brightness(1)" }
    ],
    { duration: 240, easing: "ease-out" }
  );

  // Modo flujo (oculta header desde momento 2)
  if (i >= 1) card.classList.add("flow");
  else card.classList.remove("flow");

  // Botón "Tengo una pregunta..." solo en el último
  const isLast = i === photos.length - 1;
  btnAsk.style.display = isLast ? "inline-block" : "none";

  // 🔥 CONTROL CORRECTO DE FLECHAS 🔥
  const isFirst = i === 0;

  // Flecha izquierda
  prev.style.visibility = isFirst ? "hidden" : "visible";
  prev.style.pointerEvents = isFirst ? "none" : "auto";

  // Flecha derecha
  next.style.visibility = isLast ? "hidden" : "visible";
  next.style.pointerEvents = isLast ? "none" : "auto";
}


prev.addEventListener("click", () => {
  i = (i - 1 + photos.length) % photos.length;
  render();
});
next.addEventListener("click", () => {
  i = (i + 1) % photos.length;
  render();
});

btnAsk.addEventListener("click", () => {
  question.classList.remove("hidden");
  btnAsk.textContent = "Ahora si miamor elijaaa 😳";
  question.scrollIntoView({ behavior: "smooth", block: "center" });
});

btnYes.addEventListener("click", () => {
  // Ocultamos la pregunta y mostramos overlay impactante
  question.classList.add("hidden");
  showOverlayWithFireworks();
});

btnCloseOverlay.addEventListener("click", () => {
  stopFireworks();
  location.reload();
});

btnReplay2.addEventListener("click", () => location.reload());

// Botón "No" juguetón
let noCount = 0;
const noPhrases = [
  "¿Segura? 🥺",
  "Piénsalo otra vez 😳",
  "Yo digo que sí 😼",
  "Ándale di que sí 💘",
  "No acepto esa opción 🤭",
];

btnNo.addEventListener("mouseenter", () => {
  const dx = Math.floor((Math.random() - 0.5) * 220);
  const dy = Math.floor((Math.random() - 0.5) * 90);
  btnNo.style.transform = `translate(${dx}px, ${dy}px)`;
});

btnNo.addEventListener("click", () => {
  noCount++;
  hint.textContent = noPhrases[Math.min(noCount, noPhrases.length - 1)];

  if (noCount >= 4) {
    btnNo.textContent = "Ok… Sí 💞";
    btnNo.classList.remove("no");
    btnNo.classList.add("yes");
    btnNo.style.transform = "translate(0,0)";
    btnNo.onclick = () => btnYes.click();
  }
});

// ========= FIREWORKS =========
function showOverlayWithFireworks() {
  overlay.classList.remove("hidden");
  startFireworks();
}

function startFireworks() {
  resizeCanvas();
  fwRunning = true;
  fwParticles = [];
  fwBursts = 0;

  // Disparamos varios “cohetes” en ráfaga al inicio
  burstSequence();

  const loop = () => {
    if (!fwRunning) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // dibuja y actualiza partículas
    fwParticles = fwParticles.filter(p => p.life > 0);
    for (const p of fwParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravedad suave
      p.life -= 1;
      p.alpha = Math.max(0, p.life / p.maxLife);

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    fwRAF = requestAnimationFrame(loop);
  };

  fwRAF = requestAnimationFrame(loop);
}

function stopFireworks() {
  fwRunning = false;
  fwParticles = [];
  if (fwRAF) cancelAnimationFrame(fwRAF);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function burstSequence() {
  // 6 explosiones iniciales
  const bursts = 6;
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      fireworkBurst(
        rand(window.innerWidth * 0.15, window.innerWidth * 0.85),
        rand(window.innerHeight * 0.18, window.innerHeight * 0.45)
      );
    }, b * 180);
  }

  // y algunas aleatorias extras por 2.5s
  const interval = setInterval(() => {
    if (!fwRunning) return clearInterval(interval);
    fwBursts++;
    fireworkBurst(
      rand(window.innerWidth * 0.12, window.innerWidth * 0.88),
      rand(window.innerHeight * 0.14, window.innerHeight * 0.52)
    );
    if (fwBursts > 10) clearInterval(interval);
  }, 220);
}

function fireworkBurst(x, y) {
  const colors = ["#ff4d88", "#ff9ac2", "#ffd166", "#8ecae6", "#b8f2e6", "#c77dff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 120;

  for (let k = 0; k < count; k++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(1.2, 4.2);
    fwParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(1.2, 2.6),
      life: randInt(45, 95),
      maxLife: 95,
      color,
      alpha: 1,
    });
  }
}

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

// ========= CONFETTI (queda por si luego lo quieres) =========
function launchConfetti() {
  confetti.innerHTML = "";
  const pieces = 90;

  for (let k = 0; k < pieces; k++) {
    const s = document.createElement("span");
    const size = 4 + Math.random() * 6;
    s.style.position = "absolute";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 20}px`;
    s.style.width = `${size}px`;
    s.style.height = `${size + 6}px`;
    s.style.background = `hsl(${Math.random() * 360}, 90%, 70%)`;
    s.style.borderRadius = "2px";
    s.style.transform = `rotate(${Math.random() * 180}deg)`;
    s.style.opacity = "0.95";

    const fall = s.animate(
      [
        { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 260}px, 170px) rotate(360deg)`, opacity: 0 }
      ],
      { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.2,.9,.2,1)" }
    );
    fall.onfinish = () => s.remove();

    confetti.appendChild(s);
  }
}

render();
