// plugins/owner-banuser.js
const handler = async (m, { conn, text, isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply('❌ Solo el dueño puede usar este comando.');
        }

        if (!text) {
            return m.reply('⚠️ Uso correcto: .banuser @usuario');
        }

        // Extraemos los números mencionados
        let mentions = m.mentionedJid || [];
        if (mentions.length === 0) {
            return m.reply('⚠️ Debes mencionar al usuario que quieres banear.');
        }

        // Aquí puedes implementar tu lista de baneados
        // Por ejemplo: guardarla en un array en memoria o en archivo JSON
        mentions.forEach(user => {
            // Ejemplo: array global 'bannedUsers'
            if (!global.bannedUsers) global.bannedUsers = [];
            if (!global.bannedUsers.includes(user)) global.bannedUsers.push(user);
        });

        m.reply(`✅ Usuario(s) baneado(s) correctamente:\n${mentions.join('\n')}`);

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al ejecutar el banuser.');
    }
};

handler.tags = ['owner'];
handler.help = ['banuser @usuario'];
handler.command = ['banuser'];
handler.rowner = true;   // solo dueño
handler.group = false;
handler.botAdmin = false;
handler.admin = false;
export default handler;
