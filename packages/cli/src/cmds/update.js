const path = require('path');
const fs = require('fs');
const { SCOPE_PACKAGES, Pkg, print, install } = require('../utils');

/**
 * @typedef {import('../utils').Dep} Dep
 */

async function exec() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, './package.json');

  if (!fs.existsSync(pkgPath)) {
    print('Error', '未找到 package.json');
    process.exit(1);
  }

  const pkg = new Pkg(pkgPath);
  /** @type {Dep[]}  */
  const deps = [];
  SCOPE_PACKAGES.forEach(dep => {
    if (pkg.hasInstall(dep)) {
      deps.push({ name: dep, dev: true });
    }
  });

  if (deps.length) {
    print('Info', '正在更新依赖');
    await install(deps);
  } else {
    print('Info', '不需要需要更新的依赖');
  }
}

module.exports = exec;
