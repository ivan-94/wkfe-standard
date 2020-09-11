const fs = require('fs')
const path = require('path')
const get = require('lodash/get')
const set = require('lodash/set')
const json5 = require('json5')
const execa = require('execa')
const chalk = require('chalk')
const ch = require('child_process')
const multimatch = require('multimatch')
const babel = require('@babel/core')
const babelGenerate = require('@babel/generator')
const pkg = require('../package.json')

/**
 * @typedef {{name: string, version?: string, dev: boolean}} Dep
 * @typedef {{
 *   milestone: string,
 *   milestoneAutoUpdate: boolean
 *   formatPatterns?: string | string[]
 *   scriptPatterns?: string | string[]
 *   stylePatterns?: string | string[]
 * }} Config
 */

const UseYarn = fs.existsSync('yarn.lock')
const COMMAND_NAME = 'wkstd'
const PACKAGE_NAME = pkg.name
const PRETTIER_CONFIG_NAME = 'prettier-config-wk'
const CONFIGURE_NAME = '.standard.jsonc'
const SCRIPT_SUPPORT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.vue']
const STYLE_SUPPORT_EXTENSIONS = ['.css', '.scss', '.sass', '.less', '.stylus']

const NOOP = () => {}

/**
 * package.json 读写
 */
class Pkg {
  /**
   * @param {string} path
   */
  constructor(path) {
    this.path = path
    this.obj = require(path)
    this.dirty = false
  }
  /**
   * 字段获取
   * @param {string} path
   */
  get(path) {
    return get(this.obj, path)
  }

  /**
   * @param {string} path
   * @param {any} value
   */
  set(path, value) {
    set(this.obj, path, value)
    this.dirty = true
  }

  /**
   * 判断依赖是否安装
   * @param {string} name
   */
  hasInstall(name) {
    const dep = this.obj.dependencies
    const devDep = this.obj.devDependencies
    if (dep && name in dep) {
      return true
    }
    if (devDep && name in devDep) {
      return true
    }

    return false
  }

  async write() {
    if (!this.dirty) {
      return
    }
    await fs.promises.writeFile(this.path, toPrettieredJSON(this.obj))
  }
}

/**
 * @param {object} obj
 */
function toPrettieredJSON(obj) {
  return JSON.stringify(obj, undefined, 2)
}

/**
 * @param {string} str
 */
function getLines(str) {
  return str
    .split('\n')
    .map((i) => i.trim())
    .filter(Boolean)
}

/**
 * 是否为 git 仓库
 * @param {string} [cwd]
 */
function isGitRepo(cwd) {
  return fs.existsSync(path.join(cwd || process.cwd(), '.git'))
}

/**
 * @param {string} commit
 */
function getChangedFiles(commit) {
  const str = execCommand(`git diff --name-only ${commit}`).toString()
  return getLines(str)
}

function getStagedFiles() {
  const str = execCommand(`git diff --name-only --cached`).toString()
  return getLines(str)
}

/**
 * 获取所有未提交的文件
 */
function getUnstagedFiles() {
  const trackeds = execCommand(`git diff --name-only`).toString()
  const untrackeds = execCommand(`git ls-files --others --exclude-standard`).toString()
  return getLines(trackeds).concat(getLines(untrackeds))
}

/**
 * 比对两个 commit 的新旧
 * @param {string} a
 * @param {string} b
 * @returns {boolean} a 比 b 新
 */
function commitNewerThan(a, b) {
  if (a === b) {
    return false
  }

  const str = execCommand(`git diff --name-only "${a}"..."${b}"`).toString()
  return !getLines(str).length
}

/**
 * 获取所有已提交到仓库的文件
 */
function getAllCachedFiles() {
  const str = execCommand('git ls-files --exclude-standard --cached').toString()
  return getLines(str)
}

function getHEADref() {
  return getRef('HEAD')
}

/**
 * 获取指定点的 revision
 * @param {string} point
 */
function getRef(point) {
  try {
    return execCommand(`git rev-parse ${point}`, { printCommand: true }).toString().trim()
  } catch (err) {
    return ''
  }
}

/**
 * @param {string[]} files
 */
function stageFiles(files) {
  execCommand(`git add ${files.join(' ')}`, { printCommand: false })
}

/**
 * 获取可以安全编辑的文件
 * @param {string[]} stageds
 * @param {string[]} unstageds
 */
function getSafeChangeableFiles(stageds, unstageds) {
  /** @type {string[]} */
  const safe = []
  /** @type {string[]} */
  const unsafe = []
  for (const file of stageds) {
    if (unstageds.includes(file)) {
      unsafe.push(file)
    } else {
      safe.push(file)
    }
  }
  return {
    safe,
    unsafe,
  }
}

const printPrefix = {
  Success: '✅ ',
  Error: chalk.red('❌ 错误'),
  Warn: chalk.yellow('⚠️ 警告'),
  Info: 'ℹ️',
  Debug: '💻',
}
/**
 * @param {'Error' | 'Warn' | 'Info' | 'Debug' | 'Success'} level
 * @param  {...any} args
 */
function print(level, ...args) {
  const fn = level === 'Error' ? console.error : level == 'Warn' ? console.warn : console.log
  fn.call(console, printPrefix[level], ...args)
}

/**
 *
 * @param {string} command
 * @param {{cwd?: string, printCommand?: boolean}} options
 */
function execCommand(command, options = {}) {
  const finalOptions = {
    cwd: process.cwd(),
    printCommand: true,
    ...options,
  }

  if (finalOptions.printCommand) {
    print('Debug', `$ ${command}`)
  }

  const output = ch.execSync(command, {
    cwd: finalOptions.cwd,
    stdio: ['inherit', 'pipe', 'inherit'],
  })

  if (finalOptions.printCommand) {
    console.log('\n' + output)
  }

  return output
}

/**
 * @param {string} command
 * @param {{cwd?: string}} options
 */
function execNpmScript(command, options = {}) {
  print('Debug', command)
  return execa.commandSync(command, { preferLocal: true, cwd: options.cwd || process.cwd(), stdio: 'inherit' })
}

/**
 * 安装依赖
 * @param {Dep[]} deps
 */
function install(deps) {
  /** @type {Dep[]} */
  const dep = []
  /** @type {Dep[]} */
  const devDep = []
  deps.forEach((i) => (i.dev ? devDep.push(i) : dep.push(i)))

  /**
   * @param {Dep[]} list
   * @param {boolean} dev
   */
  const toCommand = (list, dev) => {
    const pkgs = list.map((i) => (i.version ? `${i.name}@${i.version}` : i.name)).join(' ')
    return UseYarn ? `yarn add ${pkgs} ${dev ? '-D' : ''}` : `npm install ${pkgs} ${dev ? '--save-dev' : '--save'}`
  }

  if (devDep.length) {
    execCommand(toCommand(devDep, true), { printCommand: true })
  }

  if (dep.length) {
    execCommand(toCommand(dep, true), { printCommand: true })
  }
}

/**
 * 扩展名过滤器
 * @param {string[]} extensions
 * @returns {(file: string) => boolean}
 */
const filterByExtensions = (extensions) => (file) => extensions.some((ext) => file.endsWith(ext))

/**
 * 模式过滤器
 * @param {string | string[]} pattern
 * @returns {(file: string) => boolean}
 */
const filterByPattern = (pattern) => {
  // Match everything if no pattern was given
  if ((typeof pattern !== 'string' && !Array.isArray(pattern)) || (Array.isArray(pattern) && pattern.length === 0)) {
    return () => true
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  return (file) => multimatch(path.normalize(file), patterns, { dot: true }).length > 0
}

/**
 * 文件过滤
 * @param {string[]} files
 * @param {string[]} extensions
 * @param {string | string[] | undefined} pattern
 * @returns {string[]}
 */
function fileFilter(files, extensions, pattern) {
  if (extensions && extensions.length) {
    const filter = filterByExtensions(extensions)
    files = files.filter(filter)
  }

  if (pattern != null) {
    const filter = filterByPattern(pattern)
    files = files.filter(filter)
  }

  return files
}

function getConfigPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIGURE_NAME)
}

/**
 * @param {string} [cwd]
 * @returns {Promise<Config>}
 */
async function getConfig(cwd = process.cwd()) {
  const p = getConfigPath(cwd)
  if (!fs.existsSync(p)) {
    throw new Error(`未找到配置文件(${CONFIGURE_NAME})`)
  }

  try {
    const content = (await fs.promises.readFile(p)).toString()
    return /** @type {Config} */ (json5.parse(content))
  } catch (err) {
    throw new Error(`配置文件(${CONFIGURE_NAME})读取失败: ${err.message}`)
  }
}

/**
 * 更新配置文件
 * @param {string} key
 * @param {any} value
 */
async function updateConfig(key, value, cwd = process.cwd()) {
  const p = path.join(cwd, CONFIGURE_NAME)
  if (!fs.existsSync(p)) {
    throw new Error(`未找到配置文件(${CONFIGURE_NAME})`)
  }

  const content = (await fs.promises.readFile(p)).toString()
  const res = await babel.parseAsync(`c=${content}`)

  // 使用 babel 来解析 JSON 并保留注释
  if (res) {
    const { types: t } = babel
    // @ts-expect-error
    const valueAst = babel.template.ast(JSON.stringify(value)).expression
    let found = false

    babel.traverse(res, {
      ObjectExpression: {
        exit(path) {
          if (!found) {
            path.node.properties.push(t.objectProperty(t.stringLiteral(key), valueAst))
          }
        },
      },
      ObjectProperty(path) {
        const node = path.node
        if (t.isStringLiteral(node.key) && node.key.value === key) {
          found = true
          node.value = valueAst
        }
      },
    })

    const newcode = babelGenerate.default(res).code
    const newContent = newcode.slice(newcode.indexOf('{'), newcode.endsWith(';') ? -1 : undefined)
    await fs.promises.writeFile(p, newContent)
  } else {
    throw new Error('配置文件解析失败')
  }
}

module.exports = {
  UseYarn,
  isGitRepo,
  getChangedFiles,
  getStagedFiles,
  getUnstagedFiles,
  getAllCachedFiles,
  stageFiles,
  getHEADref,
  getRef,
  getSafeChangeableFiles,
  commitNewerThan,
  print,
  execCommand,
  execNpmScript,
  toPrettieredJSON,
  Pkg,
  install,
  NOOP,
  filterByExtensions,
  filterByPattern,
  fileFilter,
  getConfigPath,
  getConfig,
  updateConfig,
  COMMAND_NAME,
  PACKAGE_NAME,
  PRETTIER_CONFIG_NAME,
  CONFIGURE_NAME,
  SCRIPT_SUPPORT_EXTENSIONS,
  STYLE_SUPPORT_EXTENSIONS,
  pkg,
}
