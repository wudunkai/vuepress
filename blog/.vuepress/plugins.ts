import { searchProPlugin } from "vuepress-plugin-search-pro";
export default [
  // 本地搜索，删除上方 docsearchPlugin 区块后生效
  searchProPlugin({
    // 索引全部内容
    indexContent: true,
  }),
];
