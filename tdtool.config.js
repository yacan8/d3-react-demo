const path = require('path');
const pkg = require('./package.json');
const Config = require('tdtool').Config;
const isDebug = process.env.NODE_ENV !== 'production';
const dll = require('./tdtool.dll.config');
const clientConfig = new Config({
  entry: {
    [pkg.name]: './src/index'
  },
  sourceMap: true,
  filename: '[name].js',
  minimize: !isDebug,
  extends: [['react']],
  env: {
    'process.env.NODE_ENV': isDebug ? '"development"': '"production"',
    __DEV__: isDebug,
    'process.env.BROWSER': true
  },
  dll
});
clientConfig.add('rule.svg', {
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'url-loader',
  query: {
    limit: 10000,
    minetype: 'image/svg+xml'
  }
})

clientConfig.add('output.path', path.join(process.cwd(), 'dist'));
const AssetsPlugin = require('assets-webpack-plugin');
clientConfig.add(
  'plugin.AssetsPlugin',
  new AssetsPlugin({
    path: './dist',
    filename: 'assets.json',
    prettyPrint: true,
  })
);
const serverConfig = new Config({
  entry: './src/server',
  target: 'node',
  filename: 'server.js',
  sourceMap: true,
  devServer: true,
  externals: [ /^\.\/assets\.json$/ ],
  extends: [['react']],
  env: {
    __DEV__: isDebug,
    'process.env.BROWSER': false
  }
});
module.exports = [clientConfig.resolve(), serverConfig.resolve()];
