const { getHEADref, getRef, print, updateConfig, stageFiles } = require('../utils');

/**
 * @type {import("./type").Task}
 */
async function post(ctx) {
  const {
    failed,
    fixable,
    files,
    config: { milestoneAutoUpdate, milestone },
    configPath,
    cwd,
  } = ctx;

  if (fixable && !failed && milestoneAutoUpdate && files.length) {
    // update milestone
    const head = getHEADref();
    const beforeHead = getRef('"HEAD^1"');

    // milestone 为空 或者 为上一个提交
    if (head && (!milestone || (beforeHead && beforeHead !== head && milestone === beforeHead))) {
      print('Info', `正在更新 milestone 为 ${head}`);
      await updateConfig('milestone', head, cwd);
      stageFiles([configPath]);
    }
  }
}

module.exports = post;
