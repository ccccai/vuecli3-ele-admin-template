/* 封装axios请求 */
/* 用法示例：(*)为必须参数
  this.$request.httpRequest({
    headers: false, // 是否格式化参数
    (*)method: 'post', // 请求方式，post或get
    (*)url: this.API.ResetPassword, // 请求地址，请求地址的配置在@/api/apiUrl.js
    noLoading: true, // 是否显示全局Loading遮罩，默认每个请求都显示遮罩，即默认不设置该参数。如果需要某个请求不加遮罩，就设置noLoading: true即可
    returnFullData: true, // 是否返回完整数据，例如接口返回的数据格式为{ code:0, data: [], meaasge:''}，则默认请求成功之后的回调函数的参数为data:[]，如果设置returnFullData: true，则回调参数为{ code:0, data: [], meaasge:''}
    hideErrorMsg: true, // 是否展示错误提示
    (*)params: {}, // 请求参数，object类型
    (*)success: (data) => { // 请求成功之后的回调函数，data是回调参数
      // 在这里写请求成功后的逻辑
    },
    error: (err) => { 请求不成功之后的回调函数，data是回调参数
      // 在这里写请求报错后的逻辑
    }
  })
*/
import service from './service'
import { Message, Loading } from 'element-ui'
import Qs from 'qs'

function requestMethods(options) {
  return new Promise((resolve, reject) => {
    try {
      switch (options.method) {
        case 'post':
          if (options.headers) {
            resolve(
              service({
                url: options.url,
                method: 'post',
                data: options.params
              })
            )
          } else {
            resolve(
              service({
                url: options.url,
                method: 'post',
                data: Qs.stringify(options.params)
              })
            )
          }
          break
        case 'get':
          resolve(
            service({
              url: options.url,
              method: 'get',
              params: options.params
            })
          )
          break
        default: // 默认是get调用
          resolve(
            service({
              url: options.url,
              method: 'get',
              params: options.params
            })
          )
          break
      }
    } catch (e) {
      Message({
        message: 'HTTP请求方法出错！',
        type: 'error',
        duration: 3 * 1000
      })
      reject('methods error!')
    }
  })
}

function httpRequest(options = {}) {
  let loading
  if (!options.noLoading) {
    // 启用全局loading
    loading = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }

  try {
    requestMethods(options).then(response => {
      // 成功返回结果的逻辑。根据接口定义的数据返回格式 修改判断条件
      const data = response.data
      if (data.resultCode === '1' || data.resultCode === 1) {
        // 成功
        const result = options.returnFullData ? data : data.data // 返回完整数据结构还是只返回有效数据
        options.success(result)
      } else {
        if (!options.hideErrorMsg) {
          // 失败
          let errorMsg = data.hasOwnProperty('resultMessage') ? data.resultMessage : '数据解析错误'
          switch (data.resultCode) {
            case '401':
              errorMsg = '暂无操作权限'
              break
          }
          Message.closeAll()
          Message({
            message: errorMsg,
            type: 'error',
            customClass: 'errorloginwidth',
            duration: 3000
          })
        }
        options.error(data)
      }
      if (!options.noLoading) {
        // loading完毕
        loading.close()
      }
    }).catch(e => {
      options.error(e.response)
    })
  } catch (e) {
    Message({
      message: 'Axios请求出错！',
      type: 'error',
      duration: 3 * 1000
    })
  }
}
export default {
  httpRequest
}
