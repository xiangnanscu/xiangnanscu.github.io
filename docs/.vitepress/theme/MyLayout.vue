<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'


// https://vitepress.dev/zh/guide/extending-default-theme
const { Layout } = DefaultTheme
const pageData = useData()
console.log(pageData)
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="my-last-updated">
        {{ new Date(useData().page.value.lastUpdated).toLocaleString().slice(0,-3) }}
      </div>
    </template>
  </Layout>
</template>

<style>
.my-last-updated {
  margin-bottom: 20px;
  font-style: italic;
  color:#666;
}
</style>