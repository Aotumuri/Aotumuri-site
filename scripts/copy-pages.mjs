import { copyFile, writeFile } from 'node:fs/promises';

// A real static secret entry and a Pages fallback: both use the same base-safe bundle.
await Promise.all([
  copyFile('dist/index.html', 'dist/404.html'),
  copyFile('dist/index.html', 'dist/secret.html'),
  writeFile('dist/.nojekyll', ''),
]);
