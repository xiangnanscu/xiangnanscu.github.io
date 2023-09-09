<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = ref(0)
const items = ref([
  {
    label: '',
    icon: 'pi pi-fw pi-home',
    route: '/'
  },
  // {
  //   label: '',
  //   icon: 'pi pi-fw pi-pencil',
  //   route: '/edit'
  // },
  {
    label: '',
    icon: 'pi pi-fw pi-file',
    route: '/Docs'
  }
  // {
  //   label: '',
  //   icon: 'pi pi-fw pi-cog',
  //   route: '/settings'
  // }
])
const setActiveIndex = () => {
  active.value = items.value.findIndex((item) => {
    const rpath = router.resolve(item.route).path
    if (rpath == '/') return route.path === rpath
    else return route.path.startsWith(rpath)
  })
}
onMounted(setActiveIndex)

watch(route, setActiveIndex, { immediate: true })
</script>

<template>
  <div class="main">
    <TabMenu v-model:activeIndex="active" :model="items">
      <template #item="{ label, item, props }">
        <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
          <a
            :href="routerProps.href"
            v-bind="props.action"
            @click="($event) => routerProps.navigate($event)"
            @keydown.enter.space="($event) => routerProps.navigate($event)"
          >
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </a>
        </router-link>
      </template>
    </TabMenu>
    <suspense><router-view /></suspense>
  </div>
</template>

<style scoped>
.main {
  padding: 1em;
  max-width: 800px;
  margin: auto;
}
</style>
