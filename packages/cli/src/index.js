const { Command } = require('commander')
const pkg = require('../package.json')
const init = require('./cmds/init')

const program = new Command()
program.version(pkg.version)

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
  .option('-t --type', '项目类型, 支持 react、vue、taro、standard', 'standard')
  .action((opt) => {
    init({type: opt.type})
  })

/**
 * 本地验证
 */
program.command('local-lint')

/**
 * 远程验证
 */
program.command('remote-lint')
