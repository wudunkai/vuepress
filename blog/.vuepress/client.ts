import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const MyIcon = defineAsyncComponent(() => import("./components/MyIcon.vue"));
const NavMusic = defineAsyncComponent(
  () => import("./components/NavMusic.vue")
);
const CursorEffects = defineAsyncComponent(
  () => import("./components/CursorEffects.vue")
);
const ResumeModify = defineAsyncComponent(
  () => import("./components/resume/ResumeModify.vue")
);

export default defineClientConfig({
  enhance({ app }) {
    app.use(ElementPlus);
    app.component("MyIcon", MyIcon);
    app.component("ResumeModify", ResumeModify);
  },
  setup() {},
  rootComponents: [NavMusic, CursorEffects],
});
