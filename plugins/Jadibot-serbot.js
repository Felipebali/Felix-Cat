// plugins/jadibot-serbot.js
// Archivo base para Jadibot-Serbot
// Evita errores al iniciar el bot
// Aquí puedes agregar las funciones de tu "jadibot" más adelante

export async function jadibotHandler(sock, message) {
    // Este es un handler de ejemplo
    console.log('Jadibot recibió un mensaje:', message.key?.remoteJid || '');
    // Puedes agregar respuestas o comandos aquí
    return;
}
