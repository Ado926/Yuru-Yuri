import Starlights from '@StarlightsTeam/Scraper'
import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🚫 Ingresa el título o enlace del video de YouTube.\nEjemplo: ${usedPrefix + command} Alan Walker`)

  try {
    await m.react('🕓')

    // Detecta si es enlace o texto para búsqueda
    let url = text.match(/^https?:\/\//) ? text : null

    if (!url) {
      // Buscar video con yt-search si es texto
      let res = await yts(text)
      if (!res.videos.length) throw new Error('No se encontró ningún video con ese título.')
      url = res.videos[0].url
    }

    // Descargar video mp4 con Starlights
    let data = await Starlights.ytmp4(url)

    if (!data.dl_url) throw new Error('No se pudo obtener el enlace de descarga del video.')

    // Enviar video al chat
    await conn.sendMessage(
      m.chat,
      {
        video: { url: data.dl_url },
        caption: `🎥 ${data.title}`,
        mimetype: 'video/mp4',
        fileName: `${data.title}.mp4`
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ Error al descargar el video:\n${e.message || e}`)
  }
}

handler.help = ['ytmp4 <título o enlace>']
handler.tags = ['descargas']
handler.command = ['ytmp4']

export default handler