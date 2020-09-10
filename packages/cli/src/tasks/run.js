const { getConfig, print } = require('../utils')
const { defaultTasks } = require('./tasks')

/**
 * 执行任务
 * @param {boolean} fixable 是否可以进行修复
 * @param {string[]} files
 * @param {string[]} unstagedFiles
 * @param {Array<import('./type').Task>} tasks
 */
async function run(fixable, files, unstagedFiles, tasks = defaultTasks) {
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
      const res = await task(ctx)

      if (res === false) {
        // 如果终止执行 task 有义务输出错误信息
        print('Warn', `${task.name} 终止了执行`)
        failed = true
        break
      }
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
