// 不允许使用 ==
if (process.env.NODE_ENV == 'development') {
  console.log('in development');
}

// 未使用变量
const a = {};

[].map(() => {});


// Error 没有被处理
run(function (err) {
  window.alert('done');
});

// 代码格式化遵循 prettier
export default {};
