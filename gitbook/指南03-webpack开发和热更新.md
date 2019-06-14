# webpack常用开发工具模块介绍

## 导读

在`webpack`的构建过程中我们需要用到一些基本构建开发工具来提升我们的工作效率，这些工具有哪些呢？

* `source map` 自动追踪代码错误所在的文件
* `webpack watch` 观察者模式自动编译
* `webpack-dev-server`  指定目录启动本地服务
* `webpack-dev-middleware` 传递文件给服务器

## `source map` 自动追踪代码错误所在的文件

当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。例如，如果将三个源文件（a.js, b.js 和 c.js）打包到一个 bundle（bundle.js）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到 bundle.js。这并通常没有太多帮助，因为你可能需要准确地知道错误来自于哪个源文件。

1. 为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你。

```js
module.exports = {
    //...
    devtool: 'inline-source-map',
    //...
  };
```

2. 现在，让我们来做一些调试，在 project.js 文件中生成一个错误：

```js
export default function printMe() {
  console.error("It's a error.")
}
```

3. 运行`npm run build`, 打印如下：

```shell
D:\me\npm\test\webpack-test>npm run build

> webpack@1.0.0 build D:\me\npm\test\webpack-test
> npx webpack --config webpack.config.js

Hash: e2afc41aa2c58cfd8b32
Version: webpack 4.33.0
Time: 6741ms
Built at: 2019-06-13 16:29:06
            Asset       Size  Chunks                    Chunk Names
    app.bundle.js    968 KiB    0, 1  [emitted]  [big]  app
       index.html  249 bytes          [emitted]
project.bundle.js   7.29 KiB       1  [emitted]         project
Entrypoint app [big] = app.bundle.js
Entrypoint project = project.bundle.js
[0] ./src/project.js 72 bytes {0} {1} [built]
[2] ./src/index.js 440 bytes {0} [built]
[3] (webpack)/buildin/global.js 472 bytes {0} [built]
[4] (webpack)/buildin/module.js 497 bytes {0} [built]
    + 1 hidden module
```

4. 最终显示效果：


## `webpack watch` 观察者模式自动编译

1. 在`package.json`中的**scripts**字段中新增：

```json
"watch": "webpack --watch",
```
2. 执行命令`npm run watch`即可监听自动打包，运行效果如下：



## `webpack-dev-server` 指定目录启动本地服务

1. 在`webpack.config.js`中新增：

```
module.exports = {
   //...
   devServer: {
     contentBase: './dist'
   }
   //...
  };
```
2. 在`package.json`中新增start命令：

```json
    "start": "webpack-dev-server --open", 
```

3. 运行效果如下：




##  `webpack-dev-middleware` 传递文件给服务器

1. 首先，安装 `express` 和 `webpack-dev-middleware`

```shell
cnpm install --save-dev express webpack-dev-middleware
```

2. `webpack.config.js`中新增如下：
```js
 module.exports = {
    //...
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
     publicPath: '/', // 新增
    }
  };
```

3. 在根目录中新建文件`server.js`, 编辑如下：
```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

4. 在`package.json`中新增命令
```json
"server": "node server.js",
```

5. 在终端执行`npm run server`, 效果如下：

