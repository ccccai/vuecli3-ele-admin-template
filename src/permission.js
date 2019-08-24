import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import getPageTitle from '@/assets/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register', '/resetPsw'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 有无token判断
  const token = localStorage.getItem('ADMIN_TOKEN')
  if (token) {
    if (whiteList.includes(to.path)) {
      next()
      NProgress.done()
    } else {
      // 判断当前用户是不是进行了刷新操作，防止进入死循环，如果存在就表示正常跳转，如果不存在就表示刷新了，vuex中的状态丢失了，需要重新挂载路由
      const hasUser = store.state.user.token
      if (hasUser) {
        next()
      } else {
        try {
          // 防止进入死循环
          await store.commit('SET_TOKEN', token)
          // 是不是超级管理员
          const isSuperAdmin = store.state.user.roles.some(item => item.id === 1)
          const accessRoutes = await store.dispatch('GenerateRoutes', isSuperAdmin)
          // 异步加载路由
          router.addRoutes(accessRoutes)
          router.options.routes = store.state.permission.routes
          // 设置replace：true，导航不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 移除token，重定向到登录页
          await store.dispatch('ResetToken')
          Message.error(error || '身份验证出错，请重新登录。')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
