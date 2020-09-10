const fs = require('fs')
const get = require('lodash/get')
const set = require('lodash/set')
const chalk = require('chalk')
const ch = require('child_process')
const prettier = require('prettier')
const pkg = require('../package.json')

/**
 * @typedef {{name: string, version?: string, dev: boolean}} Dep
 */

const UseYarn = fs.existsSync('yarn.lock')
const COMMAND_NAME = 'wkstd'
const PACKAGE_NAME = pkg.name
const PRETTIER_CONFIG_NAME = 'prettier-config-wk'

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
    const str = JSON.stringify(this.obj)
    const prettied = prettier.format(str, { parser: 'json' })
    await fs.promises.writeFile(this.path, prettied)
  }
}

/**
 * @param {string} commit
 */
function getChangedFile(commit) {
  const str = execCommand(`git diff --name-only ${commit}`).toString()
  return str
    .split('\n')
    .map((i) => i.trim())
    .filter(Boolean)
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
 * @param {{cwd?: string, quite?: string, printCommand?: boolean}} options
 */
function execCommand(command, options = {}) {
  const finalOptions = {
    quite: true,
    cwd: process.cwd(),
    printCommand: true,
    ...options,
  }

  if (finalOptions.printCommand) {
    print('Debug', `$ ${command}`)
    finalOptions.quite = false
  }

  return ch.execSync(command, {
    cwd: finalOptions.cwd,
    stdio: ['pipe', finalOptions.quite ? 'ignore' : 'pipe', 'pipe'],
  })
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

module.exports = {
  UseYarn,
  getChangedFile,
  print,
  execCommand,
  Pkg,
  install,
  NOOP,
  COMMAND_NAME,
  PACKAGE_NAME,
  PRETTIER_CONFIG_NAME,
  pkg,
}
