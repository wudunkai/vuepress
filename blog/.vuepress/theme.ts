import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  repo: "wudunkai/vuepress",
  author: {
    name: "20200124",
    url: "/",
  },
  iconAssets: "//at.alicdn.com/t/c/font_4045271_mtd4y3xfob.css",
  logo: "/logo.webp",
  docsDir: "blog",
  blog: {
    medias: {
      GitHub: "https://github.com/wudunkai/vuepress",
    },
  },
  darkmode: "toggle",
  locales: {
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "你已经到达了世界的尽头",

      displayFooter: true,

      blog: {
        description: "一个笨笨的前端开发者",
        intro: "/intro.html",
      },

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },
  plugins: {
    blog: true,
    copyCode: {
      showInMobile: true,
    },
    comment: {
      // @ts-ignore
      provider: "Giscus",
      repo: "wudunkai/vuepress",
      repoId: "R_kgDOJHL2nQ",
      category: "Q&A",
      categoryId: "DIC_kwDOJHL2nc4CUvuX",
    },

    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
    components: {
      components: ["SiteInfo"],
      rootComponents: {
        backToTop: true,
        notice: [
          {
            path: "/",
            title: "欢迎来到这个地方",
            content: "这是一个记录前端学习的博客",
            // actions: [
            //   {
            //     text: "立即访问",
            //     link: "https://plugin-components.vuejs.press/zh/",
            //   },
            // ],
          },
        ],
      },
    },
  },
});
