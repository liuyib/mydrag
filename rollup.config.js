// 告诉 Rollup 如何查找外部模块
import resolve from '@rollup/plugin-node-resolve';
// 将 CommJS 模块转换为 ES6 模块
import commonjs from '@rollup/plugin-commonjs';
// 压缩文件
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/mydrag.js',
  output: [
    {
      file: './dist/mydrag.min.js',
      format: 'umd',
      // 生成 iife / umd 包的名称
      name: 'Mydrag',
      banner: `/*!\n * mydrag.js v1.0.1\n * (c) 2020 liuyib <https://github.com/liuyib>\n * Released under the MIT License.\n */`,
      plugins: [terser()]
    }
  ],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs()
  ]
};
