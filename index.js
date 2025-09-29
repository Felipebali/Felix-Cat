// index.js
import readline from 'readline';
import fs from 'fs';
import { makeWASocket, example } from './lib/simple.js'; // solo makeWASocket
import { useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino'; // logger compatible
import pkg from 'google-libphonenumber'; // CommonJS
const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();

// Aseguramos que exista la carpeta de sesiones
if (!global.sessions) global.sessions = 'sessions';

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

// Si eligió código, pide el número
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
}

// Obtener versión de Baileys
const { version } = await fetchLatestBaileysVersion();

// Crear socket con logger compatible
const { state, saveCreds } = await useMultiFileAuthState(global.sessions);
global.conn = makeWASocket({
    logger: pino({ level: 'silent' }), // <-- aquí está la corrección
    printQRInTerminal: opcion === '1',
    browser: opcion === '1' ? Browsers.macOS('Desktop') : Browsers.macOS('Chrome'),
    auth: { creds: state.creds, keys: state.keys },
    version
});

// Guardar credenciales automáticamente
global.conn.ev.on('creds.update', saveCreds);

// Si se eligió código, generar código de vinculación
if (opcion === '2') {
    setTimeout(async () => {
        let code = await global.conn.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(`\n🔐 Código de vinculación: ${code}`);
    }, 3000);
}

// Mensaje de conexión
global.conn.ev.on('connection.update', (update) => {
    if (update.connection === 'open') console.log('✨ Felix-Cat Bot conectado correctamente ✨');
    if (update.qr && opcion === '1') console.log('❐ Escanea el QR, expira en 45 segundos');
});

// Solo un ejemplo de que simple.js funciona
console.log(example());
