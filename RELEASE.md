# How to release

1. Create a pull request for each development
2. [ *only pre-release* ] Create a new version from `main` with `pnpm version [premajor | preminor | prepatch] --preid=beta`
3. Create a new version from `main` with `pnpm version [major | minor | patch]`
4. Push changes with `git push origin main --follow-tags`
5. _Release is automatically created and published_

# How to publish

1. Download `dist-*.zip` from https://github.com/marcomontalbano/video-to-markdown/releases/latest
2. Publish the Google Chrome extension to https://chrome.google.com/webstore/devconsole
3. Publish the Firefox extension to https://addons.mozilla.org/it/developers/addons
