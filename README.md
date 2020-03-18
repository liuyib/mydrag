<h1 align="center">Mydrag.js</h1>

<p align="center">🐾 拖拽移动设备上的任意元素</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/v/mydrag.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/dt/mydrag.svg?style=flat-square">
  </a>
  <a href="https://codecov.io/gh/liuyib/mydrag" target="_blank" rel="noopener noreferrer">
    <img src="https://codecov.io/gh/liuyib/mydrag/branch/master/graph/badge.svg?style=flat-square" />
  </a>
</p>

[简体中文](https://github.com/liuyib/mydrag/blob/master/README.md) | [English](https://github.com/liuyib/mydrag/blob/master/README_en-US.md)

## :cloud: 安装

使用 npm:

```bash
$ npm install mydrag --save
```

使用 yarn:

```bash
$ yarn add mydrag
```

使用 bower:

```bash
$ bower install liuyib/mydrag --save
```

使用 jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/mydrag/dist/mydrag.min.js"></script>
```

使用 unpkg CDN:

```html
<script src="https://unpkg.com/mydrag/dist/mydrag.min.js"></script>
```

## :package: 用法

- 在 ES6 模块中使用

  HTML

  ```html
  <div id="drag"></div>
  ```

  JavaScript

  ```js
  import Mydrag from 'mydrag';

  // 用例 1（使用 `new`）
  new Mydrag('#drag');

  // 用例 2（无 `new`）
  Mydrag('#drag');

  // 用例 3
  Mydrag('#drag', {
    initX: 100, // 100 px
    initY: 100, // 100 px
  });
  ```

- 在 `<script>` 中使用

  HTML

  ```html
  <script src="https://cdn.jsdelivr.net/npm/mydrag/dist/mydrag.min.js"></script>
  ...
  <div id="drag"></div>
  ```

  JavaScript

  ```js
  // 用例 1（使用 `new`）
  new Mydrag('#drag');

  // 用例 2（无 `new`）
  Mydrag('#drag');

  // 用例 3
  Mydrag('#drag', {
    initX: 100, // 100 px
    initY: 100, // 100 px
  });
  ```

## :memo: 文档

### `Mydrag(selector, options)`

- **selector** (string)：元素的 CSS 选择器 (**必须**)
- **options** (object)
  - **options.adsorb** (boolean)：是否自动吸附边缘（**可选**。默认：`true`）
  - **options.rate** (number)：吸附动画的缓冲速率（**可选**。默认：`5`）
    > 数值越大，缓冲动画的速度减小越慢。
  - **options.initX** (number)：初始 `x` 坐标（**可选**。默认：`0`，单位：`px`）
  - **options.initY** (number)：初始 `y` 坐标（**可选**。默认：`0`，单位：`px`）
  - **options.gap** (number)：元素距离边缘的间隙（**可选**。默认：`10`，单位：`px`）

## :handshake: 开源协议

[MIT](https://github.com/liuyib/mydrag/blob/master/LICENSE) Copyright (c) 2020 [liuyib](https://github.com/liuyib/)
