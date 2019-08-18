/* mock配置文件
  ps：mock模块会影响原生的ajax请求，使得服务器返回的blob类型变成乱码，
  所以如果在代码中有使用blob时，需要在mainjs中把mock注释掉，才能正常使用
*/
// 引入mockjs
import Mock from 'mockjs'
// 获取 mock.Random 对象
const Random = Mock.Random
const result = {
  data: {},
  resultCode: 1,
  resultMessage: 'success'
}
// mock一组数据
const loginData = () => {
  result.data = {
    token: Random.string(10)
  }
  return result
}

const smsData = () => {
  result.data = {
    code: Random.natural(1000, 9999)
  }
  return result
}
Mock.mock('/apiReplace/login', 'post', loginData)
Mock.mock('/apiReplace/sendSms', 'post', smsData)
