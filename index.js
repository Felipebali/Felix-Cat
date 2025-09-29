process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './settings.js'
import { watchFile, unwatchFile, readdirSync, existsSync, mkdirSync } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { format } from 'util'
import { join, dirname } from 'path'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import store from './lib/store.js'
import NodeCache from 'node-cache'
import yargs from 'yargs'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers, DisconnectReason } from '@whiskeysockets/baileys'
import readline from 'readline'

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
    return dirname(global.__filename(pathURL, true))
};
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.prefix = new RegExp('^[!.]')

global.db = new Low(new JSONFile('database.json'))
global.loadDatabase = async function loadDatabase() {
    if (global.db.data !== null) return
    await global.db.read().catch(console.error)
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = global.db.data
}
await global.loadDatabase()

protoType()
serialize()

const { state, saveCreds } = await useMultiFileAuthState('sessions')
const { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
    logger: { level: 'silent' },
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys)
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    version
})
global.conn = conn

conn.ev.on('creds.update', saveCreds)
conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode
        if (reason !== DisconnectReason.loggedOut) {
            global.reloadHandler && global.reloadHandler(true)
        } else {
            console.log(chalk.redBright(`⚠︎ Sesión cerrada, inicia sesión nuevamente.`))
        }
    } else if (connection === 'open') {
        console.log(chalk.greenBright(`[✔] Conectado como: ${conn.user.name || conn.user.id}`))
    }
})

// Carga de plugins
const pluginFolder = join(global.__dirname(), './plugins/index')
global.plugins = {}

async function filesInit() {
    for (const filename of readdirSync(pluginFolder).filter(f => f.endsWith('.js'))) {
        try {
            const file = global.__filename(join(pluginFolder, filename))
            const module = await import(file)
            global.plugins[filename] = module.default || module
        } catch (e) {
            console.error(e)
            delete global.plugins[filename]
        }
    }
}
await filesInit()

// Recarga automática de plugins
import { watch } from 'fs'
const pluginFilter = filename => /\.js$/.test(filename)
global.reload = async (_ev, filename) => {
    if (!pluginFilter(filename)) return
    const dir = global.__filename(join(pluginFolder, filename), true)
    try {
        const module = await import(`${dir}?update=${Date.now()}`)
        global.plugins[filename] = module.default || module
    } catch (e) {
        console.error(`Error cargando plugin ${filename}`, e)
    }
}
watch(pluginFolder, global.reload)

// Carga del handler
let handler = await import('./handler.js')
global.reloadHandler = async (restartConn) => {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`)
        if (Handler) handler = Handler
    } catch (e) { console.error(e) }

    if (restartConn && global.conn) {
        global.conn.ev.removeAllListeners()
        global.conn = makeWASocket({ ...conn, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys) } })
    }

    global.conn.handler = handler.handler.bind(global.conn)
    global.conn.ev.on('messages.upsert', global.conn.handler)
    global.conn.ev.on('connection.update', connectionUpdate)
    global.conn.ev.on('creds.update', saveCreds)
}

async function connectionUpdate(update) {
    const { connection } = update
    if (connection === 'open') console.log(chalk.greenBright('[✔] Bot conectado correctamente'))
}

await global.reloadHandler()

console.log(chalk.cyanBright('⚡ Félix Cat Bot iniciado sin Jadibot'))
