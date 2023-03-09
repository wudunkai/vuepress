import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme";

export default defineUserConfig({
  base: "/",
  port: 90,
  locales: {
    "/": {
      lang: "zh-CN",
      title: "20200124",
      description: "20200124 的博客",
    },
  },
  head: [["link", { rel: "icon", href: "/logo.webp" }]],
  theme,
  plugins: [
    // 本地搜索，删除上方 docsearchPlugin 区块后生效
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
    }),
  ],
  shouldPrefetch: false,
});
