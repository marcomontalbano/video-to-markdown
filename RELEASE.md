# How to release

1. Create a pull request for each development
2. [ *only pre-release* ] Create a new version from `main` with `pnpm version [premajor | preminor | prepatch] --preid=beta`
3. Create a new version from `main` with `pnpm version [major | minor | patch]`
4. Push changes with `git push origin main --follow-tags`
5. _Release is automatically created and published_
