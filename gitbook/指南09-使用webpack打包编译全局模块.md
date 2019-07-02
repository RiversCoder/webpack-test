# webpack 引用打包第三方全局依赖
---

## 导读

`webpack` 可以识别 ES6 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(`library`)可能会引用一些全局依赖（例如 `jQuery` 中的 `$`）
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

## 指定的少量确定的全局变量实现

### 第一种方案：使用 `ProvidePlugin` 插件

还记得我们之前文章中使用过的 `lodash` 吗？让我们把这个模块作为我们应用程序中的一个全局变量。要实现这些，我们需要使用 `ProvidePlugin` 插件。
使用 `ProvidePlugin` 后，能够在通过 `webpack` 编译的每个模块中，通过访问一个指定变量来获取到该依赖包（例如`lodash`、`jquery`等）。

**1. src/index..js**
```js
function component(){
  var element = document.createElement("div")
  element.innerHTML = lod.join(['Hello ','webpack'], ' ') // 调用 lodash
  
  return element 
}

document.body.appendChild(component())
```

**2. webpack.config.js**
```js
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
```

**3. 执行打包命令**

```shell
D:\me\npm\test\webpack-test>npx webpack --config webpack.config.js
Hash: c08499ee073ad31cb4ca
Version: webpack 4.34.0
Time: 735ms
Built at: 2019-07-02 6:11:38 PM
                               Asset       Size  Chunks             Chunk Names
index.bundle.1164899ae8ed1f644bec.js   70.4 KiB       0  [emitted]  index
                          index.html  208 bytes          [emitted]
Entrypoint index = index.bundle.1164899ae8ed1f644bec.js
[KQu2] (webpack)/buildin/global.js 472 bytes {0} [built]
[P7h0] (webpack)/buildin/module.js 497 bytes {0} [built]
[tjUo] ./src/index.js 216 bytes {0} [built]
    + 1 hidden module

Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [KQu2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [P7h0] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 2 hidden modules
```

**4. 运行结果**

    图片01.jpg


** 6. 继续深入，使用 ProvidePlugin 插件，导出某个依赖的单独属性**
(1) webpack.config.js 编辑为如下：
```js
// ...
      new webpack.ProvidePlugin({
        lod: 'lodash'
        join: ['lodash', 'join']
      })
//...
```
(2) index.js 编辑为如下：
```js
//...
element.innerHTML = join(['Hello', 'webpack'], ' ');
//...
```

### 第二种方案：使用 `imports-loader` 全局暴露，重写`this`指向

**1. src/index.js**
一些传统的模块依赖的 this 指向的是 `window` 对象。在接下来的用例中，调整我们的 `index.js` ：
```js
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
    this.alert('Hmmm, this probably isn\'t a great idea...')  // edit new +

    return element;
  }

  document.body.appendChild(component());
```
 **2. webpack.config.js**
 当模块运行在 `CommonJS` 环境下，此时的 `this` 指向的是 `module.exports` 。在这个例子中，可以通过使用 `imports-loader` 覆盖 `this`， 在`module.rules`中新增如下：
 ```js
   module: {
     rules: [
       {
         test: require.resolve('index.js'),
         use: 'imports-loader?this=>window'
       }
     ]
   },
   //...
 }
 ```

### 第二种方案：使用 `exports-loader` 全局暴露变量

如果某个库(library)创建出一个全局变量，它期望用户使用这个变量。为此，我们可以在项目配置中，添加一个模块来测试下：

**1. 新建src/global.js** ，可以替换成`jquery`等常用的库
```js
var file = 'blah.txt';
var helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); }
}
```
**2. 编辑webpack.config.js如下**
在这个用例中，我们可以使用 `exports-loader`，将一个全局变量作为一个普通的模块来导出。例如，为了将 `file` 导出为 file 以及将 `helpers.parse` 导出为 `parse`，
 ```js
   module: {
     rules: [
         {
              test: require.resolve('globals.js'),
              use: 'exports-loader?file,parse=helpers.parse'
        }
     ]
   },
   //...
 }
 ```

 ## 使用`polyfills`动态加载多个全局模块






