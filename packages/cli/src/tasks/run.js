const { getConfig, print, getConfigPath } = require('../utils');
const { defaultTasks } = require('./tasks');

/**
 * 执行任务
 * @param {{
 *   fixable: boolean
 *   files: string[],
 *   unstagedFiles: string[], // 未提交的文件
 *   ignoreFailed?: boolean   // 是否忽略上游错误
 *   tasks?: Array<import('./type').Task>
 * }} param
 */
async function run({ fixable, files, unstagedFiles, ignoreFailed, tasks = defaultTasks }) {
  try {
    const cwd = process.cwd();
    const configPath = getConfigPath(cwd);
    const config = await getConfig();
    const ctx = {
      config,
      files,
      unstagedFiles,
      cwd,
      configPath,
      fixable,
      ignoreFailed,
      failed: false,
    };

    for (const task of tasks) {
      try {
        const res = await task(ctx);

        if (res === false) {
          // 如果终止执行 task 有义务输出错误信息
          print('Warn', `${task.name} 终止了执行`);
          ctx.failed = true;
          break;
        }
      } catch (err) {
        print('Error', `${task.name} 执行失败`, err.message);
        ctx.failed = true;
      }
    }

    if (ctx.failed) {
      process.exit(2);
    }
  } catch (err) {
    print('Error', err.message);
    process.exit(3);
  }
}

module.exports = run;
