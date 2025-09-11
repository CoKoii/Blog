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
          name: 'Home',
          component: () => import('@/views/User/Home/Home.vue'),
          meta: { keepAlive: true },
        },
        {
          path: '/archive',
          name: 'Archive',
          component: () => import('@/views/User/Archive/Archive.vue'),
          meta: { keepAlive: true },
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

export default router
