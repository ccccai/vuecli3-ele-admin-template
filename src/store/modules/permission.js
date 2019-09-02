/**
 * constantRoutes 常规路由，不需要权限即可访问
 * asyncRoutes 需要访问权限的路由
 * notFoundRoutes 404路由
 * resetRouter 重置路由的方法
 */
import { asyncRoutes, constantRoutes, notFoundRoutes, resetRouter } from '@/router'
import API from '@/assets/http/apiUrl'
import Request from '@/assets/http'

const permission = {
  state: {
    routes: [],
    addRoutes: [] // 异步加载的路由
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },

  actions: {
    // 获取动态路由
    GenerateRoutes({ commit }, isSuperAdmin) {
      resetRouter() // 先初始化路由
      return new Promise((resolve, reject) => {
        // 如果是超级管理员,挂载全部路由全部权限
        if (isSuperAdmin) {
          // 重定向404的匹配规则需要在整个完整路由定义的最后面，否则刷新会出错。
          const accessedRoutes = [...asyncRoutes, ...notFoundRoutes]
          accessedRoutes.forEach(item => {
            if (item.children) {
              // 超级管理员赋全部权限
              item.children.forEach(elem => {
                elem.meta = {
                  ...elem.meta,
                  check: true,
                  delete: true,
                  add: true,
                  edit: true
                }
              })
            }
          })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        } else {
          Request.httpRequest({
            method: 'post',
            url: API.GetPermissionData,
            noLoading: true,
            params: {},
            success: (data) => {
              console.log(data)
              let accessedRoutes = []
              // 匹配前端路由和后台返回的菜单
              accessedRoutes = filterAsyncRoutes(asyncRoutes, data)
              // 重定向404的匹配规则需要在整个完整路由定义的最后面，否则刷新会出错。
              accessedRoutes.push(...notFoundRoutes)
              commit('SET_ROUTES', accessedRoutes)
              resolve(accessedRoutes)
            },
            error: res => {
              reject(res)
            }
          })
        }
      })
    }
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * 匹配后台返回的菜单信息和前端定义的路由
 * @param routes 前端定义好的异步路由
 * @param menus 后台返回的菜单
 */
export function filterAsyncRoutes(routes = [], menus = []) {
  const res = []

  routes.forEach(route => {
    // 复制一遍路由，这样改变tmp的同时路由不会受影响
    const tmp = {
      ...route
    }

    // 是否匹配到了
    if (hasPermission(menus, tmp)) { // 有符合的匹配项
      // 找出那一条匹配成功的路由项
      const findMenu = menus.find((menu, index, menus) => {
        return menu.name.includes(tmp.name)
      })

      // 赋权
      if (findMenu.hasOwnProperty('auth')) {
        tmp.meta = {
          ...tmp.meta,
          ...findMenu.auth
        }
      }

      // 如果该路由项中含有子路由，子路由也是需要和菜单进行匹配的
      if (findMenu.hasOwnProperty('children') && findMenu.children.length) {
        // 子路由匹配的步骤和父路由一样
        tmp.children = filterAsyncRoutes(tmp.children, findMenu.children)
      } else {
        // 将匹配不到的子路由从路由中删除
        delete tmp.children
      }

      // 最后得到的结果就是和后台返回菜单匹配一致的异步路由值
      res.push(tmp)
    }
  })

  return res
}

/**
 * Use meta.role to determine if the current user has permission
 * @param menus 后台返回的菜单
 * @param route 前端定义好的异步路由中的项
 */
function hasPermission(menus, route) {
  // 进行匹配
  if (route.name) { // 前提是异步路由要存在name
    // 匹配的规则是，name要一致，只要匹配到就返回true，停止继续往下循环
    return menus.some(menu => route.name.includes(menu.name))
  } else {
    return true
  }
}

export default permission
