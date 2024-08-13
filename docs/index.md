---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "xnscu's blog"
  text: ""
  tagline: reading, thinking, doing
---

<script setup>
import { ref } from 'vue'
import  LatestPosts from ".vitepress/components/LatestBlog.vue"
</script>
 <LatestPosts />
