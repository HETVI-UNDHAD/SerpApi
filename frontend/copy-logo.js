import fs from 'fs';
import path from 'path';

const src = path.resolve('../logo.png');
const destDir = path.resolve('public/assets');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
const dest1 = path.join(destDir, 'travelosai-logo.png');
const dest2 = path.resolve('public/logo.png');
const dest3 = path.resolve('public/travelosai-logo.png');

fs.copyFileSync(src, dest1);
fs.copyFileSync(src, dest2);
fs.copyFileSync(src, dest3);

console.log('Logo copied successfully to:', dest1, dest2, dest3);
