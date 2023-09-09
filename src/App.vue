<script setup lang="ts"></script>

<template>
  <div class="main">
    <h1 class="font-bold text-center">思想与记录</h1>
    <suspense><router-view /></suspense>
  </div>
</template>

<style scoped>
.main {
  max-width: 800px;
  margin: auto;
}
</style>
