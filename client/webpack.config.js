var webpack = require('webpack')
var path = require('path')
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          path.resolve(__dirname, "node_modules")
        ],
        query: {
          presets: ['es2015', 'stage-0']
        }
      }, {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 versions!sass-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 versions'
      }
    ]
  },

  entry: {
    app: ["babel-polyfill", './src/app.js']
  },

  output: {
    path: "../assets/webpack_bundles/",
    filename: "[name]-[hash].js"
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'})
  ],

  node: {
    fs: 'empty'
  },

  devtool: 'source-map'

};
