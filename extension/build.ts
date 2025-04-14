import { cpSync, writeFileSync } from 'node:fs';
import { build } from 'tsup';
import manifest from './manifest.json' with { type: 'json' };

(async () => {
  /** Build the extension */
  await build({
    entry: {
      background: 'src/background/index.ts',
      content: 'src/content/index.ts',
      popup: 'src/popup/index.ts',
    },
    format: ['iife'], // Mantiene tutto in un unico file senza moduli
    target: 'esnext',
    outDir: 'dist',
    minify: false, // Disattiva la minificazione
    splitting: false,
    clean: true,
  }).catch(() => process.exit(1));

  /** Clone the extension to different directories */
  cloneExtension('dist-chrome');
  cloneExtension('dist-firefox');

  /** Write the manifest file */
  fixChromeManifest();
  fixFirefoxManifest();
})();

function fixChromeManifest() {
  const chromeManifest = structuredClone(manifest);

  // @ts-expect-error I want to remove the property
  // biome-ignore lint/performance/noDelete: <explanation>
  delete chromeManifest.background.scripts;

  // @ts-expect-error I want to remove the property
  // biome-ignore lint/performance/noDelete: <explanation>
  delete chromeManifest.background.persistent;

  writeFileSync('dist-chrome/manifest.json', JSON.stringify(chromeManifest, null, 2), 'utf-8');
}

function fixFirefoxManifest() {
  const firefoxManifest = structuredClone(manifest);

  // @ts-expect-error I want to remove the property
  // biome-ignore lint/performance/noDelete: <explanation>
  delete firefoxManifest.$schema;

  // @ts-expect-error I want to remove the property
  // biome-ignore lint/performance/noDelete: <explanation>
  delete firefoxManifest.background.persistent;

  // @ts-expect-error I want to remove the property
  // biome-ignore lint/performance/noDelete: <explanation>
  delete firefoxManifest.background.service_worker;

  firefoxManifest.permissions = firefoxManifest.permissions.filter((permission) => permission !== 'background');

  writeFileSync('dist-firefox/manifest.json', JSON.stringify(firefoxManifest, null, 2), 'utf-8');
}

async function cloneExtension(destination: string): Promise<void> {
  function recursiveCopy(source: string) {
    cpSync(source, `${destination}/${source}`, { recursive: true });
  }

  recursiveCopy('dist');
  recursiveCopy('images');
  recursiveCopy('src');
  recursiveCopy('manifest.json');
  recursiveCopy('README.md');
}
