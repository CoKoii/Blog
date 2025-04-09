import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'
import { getUserInfoApi } from '@/apis/request'
import { useSystemStore } from '@/stores/system'

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
  next()
})

router.afterEach(async (to) => {
  const systemStore = useSystemStore()

  if (to.path !== '/login') {
    if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
      message.error('请先登录')
      router.push('/login')
    } else {
      const res = await getUserInfoApi()
      if (res.data) {
        systemStore.userInfo = res.data
      } else {
        message.error('请先登录')
        router.push('/login')
      }
    }
  }

  NProgress.done()
})

export default router
