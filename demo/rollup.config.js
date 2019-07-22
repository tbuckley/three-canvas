import resolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'esm',
  },

  plugins: [
    resolve({ module: true }),
  ],
};
