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
          component: () => import('@/views/User/Home/home.vue'),
        },
      ],
    },
  ],
})

export default router
