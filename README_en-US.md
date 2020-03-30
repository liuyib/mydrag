<h1 align="center">Mydrag.js</h1>

<p align="center">🐾 Drag any element on mobile device</p>

<p align="center">
  <a href="https://travis-ci.com/github/liuyib/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="Travis CI" src="https://img.shields.io/travis/com/liuyib/mydrag">
  </a>
  <a href="https://codecov.io/gh/liuyib/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="Codecov" src="https://img.shields.io/codecov/c/github/liuyib/mydrag">
  </a>
  <a href="https://www.npmjs.com/package/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/dt/mydrag">
  </a>
  <a href="https://www.npmjs.com/package/mydrag" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/v/mydrag">
  </a>
  <a href="https://github.com/liuyib/mydrag/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/license/liuyib/mydrag" />
  </a>
</p>

[简体中文](https://github.com/liuyib/mydrag/blob/master/README.md) | [English](https://github.com/liuyib/mydrag/blob/master/README_en-US.md)

## :cloud: Installation

Using npm:

```bash
$ npm install mydrag --save
```

Using yarn:

```bash
$ yarn add mydrag
```

Using bower:

```bash
$ bower install liuyib/mydrag --save
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/mydrag/dist/mydrag.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/mydrag/dist/mydrag.min.js"></script>
```

## :package: Usage

Firstly, Introducing `mydrag.js`:

```js
import Mydrag from 'mydrag';      // ES6
// 或
const Mydrag = require('Mydrag'); // CommonJS
// 或
<script src="https://cdn.jsdelivr.net/npm/mydrag/dist/mydrag.min.js"></script>
// 或
<script src="https://unpkg.com/mydrag/dist/mydrag.min.js"></script>
```

Secondly, Prepare an element:

```html
<div id="drag"></div>
```

Finally, use:

```js
// Use case 1 (With new)
new Mydrag('#drag');

// Use case 2 (No new)
Mydrag('#drag');

// Use case 3 (Width parameters)
Mydrag('#drag', {
  initX: 100, // 100 px
  initY: 100 // 100 px
});
```

## :memo: Documentation

### `Mydrag(selector, options)`

- **selector** (string): The CSS selector of element (**Must**)
- **options** (object)
  - **options.adsorb** (boolean): Whether to absorb edges (**Optional**. Default: `true`)
  - **options.rate** (number): Buffer rate of adsorption animation (**Optional**. Default: `5`)
    > The larger the value is, the slower the speed drops.
  - **options.initX** (number): Initial `x` coordinate (**Optional**. Default: `0`, unit: `px`)
  - **options.initY** (number): Initial `y` coordinate (**Optional**. Default: `0`, unit: `px`)
  - **options.gap** (number): The gap between element and edges (**Optional**. Default: `10`, unit: `px`)

## :handshake: License

[MIT](https://github.com/liuyib/mydrag/blob/master/LICENSE) Copyright (c) 2020 [liuyib](https://github.com/liuyib/)
