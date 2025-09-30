// plugins/unbanuser.js
const handler = async (m, { conn, text, isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply('❌ Solo el dueño puede usar este comando.');
        }

        if (!text) {
            return m.reply('⚠️ Uso correcto: .unbanuser @usuario');
        }

        // Extraemos los números mencionados
        let mentions = m.mentionedJid || [];
        if (mentions.length === 0) {
            return m.reply('⚠️ Debes mencionar al usuario que quieres desbanear.');
        }

        // Verificamos y removemos de la lista global de baneados
        if (!global.bannedUsers) global.bannedUsers = [];

        let removed = [];
        mentions.forEach(user => {
            let index = global.bannedUsers.indexOf(user);
            if (index !== -1) {
                global.bannedUsers.splice(index, 1);
                removed.push(user);
            }
        });

        if (removed.length === 0) {
            m.reply('⚠️ Ninguno de los usuarios mencionados estaba baneado.');
        } else {
            m.reply(`✅ Usuario(s) desbaneado(s) correctamente:\n${removed.join('\n')}`);
        }

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al ejecutar el unbanuser.');
    }
};

handler.tags = ['owner'];
handler.help = ['unbanuser @usuario'];
handler.command = ['unbanuser'];
handler.rowner = true;   // solo dueño
handler.group = false;
handler.botAdmin = false;
handler.admin = false;
export default handler;
