const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const rules = require('./webpackRules');

module.exports = {
  mode: 'development',
  entry: './src/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  devServer: {
    static: path.join(__dirname, 'bin'), // /renderer.js'),
    compress: true,

    port: 9000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@asset': path.resolve(__dirname, 'asset'),
    },
    extensions: ['', '.jsx', '.tsx', '.ts', '.js', '.png', '.jpg', '.svg'],
    fallback: rules.fallback,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        //include: /src/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      rules.source,
      rules.inline,
      rules.resource,
      rules.svg,
    ],
  },
  output: {
    path: __dirname + '/bin',
    filename: 'renderer.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  'externals': {
    'electron': 'require(\'electron\')',
    'child_process': 'require(\'child_process\')',
    'fs': 'require(\'fs\')',
    'path': 'require(\'path\')',
  },
};
