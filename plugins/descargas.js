import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre o enlace de la música.`, m);
    }

    let videoIdMatch = text.match(youtubeRegexID);
    let search = await yts(videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text);

    let video = videoIdMatch
      ? search.all.find(item => item.videoId === videoIdMatch[1]) || search.videos.find(item => item.videoId === videoIdMatch[1])
      : search.videos?.[0];

    if (!video) return m.reply("✧ No se encontraron resultados para tu búsqueda.");

    let { title, thumbnail, timestamp, views, ago, url, author } = video;
    title = title || "Sin título";
    thumbnail = thumbnail || "https://telegra.ph/file/27cbe1b4f2f7ed3c1cc0a.jpg";
    const canal = author?.name || "Desconocido";
    const vistas = formatViews(views);

    const infoMessage = `*「✦」<${title}>*\n\n`
      + `> ✦ *Canal* » ${canal}\n`
      + `> ✰ *Vistas* » ${vistas}\n`
      + `> ⴵ *Duración* » ${timestamp || "?"}\n`
      + `> ✐ *Publicación* » ${ago || "?"}\n`
      + `> 🜸 *Link* » ${url}`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage
    }, { quoted: m });

    // AUDIO
    if (["play", "mp3", "ytmp3", "playaudio"].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
        const result = api.result?.download?.url;

        if (!result) throw new Error("⚠ El enlace de audio no se generó correctamente.");
        await conn.sendMessage(m.chat, {
          audio: { url: result },
          fileName: `${api.result.title}.mp3`,
          mimetype: "audio/mpeg"
        }, { quoted: m });
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Intenta nuevamente más tarde.', m);
      }
    }

    // VIDEO
    else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`);
        const json = await res.json();

        const videoURL = json.data?.download?.url;
        const videoTitle = json.data?.title || title;

        if (!videoURL) throw new Error("⚠ No se obtuvo un enlace válido del video.");

        await conn.sendMessage(m.chat, {
          video: { url: videoURL },
          caption: `🎬 *${videoTitle}*`,
          mimetype: 'video/mp4'
        }, { quoted: m });
      } catch (e) {
        console.error('[ERROR MP4]', e);
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Intenta nuevamente más tarde.', m);
      }
    } else {
      return conn.reply(m.chat, "✧︎ Comando no reconocido.", m);
    }

  } catch (error) {
    console.error('[ERROR GENERAL]', error);
    return m.reply(`⚠︎ Ocurrió un error:\n${error.message || error}`);
  }
};

handler.command = handler.help = ['play', 'mp3', 'ytmp3', 'playaudio', 'play2', 'ytv', 'ytmp4', 'mp4'];
handler.tags = ['descargas'];
handler.group = false;

export default handler;

// Función para dar formato bonito a las vistas
function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}
