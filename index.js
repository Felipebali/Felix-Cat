import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import cron from 'node-cron'
import readline from 'readline'
import { Boom } from '@hapi/boom'

// ⚙️ CONFIGURACIÓN PRINCIPAL
const OWNER = ['59896026646', '59898719147']
const BOT_NAME = 'FelixCat_Bot'
const SESSION_FOLDER = './session'
const TEMP_FOLDER = './temp'
const BACKUP_FOLDER = './backup'

// 📥 FUNCIÓN PARA INPUT EN CONSOLA
function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => {
    rl.close()
    resolve(ans.trim())
  }))
}

// 📂 CREAR CARPETAS NECESARIAS
for (const dir of [SESSION_FOLDER, TEMP_FOLDER, BACKUP_FOLDER]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// 🚀 FUNCIÓN PRINCIPAL DEL BOT
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER)
  const { version } = await fetchLatestBaileysVersion()

  console.log(`\n╭─────────────────────────────◉
│ 🐾 MÉTODO DE CONEXIÓN - FelixCat_Bot
│ 1️⃣ Escanear Código QR
│ 2️⃣ Código de Emparejamiento
╰─────────────────────────────◉`)
  
  const choice = await ask('Elige (1 o 2): ')
  let pairingCode = null

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: choice === '1',
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: undefined,
  })

  if (choice === '2') {
    const number = await ask('📱 Ingresa tu número con código de país (sin +): ')
    pairingCode = await sock.requestPairingCode(number)
    console.log(`\n🔗 Tu código de emparejamiento es: ${pairingCode}`)
  }

  // 📡 EVENTOS DE CONEXIÓN
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'open') {
      console.log(`✅ ${BOT_NAME} conectado correctamente.`)
    } else if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
      if (reason === DisconnectReason.loggedOut) {
        console.log('🔴 Sesión cerrada. Eliminando y reiniciando...')
        fs.rmSync(SESSION_FOLDER, { recursive: true, force: true })
        startBot()
      } else {
        console.log('⚠️ Desconectado, intentando reconectar...')
        startBot()
      }
    }
  })

  // 💬 RECEPCIÓN DE MENSAJES
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const from = msg.key.remoteJid
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

    // 🔹 COMANDO .ping
    if (text.startsWith('.ping')) {
      await sock.sendMessage(from, { text: '🏓 ¡FelixCat_Bot está activo!' })
    }

    // 🔹 COMANDO .menu
    if (text.startsWith('.menu')) {
      const menu = `
🐾 *${BOT_NAME}* 🐾

📋 *Menú principal:*
• .menu - Muestra este menú
• .ping - Ver si el bot responde
• .owner - Ver los dueños
• .help - Mostrar ayuda

💡 Más comandos próximamente...
`
      await sock.sendMessage(from, { text: menu })
    }

    // 🔹 COMANDO .owner
    if (text.startsWith('.owner')) {
      await sock.sendMessage(from, { text: `👑 Dueños oficiales:\n${OWNER.map(o => `wa.me/${o}`).join('\n')}` })
    }

    // 🔹 COMANDO .help
    if (text.startsWith('.help')) {
      await sock.sendMessage(from, { text: '🐾 Usa *.menu* para ver todos los comandos disponibles.' })
    }
  })

  sock.ev.on('creds.update', saveCreds)
}

// 🧹 LIMPIEZA AUTOMÁTICA DE ARCHIVOS CADA 3 HORAS
function purgeOldFiles() {
  const now = Date.now()
  const limit = 3 * 60 * 60 * 1000 // 3 horas
  for (const folder of [TEMP_FOLDER, BACKUP_FOLDER]) {
    fs.readdirSync(folder).forEach(file => {
      const filePath = path.join(folder, file)
      fs.stat(filePath, (err, stats) => {
        if (!err && now - stats.mtimeMs > limit) {
          fs.unlinkSync(filePath)
          console.log(`🧹 Archivo eliminado: ${file}`)
        }
      })
    })
  }
}
cron.schedule('0 */3 * * *', purgeOldFiles)

startBot()
