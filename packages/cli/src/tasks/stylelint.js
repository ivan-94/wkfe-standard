const {
  print,
  STYLE_SUPPORT_EXTENSIONS,
  fileFilter,
  getSafeChangeableFiles,
  execNpmScript,
  stageFiles,
  isInstalled,
} = require('../utils');

/**
 * @type {import("./type").Task}
 * stylelint 检查
 */
async function stylelint(ctx) {
  // 未安装 stylelint 跳过检查
  if (!isInstalled('stylelint')) {
    return;
  }

  const {
    files,
    unstagedFiles,
    fixable,
    config: { stylePatterns, stylelintArgs = '' },
  } = ctx;
  const filtered = fileFilter(files, STYLE_SUPPORT_EXTENSIONS, stylePatterns);
  if (!filtered.length) {
    print('Info', '没有文件需要 stylelint 检查, 跳过');
    return;
  }

  print('Info', '正在执行 stylelint 检查');
  print('Debug', '变动文件: \n' + filtered.map(i => `\t ${i}`).join('\n') + '\n');

  if (!fixable) {
    // 纯 lint
    execNpmScript(`stylelint ${stylelintArgs} ${filtered.join(' ')}`);
    return;
  }

  const { safe, unsafe } = getSafeChangeableFiles(filtered, unstagedFiles);

  if (safe.length) {
    execNpmScript(`stylelint --fix ${stylelintArgs} ${safe.join(' ')}`);
    stageFiles(safe);
  }

  if (unsafe.length) {
    print(
      'Error',
      `下列文件不能被安全地进行 stylelint fix，请完成编辑并 stage(git add) 后重试: \n ${unsafe
        .map(i => `\t ${i}`)
        .join('\n')}\n\n`
    );
    process.exit(1);
  }
}

module.exports = stylelint;
