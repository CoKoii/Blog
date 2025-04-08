import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'
import { getUserInfoApi } from '@/apis/request'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '脚手架',
      redirect: '/home',
    },
    {
      path: '/home',
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

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path !== '/login') {
    const getUserInfo = async () => {
      const res = await getUserInfoApi()
      return res
    }
    const UserInfo = getUserInfo()
    console.log(UserInfo)
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
