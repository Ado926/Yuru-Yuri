import { createCanvas, loadImage, registerFont } from 'canvas'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import fetch from 'node-fetch'

// Puedes registrar una fuente personalizada si quieres algo más bonito
// registerFont('./fonts/Poppins-Bold.ttf', { family: 'Poppins' })

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  const lines = []

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      lines.push(line)
      line = words[n] + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)

  lines.forEach((l, i) => {
    ctx.fillText(l.trim(), x, y + (i * lineHeight))
  })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const frase = text || (m.quoted?.text || '')
  if (!frase) throw `*Uso:* ${usedPrefix + command} <frase o etiqueta un mensaje>`

  const user = m.quoted?.sender || m.sender
  const name = await conn.getName(user)

  const defaultImg = 'https://i.imgur.com/axnP93g.png'
  const imgUrl = await conn.profilePictureUrl(user, 'image').catch(_ => defaultImg)
  const avatarBuffer = await fetch(imgUrl).then(res => res.buffer())
  const avatar = await loadImage(avatarBuffer)

  const bgBuffer = await fetch('https://files.catbox.moe/6tno0n.jpg').then(res => res.buffer())
  const bgImage = await loadImage(bgBuffer)

  const width = 900, height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo
  ctx.drawImage(bgImage, 0, 0, width, height)
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(0, 0, width, height)

  // Marco decorativo para frase
  ctx.strokeStyle = '#ffffff80'
  ctx.lineWidth = 4
  ctx.strokeRect(260, 60, 600, 300)

  // Avatar con borde circular blanco
  const avatarSize = 150
  const avatarX = 80, avatarY = height - 180
  ctx.save()
  ctx.beginPath()
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 5, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(avatar, avatarX + 5, avatarY + 5, avatarSize - 10, avatarSize - 10)
  ctx.restore()

  // Texto de frase
  ctx.fillStyle = '#ffffff'
  ctx.font = '36px sans-serif'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
  ctx.shadowBlur = 8
  wrapText(ctx, `"${frase}"`, 280, 110, 580, 45)
  ctx.shadowBlur = 0

  // Autor
  ctx.fillStyle = '#eeeeee'
  ctx.font = '24px sans-serif'
  ctx.fillText(`— ${name}`, 280, height - 60)

  // Guardar imagen
  const out = join(tmpdir(), `frase_${user.split('@')[0]}.png`)
  writeFileSync(out, canvas.toBuffer())

  await conn.sendMessage(m.chat, {
    image: { url: out },
    caption: `_📝 Frase de ${name}_`,
    mentions: [user]
  }, { quoted: m })
}

handler.help = ['quote <texto|etiqueta>']
handler.tags = ['maker']
handler.command = ['quote', 'mensaje', 'frase']

export default handler