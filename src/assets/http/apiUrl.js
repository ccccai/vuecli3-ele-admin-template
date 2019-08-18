/* 全局定义接口url */

// host头，这里我们要使用代理，所以定义的字符串apiReplace是用来进行反向代理时的标记字符串。
const apiHost = '/apiReplace/'
// 密码登录
const Login = `${apiHost}login`
// 短信登录
const LoginByVin = `${apiHost}loginByVin`
// 发送短信
const SendSms = `${apiHost}sendSms`

export default {
  Login,
  LoginByVin,
  SendSms
}
