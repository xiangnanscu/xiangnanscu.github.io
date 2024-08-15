<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import Giscus from "@giscus/vue";

// https://vitepress.dev/zh/guide/extending-default-theme
const { Layout } = DefaultTheme;
const pageData = useData();
</script>

<template>
  <Layout>
    <template #doc-before2>
      <div class="my-last-updated">
        {{ new Date(useData().page.value.lastUpdated).toLocaleString().slice(0, -3) }}
      </div>
    </template>
    <template #doc-after>
      <div style="margin-top: 2em"></div>
      <!-- <Giscus
        id="comments"
        repo="xiangnanscu/xiangnanscu.github.io"
        repoId="R_kgDOHj14pA"
        category="Announcements"
        categoryId="DIC_kwDOHj14pM4Cc6jT"
        mapping="pathname"
        term="Welcome to @giscus/vue component!"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      /> -->
    </template>
  </Layout>
</template>

<style>
.my-last-updated {
  margin-bottom: 20px;
  font-style: italic;
  color: #666;
}
</style>
