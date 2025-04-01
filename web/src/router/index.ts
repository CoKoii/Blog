import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      component: () => import('../views/Layout/index.vue'),
    },
    {
      path: '/login',
      name: '登陆页',
      component: () => import('../views/Login/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/ErrorPage/index.vue'),
    },
  ],
})

export default router
