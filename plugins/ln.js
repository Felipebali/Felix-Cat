import { addToBlacklist } from './lib/blacklist.js'; // Ajusta la ruta según tu estructura

let lnCommand = {
    name: 'ln',
    description: 'Agrega un usuario a la lista negra',
    owner: true, // Solo los dueños pueden usarlo
    run: async (m, { conn, text }) => {
        if (!text) return m.reply('⚠️ Uso: .ln @usuario motivo');

        // Extraer número de WhatsApp del texto (mención)
        let userId = text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let reason = text.split(' ').slice(1).join(' ') || 'Sin motivo';

        // Agregar a la blacklist
        let added = addToBlacklist(userId, reason);
        if (added) {
            m.reply(`✅ Usuario agregado a la lista negra.\nMotivo: ${reason}`);
        } else {
            m.reply('⚠️ Este usuario ya estaba en la lista negra.');
        }
    }
};

export default lnCommand;
