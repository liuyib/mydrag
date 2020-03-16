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
      name: 'mydrag',
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
