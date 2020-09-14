const {
  print,
  SCRIPT_SUPPORT_EXTENSIONS,
  fileFilter,
  getSafeChangeableFiles,
  execNpmScript,
  stageFiles,
} = require('../utils');

/**
 * eslint 检查
 * @type {import("./type").Task}
 */
async function eslint(ctx) {
  const {
    files,
    unstagedFiles,
    fixable,
    cwd,
    config: { scriptPatterns },
  } = ctx;
  const filtered = fileFilter(files, SCRIPT_SUPPORT_EXTENSIONS, scriptPatterns);
  if (!filtered.length) {
    print('Info', '没有文件需要 eslint 检查, 跳过');
    return;
  }

  print('Info', '正在执行 eslint 检查');
  print('Debug', '变动文件: \n' + filtered.map((i) => `\t ${i}`).join('\n') + '\n');

  if (!fixable) {
    // 纯 lint
    execNpmScript(`eslint ${filtered.join(' ')}`);
    return;
  }

  const { safe, unsafe } = getSafeChangeableFiles(filtered, unstagedFiles);

  if (safe.length) {
    execNpmScript(`eslint --fix --fix-type problem,suggestion ${safe.join(' ')}`);
    stageFiles(safe);
  }

  if (unsafe.length) {
    print(
      'Error',
      `下列文件不能被安全地进行 eslint fix，请完成编辑并 stage(git add) 后重试: \n ${unsafe
        .map((i) => `\t ${i}`)
        .join('\n')}\n\n`
    );
    process.exit(1);
  }
}

module.exports = eslint;
