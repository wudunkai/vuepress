<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
const textarea = ref();
const changeDiploma = async () => {
  let clean = textarea.value;
  // 1. 移除所有“复制”字样（包括前面可能的·或空格）
  clean = clean.replace(/(?:·?\s*)?复制/g, "");
  // 2. 移除所有剩余空格和换行
  clean = clean.replace(/\s+/g, "");
  // 3. 每12个字符分组，用 \n 连接
  const result = clean.match(/.{1,12}/g).join("\n");
  try {
    await navigator.clipboard.writeText(result);
    ElMessage.success("复制成功"); // ← 按你的要求
  } catch (err) {
    ElMessage.error("复制失败"); // ← 按你的要求
  }
};
</script>

<template>
  <el-input
    type="textarea"
    placeholder="请输入内容"
    v-model="textarea"
    :autosize="{ minRows: 5, maxRows: 8 }"
  ></el-input>
  <el-button @click="changeDiploma()">转换</el-button>
</template>
