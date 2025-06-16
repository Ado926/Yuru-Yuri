import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre o enlace del video de YouTube.`, m)
    }

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2 || ytplay2.length === 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2

    const infoMessage = `*「✦」<${title}>*\n\n` +
                        `> ✦ *Canal:* ${author.name || 'Desconocido'}\n` +
                        `> ✰ *Vistas:* ${formatViews(views)}\n` +
                        `> ⴵ *Duración:* ${timestamp}\n` +
                        `> ✐ *Publicado:* ${ago}\n` +
                        `> 🜸 *Link:* ${url}`

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMessage }, { quoted: m })

    if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`)
        const json = await res.json()

        if (!json.result || !json.result.url) throw new Error('No se obtuvo un enlace válido.')

        await conn.sendMessage(m.chat, {
          video: { url: json.result.url },
          caption: `🎬 ${json.result.title || title}`,
          mimetype: 'video/mp4'
        }, { quoted: m })

      } catch (err) {
        console.error(err)
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede ser por peso o error del enlace.', m)
      }
    } else if (['mp3', 'ytmp3', 'play', 'playaudio'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
        const json = await res.json()
        if (!json.result?.download?.url) throw new Error('No se obtuvo el enlace de audio.')
        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: `${json.result.title}.mp3`
        }, { quoted: m })
      } catch (err) {
        console.error(err)
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Puede ser por peso o error de enlace.', m)
      }
    }
  } catch (error) {
    console.error(error)
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`)
  }
}

handler.command = handler.help = ['mp3', 'ytmp3', 'playaudio', 'play2', 'ytv', 'ytmp4', 'mp4']
handler.tags = ['descargas']
handler.group = false

export default handler

function formatViews(views) {
  if (!views) return 'No disponible'
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
