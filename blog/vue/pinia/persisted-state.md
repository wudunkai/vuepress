---
date: 2023-03-13
category:
  - Vue
tag:
  - Vue3
  - Pinia
---

# pinia-plugin-persistedstate

Vue3 pinia 数据持久化插件 pinia-plugin-persistedstate 使用

<!-- more -->

![](/vue/pinia/bg1.png)

## 废话少说，上代码

### 安装

```sh
yarn add pinia-plugin-persistedstate
# 或者使用 npm
npm install pinia-plugin-persistedstate
```

### 配置

```ts
// main.ts
import { createApp } from "vue";
import app from "./app.vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(app).use(pinia);

// stores/main.ts
import { defineStore } from "pinia";

export const main = defineStore("main", {
  // 开启数据持久化
  // 数据默认存在 localStorage 里，并且会以store的id作为key
  persist: true,
  // ...省略
});
```

![](/vue/pinia/bg2.png)

## 进阶用法

### 不想所有数据持久化

需求：不想所有数据都持久化处理，能不能按需持久化所需数据，怎么办？

```ts
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      someState: "hello pinia",
      nested: {
        data: "nested pinia",
      },
    };
  },
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 store的 id
    key: "storeKey",
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: ["nested.data"],
  },
});
```

### 不同数据持久化

```ts
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      someState: "hello pinia",
      nested: {
        data: "nested pinia",
      },
    };
  },
  // 不同数据持久化
  persist: [
    // 默认key为routes
    {
      paths: ["someState"],
      storage: localStorage,
    },
    {
      paths: ["nested"],
      storage: sessionStorage,
    },
  ],
});
```

![](/vue/pinia/bg3.png)

## 插件 api 了解

- key 用于引用存储中存储的反序列化数据的密钥。
- storage 将数据持久保存到的存储类型。必须有 getItem: (key: string) => string | null 和 setItem: (key: string, value: string) => void 方法。
- paths 持久化属性数组。 [] 表示没有状态被持久化， undefined 或 null 表示整个状态被持久化。
- serializer 自定义序列化程序在持久化数据之前序列化数据，并在重新水化存储之前反序列化数据。必须同时有 serialize: (value: StateTree) => string 和 deserialize: (value: string) => StateTree 方法。
- beforeRestore 钩子函数在恢复持久状态之前运行。该钩子可以访问整个 PiniaPluginContext。这可用于在水合之前强制执行特定操作。
- afterRestore 钩子函数在恢复持久状态后运行。该钩子可以访问整个 PiniaPluginContext。这可用于在水合后强制执行特定操作。
- debug 设置为 true 时，在持久化/水合存储时可能发生的任何错误都将记录为 console.error。

```ts
import { stringify, parse } from "zipson";
import { defineStore } from "pinia";

export const main = defineStore("main", {
  persist: {
    key: "my-custom-key",
    storage: sessionStorage,
    paths: ["count"],
    serializer: {
      deserialize: parse,
      serialize: stringify,
    },
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$id}'`);
    },
    afterRestore: (ctx) => {
      console.log(`just restored '${ctx.store.$id}'`);
    },
    debug: true,
  },
});
```

- ⭐ 目前只支持 `sessionStorage` 和 `localStorage`
