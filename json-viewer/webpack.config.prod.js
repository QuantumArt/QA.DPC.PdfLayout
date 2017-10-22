/* eslint-disable import/no-extraneous-dependencies, global-require, no-undef, quote-props */
const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(process.env.NODE_ENV);

module.exports = {
  entry: [
    './src/index.js', // Your appʼs entry point
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'json-viewer.bundle.js',
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
    new webpack.optimize.UglifyJsPlugin(),
    new WebpackNotifierPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CopyWebpackPlugin([{
      from: './public',
      to: './',
    }]),
  ],
};
