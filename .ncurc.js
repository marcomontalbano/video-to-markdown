module.exports = {
  dep: ['prod', 'dev', 'optional', 'packageManager'],
  deep: true,
  upgrade: true,
  reject: ['pnpm'],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (name === '@types/node' && parseInt(upgradedVersionSemver?.major, 10) >= 22) {
      return false;
    }

    return true;
  },
};
