# webpack热更新案例操作
===
## 导读

模块热替换(Hot Module Replacement 或 HMR)， 也叫热更新，它是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行浏览器刷新或者命令行重启。
**注意**：热更新 `HMR`只能在开发环境使用，不适用于生产环境

## 使用`webpack.config.js`启用 `HMR`

启用该功能实际上相当简单。而我们要做的，就是更新 `webpack-dev-server` 的配置，和使用 `webpack` 内置的 `HMR` 插件。我们还要删除掉 `project.js `的入口起点，因为它现在正被 index.js 模块使用。

** 1. webpack.config.js ** 

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require("webpack")

module.exports = {
  entry: {
    app: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer:{   // 新增 devServer
    contentBase: './dist',
    hot: true 
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'output出口管理'
    }),
    new webpack.NamedModulesPlugin(),   // 新增引入webpack默认方法 NamedModulesPlugin()
    new webpack.HotModuleReplacementPlugin(),   // 新增引入webpack默认方法 HotModuleReplacementPlugin()
  ]
};

```

**2. 我们使用`npm run start` 来执行命令`webpack-dev-server --open`** 

**3. 编辑`index.js`如下：**

```js
// 在最底下新增如下
if (module.hot) {
   module.hot.accept('./project.js', function() {
    console.log('Accepting the updated printMe module!');
     printMe();
   })
 }
```

**4. 修改`print.js`如下：**
```js
export default function printMe() {
  console.log(' 我会打印这条信息…')
}
```

**5. 命令行打印**

```shell
D:\me\npm\test\webpack-test>npm run start

> webpack@1.0.0 start D:\me\npm\test\webpack-test
> webpack-dev-server --open

i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from ./dist
i ｢wdm｣: Hash: d067c0aaf40790e7daa9
Version: webpack 4.34.0
Time: 4304ms
Built at: 2019-06-14 13:31:15
        Asset       Size  Chunks             Chunk Names
app.bundle.js   2.35 MiB     app  [emitted]  app
   index.html  186 bytes          [emitted]
Entrypoint app = app.bundle.js
[0] multi ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client?http://localhost (webpack)/hot/dev-server.js ./src/index.js 52 bytes {app} [built]
[./node_modules/_lodash@4.17.11@lodash/lodash.js] 527 KiB {app} [built]
[./node_modules/_strip-ansi@3.0.1@strip-ansi/index.js] 161 bytes {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/index.js?http://localhost] ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client?http://localhost 4.29 KiB {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/overlay.js] 3.59 KiB {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/socket.js] 1.04 KiB {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/createSocketUrl.js] 2.77 KiB {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/log.js] 964 bytes {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/reloadApp.js] 1.63 KiB {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/sendMessage.js] 402 bytes {app} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/node_modules/webpack/hot sync ^\.\/log$] ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/node_modules/webpack/hot sync nonrecursive ^\.\/log$ 170 bytes {app} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/dev-server.js] (webpack)/hot/dev-server.js 1.59 KiB {app} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/emitter.js] (webpack)/hot/emitter.js 75 bytes {app} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/log-apply-result.js] (webpack)/hot/log-apply-result.js 1.27 KiB {app} [built]
[./src/index.js] 569 bytes {app} [built]
    + 22 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/default_index.ejs] 392 bytes {0} [built]
    [./node_modules/_lodash@4.17.11@lodash/lodash.js] 527 KiB {0} [built]
    [./node_modules/_webpack@4.34.0@webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/_webpack@4.34.0@webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
i ｢wdm｣: Compiled successfully.
i ｢wdm｣: Compiling...
i ｢wdm｣: Hash: bf9c06a7b4db9c196a79
Version: webpack 4.34.0
Time: 862ms
Built at: 2019-06-14 13:34:20
                                 Asset       Size    Chunks             Chunk Names
  2f0d904b401aa66d24b4.hot-update.json   44 bytes            [emitted]
                         app.bundle.js   2.35 MiB       app  [emitted]  app
app.d067c0aaf40790e7daa9.hot-update.js  939 bytes  app, app  [emitted]  app, app
  d067c0aaf40790e7daa9.hot-update.json   45 bytes            [emitted]
                            index.html  186 bytes            [emitted]
Entrypoint app = app.bundle.js app.d067c0aaf40790e7daa9.hot-update.js app.d067c0aaf40790e7daa9.hot-update.js
[./src/project.js] 68 bytes {app} [built]
    + 36 hidden modules
Child html-webpack-plugin for "index.html":
                                   Asset      Size  Chunks             Chunk Names
    2f0d904b401aa66d24b4.hot-update.json  44 bytes          [emitted]
     + 1 hidden asset
    Entrypoint undefined = index.html
       4 modules
i ｢wdm｣: Compiled successfully.
```

## 使用`dev-server.js`启用 `HMR`

当使用 `webpack dev serve`r 和 `Node.js API` 时，不要将 `dev server` 选项放在 webpack 配置对象(webpack config object)中。而是，在创建选项时，将其作为第二个参数传递。例如：

`new WebpackDevServer(compiler, options)`

接下来实现一个编辑js，css文件后热更新的案例：

**1.在根目录下新建`dev-server.js`，并且编辑如下**
```js

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```
**2. webpack.config.js**

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require("webpack")

module.exports = {
  entry: {
    app: './src/index.js',
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'output出口管理'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
```

**3. 根目录命令行执行`node dev-server.js`,打印如下:**
```js
D:\me\npm\test\webpack-test>node dev-server.js
i ｢wds｣: Project is running at http://localhost:5000/
i ｢wds｣: webpack output is served from undefined
i ｢wds｣: Content not from webpack is served from ./dist
dev server listening on port 5000
i ｢wdm｣: wait until bundle finished: /
‼ ｢wdm｣: Hash: 2790f4ffdbd61bc7ac3c
Version: webpack 4.33.0
Time: 17774ms
Built at: 2019-06-14 13:42:52
        Asset       Size  Chunks                    Chunk Names
app.bundle.js   1.81 MiB       0  [emitted]  [big]  app
   index.html  186 bytes          [emitted]
Entrypoint app [big] = app.bundle.js
[0] multi ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client?http://localhost ./node_modules/_webpack@4.34.0@webpack/hot/dev-server.js ./src/index.js 52 bytes {0} [built]
[./node_modules/_lodash@4.17.11@lodash/lodash.js] 527 KiB {0} [built]
[./node_modules/_strip-ansi@3.0.1@strip-ansi/index.js] 161 bytes {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/index.js?http://localhost] ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client?http://localhost 4.29 KiB {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/overlay.js] 3.59 KiB {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/socket.js] 1.04 KiB {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/createSocketUrl.js] 2.77 KiB {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/log.js] 964 bytes {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/reloadApp.js] 1.63 KiB {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/client/utils/sendMessage.js] 402 bytes {0} [built]
[./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/node_modules/webpack/hot sync ^\.\/log$] ./node_modules/_webpack-dev-server@3.7.1@webpack-dev-server/node_modules/webpack/hot sync nonrecursive ^\.\/log$ 170 bytes {0} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/dev-server.js] 1.59 KiB {0} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/emitter.js] 75 bytes {0} [built]
[./node_modules/_webpack@4.34.0@webpack/hot/log-apply-result.js] 1.27 KiB {0} [built]
[./src/index.js] 574 bytes {0} [built]
    + 22 hidden modules
```

**4. 执行效果如下:**
