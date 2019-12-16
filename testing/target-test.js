const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const myBabelPlugin = require('../index');

const testTarget = fs.readFileSync(path.resolve(__dirname, './target.js'), 'utf-8');

const babelResult = babel.transform(testTarget, {
  plugins: [
    [
      myBabelPlugin,
      {
        env: 'dev',
        name: 'testing-babel',
        removeAlert: true,
        removeDebugger: true,
        removeConsole: true,
        debugFn: 'testingFn'
      }
    ]
  ]
});
// 输出文件
fs.writeFileSync(path.resolve(__dirname, './bundle.js'), babelResult.code, 'utf-8')

console.log('after babel transformed >>> \n', babelResult.code);