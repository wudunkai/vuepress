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
    preview: /links/VuePress.jpg
  - name: VuePress Theme Hope
    desc: 一个具有强大功能的 vuepress 主题✨
    logo: https://theme-hope.vuejs.press/logo.svg
    url: https://theme-hope.vuejs.press/zh/
    repo: https://github.com/vuepress-theme-hope/vuepress-theme-hope
    preview: /links/theme-hope.jpg

linkList:
  - name: 墨七
    desc: 简单快乐，理应如此
    logo: https://file.mo7.cc/static/lxh_gif/lxh_71.gif
    url: https://blog.mo7.cc/
    repo: https://github.com/mo7cc/BlogSource
    preview: https://file.mo7.cc/disk/blog_preview.png
---

# 框架与主题

<SiteInfo
  v-for="item in $frontmatter.dependence"
  :key="item.link"
  v-bind="item"
/>

# 友情链接

<SiteInfo
  v-for="item in $frontmatter.linkList"
  :key="item.link"
  v-bind="item"
/>
