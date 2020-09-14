const { isGitRepo, print } = require('../utils');

/**
 * @type {import("./type").Task}
 */
async function pre(ctx) {
  if (!isGitRepo(ctx.cwd)) {
    print('Error', '必须为 git 项目');
    return false;
  }
}

module.exports = pre;
