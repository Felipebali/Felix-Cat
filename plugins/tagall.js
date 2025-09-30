// Comando .tagall solo para admins
let tagallHandler = async (m, { conn, usedPrefix, isAdmin }) => {
    try {
        // Verifica si el mensaje es en un grupo
        if (!m.isGroup) {
            return m.reply('❌ Este comando solo puede usarse en grupos.');
        }

        // Verifica si quien lo usa es admin
        if (!isAdmin) {
            return m.reply('❌ Solo los administradores pueden usar este comando.');
        }

        // Obtiene todos los participantes del grupo
        let groupMetadata = await conn.groupMetadata(m.chat);
        let participants = groupMetadata.participants.map(u => u.id);

        // Construye el mensaje con mención
        let text = `🌟 Atención a todos los miembros del grupo:\n\n`;
        let mentions = participants;

        // Envía el mensaje etiquetando a todos
        await conn.sendMessage(m.chat, { text, mentions });

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al intentar etiquetar a todos.');
    }
};

// Definición del comando
tagallHandler.command = ['tagall'];
tagallHandler.group = true; // solo para grupos
tagallHandler.botAdmin = true; // el bot debe ser admin para mencionar
tagallHandler.admin = true; // solo admins pueden usarlo
tagallHandler.owner = false; // no requiere que sea dueño
export default tagallHandler;
