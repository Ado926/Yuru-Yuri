import yts from 'yt-search'
import fetch from 'node-fetch'
import axios from 'axios'

const handler = async (m, { conn, text, command }) => {
  let user = global.db.data.users[m.sender]

  // if (user.chocolates < 2) {
  //   return conn.reply(m.chat, `🩵 Necesitas 2 Diamantes para poder usar este comando.`, m)
  // }

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `> Ingresa el nombre del video a descargar.`, m)
    }

    const search = await yts(text)
    const videoInfo = search.all?.[0]
    if (!videoInfo) return m.reply('❌ No se encontró ningún resultado.')

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo

    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'

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
          title: botname,
          body: dev,
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

    if (command === 'play' || command === 'mp3' || command === 'playaudio') {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
      const result = api.result?.download?.url
      if (!result) throw new Error('No se generó el audio.')

      await conn.sendMessage(m.chat, {
        audio: { url: result },
        fileName: `${api.result.title}.mp3`,
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m })
    } else if (command === 'play2' || command === 'mp4' || command === 'playvideo') {
      const res = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`)
      const json = await res.json()
      const videoURL = json.result?.download?.url
      const filename = json.result?.title || 'video.mp4'

      if (!videoURL) throw new Error('No se generó el video.')

      await conn.sendMessage(m.chat, {
        document: { url: videoURL },
        fileName: filename,
        mimetype: 'video/mp4',
        caption: `🎬 ${filename}`
      }, { quoted: m })
    } else {
      return conn.reply(m.chat, '⚠︎ Comando no reconocido.', m)
    }

    // user.chocolates -= 2;
    // conn.reply(m.chat, `🩵 Utilizaste 2 Diamantes`, m)

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