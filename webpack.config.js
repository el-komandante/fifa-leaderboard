var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: __dirname + '/js-source/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public/js'
  },
  plugins: [HTMLWebpackPluginConfig]
};
