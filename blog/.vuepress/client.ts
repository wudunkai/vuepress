import { defineClientConfig } from "@vuepress/client";
import { defineAsyncComponent } from "vue";

const MyIcon = defineAsyncComponent(() => import("./components/MyIcon.vue"));
const NavMusic = defineAsyncComponent(
  () => import("./components/NavMusic.vue")
);
const CursorEffects = defineAsyncComponent(
  () => import("./components/CursorEffects.vue")
);

export default defineClientConfig({
  enhance({ app }) {
    app.component("MyIcon", MyIcon);
  },
  setup() {},
  rootComponents: [NavMusic, CursorEffects],
});
