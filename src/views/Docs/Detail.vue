<script setup lang="js">
import { getContent } from '@/markdowns.js'

const route = useRoute()
const name = route.query.name
const content = await getContent(name)
</script>

<template>
  <MarkdownRender :content="content"></MarkdownRender>
</template>

<style></style>
