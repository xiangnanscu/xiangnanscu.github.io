<script setup lang="js">
import { names, getContent } from './markdowns.js'
</script>

<template>
  <van-list>
    <van-cell v-for="name in names" :key="name">
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <router-link :to="{ name: 'MarkdownDetail', query: { name } }">
          <span>{{ name }}</span>
        </router-link>
      </template>
    </van-cell>
  </van-list>
</template>

<style></style>
