import fetch from "node-fetch";

// Variable global para evitar procesos concurrentes en el comando .artista
let isDownloadingArtist = false;

// Función auxiliar que descarga un audio a partir de una URL de YouTube
async function downloadTrack(youtubeUrl) {
  const encodedUrl = encodeURIComponent(youtubeUrl);
  const primaryAPI = `https://mahiru-shiina.vercel.app/download/ytmp3?url=${encodedUrl}`;
  const backupAPI = `https://api.vreden.my.id/api/ytmp3?url=${encodedUrl}`;
  let resultJson = null;
  let lastError = null;
  const maxAttempts = 2;
  let usedAPI = 'primary';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(primaryAPI);
      const json = await response.json();
      if (!json.status || !json.data) throw new Error("Primary API: No se pudo obtener el enlace de descarga.");
      resultJson = json;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) continue;
    }
  }

  if (!resultJson) {
    usedAPI = 'backup';
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(backupAPI);
        const json = await response.json();
        if (json.status !== 200 || !json.result || !json.result.download) {
          throw new Error("Backup API: No se encontró el enlace de descarga.");
        }
        resultJson = json;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) continue;
      }
    }
  }

  if (!resultJson) throw lastError;

  let downloadUrl, title;
  if (resultJson.data) {
    downloadUrl = resultJson.data.author?.download || resultJson.data.download;
    title = resultJson.data.title || "audio";
  } else if (resultJson.result) {
    downloadUrl = resultJson.result.download?.url;
    title = resultJson.result.metadata?.title || "audio";
  }

  if (!downloadUrl) throw new Error("No se encontró el enlace de descarga.");
  title = title.replace(/[^\w\s]/gi, '').substring(0, 60);

  let audioBuffer;
  const maxAudioAttempts = 2;
  let audioError = null;
  for (let attempt = 1; attempt <= maxAudioAttempts; attempt++) {
    try {
      const audioResponse = await fetch(downloadUrl);
      if (!audioResponse.ok) throw new Error(`No se pudo descargar el audio. Código: ${audioResponse.status}`);
      audioBuffer = await audioResponse.buffer();
      break;
    } catch (error) {
      audioError = error;
      if (attempt < maxAudioAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  if (!audioBuffer && usedAPI === 'primary') {
    usedAPI = 'backup';
    resultJson = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(backupAPI);
        const json = await response.json();
        if (json.status !== 200 || !json.result || !json.result.download) {
          throw new Error("Backup API: No se encontró el enlace de descarga.");
        }
        resultJson = json;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) continue;
      }
    }

    if (resultJson && resultJson.result) {
      downloadUrl = resultJson.result.download?.url;
      title = resultJson.result.metadata?.title || "audio";
      if (!downloadUrl) throw new Error("No se encontró el enlace de descarga.");
      title = title.replace(/[^\w\s]/gi, '').substring(0, 60);
      for (let attempt = 1; attempt <= maxAudioAttempts; attempt++) {
        try {
          const audioResponse = await fetch(downloadUrl);
          if (!audioResponse.ok) throw new Error(`No se pudo descargar el audio. Código: ${audioResponse.status}`);
          audioBuffer = await audioResponse.buffer();
          break;
        } catch (error) {
          audioError = error;
          if (attempt < maxAudioAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
    }
  }

  if (!audioBuffer) throw audioError;

  return { audioBuffer, title };
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command.toLowerCase() !== "artista") return;

  if (isDownloadingArtist) {
    return conn.sendMessage(m.chat, { text: "⚠️ ¡Ya hay una descarga en curso! No interrumpas el proceso." }, global.rcanal);
  }

  if (!text || text.trim().length === 0) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *¡Atención!*\n\n💡 Debes proporcionar el nombre del artista.\n📌 Ejemplo: ${usedPrefix}artista TWICE`
    }, global.rcanal);
  }

  isDownloadingArtist = true;

  await conn.sendMessage(m.chat, {
    text: "🔔 *Iniciando descarga de música por artista.*\n\n⏳ Por favor, no interrumpas el proceso."
  }, global.rcanal);

  const searchUrl = `https://delirius-apiofc.vercel.app/search/searchtrack?q=${encodeURIComponent(text)}`;
  let searchResults;
  try {
    const response = await fetch(searchUrl);
    searchResults = await response.json();
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      isDownloadingArtist = false;
      return conn.sendMessage(m.chat, {
        text: "⚠️ No se encontraron resultados para ese artista."
      }, global.rcanal);
    }
  } catch (error) {
    isDownloadingArtist = false;
    return conn.sendMessage(m.chat, {
      text: `❌ *Error al buscar música:* ${error.message || "Desconocido"}`
    }, global.rcanal);
  }

  const tracks = searchResults.slice(0, 10);

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    try {
      const { audioBuffer, title } = await downloadTrack(track.url);
      await conn.sendMessage(m.chat, {
        document: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `🎶 *${track.title}*\n👤 *Artista:* ${track.artist}\n💽 *Álbum:* ${track.album || "Desconocido"}`
      }, { quoted: m, ...global.rcanal });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error al descargar "${track.title}":`, error);
      continue;
    }
  }

  isDownloadingArtist = false;
  await conn.sendMessage(m.chat, {
    text: "✅ *Descargas Finalizadas Exitosamente.*"
  }, global.rcanal);
};

handler.command = /^artista$/i;

export default handler;
