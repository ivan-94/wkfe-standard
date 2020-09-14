import pkg from './package.json'
import module1 from './module1.js'
import module2 from './module2.tsx'
import module3 from './module3.vue'
import module4 from './module4/index'
import theme from 'style!css!./theme.css';
// 相对路径不要超过三层
import toDeep from '../../../parent/path'
import express from 'express'
import './module1.css'


// 不允许使用 ==
if (process.env.NODE_ENV == 'development') {
  console.log('in development');
}

// 未使用变量
const a = {};

[].map(() => {});

// no-empty-function
function foo() {
}

// no-empty
if (window.navigator) {
}

// no-lone-block
{
  console.log('lone block')
}

export function bar(params) {
  // no-shadow var
  return (params) => {
    console.log(params)
  }
}

debugger


// Error 没有被处理
run(function (err) {
  window.alert('done');
});

export @dec class MyClass {
}

// 代码格式化遵循 prettier
export default {};
