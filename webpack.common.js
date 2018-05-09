const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src');
const STATIC_DIR = path.resolve(APP_DIR, 'static');
const DIST_DIR = path.resolve(__dirname, 'dist');
const PUBLIC_DIR = path.resolve(DIST_DIR, 'public');

const config = {
  context: APP_DIR,
  entry: ['babel-polyfill', './main.jsx'],

  plugins: [
    new HtmlWebpackPlugin({ title: 'Receipts', template: 'static/index.html' }),
    new CleanWebpackPlugin([DIST_DIR]),
    new ExtractTextPlugin('public/style.css')
  ],
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          enforce: true,
          priority: 1
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    alias: {
      'assets': STATIC_DIR,
      'components': path.resolve(APP_DIR, 'components')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.s?css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'], publicPath: '../' }) },
      { test: /\.jsx?$/, exclude: path.resolve(__dirname, 'node_modules'), use: 'babel-loader' },
      { test: /favicon\.ico/, use: 'file-loader?name=./favicon.ico' },
      { test: /\.(jpe?g|gif|png|svg|woff2?|eot|ttf|wav|mp3)$/, use: 'file-loader?name=./public/[name].[ext]' }
    ]
  }
};

module.exports = {
  DIST_DIR,
  PUBLIC_DIR,
  APP_DIR,
  STATIC_DIR,
  config
};