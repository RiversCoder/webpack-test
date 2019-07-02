var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tool-format.js',
    library: 'toolFormat',
    libraryTarget: 'umd'
  },
  externals: {
     moment: {
       commonjs: 'moment',
       commonjs2: 'moment',
       amd: 'moment',
       root: 'moment'
     }
   }
};