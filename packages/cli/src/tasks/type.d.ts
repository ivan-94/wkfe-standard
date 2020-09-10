export interface Context {
  /**
   * 变动的文件
   */
  files: string[]
  unstagedFiles: string[]
  config: import('../utils').Config
  cwd: string
  /**
   * 是否可以修复代码
   */
  fixable: boolean
}

/**
 * 如果返回 false，将终止后续任务的执行
 */
export type Task = (ctx: import('./type').Context) => Promise<void | false>
