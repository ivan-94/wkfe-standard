// 禁止 namespace
// 禁止未使用变量
namespace Foo {}

// 使用 interface 取代
export type Ixx = {}

// 类型断言
export const xx = <number>dosomthing()


@doc
export class MyClass {
}

export const commaDangle = {
  a: 1,
}

// no shadow
const bar = 1
function foo(bar) {
  if (bar == 1) {
    console.log('hello')
  }
}
