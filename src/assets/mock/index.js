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

const tableData = () => {
  const length = Random.integer(1, 20)
  const data = {
    totalCount: length,
    currentPage: 1,
    data: []
  }
  for (let i = 0; i < length; i++) {
    data.data[i] = {
      id: Random.id(),
      name: Random.cname(),
      age: Random.integer(1, 100),
      gender: Random.cword('男女'),
      phone: `1${Random.integer(1000000000, 9999999999)}`
    }
  }
  result.data = data
  return result
}
Mock.mock('/apiReplace/login', 'post', loginData)
Mock.mock('/apiReplace/sendSms', 'post', smsData)
Mock.mock('/apiReplace/table', 'post', tableData)
