const { getSupportInfo } = require('prettier');
const { fileFilter, print, stageFiles, getSafeChangeableFiles, execNpmScript } = require('../utils');

/**
 * @type {string[]}
 */
const PRETTIER_SUPPORT_EXTENSIONS = getSupportInfo().languages.reduce(
  // @ts-expect-error
  (prev, language) => prev.concat(language.extensions || []),
  []
);

/**
 * @type {import("./type").Task}
 */
async function pretty(ctx) {
  const {
    files,
    unstagedFiles,
    config: { formatPatterns },
    fixable,
    failed,
  } = ctx;

  if (failed) {
    print('Warn', '上游任务存在错误，跳过 prettier, 请修复错误后重试');
    return;
  }

  if (!fixable) {
    return;
  }

  const filtered = fileFilter(files, PRETTIER_SUPPORT_EXTENSIONS, formatPatterns);
  if (!filtered.length) {
    print('Info', '没有文件支持 prettier 格式化, 跳过');
    return;
  }

  print('Info', '正在执行 prettier 格式化');
  print('Debug', '变动文件: \n' + filtered.map((i) => `\t ${i}`).join('\n') + '\n');
  const { safe, unsafe } = getSafeChangeableFiles(filtered, unstagedFiles);

  if (safe.length) {
    execNpmScript(`prettier --write ${safe.join(' ')}`);
    stageFiles(safe);
  }

  if (unsafe.length) {
    print(
      'Error',
      `下列文件不能被安全地格式化，请完成编辑并 stage(git add) 后重试: \n ${unsafe
        .map((i) => `\t ${i}`)
        .join('\n')}\n\n`
    );
    process.exit(1);
  }
}

module.exports = pretty;
