// plugins/welcome.js
import { WAMessageStubType } from '@whiskeysockets/baileys'

/* ------------------------------
   COMANDO .WELCOME (toggle)
--------------------------------*/
let welcomeCommand = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  chat.welcome = !chat.welcome // alterna entre true/false
  m.reply(`✅ Bienvenida/Despedida *${chat.welcome ? 'Activada' : 'Desactivada'}* en este grupo`)
}

welcomeCommand.help = ['welcome']
welcomeCommand.tags = ['group']
welcomeCommand.command = /^welcome$/i
welcomeCommand.group = true
welcomeCommand.admin = true

/* ------------------------------
   HANDLER DE ENTRADA/SALIDA
--------------------------------*/
export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true
  let chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return true  // si está apagado, no hace nada

  // Obtener país por prefijo
  const getPais = (numero) => {
    const paises = {
      "1": "🇺🇸 Estados Unidos", "34": "🇪🇸 España", "52": "🇲🇽 México",
      "54": "🇦🇷 Argentina", "55": "🇧🇷 Brasil", "56": "🇨🇱 Chile",
      "57": "🇨🇴 Colombia", "58": "🇻🇪 Venezuela", "591": "🇧🇴 Bolivia",
      "593": "🇪🇨 Ecuador", "595": "🇵🇾 Paraguay", "598": "🇺🇾 Uruguay",
      "502": "🇬🇹 Guatemala", "503": "🇸🇻 El Salvador", "504": "🇭🇳 Honduras",
      "505": "🇳🇮 Nicaragua", "506": "🇨🇷 Costa Rica", "507": "🇵🇦 Panamá",
      "51": "🇵🇪 Perú", "53": "🇨🇺 Cuba", "91": "🇮🇳 India"
    }
    for (let i = 1; i <= 3; i++) {
      const prefijo = numero.slice(0, i)
      if (paises[prefijo]) return paises[prefijo]
    }
    return "🌎 Desconocido"
  }

  const usuarioJid = m.messageStubParameters[0] || m.key.participant
  const numeroUsuario = usuarioJid.split('@')[0]
  const pais = getPais(numeroUsuario)

  const fechaObj = new Date()
  const hora = fechaObj.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })
  const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })

  const groupSize = participants.length + ((m.messageStubType === 27) ? 1 : ((m.messageStubType === 28 || m.messageStubType === 32) ? -1 : 0))

  const welcomeMessage = `🍓 *BIENVENIDO/A* 🍁
┏━━━━━━━━━━━━━┓
✿ Grupo: *${groupMetadata.subject}*
✿ Usuario: @${numeroUsuario}
✿ País: ${pais}
✿ Miembros: ${groupSize}
✿ Fecha: ${dia}, ${fecha}
✿ Hora: ${hora}
┗━━━━━━━━━━━━━┛

> ✨ Usa *.menu* para ver los comandos.`

  const byeMessage = `💔 *DESPEDIDA* 💔
┏━━━━━━━━━━━━━┓
✿ Grupo: *${groupMetadata.subject}*
✿ Usuario: @${numeroUsuario}
✿ Miembros restantes: ${groupSize}
✿ Fecha: ${dia}, ${fecha}
✿ Hora: ${hora}
┗━━━━━━━━━━━━━┛

> Esperamos verte de vuelta pronto.`

  // ENTRADA
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    await conn.sendMessage(m.chat, { text: welcomeMessage, mentions: [usuarioJid] })
  }

  // SALIDA
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    await conn.sendMessage(m.chat, { text: byeMessage, mentions: [usuarioJid] })
  }

  return true
}

export default welcomeCommand 
