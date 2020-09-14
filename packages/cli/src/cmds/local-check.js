const { run } = require('../tasks');
const { getStagedFiles, getUnstagedFiles } = require('../utils');

async function exec() {
  const stagedFiles = getStagedFiles();
  const unstagedFiles = getUnstagedFiles();
  await run(true, stagedFiles, unstagedFiles);
}

module.exports = exec;
