const { getChangedFile } = require('../utils')

function exec() {
  const changed = getChangedFile('aa244b0714af4de4bdf3d6485a48c67713e89d80')
  console.log(changed)
}

module.exports = exec

exec()
