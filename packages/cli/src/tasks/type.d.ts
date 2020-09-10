export interface Context {
  files: string[]
  unstagedFiles: string[]
  config: import('../utils').Config
  cwd: string
}
