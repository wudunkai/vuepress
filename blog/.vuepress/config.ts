import { defineUserConfig } from "vuepress";
import theme from "./theme";
import plugins from "./plugins";

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
  plugins,
  shouldPrefetch: false,
});
