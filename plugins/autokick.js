// plugins/autokick.js
import { isBlacklisted } from '../lib/blacklist.js'; // ruta según tu estructura

/**
 * Inicializa el autokick.
 * Si global.conn ya existe, lo registra automáticamente.
 * Si no, exporta init(conn) para llamarlo desde index.js después de crear el socket.
 */

const registerListener = (conn) => {
  // Evitar registrar múltiples veces
  if (conn._autokick_registered) return;
  conn._autokick_registered = true;

  conn.ev.on('group-participants.update', async (update) => {
    try {
      const groupId = update.id;
      const participants = update.participants || [];
      const action = update.action;

      // Solo nos interesa cuando alguien entra (add) o se completa invitación (invite)
      if (action !== 'add' && action !== 'invite') return;

      for (const user of participants) {
        // Ignorar si es el propio bot (por si acaso)
        if (!user) continue;
        if (user === (conn.user?.id ?? conn.user?.jid ?? '')) continue;

        // Revisa la lista negra (espera jid completo: '12345@s.whatsapp.net')
        if (isBlacklisted(user)) {
          try {
            // intentar eliminar
            await conn.groupParticipantsUpdate(groupId, [user], 'remove');

            // Aviso al grupo (mencionar al expulsado)
            await conn.sendMessage(groupId, {
              text: `⚠️ Usuario en lista negra eliminado: @${user.split('@')[0]}`,
            }, { mentions: [user] });

          } catch (err) {
            // Si falla, probablemente el bot no es admin — avisar a admins del grupo
            const errMsg = String(err?.message || err);
            console.error('Autokick error:', errMsg);

            // Intentamos notificar a los admins del grupo para que promuevan al bot
            try {
              // Obtener metadata para listar admins
              const metadata = await conn.groupMetadata(groupId);
              const admins = (metadata.participants || [])
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => p.id);

              // Mensaje explicativo
              const helpText = [
                '⚠️ No pude expulsar a un usuario en lista negra — el bot necesita ser administrador.',
                `Usuario: @${user.split('@')[0]}`,
                'Por favor promuevan al bot a administrador para que pueda expulsar miembros automáticamente.'
              ].join('\n');

              await conn.sendMessage(groupId, { text: helpText }, { mentions: admins });

            } catch (e2) {
              console.error('Error notificando admins:', e2);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error en listener autokick:', e);
    }
  });
};

// Si global.conn ya existe, registrar automático
if (global.conn) registerListener(global.conn);

// Exportar init por si querés llamarlo manualmente desde index.js
export default { init: registerListener };
