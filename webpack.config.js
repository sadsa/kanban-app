const path = require('path');
const merge = require('webpack-merge');
const ProgressBar = require('progress-bar-webpack-plugin');
const webpack = require('webpack');

// Get the NPM process target e.g. build/start/test etc.
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      }
    ]
  }
}

switch (TARGET) {
  case 'build':
    module.exports = merge(common, {});
  case 'start':
    module.exports = merge(common, {
      devServer: {
        contentBase: PATHS.build,
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
        // Parse host and port from env so this is easy to customize.
        //
        // If you use Vagrant or Cloud9, set
        // host: process.env.HOST || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices unlike default
        // localhost
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ProgressBar({clear: false})
      ],
      devtool: 'eval-source-map'
    });
}