import {Text} from '@tarojs/components'
// no-unused-vars
const i = 0

/**
 * 测试：JSX或JS 文件，JSX 元素已使用会误报未使用
 */
export default () => {
  return <View>hello, <Text></Text></View>
}
