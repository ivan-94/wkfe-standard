const fs = require('fs');
const pathUtils = require('path');
const get = require('lodash/get');
const set = require('lodash/set');
const json5 = require('json5');
const execa = require('execa');
const chalk = require('chalk');
const ch = require('child_process');
const multimatch = require('multimatch');
const babel = require('@babel/core');
const babelGenerate = require('@babel/generator');
const pkg = require('../package.json');

/**
 * @typedef {{name: string, version?: string, dev: boolean}} Dep
 * @typedef {{
 *   milestone: string,
 *   milestoneAutoUpdate: boolean
 *   formatPatterns?: string | string[]
 *   scriptPatterns?: string | string[]
 *   stylePatterns?: string | string[]
 *   eslintArgs?: string
 *   stylelintArgs?: string
 *   prettierArgs?: string
 * }} Config
 */

const _DEV_ = process.env.NODE_ENV === 'development';
/**
 * 是否为 CI 环境
 */
const IS_CI = !!(
  process.env.JENKINS_URL ||
  process.env.GITLAB_CI ||
  process.env.GITHUB_ACTIONS ||
  process.env.CIRCLECI ||
  process.env.TRAVIS
);
const UseYarn = fs.existsSync('yarn.lock');
const COMMAND_NAME = 'wkstd';
const PACKAGE_NAME = pkg.name;
const PRETTIER_CONFIG_NAME = 'prettier-config-wk';
const ESLINT_CONFIG_NAME = 'eslint-config-wk';
const ESLINT_CONFIG_REACT_NAME = 'eslint-config-wkreact';
const ESLINT_CONFIG_TARO_NAME = 'eslint-config-wktaro';
const ESLINT_CONFIG_TS_NAME = 'eslint-config-wkts';
const ESLINT_CONFIG_VUE_NAME = 'eslint-config-wkvue';
const STYLELINT_CONFIG_WK = 'stylelint-config-wk';
const STYLELINT_CONFIG_WKTARO = 'stylelint-config-wktaro';
const ESLINT_FRAMEWORK_CONFIG = {
  react: ESLINT_CONFIG_REACT_NAME,
  vue: ESLINT_CONFIG_VUE_NAME,
  taro: ESLINT_CONFIG_TARO_NAME,
};
const SCOPE_PACKAGES = [
  PACKAGE_NAME,
  ESLINT_CONFIG_NAME,
  ESLINT_CONFIG_REACT_NAME,
  ESLINT_CONFIG_TARO_NAME,
  ESLINT_CONFIG_TS_NAME,
  ESLINT_CONFIG_VUE_NAME,
  PRETTIER_CONFIG_NAME,
  STYLELINT_CONFIG_WK,
  STYLELINT_CONFIG_WKTARO,
];
const CONFIGURE_NAME = '.standard.jsonc';
const SCRIPT_SUPPORT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.vue'];
const STYLE_SUPPORT_EXTENSIONS = [
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.stylus',
  '.vue',
  '.html',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
];

const NOOP = () => {};

/**
 * package.json 读写
 */
class Pkg {
  /**
   * @param {string} identifier
   */
  constructor(identifier) {
    this.path = identifier;
    // eslint-disable-next-line import/no-dynamic-require
    this.obj = require(identifier);
    this.dirty = false;
  }

  /**
   * @param {string} name
   */
  removeDep(name) {
    if (this.obj.dependencies) {
      delete this.obj.dependencies[name];
      this.dirty = true;
    }
    if (this.obj.devDependencies) {
      delete this.obj.devDependencies[name];
      this.dirty = true;
    }
  }

  /**
   * 字段获取
   * @param {string} identifier
   */
  get(identifier) {
    return get(this.obj, identifier);
  }

  /**
   * @param {string} identifier
   * @param {any} value
   */
  set(identifier, value) {
    set(this.obj, identifier, value);
    this.dirty = true;
  }

  /**
   * 判断依赖是否安装
   * @param {string} name
   */
  hasInstall(name) {
    return this.getVersion(name) != null;
  }

  /**
   * 获取指定依赖的版本号
   * @param {string} name
   * @returns {string|null}
   */
  getVersion(name) {
    const dep = this.obj.dependencies;
    const devDep = this.obj.devDependencies;
    if (dep && name in dep) {
      return dep[name];
    }
    if (devDep && name in devDep) {
      return devDep[name];
    }

    return null;
  }

  async refresh() {
    delete require.cache[this.path];
    // eslint-disable-next-line import/no-dynamic-require
    this.obj = require(this.path);
    this.dirty = false;
  }

  async write() {
    if (!this.dirty) {
      return;
    }
    await fs.promises.writeFile(this.path, toPrettieredJSON(this.obj));
  }
}

/**
 * @param {object} obj
 */
function toPrettieredJSON(obj) {
  return JSON.stringify(obj, undefined, 2);
}

/**
 * @param {string} str
 */
function getLines(str) {
  return str
    .split('\n')
    .map(i => i.trim())
    .filter(Boolean);
}

/**
 * 是否为 git 仓库
 * @param {string} [cwd]
 */
function isGitRepo(cwd) {
  return fs.existsSync(pathUtils.join(cwd || process.cwd(), '.git'));
}

/**
 * @param {string} commit
 */
function getChangedFiles(commit) {
  const str = execCommand(`git diff --name-only --diff-filter=ACMR ${commit}`).toString();
  return getLines(str);
}

function getStagedFiles() {
  const str = execCommand(`git diff --name-only --diff-filter=ACMR --cached`).toString();
  return getLines(str);
}

/**
 * 获取所有未提交的文件
 */
function getUnstagedFiles() {
  const trackeds = execCommand(`git diff --name-only`).toString();
  const untrackeds = execCommand(`git ls-files --others --exclude-standard`).toString();
  return getLines(trackeds).concat(getLines(untrackeds));
}

/**
 * 比对两个 commit 的新旧
 * @param {string} a
 * @param {string} b
 * @returns {boolean} a 比 b 新
 */
function commitNewerThan(a, b) {
  if (a === b) {
    return false;
  }

  const str = execCommand(`git diff --name-only "${a}"..."${b}"`).toString();
  return !getLines(str).length;
}

/**
 * 获取所有已提交到仓库的文件
 */
function getAllCachedFiles() {
  const str = execCommand('git ls-files --exclude-standard --cached').toString();
  return getLines(str);
}

function getHEADref() {
  return getRef('HEAD');
}

/**
 * 获取指定点的 revision
 * @param {string} point
 */
function getRef(point) {
  try {
    return execCommand(`git rev-parse ${point}`, { printCommand: true }).toString().trim();
  } catch (err) {
    return '';
  }
}

/**
 * @param {string[]} files
 */
function stageFiles(files) {
  execCommand(`git add ${files.join(' ')}`, { printCommand: false });
}

/**
 * 获取可以安全编辑的文件
 * @param {string[]} stageds
 * @param {string[]} unstageds
 */
function getSafeChangeableFiles(stageds, unstageds) {
  /** @type {string[]} */
  const safe = [];
  /** @type {string[]} */
  const unsafe = [];
  for (const file of stageds) {
    if (unstageds.includes(file)) {
      unsafe.push(file);
    } else {
      safe.push(file);
    }
  }
  return {
    safe,
    unsafe,
  };
}

const printPrefix = {
  Success: '✅ ',
  Error: chalk.red('❌ 错误'),
  Warn: chalk.yellow('⚠️ 警告'),
  Info: 'ℹ️',
  Debug: '💻',
};
/**
 * @param {'Error' | 'Warn' | 'Info' | 'Debug' | 'Success'} level
 * @param  {...any} args
 */
function print(level, ...args) {
  const fn = level === 'Error' ? console.error : level === 'Warn' ? console.warn : console.log;
  if (!_DEV_ && level === 'Debug') {
    return;
  }

  fn.call(console, printPrefix[level] + ' ', ...args);
}

/**
 *
 * @param {string} command
 * @param {{cwd?: string, printCommand?: boolean, inherit?: boolean}} options
 */
function execCommand(command, options = {}) {
  const finalOptions = {
    cwd: process.cwd(),
    printCommand: true,
    ...options,
  };

  if (finalOptions.printCommand) {
    print('Info', `$ ${command}`);
  }

  const output = ch.execSync(command, {
    cwd: finalOptions.cwd,
    stdio: ['inherit', finalOptions.inherit ? 'inherit' : 'pipe', _DEV_ || finalOptions.inherit ? 'inherit' : 'pipe'],
  });

  if (finalOptions.printCommand) {
    print('Debug', '\n' + output);
  }

  return output;
}

/**
 * @param {string} command
 * @param {{cwd?: string}} options
 */
function execNpmScript(command, options = {}) {
  print('Debug', command);
  return execa.commandSync(command, { preferLocal: true, cwd: options.cwd || process.cwd(), stdio: 'inherit' });
}

/**
 * 安装依赖
 * @param {Dep[]} deps
 * @param {{ignoreScripts?: boolean}} options
 */
function install(deps, options = {}) {
  /** @type {Dep[]} */
  const dep = [];
  /** @type {Dep[]} */
  const devDep = [];
  deps.forEach(i => (i.dev ? devDep.push(i) : dep.push(i)));

  /**
   * @param {Dep[]} list
   * @param {boolean} dev
   */
  const toCommand = (list, dev) => {
    const pkgs = list.map(i => (i.version ? `${i.name}@${i.version}` : i.name)).join(' ');
    return UseYarn
      ? `yarn add ${dev ? '-D' : ''} ${options.ignoreScripts ? '--ignore-scripts' : ''} ${pkgs}`
      : `npm install ${dev ? '--save-dev' : '--save'} ${options.ignoreScripts ? '--ignore-scripts' : ''} ${pkgs}`;
  };

  if (devDep.length) {
    execCommand(toCommand(devDep, true), { printCommand: true, inherit: true });
  }

  if (dep.length) {
    execCommand(toCommand(dep, false), { printCommand: true, inherit: true });
  }
}

/**
 * 扩展名过滤器
 * @param {string[]} extensions
 * @returns {(file: string) => boolean}
 */
const filterByExtensions = extensions => file => extensions.some(ext => file.endsWith(ext));

/**
 * 模式过滤器
 * @param {string | string[]} pattern
 * @returns {(file: string) => boolean}
 */
const filterByPattern = pattern => {
  // Match everything if no pattern was given
  if ((typeof pattern !== 'string' && !Array.isArray(pattern)) || (Array.isArray(pattern) && pattern.length === 0)) {
    return () => true;
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  return file => multimatch(pathUtils.normalize(file), patterns, { dot: true }).length > 0;
};

/**
 * 文件过滤
 * @param {string[]} files
 * @param {string[]} extensions
 * @param {string | string[] | undefined} pattern
 * @returns {string[]}
 */
function fileFilter(files, extensions, pattern) {
  if (extensions && extensions.length) {
    const filter = filterByExtensions(extensions);
    files = files.filter(filter);
  }

  if (pattern != null) {
    const filter = filterByPattern(pattern);
    files = files.filter(filter);
  }

  return files;
}

function getConfigPath(cwd = process.cwd()) {
  return pathUtils.join(cwd, CONFIGURE_NAME);
}

/**
 * @param {string} [cwd]
 * @returns {Promise<Config>}
 */
async function getConfig(cwd = process.cwd()) {
  const p = getConfigPath(cwd);
  if (!fs.existsSync(p)) {
    throw new Error(`未找到配置文件(${CONFIGURE_NAME})`);
  }

  try {
    const content = (await fs.promises.readFile(p)).toString();
    return /** @type {Config} */ (json5.parse(content));
  } catch (err) {
    throw new Error(`配置文件(${CONFIGURE_NAME})读取失败: ${err.message}`);
  }
}

/**
 * 更新配置文件
 * @param {string} key
 * @param {any} value
 */
async function updateConfig(key, value, cwd = process.cwd()) {
  const p = pathUtils.join(cwd, CONFIGURE_NAME);
  if (!fs.existsSync(p)) {
    throw new Error(`未找到配置文件(${CONFIGURE_NAME})`);
  }

  const content = (await fs.promises.readFile(p)).toString();
  const res = await babel.parseAsync(`c=${content}`);

  // 使用 babel 来解析 JSON 并保留注释
  if (res) {
    const { types: t } = babel;
    // @ts-expect-error
    const valueAst = babel.template.ast(JSON.stringify(value)).expression;
    let found = false;

    babel.traverse(res, {
      ObjectExpression: {
        exit(path) {
          if (!found) {
            path.node.properties.push(t.objectProperty(t.stringLiteral(key), valueAst));
          }
        },
      },
      ObjectProperty(path) {
        const node = path.node;
        if (t.isStringLiteral(node.key) && node.key.value === key) {
          found = true;
          node.value = valueAst;
        }
      },
    });

    const newcode = babelGenerate.default(res).code;
    const newContent = newcode.slice(newcode.indexOf('{'), newcode.endsWith(';') ? -1 : undefined);
    await fs.promises.writeFile(p, newContent);
  } else {
    throw new Error('配置文件解析失败');
  }
}

module.exports = {
  UseYarn,
  isGitRepo,
  getChangedFiles,
  getStagedFiles,
  getUnstagedFiles,
  getAllCachedFiles,
  stageFiles,
  getHEADref,
  getRef,
  getSafeChangeableFiles,
  commitNewerThan,
  print,
  execCommand,
  execNpmScript,
  toPrettieredJSON,
  Pkg,
  install,
  NOOP,
  filterByExtensions,
  filterByPattern,
  fileFilter,
  getConfigPath,
  getConfig,
  updateConfig,
  IS_CI,
  COMMAND_NAME,
  PACKAGE_NAME,
  PRETTIER_CONFIG_NAME,
  ESLINT_CONFIG_NAME,
  ESLINT_CONFIG_REACT_NAME,
  ESLINT_CONFIG_TARO_NAME,
  ESLINT_CONFIG_TS_NAME,
  ESLINT_CONFIG_VUE_NAME,
  ESLINT_FRAMEWORK_CONFIG,
  SCOPE_PACKAGES,
  CONFIGURE_NAME,
  SCRIPT_SUPPORT_EXTENSIONS,
  STYLE_SUPPORT_EXTENSIONS,
  pkg,
};
