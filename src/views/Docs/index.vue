<script setup lang="js">
import { names } from '@/markdowns.js'
</script>

<template>
  <van-list>
    <van-cell v-for="name in names" :key="name">
      <template #title>
        <router-link :to="{ name: '/Docs/Detail', query: { name } }">
          <span>{{ name }}</span>
        </router-link>
      </template>
    </van-cell>
  </van-list>
</template>

<style></style>
