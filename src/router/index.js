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

/**
 * 异步挂载的路由
 * 动态需要根据权限加载的路由表
 */
const modulesFiles = require.context('./modules', true, /\.js$/)
const routesModules = []
// 自动引入modules目录下的所有模块
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  routesModules.push(value.default)
}, {})
export const asyncRoutes = routesModules

/**
 * 最终无法匹配到相应路由，重定向到404
 * 异步加载路由时，在生成完异步路由准备挂载时，需要将重定向404的匹配规则定义在最后面，否则刷新会出错。
 */
export const notFoundRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      title: '404'
    }
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
