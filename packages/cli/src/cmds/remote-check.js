const { run } = require('../tasks');
const { print, getChangedFiles, getAllCachedFiles, getHEADref, getConfig, commitNewerThan } = require('../utils');

/**
 * @param {string} head
 * @param {...any} refs
 */
function pickAvailableRef(head, ...refs) {
  for (const ref of refs) {
    if (ref != null && ref !== '' && !ref.startsWith('00000') && ref !== head) {
      return ref;
    }
  }
  return null;
}

/**
 * 远程代码检查
 */
async function exec() {
  const config = await getConfig();
  const head = process.env.gitlabAfter || process.env.GIT_COMMIT || getHEADref();
  if (!head) {
    print('Error', '无法获取当前提交(HEAD)，该仓库可能为空仓库');
    process.exit(1);
  }

  // from [gitlab-plugin](https://github.com/jenkinsci/gitlab-plugin#defined-variables)
  // from jenkins ENV
  let prevCommit = pickAvailableRef(head, process.env.gitlabBefore, process.env.GIT_PREVIOUS_COMMIT, config.milestone);

  // config.milestone 可能新于 gitlabBefore
  if (prevCommit && config.milestone && prevCommit !== config.milestone) {
    // 检查 milestone 是否新于 gitlabBefore
    if (commitNewerThan(config.milestone, prevCommit)) {
      print('Debug', 'milestone 新于 push commit, 将基于 milestone 进行比较');
      prevCommit = config.milestone;
    }
  }

  const fullCheck = prevCommit == null;
  const nocheck = head === config.milestone || head === prevCommit;
  const changed = nocheck ? [] : fullCheck ? getAllCachedFiles() : getChangedFiles(prevCommit);

  if (nocheck) {
    print('Warn', `HEAD(${head}) 为 milestone, 跳过`);
    process.exit(0);
  } else if (fullCheck) {
    print('Warn', '未找到比对的起始点，将进行全量检查');
  } else {
    print('Info', `将检查 HEAD(${head}) -> ${prevCommit} 之间变动的文件`);
  }

  await run(false, changed, []);
}

module.exports = exec;
