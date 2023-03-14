---
date: 2021-12-12
category:
  - Vue
tag:
  - Vue3
  - Vue2
  - Scss
---

# Vue3.0 深度选择器＞＞＞ 和 /deep/ 、 ::v-deep 被弃用

**>>>** 和 **/deep/**在 vue3 中使用直接报错。

[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep() instead.

::v-deep 会警告组合符的用法已被弃用,改为:deep()

<!-- more -->

![](/vue/scss-deep/bg.jpg)

```vue
//警告例子
<style lang="scss" scoped>
/deep/ .main {
  height: 520px;
}
>>> .main {
  height: 520px;
}
::v-deep .main {
  height: 520px;
}
</style>

//正确例子
<style lang="scss" scoped>
:deep(.main) {
  height: 520px;
}
</style>
```
