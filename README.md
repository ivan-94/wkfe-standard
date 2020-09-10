# WakeData 前端代码规范工具集

## 项目包结构

- @wk/std-cli              - 命令行工具，用于在本地或 CI 验证代码
- eslint-plugin-wk         - wakedata 自定义规则
- eslint-config-wk         - 通用 ESLint 配置，适用于常规项目
  - eslint-config-wkreact    - 适用于 React 项目, 继承 wk
    - eslint-config-wktaro   - 适用于 Taro 项目, 继承 wkreact
  - eslint-config-wkvue      - 使用于 Vue 项目，继承 wk 
- stylelint-config-wk      - 通用的 Stylint 配置
  - eslint-config-wktaro   - 适用于 Taro 项目, 继承 wk
  ...                      - TODO
- prettier-config-wk       - 通用的 prettier 配置

## 安装

## 命令
