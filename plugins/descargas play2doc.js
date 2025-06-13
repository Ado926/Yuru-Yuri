import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '🎧 Ingresa el nombre o link del video.', m)
    }

    let url = ''
    let videoInfo = null

    if (/^https?:\/\//.test(text)) {
      url = text.trim()
      const info = await yts({ videoId: extractVideoId(url) })
      videoInfo = info?.all?.[0]
    } else {
      const search = await yts(text)
      videoInfo = search.all?.[0]
      url = videoInfo?.url
    }

    if (!videoInfo || !url) return m.reply('❌ No se encontró el video.')

    const { title, thumbnail, timestamp, views, ago, author } = videoInfo
    const canal = author?.name || 'Desconocido'
    const vistas = formatViews(views)

    const infoMessage = `「✦」Descargando *<${title}>*\n\n` +
      `> ✧ Canal » *${canal}*\n` +
      `> ✰ Vistas » *${vistas}*\n` +
      `> ⴵ Duración » *${timestamp}*\n` +
      `> ✐ Publicado » *${ago}*\n` +
      `> 🜸 Link » ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: canal,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    if (['play', 'mp3', 'playaudio'].includes(command)) {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
      const audioURL = api.result?.download?.url
      if (!audioURL) throw new Error('No se generó el audio.')

      await conn.sendMessage(m.chat, {
        audio: { url: audioURL },
        fileName: `${api.result.title}.mp3`,
        mimetype: 'audio/mpeg'
      }, { quoted: m })
    }

    if (['play2', 'mp4', 'playvidoc'].includes(command)) {
      const res = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`)
      const json = await res.json()
      const videoURL = json.result?.download?.url
      const videoTitle = json.result?.title?.replace(/[\\/:*?"<>|]/g, '') || 'video'

      if (!videoURL) throw new Error('No se generó el video.')

      await conn.sendMessage(m.chat, {
        document: { url: videoURL },
        fileName: `${videoTitle}.mp4`,
        mimetype: 'video/mp4',
        caption: `🎬 ${videoTitle}`
      }, { quoted: m })
    }

  } catch (error) {
    console.error(error)
    return m.reply(`❌ Error: ${error.message}`)
  }
}

handler.command = handler.help = ['playvidoc']
handler.tags = ['downloader']
export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}

function extractVideoId(url) {
  const reg = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(reg)
  return match ? match[1] : null
}