/* eslint-disable import/no-extraneous-dependencies, global-require, no-undef, quote-props */
const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(process.env.NODE_ENV);

module.exports = {
  entry: {
    json: [
      'react-hot-loader/patch', // RHL patch
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './src/json/index.js', // Your appʼs entry point
    ],
    html: [
      'react-hot-loader/patch', // RHL patch
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './src/html/index.js', // Your appʼs entry point
    ],
    pdf: [
      'react-hot-loader/patch', // RHL patch
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './src/pdf/index.js', // Your appʼs entry point
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]/[name]Viewer.bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        failOnError: true,
      },
    },
    {
      test: /\.(js|jsx)?$/,
      use: ['react-hot-loader/webpack', 'babel-loader'],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)?$/,
      use: 'file-loader?name=[name].[ext]&outputPath=fonts/',
    },
    {
      test: /\.(png|gif)?$/,
      use: 'url-loader',
    },
    {
      test: /\.svg$/,
      use: 'url-loader',
    },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackNotifierPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CopyWebpackPlugin([
      {
        from: './src/json/index.html',
        to: './json/',
      },
      {
        from: './src/html/index.html',
        to: './html/',
      },
      {
        from: './src/pdf/index.html',
        to: './pdf/',
      },
      {
        from: './src/index.html',
        to: './',
      },
    ]),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'build', 'html'),
  },
};
