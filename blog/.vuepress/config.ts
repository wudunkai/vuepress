import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  base: "/",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "20200124",
      description: "20200124 的博客",
    },
  },
  theme,
  plugins: [],
  shouldPrefetch: false,
});
