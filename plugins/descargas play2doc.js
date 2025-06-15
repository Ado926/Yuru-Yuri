import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, '🍭 Ingresa una URL válida de *Youtube*.', m);
    }

    try {
        await m.react('🕒');

        const apis = [
            `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`,
            `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=xenzpedo`,
            `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`,
            `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(text)}`
        ];

        let result;
        for (const api of apis) {
            try {
                const response = await fetch(api);
                result = await response.json();

                if (result.status && result.result && result.result.downloadUrl) {
                    const { title, downloadUrl, duration, durationString } = result.result;

                    // Duración puede venir en segundos o como string tipo "8:32"
                    let durationSeconds = 0;

                    if (typeof duration === 'number') {
                        durationSeconds = duration;
                    } else if (typeof duration === 'string' || durationString) {
                        const timeStr = duration || durationString;
                        const parts = timeStr.split(':').map(Number);
                        if (parts.length === 3) {
                            durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                        } else if (parts.length === 2) {
                            durationSeconds = parts[0] * 60 + parts[1];
                        }
                    }

                    const videoFileResponse = await fetch(downloadUrl);
                    if (videoFileResponse.ok) {
                        const buffer = await videoFileResponse.buffer();

                        const isLong = durationSeconds > 8 * 60; // más de 8 minutos

                        if (isLong) {
                            await conn.sendMessage(
                                m.chat,
                                {
                                    document: buffer,
                                    mimetype: 'video/mp4',
                                    fileName: `${title}.mp4`,
                                },
                                { quoted: m }
                            );
                        } else {
                            await conn.sendMessage(
                                m.chat,
                                {
                                    video: buffer,
                                    mimetype: 'video/mp4',
                                },
                                { quoted: m }
                            );
                        }
                    }

                    await m.react('✅');
                    return;
                }
            } catch (err) {
                console.error(`Error con API: ${api}`, err.message);
            }
        }

        throw new Error('No se pudo obtener el enlace de descarga de ninguna API.');
    } catch (error) {
        await m.react('❌');
    }
};

handler.tags = ['descargas'];
handler.command = ['playvidoc'];
handler.register = true;
export default handler;