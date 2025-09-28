import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.botNumber = ''

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.owner = [
// <-- Número @s.whatsapp.net -->
  
  ['59898719147', 'feli', true],
  
// <-- Número @lid -->

  //['80754461647013', 'Propietario', true],
  ['119069730668723', 'feli', true ]
];  

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.mods = ['51919199620', '51934053286']
global.suittag = ['51919199620'] 
global.prems = ['51919199620', '51934053286']

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17' 
global.vs = '3.0.0'
global.nameqr = '⋆｡°✩🍂 Felix-cat ⚡✩°｡⋆'
global.namebot = '✿⋆｡° Felix-cat °｡⋆✿'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.shadowJadibts = true

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.packname = '⸙͎۪۫ ࣭࿐ ✿ ˚.🐾 𝐅𝐞𝐥𝐢𝐱𝐂𝐚𝐭 ⌗ 𝐁𝐨𝐭 ♡⚡ ࿐ ۪۫⸙͎'
global.botname = '⋆ ˚｡⋆୨୧˚ 𝑭𝒆𝒍𝒊𝒙𝑪𝒂𝒕 𝐁𝐨𝐭 🐱 ˚୨୧⋆｡˚ ⋆'
global.wm = '◈ 𝐅𝐞𝐥𝐢𝐱𝐂𝐚𝐭 𝐁𝐨𝐭 ◈'
global.author = '⩇⃟🔋 𝑴𝒂𝒅𝒆 𝒃𝒚 𝑭𝒆𝒍𝒊 ⚡'
global.dev = '✧ 𖦹 𝑭𝒆𝒍𝒊 ✧'
global.bot = '𝑭𝒆𝒍𝒊𝒙𝑪𝒂𝒕 𝑩𝒐𝒕'
global.club = '𓏲⍣⃝🌙꙰꙳ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑭𝒆𝒍𝒊𝒙𝑪𝒂𝒕 𝑪𝒍𝒖𝒃 ꙳⍣⃝ ☻⋆͙̈✫.🐾'
global.textbot = '𓏲⍣⃝🐱꙰꙳ 𝑭𝒆𝒍𝒊𝒙𝑪𝒂𝒕 𝑩𝒐𝒕 ✦ 𝔽𝔼𝕃𝕀•ℂ𝔸𝕋 ꙳⍣⃝☻⋆͙̈✫.⚡'
global.etiqueta = '@FelixCat'

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.moneda = 'Motoko Points'
global.welcom1 = '🌿 𝐄ძі𝗍ᥲ ᥱᥣ ᥕᥱᥣᥴ᥆mᥱ ᥴ᥆ᥒ #sᥱ𝗍ᥕᥱᥣᥴ᥆mᥱ'
global.welcom2 = '🌷 𝐄ძі𝗍ᥲ ᥱᥣ ᥕᥱᥣᥴ᥆mᥱ ᥴ᥆ᥒ #sᥱ𝗍ᑲᥡᥱ'
global.banner = 'https://files.catbox.moe/fft2hr.jpg'
global.avatar = 'https://files.catbox.moe/js2plu.jpg'
global.logo = 'https://files.catbox.moe/fft2hr.jpg'

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
