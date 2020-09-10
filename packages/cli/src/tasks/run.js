const { getConfig, print } = require('../utils')

/**
 * 执行任务
 * @param {string[]} files
 * @param {Array<(ctx: import('./type').Context) => Promise<void>>} tasks
 */
async function run(files, tasks) {
  const config = await getConfig()
  const ctx = {
    config,
    files,
    cwd: process.cwd(),
  }

  let failed = false
  for (const task of tasks) {
    try {
      await task(ctx)
    } catch (err) {
      print('Error', `${task.name} 执行失败`, err)
      failed = true
    }
  }

  if (failed) {
    process.exit(2)
  }
}

module.exports = run
