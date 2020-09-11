# WakeData 通用 prettier 配置

## Usage

Install:

```shell
$ yarn add prettier-config-wk -D
```

<br>

Edit package.json:

```json
{
  // ...
  "prettier": "prettier-config-wk"
}
```

如果要扩展该配置，请新建 `.prettierrc.js`：

```js
module.exports = {
  ...require('prettier-config-wk'),
  semi: false,
}
```

## Contribute

如果你修改这个文件，也对应修改一下 cli/src/template/.editorconfig, 保持统一