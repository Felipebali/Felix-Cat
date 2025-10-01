// index.js
import readline from 'readline';
import fs from 'fs';
import { makeWASocket } from './lib/simple.js';
import { useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import pkg from 'google-libphonenumber';
import { addToBlacklist, isBlacklisted, loadBlacklist } from './lib/blacklist.js'; // Lista negra

const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();

async function startBot() {
    // ---------------------------
    // Cargar lista negra y sesiones
    // ---------------------------
    loadBlacklist();
    if (!global.sessions) global.sessions = 'sessions';
    if (!fs.existsSync(global.sessions)) fs.mkdirSync(global.sessions);

    // ---------------------------
    // Configuración readline para menú
    // ---------------------------
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (text) => new Promise(resolve => rl.question(text, resolve));

    let opcion;
    if (!fs.existsSync(`./${global.sessions}/creds.json`)) {
        do {
            opcion = await question(`
╭─────────────────────────────◉
│ ⚙ MÉTODO DE CONEXIÓN BOT
│ Selecciona cómo quieres conectarte:
│ 1️⃣ Escanear Código QR
│ 2️⃣ Código de Emparejamiento
╰─────────────────────────────◉
Elige (1 o 2): `);

            if (!/^[1-2]$/.test(opcion)) {
                console.log('✖ Opción inválida. Solo 1 o 2.');
            }
        } while (!/^[1-2]$/.test(opcion));
    }

    // ---------------------------
    // Si eligió código, pide el número
    // ---------------------------
    let phoneNumber;
    if (opcion === '2') {
        do {
            phoneNumber = await question('Ingresa tu número con prefijo de país (+598...): ');
            phoneNumber = phoneNumber.replace(/\D/g, '');
            if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`;

            try {
                const parsed = phoneUtil.parseAndKeepRawInput(phoneNumber);
                if (!phoneUtil.isValidNumber(parsed)) {
                    console.log('✖ Número inválido, intenta de nuevo.');
                    phoneNumber = null;
                }
            } catch {
                console.log('✖ Número inválido, intenta de nuevo.');
                phoneNumber = null;
            }
        } while (!phoneNumber);
        rl.close();
    } else {
        rl.close();
    }

    // ---------------------------
    // Inicializar Baileys
    // ---------------------------
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(global.sessions);

    global.conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: opcion === '1',
        browser: opcion === '1' ? Browsers.macOS('Desktop') : Browsers.macOS('Chrome'),
        auth: { creds: state.creds, keys: state.keys },
        version
    });

    global.conn.ev.on('creds.update', saveCreds);

    // ---------------------------
    // Generar código de emparejamiento si corresponde
    // ---------------------------
    if (opcion === '2') {
        setTimeout(async () => {
            let code = await global.conn.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log(`\n🔐 Código de vinculación: ${code}`);
        }, 3000);
    }

    // ---------------------------
    // Mensajes de conexión
    // ---------------------------
    global.conn.ev.on('connection.update', (update) => {
        if (update.connection === 'open') console.log('✨ Felix-Cat Bot conectado correctamente ✨');
        if (update.qr && opcion === '1') console.log('❐ Escanea el QR, expira en 45 segundos');
    });

    // ---------------------------
    // Autokick de usuarios en lista negra
    // ---------------------------
    global.conn.ev.on('group-participants.update', async (update) => {
        const groupId = update.id;
        const participants = update.participants;

        for (let user of participants) {
            if (update.action === 'add' || update.action === 'invite') {
                if (isBlacklisted(user)) {
                    await global.conn.groupParticipantsUpdate(groupId, [user], 'remove');
                    global.conn.sendMessage(groupId, {
                        text: `⚠️ Usuario en lista negra eliminado: @${user.split('@')[0]}`
                    }, { mentions: [user] });
                }
            }

            if (update.action === 'remove') {
                if (isBlacklisted(user)) {
                    global.conn.sendMessage(groupId, {
                        text: `⚠️ Usuario en lista negra no puede expulsar miembros.`
                    });
                }
            }
        }
    });

    // ---------------------------
    // Comando .ln para agregar usuarios a la lista negra
    // ---------------------------
    async function handleCommand(m, command, text) {
        const owners = ['+59896026646','+59898719147'];

        if (command === 'ln') {
            if (!owners.includes(m.sender)) return m.reply('⚠️ Solo el dueño puede usar este comando.');
            if (!text) return m.reply('⚠️ Uso: .ln @usuario motivo');

            let userId = text.split(' ')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            let reason = text.split(' ').slice(1).join(' ') || 'Sin motivo';

            let added = addToBlacklist(userId, reason);
            if (added) m.reply(`✅ Usuario agregado a la lista negra.\nMotivo: ${reason}`);
            else m.reply('⚠️ Este usuario ya estaba en la lista negra.');
        }
    }

    // ---------------------------
    // Ejemplo simple para simple.js
    // ---------------------------
    import { example } from './lib/simple.js';
    console.log(example());
}

// Ejecutar
startBot().catch(err => console.error('❌ Error al iniciar el bot:', err));
