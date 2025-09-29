let handler = async (m, { conn, groupMetadata }) => {
  if (!m.isGroup) return m.reply('🚫 Este comando solo funciona en *grupos*.')  

  const participantes = groupMetadata?.participants || []
  const mencionados = participantes.map(p => p.id).filter(Boolean)

  const totalAdmins = participantes.filter(p => p.admin).length
  const totalMiembros = participantes.length - totalAdmins

  let lista = participantes.map((p, i) => {
    const jid = p.id || 'N/A'
    const username = '@' + jid.split('@')[0]
    const rol = p.admin === 'superadmin' ? '👑 Fundador'
              : p.admin === 'admin' ? '🛡️ Admin'
              : '👤 Miembro'

    return `${i + 1}. ${username} | ${rol}`
  }).join('\n')

  let texto = `┏━━━〔 👥 *Lista del Grupo* 〕━━━┓
┃ 📌 *Nombre:* ${groupMetadata.subject}
┃ 🔢 *Total:* ${participantes.length}
┃ 👑 *Admins:* ${totalAdmins}
┃ 👤 *Miembros:* ${totalMiembros}
┗━━━━━━━━━━━━━━━━━━━━━━┛

${lista}`

  await conn.reply(m.chat, texto, m, { mentions: mencionados })
}

handler.command = /^lista|lids$/i
handler.group = true

export default handler
