---
date: 2023-06-27
category:
  - Axios
tag:
  - Axios
---

# 项目中某一接口失败后不调用 axios 如何利用 promise 无痛刷新 token

## axios 是什么

1. 基于 promise 封装的 http 请求库(避免回调地狱)
2. 支持浏览器和 node 端
3. 丰富的配置项：数据转换器，拦截器等等
4. 客户端支持防御 XSRF
5. 生态完善(支持 vue/react，周边插件等等)

<!-- more -->

## axios 目录格式

adapters // 适配器，兼容 xhr 和 node
cancel // 取消请求
core // 核心源码，包含拦截器等
helpers // 辅助方法
axios.js // 入口文件
default.js // 默认配置
utils.js // 公共工具方法

## axios 执行流程

axios.create 创建单独实例，或直接使用 axios 实例(axios/axios.get…)
request 方法是入口，axios/axios.get 等调用都会走进 request 进行处理
请求拦截器
请求数据转换器，对传入的参数 data 和 header 做数据处理，比如 JSON.stringify(data)
适配器，判断是浏览器端还是 node 端，执行不同的方法
响应数据转换器，对服务端的数据进行处理，比如 JSON.parse(data)
响应拦截器，对服务端数据做处理，比如 token 失效退出登陆，报错 dialog 提示
返回数据给开发者

## 实现方法

1. 方法一：
   在请求发起前拦截每个请求，判断 token 的有效时间是否已经过期，若已过期，则将请求挂起，先刷新 token 后再继续请求。

2. 方法二：
   不在请求前拦截，而是拦截返回后的数据。先发起请求，接口返回过期后，先刷新 token，再进行一次重试。

## 方法对比

1. 方法一：
   - 优点： 在请求前拦截，能节省请求，省流量。
   - 缺点： 需要后端额外提供一个 token 过期时间的字段；使用了本地时间判断，若本地时间被篡改，特别是本地时间比服务器时间慢时，拦截会失败。
2. 方法二：

   - 优点：不需额外的 token 过期字段，不需判断时间。
   - 缺点： 会消耗多一次请求，耗流量。

综上，方法一和二优缺点是互补的，方法一有校验失败的风险（本地时间被篡改时，当然一般没有用户闲的蛋疼去改本地时间的啦），方法二更简单粗暴，等知道服务器已经过期了再重试一次，只是会耗多一个请求。

### 方法一实现代码

```js
import axios from "axios";

// 从localStorage中获取token
function getLocalToken() {
  const token = window.localStorage.getItem("token");
  return token;
}

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
instance.setToken = (token) => {
  instance.defaults.headers["X-Token"] = token;
  window.localStorage.setItem("token", token);
};

function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return instance.post("/refreshToken").then((res) => res.data);
}

// 创建一个axios实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Token": getLocalToken(), // headers塞token
  },
});

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

instance.interceptors.request.use(
  (config) => {
    const currentTime = new Date().getTime();
    const loginTime = Number(localStorage.getItem("loginTime"));
    // 登录后在有效期内 超过5分钟刷新一次token
    if (loginTime && currentTime - loginTime > 300000) {
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token } = res.data;
            instance.setToken(token);
            config.headers["X-Token"] = token;
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach((cb) => cb(token));
            requests = [];
            return instance(config);
          })
          .catch((res) => {
            console.error("refreshToken error =>", res);
            window.location.href = "/";
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token) => {
            config.headers["X-Token"] = token;
            resolve(instance(config));
          });
        });
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
```

### 方法二实现代码

```js
import axios from "axios";

// 从localStorage中获取token
function getLocalToken() {
  const token = window.localStorage.getItem("token");
  return token;
}

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
instance.setToken = (token) => {
  instance.defaults.headers["X-Token"] = token;
  window.localStorage.setItem("token", token);
};

function refreshToken() {
  // instance是当前request.js中已创建的axios实例
  return instance.post("/refreshToken").then((res) => res.data);
}

// 创建一个axios实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Token": getLocalToken(), // headers塞token
  },
});

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

instance.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code === 1234) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token } = res.data;
            instance.setToken(token);
            config.headers["X-Token"] = token;
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach((cb) => cb(token));
            requests = [];
            return instance(config);
          })
          .catch((res) => {
            console.error("refreshToken error =>", res);
            window.location.href = "/";
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token) => {
            config.headers["X-Token"] = token;
            resolve(instance(config));
          });
        });
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
```
