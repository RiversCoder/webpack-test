# webpack 创建个人的第三方依赖 library 
---

## 导读

除了打包应用程序代码，`webpack` 还可以用于打包 `JavaScript library`,所以我们可以使用`webpack`很方便的打包我们的`library`项目
项目地址：[https://github.com/RiversCoder/webpack-test](https://github.com/RiversCoder/webpack-test)

## 项目目录
```shell
  |- webpack.config.js
  |- package.json
  |- /node_modules
    |- … 
  |- /src
    |- index.js
    |- test.js
```

## 编辑`index.js`如下
实现时间格式化，以及随机字符串格式化的
```js
import moment from 'moment';

// 时间格式化
export function formatTime(format){
  return moment(format)
}

// 随机字符串
export function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
```

## 编辑`webpack.config.js`如下

```js
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tool-format.js'
  }
};
```

## 尝试`webpack`打包编译，如下：
```shell
D:\me\npm\test\webpack-test\examples\case01_create_library>npx webpack
Hash: cfbdf2a67dbb5b12d27f
Version: webpack 4.34.0
Time: 1300ms
Built at: 2019-06-27 12:02:54 PM
         Asset     Size  Chunks             Chunk Names
tool-format.js  233 KiB       0  [emitted]  main
Entrypoint main = tool-format.js
[128] ./src/index.js 449 bytes {0} [built]
[129] (webpack)/buildin/module.js 497 bytes {0} [built]
[130] ./node_modules/_moment@2.24.0@moment/locale sync ^\.\/.*$ 3 KiB {0} [optional] [built]
    + 128 hidden modules
```
在这里我我们可以观察得到，编译出来的`tool-format.js`文件大小为`233KB`，过于太大，所以我们需要外部化我们的依赖包`moment`

## 修改`webpack.config.js`配置如下
```js
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tool-format.js'
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
```

## 再次打包打印如下
```shell
D:\me\npm\test\webpack-test\examples\case01_create_library>npx webpack
Hash: f841a905ae2ec1909b3e
Version: webpack 4.34.0
Time: 921ms
Built at: 2019-06-27 1:33:24 PM
         Asset      Size  Chunks             Chunk Names
tool-format.js  1.25 KiB       0  [emitted]  main
Entrypoint main = tool-format.js
[0] external {"commonjs":"moment","commonjs2":"moment","amd":"moment","root":"moment"} 42 bytes {0} [built]
[1] ./src/index.js 449 bytes {0} [built]
```
现在这次打包的大小，已经有`1.25KB`了

## 暴露我们自定义的 `library`
修改`webpack.config.js`如下展示：
```js
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
```

## 再次打包编译如下：

```shell
D:\me\npm\test\webpack-test\examples\case01_create_library>npx webpack
Hash: d867325bd7fc46b67a68
Version: webpack 4.34.0
Time: 938ms
Built at: 2019-06-27 3:50:06 PM
         Asset      Size  Chunks             Chunk Names
tool-format.js  1.52 KiB       0  [emitted]  main
Entrypoint main = tool-format.js
[0] external {"commonjs":"moment","commonjs2":"moment","amd":"moment","root":"moment"} 42 bytes {0} [built]
[1] ./src/index.js 449 bytes {0} [built]
```





