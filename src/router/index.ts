import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/User/Layout/Layout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/User/Home/home.vue'),
        },
        {
          path: 'find',
          component: () => import('@/views/User/Find/Find.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin/Home/home.vue'),
    },
  ],
})

export default router
