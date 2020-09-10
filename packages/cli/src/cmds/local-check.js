const { pretty, eslint, stylelint, run } = require('../tasks')
const { getStagedFiles, getUnstagedFiles } = require('../utils')

async function exec() {
  const stagedFiles = getStagedFiles()
  const unstagedFiles = getUnstagedFiles()
  await run(stagedFiles, unstagedFiles, [pretty, eslint, stylelint])
}

module.exports = exec
