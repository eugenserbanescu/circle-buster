/* eslint-disable no-console */

const babel = require('rollup-plugin-babel');

const SRC = `${__dirname}/index.js`;
const DST = `${__dirname}/dist`;

module.exports = {
  banner: '!function() {',
  entry: SRC,
  dest: `${DST}/app.js`,
  footer: '}();',
  format: 'cjs',
  onwarn(str) {
    if (!/^Treating/.test(str)) {
      console.error(str);
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
      presets: ['es-uxtemple'],
    }),
  ],
  sourceMap: false,
};
