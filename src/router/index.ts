import { createRouter, createWebHistory, type RouterScrollBehavior } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (() => ({ left: 0, top: 0, behavior: 'auto' })) as RouterScrollBehavior,
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
          children: [
            {
              path: 'post/:id',
              name: 'Post',
              component: () => import('@/components/User/Articles/Articles.vue'),
            },
          ],
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

export default router
