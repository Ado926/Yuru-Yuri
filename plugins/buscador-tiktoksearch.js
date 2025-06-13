import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `> ᰔᩚ Ejemplo de uso: ${usedPrefix + command} Mini Dog`, m);
    }

    m.react('🕒');
    let old = new Date();
    let res = await ttks(text);
    let videos = res.data;

    if (!videos.length) {
      return conn.reply(m.chat, "No se encontraron videos.", m);
    }

    for (let i = 0; i < videos.length; i++) {
      let video = videos[i];
      let caption = i === 0
        ? `「 𝖳𝗂𝗄𝗍𝗈𝗄 - 𝖲𝖾𝖺𝗋𝖼𝗁 」\n\n➮ ✐ 𝗧𝗶𝘁𝘂𝗹𝗼 » ${video.title}\n➮ ☄︎ 𝗕𝘂𝘀𝗾𝘂𝗲𝗱𝗮 » ${text}`
        : `❀ *Titulo* » ${video.title}\n☁︎ *Process* » ${((new Date() - old) * 1)} ms`;

      await conn.sendFile(m.chat, video.no_wm, 'tiktok.mp4', caption, m);
    }

    m.react('✅');
  } catch (e) {
    return conn.reply(m.chat, `Ocurrió un problema al obtener los videos:\n\n` + e, m);
  }
};

handler.command = ["ttsesearch", "tiktoks", "ttrndm", "ttks", "tiktoksearch"];
handler.help = ["ttsearch"];
handler.tags = ["download"];
export default handler;

async function ttks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 20,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (!videos.length) throw new Error("⚠️ No se encontraron videos para esa búsqueda.");

    const shuffled = videos.sort(() => 0.5 - Math.random()).slice(0, 5);
    return {
      status: true,
      creator: "Made With Maycol And Wirk",
      data: shuffled.map(video => ({
        title: video.title,
        no_wm: video.play,
        watermark: video.wmplay,
        music: video.music
      }))
    };
  } catch (error) {
    throw error;
  }
}