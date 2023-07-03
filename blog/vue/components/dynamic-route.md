---
date: 2023-06-29
category:
  - Vue3
tag:
  - Vue3
  - Router
  - Pinia
---

# 项目中不同用户登陆进来时，显示出来的菜单功能是不同的

## 实现方法

动态路由表：需要做权限控制的路由，用户如果权限不一致访问到的路由也不一样。

<!-- more -->

## 实现方法代码

```js
// /store/pinia.ts
import { defineStore, acceptHMRUpdate } from "pinia";
import router from "@/router";
export const useRouteStore = defineStore({
  id: "routes",
  state: () => ({
    userInfo: {
      userName: "wu",
      routes: [
        {
          path: "/video",
          name: "video",
          component: "Video",
          meta: {
            isSideBar: 1,
          },
        },
      ],
    },
  }),
  actions: {
    async addRoute(routes: Array<any>) {
      //路由未添加之前是3个,我们判断是否添加过，没添加过就添加
      if (router.getRoutes().length === 2) {
        let addRouterList = filterAsyncRouter(
          JSON.parse(JSON.stringify(routes)) //这里深拷贝下，不然会出问题
        );
        addRouterList.forEach((i: any) => {
          router.addRoute(i);
        });
      }
    },
    async login(userInfo: any) {
      this.$patch({
        userInfo,
      });
    },
    //注销
    async logout(routerList: Array<any>) {
      return new Promise((resolve) => {
        //拷贝一下
        const delRouterList = JSON.parse(JSON.stringify(routerList));
        //删除添加的路由，如果路由是多层的 递归下。。
        delRouterList.forEach((route: any) => {
          router.removeRoute(route.name);
        });
        //删除路由,清空用户信息
        this.$patch({
          userName: "",
        });
        resolve("注销 success， 清空路由，用户信息");
      });
    },
  },
});

// 路由懒加载
const loadView = (view: any) => {
  const component = () => import(`../views/${view}.vue`);
  return component;
};
//为权限路由异步添加组件
const filterAsyncRouter = (routeList: any) => {
  return routeList.filter((route: any) => {
    if (route.component) {
      // 如果不是布局组件就只能是页面的引用了
      // 利用懒加载函数将实际页面赋值给它
      route.component = loadView(route.component);
      // 判断是否存在子路由，并递归调用自己
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children);
      }
      return true;
    }
  });
};
```

```js
// /router/index.ts
import { useRouteStore } from "@/stores/PinIa";
import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/Index.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
];
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(async (to, from, next) => {
  //获取用户信息
  const Routes = useRouteStore();
  let { userName } = Routes.userInfo;
  //有用户信息 除非添加路由
  if (userName) {
    //触发添加路由方法，里面会判断是否需要添加
    await Routes.addRoute(routes);
    //根据to.name来判断是否为动态路由, 是否有人知道还有更好的判断方法？
    if (!to.name) {
      //当前路由是动态的，确定是有的, 有就跳自己，没有就跳404,, tip: 刷新后动态路由的to.name为空
      if (routes.findIndex((i) => i.path === to.path) !== -1) {
        next({ ...to, replace: true });
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
```

最后触发 login 方法就好了传入对应的值
