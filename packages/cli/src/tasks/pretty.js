const { getSupportInfo } = require('prettier')
const { fileFilter, print } = require('../utils')
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
  const files = fileFilter(ctx.files, PRETTIER_SUPPORT_EXTENSIONS, ctx.config.formatPatterns)
  if (!files.length) {
    return
  }

  print('Info', '正在执行 prettier 格式化')
  print('Debug', '变动文件: \n' + files.map((i) => `\t ${i}`).join('\n') + '\n')
  execa.sync('prettier', ['--write'].concat(files), { cwd: ctx.cwd })
}

module.exports = pretty
