const { Command } = require('commander')
const { pkg } = require('./utils')
const init = require('./cmds/init')
const localCheck = require('./cmds/local-check')

const program = new Command()
program.version(pkg.version)
program.description('WakeData 前端代码规范检查工具')

/**
 * 初始化项目
 * - 安装依赖
 *  - eslint 可能已经存在
 *  - prettier 可能已经存在
 *  - stylelint
 * - 添加命令
 * - 设置里程碑
 * - 添加配置文件
 * - .standard.js
 * - prettierignore
 * - eslintignore
 */
program
  .command('init', {})
  .description('初始化项目')
  .option('--typescript', '项目类型, 是否支持 Typescript, 默认如果存在 tsconfig,json 则开启')
  .option('-t --type', '项目类型, 支持 react、vue、taro、standard, 默认为根据当前项目依赖自动推断')
  .action((opt) => {
    init({ type: opt.type, typescript: opt.typescript })
  })

/**
 * 本地验证
 */
program
  .command('local-check')
  .description('本地 lint 检查, 配合 husky')
  .action(() => {
    localCheck()
  })

/**
 * 远程验证
 */
program.command('remote-check').description('远程 lint 检查，主要用于 CI')

program.parse(process.argv)
