import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect',
    component: () => import('@/layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: resolve => void require(['@/views/redirect/index'], resolve)
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: resolve => void require(['@/views/login/index'], resolve),
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: resolve => void require(['@/views/login/register'], resolve),
    hidden: true
  },
  {
    path: '/resetPsw',
    name: 'ResetPsw',
    component: resolve => void require(['@/views/login/resetPsw'], resolve),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
