<script setup lang="ts">
interface Props {
  title: string;
}
withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<template>
  <div class="title">
    <div class="title-main">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  border-bottom: 2px solid var(--theme-color);
  .title-main {
    width: 110px;
    text-align: center;
    color: #fff;
    background: var(--theme-color);
    padding: 5px 0 1px 0;
    border-radius: 10px 10px 0 0;
    span {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 3px;
    }
  }
}
</style>
