<script setup lang="ts">
import { Popper } from "@moefy-canvas/theme-popper";
import { onMounted, onBeforeUnmount, ref } from "vue";
const canvasCursor = ref();
const popper = new Popper(
  {
    shape: "star",
    size: 2,
  },
  { opacity: 1, zIndex: 999999999 }
);
onMounted(() => {
  popper.mount(canvasCursor.value);
});
onBeforeUnmount(() => {
  popper.unmount();
});
</script>

<template>
  <canvas id="vuepress-canvas-cursor" ref="canvasCursor"></canvas>
</template>
