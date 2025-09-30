// plugins/menu.js
let menuHandler = async (m, { conn, usedPrefix, isAdmin, isOwner }) => {
    try {
        let text = `🌟 *Menú de Comandos Actuales - FelixCat_Bot* 🌟\n\n`;

        // Comandos para admins
        if (isAdmin) {
            text += `🛡️ *Comandos para administradores:*\n`;
            text += `- .tagall 🌟 (menciona a todos)\n`;
            text += `- .tagall2 🌟🌟🌟🌟 (menciona a todos 4 veces)\n`;
            text += `- .antilink 🔗 (activar/desactivar antilink)\n\n`;
        } else {
            text += `❌ *Solo los administradores pueden usar los comandos actuales*.\n\n`;
        }

        // Comandos exclusivos del dueño
        if (isOwner) {
            text += `👑 *Comandos exclusivos del dueño:*\n`;
            text += `- .autoadmin 🫡 
            text += `- (ninguno de los actuales)\n\n`;
        }

        // Enviar mensaje
        await conn.sendMessage(m.chat, { text, mentions: [m.sender] });

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al mostrar el menú.');
    }
};

// Definición del comando
menuHandler.command = ['menu'];
menuHandler.group = false; // se puede usar en privado o grupo
menuHandler.botAdmin = false;
menuHandler.admin = false; // cualquier usuario puede ver el menú
menuHandler.owner = false;
export default menuHandler;
