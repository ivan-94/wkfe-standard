const { Command } = require('commander');
const fs = require('fs');
const { pkg, getConfigPath } = require('./utils');

const program = new Command();
program.version(pkg.version);
program.description('WakeData 前端代码规范检查工具');

function checkInitialized() {
  if (!fs.existsSync(getConfigPath())) {
    console.log('请先使用 wkstd init 初始化项目');
    process.exit(-1);
  }
}

program
  .command('init', {})
  .description('初始化项目')
  .action(opt => {
    const init = require('./cmds/init');
    init();
  });

program
  .command('fix <pattern>')
  .description('批量修复所有支持自动修复的问题，建议在项目第一次迁移时执行一次')
  .usage(
    `

wkstd fix "src/**/*"  # 修复 src 下的所有文件
wkstd fix "src/**/*.(scss|css)"

`
  )
  .action(opt => {
    checkInitialized();
    require('./cmds/fix')(opt);
  });

/**
 * 本地验证
 */
program
  .command('local-check')
  .description('本地 lint 检查, 配合 husky')
  .action(() => {
    checkInitialized();
    const localCheck = require('./cmds/local-check');
    localCheck();
  });

/**
 * 远程验证
 */
program
  .command('remote-check')
  .description('远程 lint 检查，主要用于 CI')
  .action(() => {
    checkInitialized();
    const remoteCheck = require('./cmds/remote-check');
    remoteCheck();
  });

/**
 * 远程gerrit验证
 */
program
  .command('gerrit-check')
  .description('远程 gerrit 检查，主要用于 CI')
  .action(() => {
    checkInitialized();
    const remoteCheck = require('./cmds/gerrit-check');
    remoteCheck();
  });

program
  .command('install-commit-msg <httpUrl>')
  .description('安装 Gerrit commit-msg Hook')
  .action(options => {
    require('./cmds/install-gerrit-commit-msg')(options);
  });

/**
 * 更新 milestone
 */
program
  .command('update-milestone')
  .description('里程碑 commit 更新')
  .action(() => {
    checkInitialized();
    require('./cmds/update-milestone')();
  });

program
  .command('update')
  .description('升级工具链')
  .action(() => {
    checkInitialized();
    require('./cmds/update')();
  });

program.parse(process.argv);
