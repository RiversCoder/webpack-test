const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: '全局引入lodash'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({
      lod: 'lodash'
    })
  ],
  optimization:{
    splitChunks:{
      cacheGroups: {
          commons: {
              name: "vendor",  // 指定公共模块 bundle 的名称
              chunks: "initial",
              minChunks: 2
          }
        }
    }
  },
  output: {
    filename: '[name].bundle.[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
};