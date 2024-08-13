---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "xnscu docs"
  text: "Record the Essentials"
  tagline: reading · thinking · doing
  # image:
  #   src: /vitepress-logo-large.webp
  #   alt: VitePress
---

<script setup>
import { ref } from 'vue'
import  LatestPosts from ".vitepress/components/LatestBlog.vue"
</script>
 
<LatestPosts />

<style>
/* https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css */
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}
</style>
