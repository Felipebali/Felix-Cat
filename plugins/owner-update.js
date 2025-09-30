// plugins/update.js
import { exec } from 'child_process'

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '🚫 Solo el *owner* puede usar este comando'

  await m.reply('⏳ Actualizando el bot...')

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `❌ Error: No se pudo realizar la actualización.\n\n⚠️ Razón: ${err.message}`, m)
      return
    }

    if (stderr) console.warn('Advertencia durante la actualización:', stderr)

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, '✅ El bot ya está actualizado.', m)
    } else {
      conn.reply(m.chat, `✨ Actualización realizada con éxito:\n\n${stdout}`, m)
    }
  })
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = /^(update|fix|actualizar)$/i
handler.rowner = true // 🔒 Solo owner real

export default handler 
