# minjq

简易版 jQuery 实现，提供基础的 DOM 选择与操作方法。项目参考并受 finom/tsimmes（MIT）启发。

安装

npm:

```
npm install minjq
```

使用示例（浏览器）

```html
<script src="./minjq.js"></script>
<script>
  $.ready(function(){
    console.log('DOM ready');
    $('.item').addClass('active');
  });
</script>
```

使用示例（打包工具/模块）

```js
// bundler 会把文件打包到浏览器环境中
import './minjq.js';
// 或者在 CommonJS 环境中
const $ = require('minjq');
```

# 压缩版

- 已提供压缩文件： [minjq.min.js](minjq.min.js)。

构建（在项目根目录执行）

```bash
npm install
npm run build
```

`npm run build` 将使用 `terser` 生成 `minjq.min.js`（也可直接使用仓库中已包含的压缩文件）。

# 发布

发布到 npm

1. 登录 npm：`npm login`
2. 确认 `package.json` 中的 `name`（如需改更改名称）
3. 发布：

```
npm publish --access public
```

# 许可证

本项目采用 MIT 许可（详见 LICENSE）。

## 快速开始

在浏览器中直接使用：

```html
<script src="./minjq.js"></script>
<script>
  $.ready(function(){
    // 选择元素并链式调用
    $('.item').addClass('active').css({color: 'blue'});
  });
</script>
```

示例文件位于 `example/index.html` 与 `example/app.js`，打开 `example/index.html` 即可在浏览器中查看交互示例。

## 生成 API 文档

代码中已包含 JSDoc 风格注释。可使用 `documentation` 生成文档：

安装依赖并生成 Markdown：

```bash
npm install
npm run docs:md
```

或生成 HTML：

```bash
npm run docs:html
```

生成结果会输出到 `docs/` 目录下。