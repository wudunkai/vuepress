---
title: 链接
icon: link
date: 2023-03-13
article: false
timeline: false
dependence:
  - name: VuePress
    desc: Vue 驱动的静态网站生成器
    logo: https://v2.vuepress.vuejs.org/images/hero.png
    url: https://v2.vuepress.vuejs.org/zh/
    repo: https://github.com/vuepress/vuepress-next
    preview: /assets/links/VuePress.png
  - name: VuePress Theme Hope
    desc: 一个具有强大功能的 vuepress 主题✨
    logo: https://theme-hope.vuejs.press/logo.svg
    url: https://theme-hope.vuejs.press/zh/
    repo: https://github.com/vuepress-theme-hope/vuepress-theme-hope
    preview: /assets/links/VuePress-theme-hope.png
---

# 框架与主题

<SiteInfo
  v-for="item in $frontmatter.dependence"
  :key="item.link"
  v-bind="item"
/>
