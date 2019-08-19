import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// （创建了）一个包含了modules文件夹（包含子目录）下面的，所有文件名以 `.js` 结尾的、能被 require 请求到的文件的上下文。
const modulesFiles = require.context('./modules', true, /\.js$/)
// keys() 方法用于从modules创建一个包含modules里键值的可迭代对象。
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // 模块名，取文件名
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  // 获取键名为modulePath的文件内容
  const value = modulesFiles(modulePath)
  // 将文件中的默认导出模块赋值给迭代对象modules
  modules[moduleName] = value.default
  // 返回迭代对象modules
  return modules
  // 默认值是空对象{}
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [
    // 存储vuex状态，使之刷新不丢失
    createPersistedState({
      storage: window.localStorage,
      reducer(val) {
        return {
          // 将要存储的state中的值放在这里
          user: {
            name: val.user.name
          }
        }
      }
    })
  ]
})

export default store
