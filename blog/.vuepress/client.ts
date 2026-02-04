import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const MyIcon = defineAsyncComponent(() => import("./components/MyIcon.vue"));
const Content = defineAsyncComponent(() => import("./components/Content.vue"));
const Title = defineAsyncComponent(() => import("./components/Title.vue"));
const NavMusic = defineAsyncComponent(
  () => import("./components/NavMusic.vue")
);
const CursorEffects = defineAsyncComponent(
  () => import("./components/CursorEffects.vue")
);
const ResumeModify = defineAsyncComponent(
  () => import("./components/resume/ResumeModify.vue")
);
const StringMethod = defineAsyncComponent(
  () => import("./components/StringMethod.vue")
);

export default defineClientConfig({
  enhance({ app }) {
    app.use(ElementPlus, { locale: zhCn });
    app.component("MyIcon", MyIcon);
    app.component("Content", Content);
    app.component("Title", Title);
    app.component("ResumeModify", ResumeModify);
    app.component("StringMethod", StringMethod);
  },
  setup() {},
  rootComponents: [NavMusic, CursorEffects],
});
