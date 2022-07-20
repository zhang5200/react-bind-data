import path from 'path';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from '@rollup/plugin-node-resolve';
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from 'rollup-plugin-babel';
// 压缩打包代码
import { terser } from 'rollup-plugin-terser'

import typescript from 'rollup-plugin-typescript2';
// 解决rollup.js无法识别CommonJS模块
import commonjs from 'rollup-plugin-commonjs';

import tslint from "rollup-plugin-tslint";
import stylelint from 'rollup-plugin-stylelint';
// 使rollup可以使用postCss处理样式文件less、css等
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

const paths = {
  input: path.join(__dirname, '/src/index.tsx'),
  output: path.join(__dirname, '/dist'),
};

export default {
  input: paths.input,
  output: [
    // 输出 commonjs 规范的代码
    {
      file: path.join(paths.output, 'index.js'),
      format: 'cjs',
      name: pkg.name,
    },
    // 输出 es 规范的代码
    {
      file: path.join(paths.output, 'index.esm.js'),
      format: 'es',
      name: pkg.name,
    },
  ],
  plugins: [
    stylelint(),
    postcss({
      modules: true, // 增加 css-module 功能
      extensions: ['.less', '.css'], // 处理.css和.less文件
    }),
    tslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**', '*.js', '*.scss', '*.css'],
    }),
    typescript(),
    babel(),
    commonjs({ include: /node_modules/ }),
    resolve(),
    // terser(),
  ],
  external: [
    'react',
    'react-dom',
    'antd',
    'react-color',
    'umi',
    'ahooks',
    'react-highlight-words',
    'lodash',
    'braft-editor',
    'braft-editor/dist/index.css',
    '@ant-design/pro-table',
    '@ant-design/icons',
    'react-split-pane',
    'antd-img-crop',
    'wangeditor-for-react',
    'react-window',
    'rc-resize-observer',
    'rc-table/lib/interface',
    '@uiw/react-baidu-map',
    'react-infinite-scroll-component',
  ],
};
