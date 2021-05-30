export interface Context {
  /**
   * 变动的文件
   */
  files: string[];
  unstagedFiles: string[];
  configPath: string;
  config: import('../utils').Config;
  cwd: string;
  ignoreFailed: boolean;
  /**
   * 是否可以修复代码
   */
  fixable: boolean;
  /**
   * 是否已经有任务失败
   */
  failed: boolean;
}

/**
 * 如果返回 false，将终止后续任务的执行
 */
export type Task = (ctx: import('./type').Context) => Promise<void | false>;
