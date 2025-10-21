import { spawn } from 'node:child_process';
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'tsup';
import packageJson from '../package.json' with { type: 'json' };
import manifest from './manifest.json' with { type: 'json' };

(async () => {
  /** Build the extension */
  await build({
    entry: {
      content: 'src/content/index.ts',
      popup: 'src/popup/index.ts',
    },
    format: ['iife'], // Mantiene tutto in un unico file senza moduli
    target: 'esnext',
    outDir: 'dist',
    minify: false, // Disattiva la minificazione
    splitting: false,
    clean: true,
    env: {
      BASE_URL: process.env.BASE_URL ?? 'https://video-to-markdown-api.marcomontalbano.workers.dev',
    },
  }).catch(() => process.exit(1));

  /** Clean-up dist folders */
  rmSync('dist-chrome', { recursive: true, force: true });
  rmSync('dist-firefox', { recursive: true, force: true });

  /** Clone the extension to different directories */
  cloneExtension('dist-chrome');
  cloneExtension('dist-firefox');

  /** Write the manifest file */
  updateManifestVersion();
  fixChromeManifest();
  fixFirefoxManifest();

  /** Lint Firefox extension */
  spawn('pnpm', ['web-ext', 'lint', '-s', 'dist-firefox'], { stdio: 'inherit' }).on('exit', (error) => {
    if (error) {
      console.error(`Error: ${error}`);
      process.exit(1);
    } else {
      /** Zip Firefox */
      spawn('pnpm', ['web-ext', 'build', '-s', 'dist-firefox', '-a', '.', '-n', 'dist-firefox.zip', '-o'], {
        stdio: 'inherit',
      });
      /** Zip Chrome */
      spawn('pnpm', ['web-ext', 'build', '-s', 'dist-chrome', '-a', '.', '-n', 'dist-chrome.zip', '-o'], {
        stdio: 'inherit',
      });
    }
  });
})();

function updateManifestVersion() {
  const manifestWithVersion = structuredClone(manifest);
  manifestWithVersion.version = packageJson.version;

  writeFileSync('manifest.json', JSON.stringify(manifestWithVersion, null, 2), 'utf-8');
}

function fixChromeManifest() {
  const chromeManifest = structuredClone(manifest);

  chromeManifest.version = packageJson.version;

  // // @ts-expect-error I want to remove the property
  // delete chromeManifest.background.scripts;

  // // @ts-expect-error I want to remove the property
  // delete chromeManifest.background.persistent;

  // @ts-expect-error I want to remove the property
  delete chromeManifest.browser_specific_settings;

  writeFileSync('dist-chrome/manifest.json', JSON.stringify(chromeManifest, null, 2), 'utf-8');
}

function fixFirefoxManifest() {
  const firefoxManifest = structuredClone(manifest);

  firefoxManifest.version = packageJson.version;

  // @ts-expect-error I want to remove the property
  delete firefoxManifest.$schema;

  // // @ts-expect-error I want to remove the property
  // delete firefoxManifest.background.persistent;

  // // @ts-expect-error I want to remove the property
  // delete firefoxManifest.background.service_worker;

  firefoxManifest.permissions = firefoxManifest.permissions.filter((permission) => permission !== 'background');

  writeFileSync('dist-firefox/manifest.json', JSON.stringify(firefoxManifest, null, 2), 'utf-8');
}

function cloneExtension(destination: string): void {
  function recursiveCopy(source: string) {
    cpSync(source, `${destination}/${source}`, { recursive: true });
  }

  recursiveCopy('dist');
  recursiveCopy('images');
  recursiveCopy('src');
  recursiveCopy('manifest.json');
  recursiveCopy('README.md');
}
