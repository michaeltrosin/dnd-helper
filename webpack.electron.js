const path = require('path');

const rules = require('./pack_rules');

module.exports = {
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'asset': path.resolve(__dirname, 'asset'),
    },
    extensions: ['.tsx', '.ts', '.js', '.png', '.jpg', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [{loader: 'ts-loader'}],
      },
      rules.source,
      rules.inline,
      rules.resource,
      rules.svg,
    ],
  },
  output: {
    path: __dirname + '/bin',
    filename: 'main.js',
  },
  'externals': {
    'electron': 'require(\'electron\')',
    'child_process': 'require(\'child_process\')',
    'fs': 'require(\'fs\')',
    'path': 'require(\'path\')',
  },
};
