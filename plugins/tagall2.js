// Comando .tagall2: menciona a todos 4 veces
let tagall2Handler = async (m, { conn, usedPrefix, isAdmin }) => {
    try {
        // Verifica si el mensaje es en un grupo
        if (!m.isGroup) return m.reply('❌ Este comando solo puede usarse en grupos.');

        // Verifica si quien lo usa es admin
        if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.');

        // Obtiene todos los participantes del grupo
        let groupMetadata = await conn.groupMetadata(m.chat);
        let participants = groupMetadata.participants.map(u => u.id);

        // Construye el mensaje 4 veces
        let text = '';
        for (let i = 0; i < 4; i++) {
            text += `🌟 Atención a todos los miembros del grupo:\n`;
        }

        // Envía el mensaje etiquetando a todos
        await conn.sendMessage(m.chat, { text, mentions: participants });

    } catch (err) {
        console.error(err);
        m.reply('❌ Ocurrió un error al intentar etiquetar a todos.');
    }
};

// Definición del comando
tagall2Handler.command = ['tagall2'];
tagall2Handler.group = true; // solo para grupos
tagall2Handler.botAdmin = true; // el bot debe ser admin
tagall2Handler.admin = true; // solo admins pueden usarlo
tagall2Handler.owner = false; 
export default tagall2Handler;
