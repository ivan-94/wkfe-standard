/**
 * 修复所有可以修复的问题
 */
const globby = require('globby');
const { run } = require('../tasks');
const { getUnstagedFiles } = require('../utils');

/**
 *
 * @param {string} opt
 */
async function exec(opt) {
  console.log(opt);
  const files = await globby([opt]);
  const unstagedFiles = getUnstagedFiles();

  await run({ fixable: true, files, unstagedFiles, ignoreFailed: true });
}

module.exports = exec;
