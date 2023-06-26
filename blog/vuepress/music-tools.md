---
date: 2023-04-23
category:
  - VuePress
tag:
  - VuePress
---

# VuePress 客户端配置的使用方法了解

使用客户端配置，配置公共组件，实现播放音乐。

<!-- more -->

## 了解客户端配置的使用方法（client）

在客户端配置文件中，@vuepress/client 包提供了一个 defineClientConfig 函数来帮助你定义客户端配置：

```ts
// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  rootComponents: [],
});
```

==defineClientConfig== 方法里面的 api 使用，可以查看[官方文档](http://www.fenovice.com/doc/vuepress-next/advanced/cookbook/usage-of-client-config.html)

## 使用 api 方法创建公共组件

```vue
<!-- components/MyIcon.vue -->
<script setup lang="ts">
defineProps<{ name: string; spin?: boolean }>();
</script>

<template>
  <span
    class="iconfont icon"
    :class="[`icon-${name}`]"
    v-bind="spin ? { 'data-spin': '' } : {}"
  />
</template>

<style lang="scss">
.icon {
  font-size: 1em;
}
</style>
```

```ts
// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from "vue";

const MyIcon = defineAsyncComponent(() => import("./components/MyIcon.vue"));
export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component("MyIcon", MyIcon);
  },
  setup() {},
  rootComponents: [],
});
```

## 创建播放音乐组件

```npm
<!-- 播放器组件 -->
npm install aplayer --save
<!-- 使用到路由 -->
npm install vue-router --save
```

```vue
<!-- components/NavMusic.vue -->
<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";
import { useRouter } from "vue-router";

import { globalMusicList } from "../data/music";

import "aplayer/dist/APlayer.min.css";

let player;

const display = ref(false);

const toggle = () => {
  display.value = !display.value;
};

const close = () => {
  display.value = false;
};

const InsertMenu = () => {
  const navCenterElm = document.querySelector("#app");

  if (!navCenterElm) {
    return;
  }

  if (!document.querySelector("#MyMusic_Menu")) {
    const div = document.createElement("div");

    div.id = "MyMusic_Menu";
    div.classList.add("nav-item");
    div.innerHTML = `<div id="MyMusic_icon" class="btnImg"></div>`; // spin="true"
    navCenterElm.appendChild(div);
  }

  const Menu = document.querySelector<HTMLElement>("#MyMusic_Menu")!;
  const MyMusicWrapper = document.querySelector<HTMLElement>(".MyMusic")!;

  Menu.onclick = (event) => {
    toggle();
    event.stopPropagation();
  };

  MyMusicWrapper.onclick = (event) => {
    event.stopPropagation();
  };
};

const NewPlayer = (APlayer) => {
  if (!APlayer) {
    return;
  }

  // 如果不存在盒子 则 终止
  const playElm = document.getElementById("GlobalAPlayer");
  if (!playElm) {
    return;
  }

  // 判断是否被 APlayer 接管
  const playExist = playElm.classList.contains("aplayer");
  if (playExist) {
    return;
  }

  player = new APlayer({
    container: document.getElementById("GlobalAPlayer"),
    audio: globalMusicList,
    lrcType: 3,
    listFolded: false,
    listMaxHeight: "324px",
    mini: false,
    fixed: false,
    volume: 1,
    storageName: "GlobalAPlayer",
  });

  player.on("play", () => {
    document.getElementById("MyMusic_icon")?.setAttribute("data-spin", "");
  });
  player.on("pause", () => {
    document.getElementById("MyMusic_icon")?.removeAttribute("data-spin");
  });
};

const stopMusic = () => {
  let toPath = window.location.pathname;

  if (toPath.includes("/music/") && player) player.pause();
};

onMounted(() => {
  const router = useRouter();

  import("aplayer").then(({ default: APlayer }) => {
    nextTick(() => {
      InsertMenu();
      NewPlayer(APlayer);
      stopMusic();

      // 在这里插入全局事件监听
      window.document.body.onclick = () => {
        close();
      };
    });

    router.beforeEach(() => {
      nextTick(() => {
        setTimeout(() => {
          InsertMenu();
          NewPlayer(APlayer);
        }, 50);
        setTimeout(() => {
          stopMusic();
        }, 2000);
      });
    });
  });
});
</script>

<template>
  <ClientOnly>
    <div class="MyMusic">
      <div class="MyMusic_Play" :class="{ hide: !display }">
        <div class="close" @click="close">
          <MyIcon name="close" />
        </div>
        <div id="GlobalAPlayer"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss">
.MyMusic_Play {
  background-color: #fff;
  user-select: none;
  position: fixed;
  width: 280px;
  height: 392px;
  top: 50%;
  right: 50%;
  margin-right: -140px;
  margin-top: -217px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  transition: 0.3s;
  transform: scale(1);
  opacity: 1;
  z-index: 9999;
  &.hide {
    top: 6%;
    opacity: 0;
    transform: scale(0);
    visibility: hidden;
  }

  .aplayer {
    margin: 0;
  }

  .close {
    position: absolute;
    right: 8px;
    top: 8px;
    user-select: none;
    cursor: pointer;
    font-size: 18px;
    z-index: 11;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 100px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
}
@media (max-width: 719px) {
  #app {
    #MyMusic_Menu {
      width: 1.7rem;
      height: 1.7rem;
      bottom: 7rem;
    }
  }
}

#MyMusic_Menu {
  right: 1rem;
  bottom: 8rem;
  width: 3rem;
  height: 3rem;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  position: fixed;
  user-select: none;
  cursor: pointer;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-color);
  z-index: 9999;

  .icon {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .btnImg {
    background-image: url("/playBtn.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
```

### data/music.ts 页面

```ts
const basePath = "/music/";

interface GetMusicOptions {
  name: string;
  artist: string;
  urlType: string;
  coverType: string;
}

interface MusicInfo {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc: string;
}

const getMusicInfo = (opt: GetMusicOptions): MusicInfo => {
  const musicPath = `${basePath}${opt.artist}/${opt.name}`;

  return {
    name: opt.name,
    artist: opt.artist,
    url: `${musicPath}/audio.${opt.urlType}`,
    cover: `${musicPath}/cover.${opt.coverType}`,
    lrc: `${musicPath}/lyrics.lrc`,
  };
};

// 全局音乐列表
export const globalMusicList: MusicInfo[] = [
  getMusicInfo({
    name: "水星记",
    artist: "郭顶",
    urlType: "m4a",
    coverType: "webp",
  }),
  getMusicInfo({
    name: "若把你",
    artist: "Kirsty刘瑾睿",
    urlType: "m4a",
    coverType: "jpg",
  }),
  getMusicInfo({
    name: "想去海边",
    artist: "夏日入侵企画",
    urlType: "m4a",
    coverType: "jpg",
  }),
];
```

### .vuepress/client.ts 引入组件显示播放器

```ts
// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from "vue";

const MyIcon = defineAsyncComponent(() => import("./components/MyIcon.vue"));
const NavMusic = defineAsyncComponent(
  () => import("./components/NavMusic.vue")
);

export default defineClientConfig({
  enhance({ app }) {
    app.component("MyIcon", MyIcon);
  },
  setup() {},
  rootComponents: [NavMusic],
});
```

::: tip 实现播放器组件方法显示

代码参考链接[莫七](https://blog.mo7.cc/)

:::
