import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🚫 Ingresa un enlace o título de YouTube válido.\nEjemplo: ${usedPrefix + command} mp3 Alan Walker`)

  // Divide el texto en formato + búsqueda o enlace
  let formatos = ["mp3", "mp4", "mp3doc", "mp4doc"]
  let [formato, ...busqueda] = text.split(" ")

  if (!formatos.includes(formato)) {
    return m.reply(`Formato inválido. Usa: mp3, mp4, mp3doc, mp4doc.\nEjemplo: ${usedPrefix + command} mp3 Alan Walker`)
  }

  if (busqueda.length === 0) return m.reply(`Falta el título o enlace.\nEjemplo: ${usedPrefix + command} mp3 Alan Walker`)

  // Si es un enlace, lo usamos tal cual; si es texto, podemos buscar con yt-search si quieres
  let query = busqueda.join(" ")

  try {
    await m.react('🕓')

    // Usamos yt-search para buscar video si no es link directo
    let url = query.match(/^https?:\/\//) ? query : null
    if (!url) {
      // Importa yts solo si decides buscar texto a video
      const yts = (await import('yt-search')).default
      let res = await yts(query)
      if (!res.videos.length) throw new Error('No se encontró video para esa búsqueda.')
      url = res.videos[0].url
    }

    // Descargar con Starlights según formato
    let data = formato.includes('mp3') ? await Starlights.ytmp3(url) : await Starlights.ytmp4(url)

    let isDoc = formato.includes('doc')
    let mimetype = formato.includes('mp3') ? 'audio/mpeg' : 'video/mp4'
    let sendType = isDoc ? 'document' : (formato.includes('mp3') ? 'audio' : 'video')

    await conn.sendMessage(
      m.chat,
      {
        [sendType]: { url: data.dl_url },
        mimetype,
        fileName: `${data.title}.${formato.includes('mp3') ? 'mp3' : 'mp4'}`
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ Error al descargar:\n${e.message || e}`)
  }
}

handler.help = ['ytplay <formato> <título o enlace>']
handler.tags = ['descargas']
handler.command = ['ytstar']

export default handler