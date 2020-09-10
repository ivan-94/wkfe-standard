const pre = require('./pre')
const eslint = require('./eslint')
const stylelint = require('./stylelint')
const pretty = require('./pretty')
const post = require('./post')

module.exports = {
  defaultTasks: [pre, eslint, stylelint, pretty, post],
  pre,
  eslint,
  stylelint,
  pretty,
  post,
}
