import { put } from '@vercel/blob';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const IMAGES_TO_UPLOAD = [
  { localPath: 'public/logo.png', blobName: 'site-assets/logo.png' },
  { localPath: 'public/hero-bg.jpg', blobName: 'site-assets/hero-bg.jpg' },
  { localPath: 'public/michael-profile.jpg', blobName: 'site-assets/michael-profile.jpg' },
  { localPath: 'public/images/image.png', blobName: 'site-assets/portfolio/image.png' },
  { localPath: 'public/images/mzedu-tours.jpg', blobName: 'site-assets/portfolio/mzedu-tours.jpg' },
  { localPath: 'public/images/zyra-africa.jpg', blobName: 'site-assets/portfolio/zyra-africa.jpg' },
  { localPath: 'public/favicon.ico', blobName: 'site-assets/favicon.ico' },
  { localPath: 'public/favicon-16x16.png', blobName: 'site-assets/favicon-16x16.png' },
  { localPath: 'public/favicon-32x32.png', blobName: 'site-assets/favicon-32x32.png' },
  { localPath: 'public/apple-touch-icon.png', blobName: 'site-assets/apple-touch-icon.png' },
  { localPath: 'public/apple-icon.png', blobName: 'site-assets/apple-icon.png' },
  { localPath: 'public/android-chrome-192x192.png', blobName: 'site-assets/android-chrome-192x192.png' },
  { localPath: 'public/android-chrome-512x512.png', blobName: 'site-assets/android-chrome-512x512.png' },
];

async function uploadAll() {
  const results = {};

  for (const img of IMAGES_TO_UPLOAD) {
    const fullPath = join(process.cwd(), img.localPath);
    if (!existsSync(fullPath)) {
      console.log(`SKIP: ${img.localPath} not found`);
      continue;
    }

    try {
      const fileBuffer = readFileSync(fullPath);
      const blob = await put(img.blobName, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
      });
      results[img.localPath] = blob.url;
      console.log(`OK: ${img.localPath} -> ${blob.url}`);
    } catch (err) {
      console.log(`ERR: ${img.localPath} - ${err.message}`);
    }
  }

  console.log('\n--- RESULTS JSON ---');
  console.log(JSON.stringify(results, null, 2));
}

uploadAll();
