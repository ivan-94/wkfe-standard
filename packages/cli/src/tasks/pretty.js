const { getSupportInfo } = require('prettier')
const { fileFilter, print, stageFiles } = require('../utils')
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
    cwd,
  } = ctx
  const filtered = fileFilter(files, PRETTIER_SUPPORT_EXTENSIONS, formatPatterns)
  if (!filtered.length) {
    return
  }

  print('Info', '正在执行 prettier 格式化')
  print('Debug', '变动文件: \n' + filtered.map((i) => `\t ${i}`).join('\n') + '\n')
  /** @type {string[]} */
  const safeFiles = []
  /** @type {string[]} */
  const dangerousFiles = []
  for (const file of filtered) {
    if (unstagedFiles.includes(file)) {
      dangerousFiles.push(file)
    } else {
      safeFiles.push(file)
    }
  }

  if (safeFiles.length) {
    execa.commandSync(`prettier --write ${safeFiles.join(' ')}`, { preferLocal: true, cwd: cwd, stdio: 'inherit' })
    stageFiles(safeFiles)
  }

  if (dangerousFiles.length) {
    print(
      'Error',
      `下列文件不能被安全地格式化，请完成编辑 stage 后重试: \n ${dangerousFiles.map((i) => `\t ${i}`).join('\n')}\n\n`
    )
    process.exit(1)
  }
}

module.exports = pretty
