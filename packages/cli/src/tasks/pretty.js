const { getSupportInfo } = require('prettier')
const { fileFilter, print, stageFiles, getSafeChangeableFiles } = require('../utils')
const execa = require('execa')

/**
 * @type {string[]}
 */
const PRETTIER_SUPPORT_EXTENSIONS = getSupportInfo().languages.reduce(
  // @ts-expect-error
  (prev, language) => prev.concat(language.extensions || []),
  []
)

/**
 * @param {import('./type').Context} ctx
 */
async function pretty(ctx) {
  const {
    files,
    unstagedFiles,
    config: { formatPatterns },
    fixable,
    cwd,
  } = ctx

  if (!fixable) {
    return
  }

  const filtered = fileFilter(files, PRETTIER_SUPPORT_EXTENSIONS, formatPatterns)
  if (!filtered.length) {
    return
  }

  print('Info', '正在执行 prettier 格式化')
  print('Debug', '变动文件: \n' + filtered.map((i) => `\t ${i}`).join('\n') + '\n')
  const { safe, unsafe } = getSafeChangeableFiles(filtered, unstagedFiles)

  if (safe.length) {
    execa.commandSync(`prettier --write ${safe.join(' ')}`, { preferLocal: true, cwd: cwd, stdio: 'inherit' })
    stageFiles(safe)
  }

  if (unsafe.length) {
    print(
      'Error',
      `下列文件不能被安全地格式化，请完成编辑并 stage(git add) 后重试: \n ${unsafe.map((i) => `\t ${i}`).join('\n')}\n\n`
    )
    process.exit(1)
  }
}

module.exports = pretty
