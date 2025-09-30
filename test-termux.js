// test-termux.js
import readline from 'readline'

// Simulación de base de datos
global.db = {
  data: {
    chats: {
      '12345': { welcome: true, antiLink: false }
    },
    users: {
      '59898719147@s.whatsapp.net': { role: 'owner' },
      '59898301727@s.whatsapp.net': { role: 'bot' }
    }
  }
}

// Simulación de objeto conn
const conn = {
  sendMessage: async (chatId, msg) => {
    console.log(`\n[Mensaje a ${chatId}]:\n`, msg)
  }
}

// Handler de ejemplo: toggle welcome
let toggleWelcome = async (chatId) => {
  const chat = global.db.data.chats[chatId]
  chat.welcome = !chat.welcome
  await conn.sendMessage(chatId, { text: `🌸 Welcome ${chat.welcome ? 'Activado' : 'Desactivado'}` })
}

// Test interactivo en Termux
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

console.log('🟢 Test Termux - Comando .welcome (toggle)')
rl.question('Escribe el ID del chat para probar: ', async (chatId) => {
  await toggleWelcome(chatId)
  rl.close()
}) 
