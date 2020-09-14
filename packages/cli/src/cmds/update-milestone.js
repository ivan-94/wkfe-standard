const inquirer = require('inquirer');
const { getHEADref, updateConfig } = require('../utils');

/**
 * 更新 milestone
 */
async function exec() {
  const head = getHEADref();
  const confirm = await inquirer.prompt([
    { type: 'confirm', name: 'ok', message: `确定强制将里程牌修改为 HEAD(${head})? `, default: false },
  ]);

  if (confirm.ok) {
    updateConfig('milestone', head, process.cwd());
  }
}

module.exports = exec;
