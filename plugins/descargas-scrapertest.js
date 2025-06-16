import { ytmp3scraper } from '../lib/xdtest.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🚫 Ingresa un enlace de YouTube.\n📌 Ejemplo: ${usedPrefix + command} https://youtu.be/abcd1234`)
  }

  m.react('⏳')

  try {
    const res = await ytmp3scraper(text)
    if (!res.status) throw new Error(res.error || 'No se pudo obtener el video.')

    let caption = `🎬 *${res.title}*\n\n🎧 MP3: ${res.mp3 ? '✅' : '❌'}\n📹 MP4: ${res.mp4 ? '✅' : '❌'}`
    await m.reply(caption)

    if (res.mp3) {
      await conn.sendMessage(m.chat, {
        audio: { url: res.mp3 },
        mimetype: 'audio/mpeg',
        fileName: `${res.title}.mp3`
      }, { quoted: m })
    }

    if (res.mp4) {
      await conn.sendMessage(m.chat, {
        video: { url: res.mp4 },
        caption: res.title
      }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.command = ['ytx']
handler.help = ['ytx <enlace>']
handler.tags = ['descargas']
export default handler