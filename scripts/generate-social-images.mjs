import sharp from 'sharp';
await sharp('public/social/opengraph.svg').png().toFile('public/social/opengraph.png');
await sharp('src/app/icon.svg').resize(180, 180).png().toFile('src/app/apple-icon.png');
console.log('Open Graph 1200×630 and Apple icon 180×180 generated.');
