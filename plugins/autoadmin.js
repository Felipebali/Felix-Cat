// plugins/autoadmin.js
const handler = async (m, { conn, isAdmin }) => {
  try {
    if (isAdmin) {
      return m.reply('⚡ Ya eres admin.');
    }

    // Promueve al usuario a admin
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');

    // Reacciona con emoji (opcional)
    if (m.react) await m.react('✅');

    // Mensaje final
    m.reply('⚡ Ahora eres admin del grupo.');

  } catch (err) {
    console.error(err);
    m.reply('❌ Ocurrió un error al intentar darte admin.');
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin'];
handler.rowner = true;   // solo dueño puede usar
handler.group = true;    // solo en grupos
handler.botAdmin = true; // el bot debe ser admin

export default handler;
