# webpack 缓存问题处理解决方案
---

## 导读

在该篇博文中，我们将逐步实现文件`hash`后缀的输出，修改某个文件，才会对应输出修改该文件的`hash`后缀，同时满足性能优化，客服端服务端代码同步更新
项目地址：[https://github.com/RiversCoder/webpack-test](https://github.com/RiversCoder/webpack-test)

### 官网介绍

在之前的指南案例中，我们使用 `webpack` 来打包我们的模块化后的应用程序，`webpack` 会生成一个可部署的 /dist 目录，然后把打包后的内容放置在此目录中。只要 `/dist` 目录中的内容部署到服务器上，客户端（通常是浏览器）就能够访问网站此服务器的网站及其资源。而最后一步获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为 **缓存** 的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然而，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手。

此篇文章的重点在于通过必要的配置，以确保 `webpack` 编译生成的文件能够被客户端缓存，而在文件内容变化后，能够请求到新的文件。

## 代码案例

1. 延续使用上篇文章的代码，修改**webpack.config.js**如下：

```js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');  // add new +

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [   // add new +
      'lodash'  //  提取第三方库，打包成一个单独的文件
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: '缓存'
    }),
    new webpack.HashedModuleIdsPlugin()  // add new +
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
    filename: '[name].bundle.[chunkhash].js',  // add new +
    path: path.resolve(__dirname, 'dist')
  }
};
```

2. **src/index.js**：
```js
import lod from 'lodash'

function component(){
  
  var element = document.createElement("div")
  element.innerHTML = lod.join(['Hello ','webpack'], ' ') // 调用
  
  // new add +
  var button = document.createElement('button');
  var br = document.createElement('br');
  
  button.innerHTML = '点击后将打印信息到控制台';
  element.appendChild(br);
  element.appendChild(button);
  
  button.onclick = e => import(/* webpackChunkName: "print" */ './project').then(module => {
    console.log(module)
    var project = module.default;
    project.printMe()
  })
  return element 
}

document.body.appendChild(component())
```

3. 命令行打包编译如下：

```shell
D:\me\npm\test\webpack-test>npx webpack --config  webpack.config.js
Hash: dd4a6831e829762133b3
Version: webpack 4.34.0
Time: 1147ms
Built at: 2019-06-20 4:55:07 PM
                                Asset       Size  Chunks             Chunk Names
 index.bundle.fb4de6989bcebb92f45f.js   2.64 KiB       0  [emitted]  index
                           index.html  284 bytes          [emitted]
 print.bundle.f8d09b653e1ef6800806.js  221 bytes       1  [emitted]  print
vendor.bundle.19d4dad37b0dbff4dbbf.js   69.4 KiB       2  [emitted]  vendor
Entrypoint index = vendor.bundle.19d4dad37b0dbff4dbbf.js index.bundle.fb4de6989bcebb92f45f.js
[0] multi lodash 28 bytes {2} [built]
[9Zv/] ./src/project.js 158 bytes {1} [built]
[KQu2] (webpack)/buildin/global.js 472 bytes {2} [built]
[P7h0] (webpack)/buildin/module.js 497 bytes {2} [built]
[tjUo] ./src/index.js 621 bytes {0} [built]
    + 1 hidden module

Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [KQu2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [P7h0] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 2 hidden modules
```

4. 修改`index.js`如下内容，再次打包编译，查看编译后的文件名变化 
```js
//...
button.innerHTML = '点击后将打印信息到console.log控制台';
//...
```
```shell
D:\me\npm\test\webpack-test>npx webpack --config  webpack.config.js
Hash: 78719b855fd6c9ea4001
Version: webpack 4.34.0
Time: 1912ms
Built at: 2019-06-20 4:59:06 PM
                                Asset       Size  Chunks             Chunk Names
 index.bundle.a01497bd4d30aa515c69.js   2.65 KiB       0  [emitted]  index
                           index.html  284 bytes          [emitted]
 print.bundle.f8d09b653e1ef6800806.js  221 bytes       1  [emitted]  print
vendor.bundle.19d4dad37b0dbff4dbbf.js   69.4 KiB       2  [emitted]  vendor
Entrypoint index = vendor.bundle.19d4dad37b0dbff4dbbf.js index.bundle.a01497bd4d30aa515c69.js
[0] multi lodash 28 bytes {2} [built]
[9Zv/] ./src/project.js 158 bytes {1} [built]
[KQu2] (webpack)/buildin/global.js 472 bytes {2} [built]
[P7h0] (webpack)/buildin/module.js 497 bytes {2} [built]
[tjUo] ./src/index.js 632 bytes {0} [built]
    + 1 hidden module

Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [KQu2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [P7h0] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 2 hidden modules
```
> 通过对比两次编译的结果，我们修改的`index.js`入口文件对应的打包编译的文件`hash`后缀发生改变，其他的编译输出文件则没有发生改变








