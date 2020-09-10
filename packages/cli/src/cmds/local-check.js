const { pretty, eslint, stylelint, run } = require('../tasks')
const { getStagedFile } = require('../utils')

async function exec() {
  const stagedFile = getStagedFile()
  await run(stagedFile, [pretty, eslint, stylelint])
}

module.exports = exec
