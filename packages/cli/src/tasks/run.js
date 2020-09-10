const { getConfig, print } = require('../utils')
const pretty = require('./pretty')
const eslint = require('./eslint')
const stylelint = require('./stylelint')

/**
 * 执行任务
 * @param {boolean} fixable 是否可以进行修复
 * @param {string[]} files
 * @param {string[]} unstagedFiles
 * @param {Array<(ctx: import('./type').Context) => Promise<void>>} tasks
 */
async function run(fixable, files, unstagedFiles, tasks = [eslint, stylelint, pretty]) {
  const config = await getConfig()
  const ctx = {
    config,
    files,
    unstagedFiles,
    cwd: process.cwd(),
    fixable,
  }

  let failed = false
  for (const task of tasks) {
    try {
      await task(ctx)
    } catch (err) {
      print('Error', `${task.name} 执行失败`, err.message)
      failed = true
    } finally {
      console.log('\n')
    }
  }

  if (failed) {
    process.exit(2)
  }
}

module.exports = run
