---
date: 2023-09-01
category:
  - Vue
tag:
  - Vue3
  - Vue2
  - v-instruct
---

# Vue2 Vue3 自定义指令使用了解

自定义指令中的 inserted 指令用于在 vue 中插入元素。它只调用一次，指令第一次绑定到元素时调用。inserted 指令的值可能发生改变，可以通过比较更新前后的值来忽略不必要的模板更新。

<!-- more -->

## 自定义指令钩子函数

- Vue2 自定义指令钩子函数

```js
// Vue2
Vue.directive("hello", {
  bind: function (el, binding, vNode, oldVNode) {
    //只调用一次，指令第一次绑定到元素时候调用，
    //用这个钩子可以定义一个绑定时执行一次的初始化动作。
    console.log("1-bind");
  },
  inserted: function () {
    //被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)
    console.log("2-inserted");
  },
  update: function () {
    //被绑定于元素所在模板更新时调用，而且无论绑定值是否有变化
    //通过比较更新前后的绑定值，忽略不必要的模板更新
    console.log("3-update");
  },
  componentUpdated: function () {
    //被绑定元素所在模板完成一次更新周期时调用
    console.log("4 - componentUpdated");
  },
  unbind: function () {
    //只调用一次，指令与元素解绑时调用。
    console.log("5 - unbind");
  },
});
```

[Vue2 钩子函数参数了解可以查看官方文档](https://v2.cn.vuejs.org/v2/guide/custom-directive.html#%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0)

- Vue3 自定义指令钩子函数

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vNode, prevNode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vNode, prevNode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vNode, prevNode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vNode, prevNode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vNode, prevNode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vNode, prevNode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vNode, prevNode) {},
};
```

[Vue3 钩子函数参数了解可以查看官方文档](https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks)

## 注册全局自定义指令

```js
// main.js
// vue2
Vue.directive("iKun1", {
  //当被绑定的元素插入DOM中时执行
  inserted: function (el) {
    //使元素自动获得焦点
    el.focus();
  },
});
new Vue({
  /* ... */
});

// vue3
import { createApp } from "vue";
const app = createApp({
  /* ... */
});
// 注册（对象形式的指令）
app.directive("iKun1", {
  /* 自定义指令钩子 */
  mounted(el, bindings) {},
});
// 简写
app.directive("iKun2", (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
});
```

## 注册局部自定义指令

```vue
<!-- vue2 -->
<script>
export default {
  name: "app",
  directives: {
    iKun1: {
      inserted: function (el, binding) {
        //
      },
    },
  },
};
</script>
<!-- vue3 -->
<script setup>
// 在模板中启用 v-iKun1
const vIKun1 = {
  mounted: (el) => {},
};
</script>
<!-- 没有setup的情况 -->
<script>
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-iKun1
    iKun1: {
      /* ... */
    },
  },
};
</script>
```
