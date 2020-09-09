const path = require('path')
const fs = require('fs')
const { Pkg, print, install } = require('../utils')

/**
 * @typedef {import('../utils').Dep} Dep
 * @typedef {Pkg} pkg
 * @typedef {(dep: Dep) => void} addDep
 */

/**
 * husky 初始化
 * @param {pkg} pkg
 * @param {addDep} addDep
 */
async function husky(pkg, addDep) {}

/**
 * prettier 初始化
 * @param {pkg} pkg
 * @param {addDep} addDep
 */
async function prettier(pkg, addDep) {}

/**
 * stylelint 初始化
 * @param {pkg} pkg
 * @param {addDep} addDep
 */
async function stylelint(pkg, addDep) {}

/**
 * stylelint 初始化
 * @param {pkg} pkg
 * @param {addDep} addDep
 */
async function eslint(pkg, addDep) {}

/**
 * 配置文件初始化
 * @param {pkg} pkg
 * @param {addDep} addDep
 */
async function configuration(pkg, addDep) {}

/**
 * 项目初始化
 * @param {{type: 'react' | 'vue' | 'taro' | 'standard'}} options
 */
async function exec(options) {
  const cwd = process.cwd()
  const pkgPath = path.join(cwd, './package.json')

  if (!fs.existsSync(pkgPath)) {
    print('Error', '未找到 package.json')
    process.exit(1)
  }

  const pkg = new Pkg(pkgPath)
  /** @type {Dep[]} */
  const thingsNeedToInstall = []
  const addDep = (dep) => thingsNeedToInstall.push(dep)

  await husky(pkg, addDep)
  await prettier(pkg, addDep)
  await stylelint(pkg, addDep)
  await eslint(pkg, addDep)
  await configuration(pkg, addDep)

  await pkg.write()

  // 安装依赖
  await install(thingsNeedToInstall)
}

module.exports = exec
