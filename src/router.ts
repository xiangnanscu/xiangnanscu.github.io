import { createRouter, createWebHashHistory } from 'vue-router/auto'

const walkRoutes = (routes: any) => {
  for (const route of routes) {
    if (route.children) {
      walkRoutes(route.children)
    }
    if (route.name?.toString().startsWith('Admin')) {
      route.meta ??= {}
      route.meta.adminRequired = true
    }
  }
  return routes
}
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  extendRoutes: walkRoutes
})
router.beforeEach(async (to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})
export default router
