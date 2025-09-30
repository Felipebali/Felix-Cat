// test-menu.js
import menuHandler from './plugins/menu.js';

// Simulamos un mensaje de grupo
let m = {
    chat: '12345-67890@g.us',  // ID de grupo ficticio
    sender: '59898719147@s.whatsapp.net', // tu número de prueba
    isGroup: true
};

// Simulamos que el usuario es admin y no es dueño
let testContext = {
    conn: {
        sendMessage: async (chat, { text, mentions }) => {
            console.log('--- MENSAJE ENVIADO ---');
            console.log('Chat:', chat);
            console.log('Texto:', text);
            console.log('Menciones:', mentions);
            console.log('----------------------\n');
        }
    },
    usedPrefix: '.',
    isAdmin: true,
    isOwner: false
};

// Ejecutamos el comando
menuHandler(m, testContext);
