const sharp = require('sharp');
const fs = require('fs');

async function createBrandedLogo() {
  const emblem = await sharp('public/logo-clean.png')
    .resize(360, 322)
    .toBuffer();

  const svgText = Buffer.from(`
    <svg width="460" height="180" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title-te { fill: #ea580c; font-family: 'Segoe UI', Arial, sans-serif; font-size: 38px; font-weight: 900; }
        .title-en { fill: #15803d; font-family: 'Segoe UI', Arial, sans-serif; font-size: 30px; font-weight: 800; letter-spacing: 2px; }
        .sub { fill: #64748b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; }
      </style>
      <text x="50%" y="45" text-anchor="middle" class="title-te">గ్రామ్‌కనెక్ట్</text>
      <text x="50%" y="98" text-anchor="middle" class="title-en">GramConnect</text>
      <text x="50%" y="145" text-anchor="middle" class="sub">స్మార్ట్ గ్రామం · మన బాధ్యత</text>
    </svg>
  `);

  // Overwrite public/logo.png with the new GramConnect branded logo
  await sharp({
    create: {
      width: 460,
      height: 520,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: emblem, top: 15, left: 50 },
      { input: svgText, top: 340, left: 0 },
    ])
    .png()
    .toFile('public/logo.png');

  // Also create a standalone emblem without any text for small avatar icons
  await sharp('public/logo-clean.png')
    .resize(300, 300, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile('public/emblem.png');

  console.log('Successfully generated public/logo.png with GramConnect branding and public/emblem.png');
}

createBrandedLogo().catch(console.error);
