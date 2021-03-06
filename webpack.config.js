'use strict'

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer-stylus');

module.exports = (env) => ({
  entry: [
    './src/styl/main.styl',
    './src/pug/index.pug'
  ],
  output: {
    path: path.resolve('./dist'),
    filename: path.join('js', 'all.js')
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0']
          }
        }]
      }, {
        test: /\.(pug|jade)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            }
          }, {
            loader: 'pug-html-loader',
            options: {
              pretty: true
            }
          }
        ]
      }, {
        test: /\.(styl|stylus)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: path.join('css', 'all.css'),
            },
          }, {
            loader: 'stylus-loader',
            options: {
              compress: env.NODE_ENV === 'production',
              use: [autoprefixer({browsers: ['> 1%', 'ie > 9', 'iOS > 6'], hideWarnings: true})],
            },
          },
        ],

      }, {
        test: /\.(png|jpg|gif|svg|ico|eot|ttf|woff|woff2)$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }]
        })
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanPlugin(['dist/'], {
      verbose: true,
      dry: false,
    }),
  ],

  devServer: {
    host: '0.0.0.0',
    port: 1337,
    disableHostCheck: true,
    useLocalIp: true,
    compress: true,
    open: true,
    stats: 'errors-only'
  }
});