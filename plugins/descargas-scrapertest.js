import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🚫 Ingresa un enlace de YouTube válido\nEjemplo: ${usedPrefix + command} https://youtu.be/abc123`)

  m.react('⏳')

  try {
    const info = await Starlights.youtubeV2(text) // Usamos youtubeV2 para mejor soporte

    if (!info || (!info.audio || !info.video)) throw new Error('No se pudo obtener info de audio o video')

    const { title } = info
    const audioUrl = info.audio[0]?.url || null
    const videoUrl = info.video[0]?.url || null

    let caption = `🎬 *${title}*\n\n🎧 Audio: ${audioUrl ? '✅' : '❌'}\n📹 Video: ${videoUrl ? '✅' : '❌'}`
    await m.reply(caption)

    if (audioUrl) {
      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m })
    }

    if (videoUrl) {
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: title
      }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error al obtener el video:\n${e.message || e}`)
  }
}

handler.command = ['ytstar']
handler.help = ['ytstar <url>']
handler.tags = ['descargas']
export default handler