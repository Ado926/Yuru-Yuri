import { ytmp3scraper } from '../lib/xdtest.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🚫 *Ingresa un enlace de YouTube válido!*\n\n📌 Uso: ${usedPrefix + command} <enlace>`)

  m.react('🎧')
  try {
    const res = await ytmp3scraper(text)
    if (!res.status) throw res.error || 'No se pudo obtener resultados.'

    const caption = `📽️ *${res.title}*\n\n🔊 MP3: ${res.mp3 ? 'Disponible' : 'No disponible'}\n🎥 MP4: ${res.mp4 ? 'Disponible' : 'No disponible'}`
    await m.reply(caption)

    if (res.mp3) {
      await conn.sendMessage(m.chat, {
        audio: { url: res.mp3 },
        mimetype: 'audio/mpeg',
        fileName: `${res.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: res.title,
            body: "🎧 Audio YouTube",
            thumbnailUrl: 'https://i.imgur.com/8fK4h6F.jpg',
            mediaType: 2,
            mediaUrl: text,
            sourceUrl: text
          }
        }
      }, { quoted: m })
    }

    if (res.mp4) {
      await conn.sendMessage(m.chat, {
        video: { url: res.mp4 },
        caption: `🎥 *${res.title}*`,
        contextInfo: {
          externalAdReply: {
            title: res.title,
            body: "🎬 Video YouTube",
            thumbnailUrl: 'https://i.imgur.com/GfTuI6X.jpg',
            mediaType: 1,
            mediaUrl: text,
            sourceUrl: text
          }
        }
      }, { quoted: m })
    }

  } catch (err) {
    console.error(err)
    m.reply(`❌ *Error al procesar el enlace:*\n${err.message || err}`)
  }
}

handler.command = /^ytx$/i
handler.help = ['ytx <enlace>']
handler.tags = ['descargas']

export default handler