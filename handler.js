import { smsg } from './lib/simple.js'
import { format } from 'util'
import * as ws from 'ws';
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import failureHandler from './lib/respuesta.js';
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return;

    if (global.db.data == null) await global.loadDatabase()       
    try {
        m = smsg(this, m) || m
        if (!m) return

        // --- Inicialización mínima de usuario ---
        let user = global.db.data.users[m.sender]
        if (!user || typeof user !== 'object') global.db.data.users[m.sender] = {}
        user = global.db.data.users[m.sender]
        if (!('name' in user)) user.name = m.name || ''
        if (!('banned' in user)) user.banned = false
        if (!('role' in user)) user.role = 'user'
        if (!('premium' in user)) user.premium = false

        // --- Inicialización mínima de chat ---
        let chat = global.db.data.chats[m.chat]
        if (!chat || typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        chat = global.db.data.chats[m.chat]
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('welcome' in chat)) chat.welcome = true
        if (!('autoresponder' in chat)) chat.autoresponder = false
        if (!('antiLink' in chat)) chat.antiLink = true

        // --- Inicialización mínima de settings ---
        let settings = global.db.data.settings[this.user.jid]
        if (!settings || typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
        settings = global.db.data.settings[this.user.jid]
        if (!('self' in settings)) settings.self = false
        if (!('restrict' in settings)) settings.restrict = true
        if (!('autoread' in settings)) settings.autoread = false

    } catch (e) {
        console.error(e)
    }

    // --- Permisos ---
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
    const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)

    if (m.isBaileys) return
    if (opts['nyimak']) return
    if (!isROwner && opts['self']) return
    if (opts['swonly'] && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string') m.text = ''

    // --- Control de cola de mensajes ---
    if (opts['queque'] && m.text && !(isMods || isPrems)) {
        let queque = this.msgqueque, time = 5000
        const previousID = queque[queque.length - 1]
        queque.push(m.id || m.key.id)
        setInterval(async function () {
            if (queque.indexOf(previousID) === -1) clearInterval(this)
            await new Promise(res => setTimeout(res, time))
        }, time)
    }

    // --- Plugins ---
    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin || plugin.disabled) continue
        const __filename = join(___dirname, name)

        if (typeof plugin.all === 'function') {
            try { await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename }) }
            catch (e) { console.error(e) }
        }

        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
        let match = (_prefix instanceof RegExp ?
            [[_prefix.exec(m.text), _prefix]] :
            Array.isArray(_prefix) ?
            _prefix.map(p => { let re = p instanceof RegExp ? p : new RegExp(str2Regex(p)); return [re.exec(m.text), re] }) :
            [[[], new RegExp]]
        ).find(p => p[1])

        if (typeof plugin.before === 'function') {
            if (await plugin.before.call(this, m, { match, conn: this })) continue
        }

        if (!match) continue
        m.plugin = name
        let [usedPrefix] = (match[0] || [''])[0]

        const extra = {
            match, usedPrefix, args: m.text.split(' ').slice(1), command: m.text.split(' ')[0].toLowerCase(),
            conn: this
        }

        try { await plugin.call(this, m, extra) }
        catch (e) {
            m.error = e
            console.error(e)
            m.reply(format(e))
        }
    }

    if (opts['queque'] && m.text) {
        const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
        if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
    }

    // --- Watch handler.js para recarga automática ---
    const file = global.__filename(import.meta.url, true)
    watchFile(file, async () => {
        unwatchFile(file)
        console.log(chalk.green('Actualizando "handler.js"'))
        if (global.conns && global.conns.length > 0) {
            const users = [...new Set([...global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
            for (const u of users) u.subreloadHandler(false)
        }
    })
}

global.dfail = (type, m, conn) => { failureHandler(type, conn, m); };
