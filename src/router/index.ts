import {
  createRouter,
  createWebHistory,
  type RouterScrollBehavior,
  type RouteLocationNormalized,
} from 'vue-router'

function routeKey(r: Pick<RouteLocationNormalized, 'name' | 'path' | 'params' | 'query'>) {
  const id = r.name ?? r.path
  return `${String(id)}|p:${JSON.stringify(r.params)}|q:${JSON.stringify(r.query)}`
}

const scrollPositions = new Map<string, { left: number; top: number }>()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior: ((to, from, savedPosition) => {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'auto',
        top: 0,
      }
    }

    const key = routeKey(to)
    const pos = scrollPositions.get(key)
    if (pos) {
      return { left: pos.left, top: pos.top, behavior: 'auto' }
    }

    return { left: 0, top: 0, behavior: 'auto' }
  }) as RouterScrollBehavior,

  routes: [
    {
      path: '/',
      component: () => import('@/views/User/Layout/Layout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/views/User/Home/Home.vue'),
        },
        {
          path: '/archive',
          name: 'Archive',
          component: () => import('@/views/User/Archive/Archive.vue'),
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('@/views/User/About/About.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/User/NotFound/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (from.matched.length) {
    const key = routeKey(from)
    scrollPositions.set(key, { left: window.scrollX, top: window.scrollY })
  }
  next()
})

export default router
