const path = require('path')
const fs = require('fs')
const { Pkg, print, install, NOOP, COMMAND_NAME, PACKAGE_NAME } = require('../utils')

/**
 * @typedef {import('../utils').Dep} Dep
 * @typedef {Pkg} pkg
 * @typedef {(dep: Dep) => void} addDep
 * @typedef {{
 *   pkg: pkg,
 *   addDep: addDep,
 *   onFinish: (cb: () => void) => void
 *   configurationPath: string
 *   cwd: string
 * }} Context
 */

/**
 * @param {Context} ctx
 */
async function pre(ctx) {
  if (ctx.pkg.hasInstall(PACKAGE_NAME) && fs.existsSync(ctx.configurationPath)) {
    print('Warn', '已初始化，不必重复调用')
    process.exit(0)
  }
}

/**
 * husky 初始化
 * @param {Context} ctx
 */
async function husky(ctx) {
  print('Info', '正在初始化 husky')

  const { pkg, addDep, onFinish, cwd } = ctx
  const COMMAND = `${COMMAND_NAME} local-check`

  if (pkg.get('husky')) {
    // 已安装
    const config = /** @type {string | void} */ (pkg.get('husky.hooks["pre-commit"]'))
    if (config) {
      // 可能冲突
      print('Warn', `husky 已存在 pre-commit 配置，你可能需要移除旧的配置`)
      const cmds = config
        .split('&&')
        .map((i) => i.trim())
        .filter(Boolean)
      if (!cmds.includes(COMMAND)) {
        cmds.push(COMMAND)
        pkg.set('husky.hooks["pre-commit"]', cmds.join(' && '))
      }
    } else {
      pkg.set('husky.hooks["pre-commit"]', COMMAND)
    }
  } else {
    addDep({ name: 'husky', dev: true })
    pkg.set('husky.hooks["pre-commit"]', COMMAND)

    onFinish(async () => {
      // 检查 husky 是否安装成功
      const precommitFile = (await fs.promises.readFile(path.join(cwd, '.git/hooks/pre-commit'))).toString()
      if (!precommitFile.includes('husky.sh')) {
        print('Error', `husky 安装失败，可能需要手动安装`)
      }
    })
  }
}

/**
 * prettier 初始化
 * @param {Context} ctx
 */
async function prettier(ctx) {}

/**
 * stylelint 初始化
 * @param {Context} ctx
 */
async function stylelint(ctx) {}

/**
 * stylelint 初始化
 * @param {Context} ctx
 */
async function eslint(ctx) {}

/**
 * 配置文件初始化
 * @param {Context} ctx
 */
async function configuration(ctx) {
  // 安装依赖
}

/**
 * 项目初始化
 * @param {{type: 'react' | 'vue' | 'taro' | 'standard'}} options
 */
async function exec(options) {
  const cwd = process.cwd()
  const pkgPath = path.join(cwd, './package.json')
  const configurationPath = path.join(cwd, '.standard.json')

  if (!fs.existsSync(pkgPath)) {
    print('Error', '未找到 package.json')
    process.exit(1)
  }

  const pkg = new Pkg(pkgPath)
  /** @type {Dep[]} */
  const thingsNeedToInstall = []
  const tasks = [pre, husky, prettier, stylelint, eslint, configuration]
  /** @type {Array<() => void>} */
  const postTasks = []

  /** @type {Context} */
  const ctx = {
    pkg: pkg,
    addDep: (dep) => thingsNeedToInstall.push(dep),
    onFinish: (t) => postTasks.push(t),
    configurationPath,
    cwd,
  }

  for (const task of tasks) {
    await task(ctx)
  }

  await pkg.write()

  // 安装依赖
  print('Info', '正在安装依赖，这可能需要一点时间')
  await install(thingsNeedToInstall)

  // 触发已完成钩子
  for (const task of postTasks) {
    await task()
  }
}

module.exports = exec
