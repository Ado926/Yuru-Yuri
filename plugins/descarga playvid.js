import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  // if (user.chocolates < 2) {
  //   return conn.reply(m.chat, `🩵 Necesitas 2 Diamantes para poder usar este comando.`, m);
  // }

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `> Ingresa el nombre del video a descripción.`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    if (!videoInfo) {
      return m.reply('No se pudo obtener información del video.');
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    if (!title || !thumbnail || !timestamp || !views || !ago || !url || !author) {
      return m.reply('Información incompleta del video.');
    }

    const vistas = formatViews(views);
    const canal = author.name ? author.name : 'Desconocido';

    const infoMessage = `「✦」Descargando *<${title || 'Desconocido'}>*\n\n` +
      `> ✧ Canal » *${canal}*\n` +
      `> ✰ Vistas » *${vistas || 'Desconocido'}*\n` +
      `> ⴵ Duración » *${timestamp || 'Desconocido'}*\n` +
      `> ✐ Publicado » *${ago || 'Desconocido'}*\n` +
      `> 🜸 Link » ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;


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
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (command === 'play' || command === 'mp3' || command === 'playaudio') {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
        const resulta = api.result;
        const result = resulta.download.url;

        if (!result) throw new Error('El enlace de audio no se generó correctamente.');

        await conn.sendMessage(m.chat, {
          audio: { url: result },
          fileName: `${api.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m });
      } catch (e) {
        console.error('Error al enviar el audio:', e.message);
        return conn.reply(m.chat, 'No pude enviar tu audio. Esto puede ser debido a problemas de ortografía o el audio es demasiado largo.', m);
      }
    } else if (command === 'play2' || command === 'mp4' || command === 'playvideo') {
      try {
        const response = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`);
        const json = await response.json();
        const resultad = json.result;
        const resultado = resultad.download.url;

        if (!resultad || !resultado) throw new Error('El enlace de video no se generó correctamente.');

        await conn.sendMessage(m.chat, {
          video: { url: resultado },
          fileName: resultad.title,
          mimetype: 'video/mp4',
          caption: dev
        }, { quoted: m });
      } catch (e) {
        console.error('Error al enviar el video:', e.message);
        return conn.reply(m.chat, '⚠︎ No pude enviar tu video. Esto puede ser debido a problemas de ortografía o el video es demasiado largo.', m);
      }
    } else {
      return conn.reply(m.chat, '⚠︎ Comando no reconocido.', m);
    }

    // user.chocolates -= 2;
    // conn.reply(m.chat, `🩵 Utilizaste 2 Diamantes`, m);

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`);
  }
};

handler.command = handler.help = ['playvideo', 'play2', 'mp4'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views === undefined) return "No disponible";

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  }
  return views.toString();
}