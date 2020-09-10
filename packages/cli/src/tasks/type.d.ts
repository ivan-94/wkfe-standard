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
