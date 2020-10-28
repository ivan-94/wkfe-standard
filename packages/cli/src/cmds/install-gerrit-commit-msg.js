/**
 * Gerrit commit-msg 安装
 */
const fs = require('fs');
const http = require('http');
const { IS_CI } = require('../utils');

const COMMIT_MSG = '.git/hooks/commit-msg';

/**
 * @param {string} url
 */
async function exec(url) {
  if (IS_CI) {
    // 跳过 CI 环境
    return;
  }

  if (!fs.existsSync('.git/hooks')) {
    fs.mkdirSync('.git/hooks');
  }

  const downloadUrl = url + '/tools/hooks/commit-msg';
  console.log('正在安装 commit-msg hooks: ' + downloadUrl);

  const req = http.request(downloadUrl, (res) => {
    const target = fs.createWriteStream(COMMIT_MSG);
    res.pipe(target);

    target.on('close', () => {
      fs.chmodSync(COMMIT_MSG, '755');

      if (fs.existsSync('node_modules/husky')) {
        console.log('兼容 husky');
        fs.writeFileSync(COMMIT_MSG, `\n\n . "$(dirname "$0")/husky.sh"\n`, { flag: 'a' });
      }

      console.log('安装成功');
    });
  });

  req.end();
}

module.exports = exec;
