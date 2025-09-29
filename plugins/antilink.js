const groupLinkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

// Handler del comando .antilink
let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply("⚠️ Este comando solo funciona en grupos.")

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  // Alternar entre activo e inactivo
  chat.antiLink = !chat.antiLink
  m.reply(
    `🔗 *AntiLink ${chat.antiLink ? 'Activado ✅' : 'Desactivado ❌'}*\n` +
    `\n📌 Protección actual: *Solo contra links de grupos de WhatsApp*`
  )
}

handler.command = /^antilink$/i
handler.group = true
handler.admin = true

export default handler


// Middleware antes de procesar mensajes
export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m || !m.text) return
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1
  if (!isBotAdmin) return

  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.antiLink) return !0

  let isGroupLink = m.text.match(groupLinkRegex)

  if (isGroupLink && !isAdmin) {
    try {
      const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
      if (m.text.includes(linkThisGroup)) return !0
    } catch (error) {
      console.error("[ERROR] No se pudo obtener el código del grupo:", error)
    }

    await conn.reply(
      m.chat,
      `🧪 Se ha eliminado a @${m.sender.split`@`[0]} por enviar enlaces de *otros grupos*.`,
      null,
      { mentions: [m.sender] }
    )
    
    try {
      await conn.sendMessage(m.chat, { delete: m.key })
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      console.log(`Usuario ${m.sender} eliminado del grupo ${m.chat}`)
    } catch (error) {
      console.error("No se pudo eliminar el mensaje o expulsar al usuario:", error)
    }
  }
  return !0
}
