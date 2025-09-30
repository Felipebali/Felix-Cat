import { saveBlacklist } from './lib/blacklist.js'; // Ajusta según tu estructura
import { isBlacklisted } from './lib/blacklist.js';
import fs from 'fs';

// Función para quitar usuario de la lista negra
function removeFromBlacklist(userId) {
    let index = blacklist.findIndex(u => u.id === userId);
    if (index !== -1) {
        blacklist.splice(index, 1);
        saveBlacklist();
        return true;
    }
    return false;
}

// Ejemplo de integración con handleCommand
async function handleCommand(m, command, text) {
    const owners = ['+59896026646','+59898719147']; // dueños

    // Comando .ln
    if (command === 'ln') {
        if (!owners.includes(m.sender)) return m.reply('⚠️ Solo el dueño puede usar este comando.');
        if (!text) return m.reply('⚠️ Uso: .ln @usuario motivo');

        let userId = text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let reason = text.split(' ').slice(1).join(' ') || 'Sin motivo';

        let added = addToBlacklist(userId, reason);
        if (added) m.reply(`✅ Usuario agregado a la lista negra.\nMotivo: ${reason}`);
        else m.reply('⚠️ Este usuario ya estaba en la lista negra.');
    }

    // Comando .unln
    if (command === 'unln') {
        if (!owners.includes(m.sender)) return m.reply('⚠️ Solo el dueño puede usar este comando.');
        if (!text) return m.reply('⚠️ Uso: .unln @usuario');

        let userId = text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let removed = removeFromBlacklist(userId);

        if (removed) m.reply(`✅ Usuario eliminado de la lista negra.`);
        else m.reply('⚠️ Este usuario no estaba en la lista negra.');
    }
}
