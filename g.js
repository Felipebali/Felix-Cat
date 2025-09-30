// plugins/g-toggle.js

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando')
  if (!isBotAdmin) return m.reply('❌ Necesito ser administrador para poder abrir/cerrar el grupo')

  // Obtener info del grupo
  const chat = await conn.groupMetadata(m.chat)
  const settings = chat.restrict || false  // estado actual: true=cerrado, false=abierto

  // Alternar estado
  const newRestrict = !settings

  await conn.groupSettingUpdate(m.chat, newRestrict ? 'announcement' : 'not_announcement')
  m.reply(`✅ El grupo ahora está *${newRestrict ? 'CERRADO (solo admins pueden enviar mensajes)' : 'ABIERTO (todos pueden enviar mensajes)'}*`)
}

handler.help = ['g']
handler.tags = ['group']
handler.command = /^g$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler 
