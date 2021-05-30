const { run } = require('../tasks');
const { print, getRef, getChangedFiles } = require('../utils');

/**
 * Gerrit 远程代码检查，指针对当前提交变动的文件
 */
async function exec() {
  // HEAD^ 可能不存在，比如项目只有一个提交时
  // 4b825dc642cb6eb9a060e54bf8d69288fbee4904 是一个神奇的东西，来源于 https://stackoverflow.com/questions/40883798/how-to-get-git-diff-of-the-first-commit
  const start = getRef('HEAD^') ? 'HEAD^' : '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
  const changeds = getChangedFiles(start);
  print('Info', '正在进行 Gerrit 代码规范检查');
  print('Info', '变动文件:\n\n', ...changeds.map(i => `\t ${i}\n`));
  await run({ fixable: false, files: changeds, unstagedFiles: [] });
}

module.exports = exec;
