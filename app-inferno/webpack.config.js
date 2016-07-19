/* global __dirname */

/**
 * Axel Rauschmayer's react startr kit was used here to get me started quickly
 * https://github.com/rauschma/react-starter-project
 * I fine-tuned a few settings, but credit goes to Dr Rauschmayer.
 */
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var dir_js = path.resolve(__dirname, 'js');
var dir_html = path.resolve(__dirname, 'html');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: path.resolve(dir_js, 'main.js'),
  output: {
    path: dir_build,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: dir_build,
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        test: dir_js,
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
        from: dir_html
    }]),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // UglifyJS won't work well with ES6 code
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: false,
    //   warnings: false,
    // }),
  ],
  stats: {
    colors: true,
  },
};
