const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
  }

  // Generate an icon with a white background and rounded corners
  // 1024x1024 is recommended for capacitor-assets
  const size = 1024;
  const padding = 100;
  const r = 200; // corner radius

  // Create a rounded rect mask
  const rect = Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff" /></svg>`
  );

  await sharp('public/mendyr.png')
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .composite([{ input: rect, blend: 'dest-in' }])
    .toFile('assets/icon.png');

  console.log('Generated assets/icon.png');

  // Generate splash screen (2732x2732)
  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: 'public/mendyr.png',
        gravity: 'center'
      }
    ])
    .toFile('assets/splash.png');

  console.log('Generated assets/splash.png');
}

generate().catch(console.error);
