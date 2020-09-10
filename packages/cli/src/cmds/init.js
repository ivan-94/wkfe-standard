const path = require('path')
const fs = require('fs')
const pret = require('prettier')
const {
  Pkg,
  print,
  install,
  NOOP,
  COMMAND_NAME,
  PACKAGE_NAME,
  PRETTIER_CONFIG_NAME,
  toPrettieredJSON,
  getHEADref,
  CONFIGURE_NAME,
} = require('../utils')

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
 *   typescript: Boolean
 *   type: 'react' | 'vue' | 'taro' | 'standard'
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
async function prettier(ctx) {
  print('Info', '正在初始化 prettier')
  const { pkg, cwd } = ctx

  if (pkg.get('prettier') || (await pret.resolveConfigFile(cwd)) != null) {
    print('Info', 'prettier 配置已存在，跳过')
  } else {
    pkg.set('prettier', PRETTIER_CONFIG_NAME)
    const ignoreContent = await fs.promises.readFile(path.join(__dirname, '../templates/.prettierignore'))
    await fs.promises.writeFile(path.join(cwd, '.prettierignore'), ignoreContent)
  }
}

/**
 * stylelint 初始化
 * @param {Context} ctx
 */
async function stylelint(ctx) {
  // TODO:
}

/**
 * stylelint 初始化
 * @param {Context} ctx
 */
async function eslint(ctx) {
  print('Info', '正在初始化 eslint')
  const { pkg, cwd, type, typescript, addDep } = ctx
  const bakPath = path.join(cwd, '.eslintrc.bak')
  const ignorePath = path.join(cwd, '.eslintignore')

  if (pkg.get('eslintConfig')) {
    print('Warn', '已存在 eslint 配置，它们将被拷贝到 .eslintrc.bak, 请手动合并')
    const config = pkg.get('eslintConfig')
    pkg.set('eslintConfig', undefined)
    await fs.promises.writeFile(bakPath, JSON.stringify(config, undefined, 2))
  } else {
    const eslintrcPaths = ['.eslintrc.js', '.eslintrc.json', '.eslintrc']
    const existedConfigFile = eslintrcPaths.find((p) => fs.existsSync(path.join(cwd, p)))
    if (existedConfigFile) {
      print('Warn', '已存在 eslint 配置，它们将被拷贝到 .eslintrc.bak, 请手动合并')
      await fs.promises.rename(path.join(cwd, existedConfigFile), bakPath)
    }
  }

  // 创建配置文件
  if (typescript) {
    print('Info', '使用 Typescript')
  }
  print('Info', `项目类型: ${type}`)
  const config = {
    extends: [typescript ? 'wkts' : 'wk', type !== 'standard' && `wk${type}`].filter(Boolean),
    plugins: [],
    rules: {},
    env: {
      browser: true,
      es2021: true,
    },
  }

  print('Info', '正在创建 .eslintrc.json')
  await fs.promises.writeFile(path.join(cwd, '.eslintrc.json'), toPrettieredJSON(config))

  if (!fs.existsSync(ignorePath)) {
    print('Info', '正在创建 .eslintignore')
    const ignoreContent = await fs.promises.readFile(path.join(__dirname, '../templates/.eslintignore'))
    await fs.promises.writeFile(ignorePath, ignoreContent)
  }

  // 安装依赖
  if (!pkg.hasInstall(PACKAGE_NAME)) {
    addDep({ name: PACKAGE_NAME, dev: true })
  }

  if (!pkg.hasInstall('eslint')) {
    addDep({ name: 'eslint', dev: true })
  }
}

/**
 * 配置文件初始化
 * @param {Context} ctx
 */
async function configuration(ctx) {
  const { configurationPath } = ctx
  print('Info', '正在生成配置文件 ' + CONFIGURE_NAME)
  // 安装依赖
  const config = `{
  // 里程碑，表示从这个提交开始实施代码格式化. 主要用于远程验证，
  // 当CI程序无法获取到 push 的起始 commit 时，就会用 milestone 来计算变动
  "milestone": "${getHEADref()}",
  // 指定哪些文件将被格式化，默认会格式化所有 prettier 支持的文件类型
  // 格式为 glob, 例如 "**/*.*(js|jsx)"、"!(*test).js"
  // 详见 multimatch
  "formatPatterns": [],
  // 指定哪些文件将被 eslint 格式化, 默认会格式化所有 .ts, .tsx, .js, .jsx, .mjs, .vue
  "scriptPatterns": [],
  // 指定哪些文件将被 stylelint 格式化
  "stylePatterns": []
}
`
  await fs.promises.writeFile(configurationPath, config)
}

/**
 * 项目初始化
 * @param {{type?: 'react' | 'vue' | 'taro' | 'standard', typescript?: boolean}} options
 */
async function exec(options) {
  const cwd = process.cwd()
  const pkgPath = path.join(cwd, './package.json')
  const configurationPath = path.join(cwd, CONFIGURE_NAME)

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
  const typescript = options.typescript != null ? options.typescript : fs.existsSync(path.join(cwd, 'tsconfig.json'))
  const type =
    options.type != null
      ? options.type
      : pkg.hasInstall('@tarojs/taro')
      ? 'taro'
      : pkg.hasInstall('react')
      ? 'react'
      : pkg.hasInstall('vue')
      ? 'vue'
      : 'standard'

  /** @type {Context} */
  const ctx = {
    pkg: pkg,
    addDep: (dep) => thingsNeedToInstall.push(dep),
    onFinish: (t) => postTasks.push(t),
    configurationPath,
    cwd,
    typescript,
    type,
  }

  for (const task of tasks) {
    await task(ctx)
  }

  await pkg.write()

  // 安装依赖
  if (thingsNeedToInstall.length) {
    print('Info', '正在安装依赖，这可能需要一点时间')
    await install(thingsNeedToInstall)
  }

  // 触发已完成钩子
  for (const task of postTasks) {
    await task()
  }
}

module.exports = exec
