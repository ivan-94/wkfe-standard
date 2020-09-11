# WakeData 前端代码规范工具集

## 项目包结构

- wkstd                    - 命令行工具，用于在本地或 CI 验证代码
- eslint-plugin-wk         - wakedata 自定义规则
- eslint-config-wk         - 通用 ESLint 配置，适用于常规项目
  - eslint-config-wkreact    - 适用于 React 项目, 继承 wk
    - eslint-config-wktaro   - 适用于 Taro 项目, 继承 wkreact
  - eslint-config-wkvue      - 使用于 Vue 项目，继承 wk 
- eslint-config-wkloose      - 宽松的规则，用于过渡阶段
- stylelint-config-wk      - 通用的 Stylint 配置
  - stylelint-config-wktaro   - 适用于 Taro 项目, 继承 wk
  ...                      - TODO
- prettier-config-wk       - 通用的 prettier 配置


## 安装

## 命令

## 贡献

```shell
$ yarn bootstrap
```
