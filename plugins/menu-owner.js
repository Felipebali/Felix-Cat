// plugins/menu-owner.js
let menuOwnerHandler = async (m, { conn, isOwner }) => {
    try {
        if (!isOwner) {
            return m.reply('❌ Solo el dueño puede usar este menú.');
        }

        let text = `👑 *Menú Exclusivo del Dueño - FelixCat_Bot* 👑\n\n`;
        text += `- .autoadmin 🫡 (promoverte a admin)\n`;
        text += `- .banuser @usuario 🚫 (banear usuario)\n`;
        text += `- .unbanuser @usuario ✅ (desbanear usuario)\n`;
        text += `- .ln @usuario [motivo] ⚠️ (agregar a lista negra)\n\n`;
        text += `💡 Estos comandos solo pueden ser usados por el dueño del bot.`;

        await conn.sendMessage(m.chat, { text, mentions: [m.sender] });

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al mostrar el menú del dueño.');
    }
};

// Definición del comando
menuOwnerHandler.command = ['menuowner', 'ownermenu'];
menuOwnerHandler.group = false;   // se puede usar en privado o grupo
menuOwnerHandler.botAdmin = false;
menuOwnerHandler.admin = false;
menuOwnerHandler.owner = true;    // solo dueño puede usarlo
export default menuOwnerHandler;
