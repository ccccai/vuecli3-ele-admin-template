import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/assets/utils/token'
import router from '@/router'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在此处设置请求头参数
    const token = getToken()
    if (token != null) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// axios response 拦截器
service.interceptors.response.use(
  response => {
    return response // 返回请求成功结果，status=200
  },
  err => {
    // 请求失败时，即status!=200
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break
        case 401:
          err.message = '未授权，请重新登录'
          break
        case 403:
          err.message = '禁止访问'
          break
        case 404:
          err.message = '请求错误,未找到该资源'
          break
        case 405:
          err.message = '请求方法未允许'
          break
        case 408:
          err.message = '请求超时'
          break
        case 413:
          err.message = '上传文件过大'
          break
        case 500:
          err.message = '服务器端出错'
          break
        case 501:
          err.message = '网络未实现'
          break
        case 502:
          err.message = '网络错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网络超时'
          break
        case 505:
          err.message = 'http版本不支持该请求'
          break
        default:
          err.message = `连接错误,${err.response.msg}`
      }
    } else {
      err.message = '当前网络状态不佳'
    }
    Message.closeAll()
    Message({
      message: err.message || '数据解析出错',
      type: 'error',
      customClass: 'errorloginwidth',
      duration: '3000'
    })
    if (err.response && err.response.status === 401) {
      store.dispatch('FedLogOut') // 前端登出，移除token
      router.replace({
        path: `/login?redirect=${window.location.href.split(/[#]/g)[1]}`
      })
    }
    return Promise.reject(err)
  }
)

export default service
