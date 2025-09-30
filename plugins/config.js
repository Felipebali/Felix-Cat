// plugins/configuracion.js
let handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat] || {};
  const {
    welcome,
    restrict,
    antiBot,
    autoAceptar,
    autoRechazar,
    antiBot2,
    modoadmin,
    reaction,
    antiSpam,
    jadibotmd,
    detect,
    antiLink
  } = chat;

  const estado = (valor) => valor ? '✅ *Activado*' : '❌ *Desactivado*';

  const text = `
╭━━━〔 *📋 PANEL DE CONFIGURACIÓN* 〕━━━⬣

╭─〔 *Grupos* 〕
│ ☘️ Welcome: ${estado(welcome)}
│ ☘️ Antibot: ${estado(antiBot)}
│ ☘️ Autoaceptar: ${estado(autoAceptar)}
│ ☘️ Autorechazar: ${estado(autoRechazar)}
│ ☘️ AntiSub Bots: ${estado(antiBot2)}
│ ☘️ Modo Admin: ${estado(modoadmin)}
│ ☘️ Reacción: ${estado(reaction)}
│ ☘️ Avisos / Detect: ${estado(detect)}
│ ☘️ Antilink: ${estado(antiLink)}
╰─────────────⬣

╭─〔 *Owner / Creador* 〕
│ 🌳 Restringir: ${estado(restrict)}
│ 🌳 Mode Jadibot: ${estado(jadibotmd)}
│ 🌳 Antispam: ${estado(antiSpam)}
╰─────────────⬣
`;

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      contactMessage: { displayName: await conn.getName(m.sender) }
    }
  };

  await conn.sendMessage(
    m.chat,
    {
      text,
      contextInfo: {
        externalAdReply: {
          title: "⚙️ Configuración FelixCat Bot",
          body: "Gestión avanzada del sistema",
          thumbnailUrl: "https://files.catbox.moe/4dple4.jpg",
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: fkontak }
  );
};

handler.help = ["panel", "config"];
handler.tags = ["grupo"];
handler.command = ["panel", "config"]; // ahora solo con .panel o .config
handler.register = true;

export default handler;
