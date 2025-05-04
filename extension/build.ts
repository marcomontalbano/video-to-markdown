import { exec } from 'node:child_process';
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'tsup';
import packageJson from '../package.json' with { type: 'json' };
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

  /** Clean-up dist folders */
  rmSync('dist-chrome', { recursive: true, force: true });
  rmSync('dist-firefox', { recursive: true, force: true });

  /** Clone the extension to different directories */
  cloneExtension('dist-chrome');
  cloneExtension('dist-firefox');

  /** Write the manifest file */
  fixChromeManifest();
  fixFirefoxManifest();

  /** Zip */
  exec('zip -r dist-chrome.zip dist-chrome && zip -r dist-firefox.zip dist-firefox', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    // console.info(`stdout: ${stdout}`);
  });
})();

function fixChromeManifest() {
  const chromeManifest = structuredClone(manifest);

  chromeManifest.version = packageJson.version;

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

  firefoxManifest.version = packageJson.version;

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
