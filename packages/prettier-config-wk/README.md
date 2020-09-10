# WakeData 通用 prettier 配置

# Usage

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
