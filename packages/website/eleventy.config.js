import path from 'node:path';
import * as esbuild from 'esbuild';
import * as sass from 'sass';

export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('js');
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addTemplateFormats('index.html');
  eleventyConfig.addTemplateFormats('png,svg,jpg,ico');
  eleventyConfig.addTemplateFormats('webmanifest');

  eleventyConfig.ignores.add('./src/web/**');
  eleventyConfig.ignores.add('./src/cloudinary/**');
  eleventyConfig.ignores.add('./src/*.11tydata.js');

  eleventyConfig.setInputDirectory('./src/');

  eleventyConfig.setOutputDirectory('./dist/');

  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',

    // opt-out of Eleventy Layouts
    useLayouts: false,

    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      // Don’t compile file names that start with an underscore
      if (parsed.name.startsWith('_')) {
        return;
      }

      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || '.', this.config.dir.includes],
      });

      // Map dependencies for incremental builds
      this.addDependencies(inputPath, result.loadedUrls);

      return async (_data) => {
        return result.css;
      };
    },
  });

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (_content, path) => {
      return async () => {
        const output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false,
        });

        return output.outputFiles[0].text;
      };
    },
  });
}
