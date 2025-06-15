import axios from 'axios';

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

  if (!text) return m.reply(`✐ Ingresa una búsqueda para TikTok\n> *Ejemplo:* ${usedPrefix + command} haikyuu edit`);

  let res = await fetch(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(text)}`);
  let json = await res.json();

  if (!json.status || !json.data || !json.data.length) return m.reply('❌ No se encontró ningún video.');

  let vid = json.data[0];

  let caption = `「💜」*${vid.title}*

> ✦ *Autor:* » ${vid.author}
> ✰ *Vistas:* » ${vid.views.toLocaleString()}
> ✐ *Descripción:* » ${vid.desc || 'Sin descripción'}
> 🜸 *Link:* » ${vid.url}`;

  await conn.sendMessage(m.chat, {
    video: { url: vid.url },
    caption,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: vid.title,
        body: `By ${vid.author} • ${vid.views.toLocaleString()} vistas`,
        mediaType: 1,
        thumbnailUrl: vid.thumbnail,
        mediaUrl: vid.url,
        sourceUrl: vid.url
      }
    }
  }, { quoted: m });
};

handler.help = ['tiktokplay'];
handler.tags = ['downloader'];
handler.command = ['playtt', 'playtiktok'];

export default handler;