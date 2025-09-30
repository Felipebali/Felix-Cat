import { blacklist } from '../index.js'; // si tienes la lista negra global
export default {
    name: 'lnlist',
    description: 'Muestra la lista negra completa',
    owner: true, // solo dueños
    run: async (m, { conn }) => {
        if (!blacklist || blacklist.length === 0) return m.reply('⚠️ La lista negra está vacía.');

        let textList = '📋 Lista Negra:\n\n';
        blacklist.forEach((u, i) => {
            textList += `${i+1}. @${u.id.split('@')[0]} - ${u.reason}\n`;
        });

        await conn.sendMessage(m.chat, { text: textList, mentions: blacklist.map(u => u.id) });
    }
}
