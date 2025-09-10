import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/User/Layout/Layout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/User/Home/Home.vue'),
        },
        {
          path: '/archive',
          component: () => import('@/views/User/Archive/Archive.vue'),
        },
        {
          path: '/about',
          component: () => import('@/views/User/About/About.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/User/NotFound/NotFound.vue'),
    },
  ],
})

export default router
