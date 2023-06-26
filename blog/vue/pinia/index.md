---
date: 2023-03-13
category:
  - Vue
tag:
  - Vue3
  - Pinia
---

# Pinia 快速使用

您将喜欢使用的 Vue 存储库

<!-- more -->

## 废话少说，上代码

```sh
yarn add pinia
# 或者使用 npm
npm install pinia
```

## 配置

```ts
// main.ts
import { createPinia } from "pinia";
app.use(pinia);
```

## 简单定义一个 store

```ts
// stores/main.ts
import { defineStore } from "pinia";
// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore("main", {
  // other options...
});
```

### 使用 store

```ts
// .vue setup
import { useStore } from "@/stores/counter";
const store = useStore();

// ❌ 这不起作用，因为它会破坏响应式
// 这和从 props 解构是一样的
const { name, doubleCount } = store;
name; // "eduardo"
doubleCount; // 2

// 解决方法
import { storeToRefs } from "pinia";
// `name` 和 `doubleCount` 是响应式引用
// 这也会为插件添加的属性创建引用
// 但跳过任何 action 或 非响应式（不是 ref/reactive）的属性
const { name, doubleCount } = storeToRefs(store);
```

## State

```ts
import { defineStore } from "pinia";
const useStore = defineStore("storeId", {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      counter: 0,
      name: "Eduardo",
      isAdmin: true,
    };
  },
});
```

### 访问"state"

```ts
const store = useStore();
store.counter++;
```

### 重置状态

您可以通过调用 store 上的 $reset() 方法将状态 重置 到其初始值：

```ts
const store = useStore();
store.$reset();
```

## Getters

Getter 完全等同于 Store 状态的 计算值。 它们可以用 defineStore() 中的 getters 属性定义。 他们接收“状态”作为第一个参数以鼓励箭头函数的使用：

```ts
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
});
```

直接在 store 实例上访问 getter：

```vue
<script setup>
const store = useStore();
</script>

<template>
  <p>{{ store.doubleCount }}</p>
</template>
```

### 将参数传递给 getter

Getters 只是幕后的 computed 属性，因此无法向它们传递任何参数。 但是，您可以从 getter 返回一个函数以接受任何参数：

```ts
export const useStore = defineStore("main", {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId);
    },
  },
});
```

并在组件中使用：

```vue
<script setup>
const store = useStore();
const getUserById = store.getUserById;
</script>

<template>
  <p>{{ getUserById(2) }}</p>
</template>
```

请注意，在执行此操作时，getter **不再缓存**，它们只是您调用的函数。 但是，您可以在 getter 本身内部缓存一些结果，这并不常见，但应该证明性能更高：

```ts
export const useStore = defineStore("main", {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active);
      return (userId) => activeUsers.find((user) => user.id === userId);
    },
  },
});
```

### 访问其他 getter

```ts
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 类型是自动推断的，因为我们没有使用 `this`
    doubleCount: (state) => state.counter * 2,
    // 这里需要我们自己添加类型（在 JS 中使用 JSDoc）。 我们还可以
    // 使用它来记录 getter
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动完成 ✨
      return this.doubleCount + 1;
    },
  },
});
```

## Actions

Actions 相当于组件中的 methods。 它们可以使用 defineStore() 中的 actions 属性定义，并且**它们非常适合定义业务逻辑：**

```ts
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++;
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random());
    },
  },
});
```

与 getters 一样，操作可以通过 this 访问 whole store instance 并提供**完整类型（和自动完成 ✨）支持。 与它们不同**，actions **可以是异步的**，您可以在其中 `await` 任何 API 调用甚至其他操作！ 这是使用 Mande 的示例。 请注意，只要您获得“Promise”，您使用的库并不重要，您甚至可以使用浏览器的“fetch”函数：

```ts
import { mande } from "mande";

const api = mande("/api/users");

export const useUsers = defineStore("users", {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password });
        showTooltip(`Welcome back ${this.userData.name}!`);
      } catch (error) {
        showTooltip(error);
        // 让表单组件显示错误
        return error;
      }
    },
  },
});
```

### 访问其他 store 操作

```ts
import { useAuthStore } from "./auth-store";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      const auth = useAuthStore();
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences();
      } else {
        throw new Error("User must be authenticated");
      }
    },
  },
});
```

### 更改多个属性

```ts
export const useStore = defineStore("main", {
  state: () => ({
    counter1: 0,
    counter2: 0,
  }),
  actions: {
    randomizeCounter() {
      this.$patch({
        counter1: 1,
        counter2: 1,
      });
    },
  },
});
```

## Plugins

由于是底层 API，Pania Store 可以完全扩展。 以下是您可以执行的操作列表：

- 向 Store 添加新属性
- 定义 Store 时添加新选项
- 为 Store 添加新方法
- 包装现有方法
- 更改甚至取消操作
- 实现本地存储等副作用
- 仅适用于特定 Store

使用 `pinia.use()` 将插件添加到 pinia 实例中。 最简单的例子是通过返回一个对象为所有 Store 添加一个静态属性：

```ts
import { createPinia } from "pinia";

// 为安装此插件后创建的每个store添加一个名为 `secret` 的属性
// 这可能在不同的文件中
function SecretPiniaPlugin() {
  return { secret: "the cake is a lie" };
}

const pinia = createPinia();
// 将插件提供给 pinia
pinia.use(SecretPiniaPlugin);

// 在另一个文件中
const store = useStore();
store.secret; // 'the cake is a lie'
```

常用插件:

- [pinia-plugin-persistedstate](./persisted-state.md)
