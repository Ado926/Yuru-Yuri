import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'User-Agent': 'GoogleBot',
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}}
  
global.creador = 'Wa.me/393715279301'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.namechannel = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
global.namechannel2 = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
global.namegrupo = 'ᰔᩚ ᥡᥙkі sᥙ᥆ᥙ • ᥆𝖿іᥴіᥲᥣ ❀'
global.namecomu = 'ᰔᩚ ᥡᥙkіᑲ᥆𝗍-mძ • ᥴ᥆mᥙᥒі𝗍ᥡ ❀'
global.listo = '✦ *Aquí tienes ฅ^•ﻌ•^ฅ*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

global.canalIdM = [
  "120363402846939411@newsletter",
  "120363420047428304@newsletter"
]
global.canalNombreM = [
  "✦ sʏᴀ ᴛᴇᴀᴍ | 2025 ✧",
  "✧❅ꨄ ʏᴜʀᴜ ʏᴜʀɪ ┋ᴄʜᴀɴɴᴇʟ ☙❢❀"
]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'

global.emoji = '❀'
global.emoji2 = '✧'
global.emoji3 = '✦'
global.emoji4 = '❍'
global.emoji5 = '✰'
global.emojis = [emoji, emoji2, emoji3, emoji4].getRandom()

global.wait = '❍ Espera un momento, soy lenta...';
global.waitt = '❍ Espera un momento, soy lenta...';
global.waittt = '❍ Espera un momento, soy lenta...';
global.waitttt = '❍ Espera un momento, soy lenta...';

var canal = 'https://whatsapp.com/channel/0029VbAfPu9BqbrEMFWXKE0d'  
var comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
var git = 'https://github.com/The-King-Destroy'
var github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot' 
let correo = 'thekingdestroy507@gmail.com'
global.redes = [canal, comunidad, git, github, correo].getRandom()

let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 1: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 3: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 4: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 5: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break; case 8: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 11: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 12: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 14: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 15: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 16: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 18: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 19: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 20: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 21: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 22: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;}
global.saludo = hour;

global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

global.packsticker = `✧ 𝖸𝗎𝗋𝗎 𝖸𝗎𝗋𝗂 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 ✧`
;global.packsticker2 = `⛓️‍💥 ᴍᴀᴅᴇ ʙʏ ${botname}\n💜 ᴜsᴜᴀʀɪᴏ: ${nombre} 🍁 𝙾𝚆𝙽𝙴𝚁: Wirk`
  
global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${nombre}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}

global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }
}}, { quoted: m }

global.icono = [
'https://qu.ax/dychF.jpg',
].getRandom()

global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: 100, newsletterName: channelRD.name, }, externalAdReply: { showAdAttribution: true, title: packname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: icono, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false }, }, }}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
  }

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}
