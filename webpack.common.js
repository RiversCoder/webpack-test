const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
  	app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins:[
  	new CleanWebpackPlugin(),
  	new HtmlWebpackPlugin({
  		title: '生产环境搭建'
  	})
  ],
  module: {
     rules: [
      {
         test: /\.ttf|\.jpg$/,
         use: ['file-loader']
       },
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader']
       }
     ]
   },
};