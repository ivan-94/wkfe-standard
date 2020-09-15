const { Command } = require('commander');
const { pkg } = require('./utils');

const program = new Command();
program.version(pkg.version);
program.description('WakeData 前端代码规范检查工具');

program
  .command('init', {})
  .description('初始化项目')
  .action(opt => {
    const init = require('./cmds/init');
    init();
  });

/**
 * 本地验证
 */
program
  .command('local-check')
  .description('本地 lint 检查, 配合 husky')
  .action(() => {
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
    const remoteCheck = require('./cmds/remote-check');
    remoteCheck();
  });

/**
 * 更新 milestone
 */
program
  .command('update-milestone')
  .description('里程碑 commit 更新')
  .action(() => {
    require('./cmds/update-milestone')();
  });

program
  .command('update')
  .description('升级工具链')
  .action(() => {
    require('./cmds/update')();
  });

program.parse(process.argv);
