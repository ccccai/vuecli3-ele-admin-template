/* 注册 */
<template>
  <div>
    <div class="login-container">
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerFormRules"
        autocomplete="off"
        class="login-form"
        label-position="left"
      >
        <div class="title">
          欢迎登录后台管理系统
        </div>
        <el-card shadow="hover" class="login-card">
          <div class="login-tab">
            <div class="tab-item">
              注册
            </div>
          </div>
          <el-form-item prop="phoneNumber" class="login-input-item">
            <el-input
              v-model="registerForm.phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item prop="code" class="login-input-item">
            <el-input
              v-model="registerForm.code"
              type="number"
              name="code"
              placeholder="请输入短信验证码"
              maxlength="4"
            />
            <span :style="{ cursor: isOvertime ? 'default' : 'pointer'}" class="code" @click="sendMessage">{{ word }}</span>
          </el-form-item>
          <el-form-item prop="password" class="login-input-item">
            <el-input
              v-model="registerForm.password"
              show-password
              name="password"
              placeholder="设置登录密码(数字+字母，最少6位)"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" class="login-input-item">
            <el-input
              v-model="registerForm.confirmPassword"
              name="confirmPassword"
              show-password
              placeholder="再次输入登录密码"
              @blur="confirmPsw"
            />
          </el-form-item>
          <div class="accept-agreement">
            <el-checkbox v-model="checked">
              我已阅读并接受
            </el-checkbox>
            <router-link :to="{name:'Agreement'}" tag="a" target="_blank" class="agreement">
              《后台管理系统用户协议》
            </router-link>
          </div>
          <el-form-item style="margin-bottom:0">
            <el-button
              :loading="loading"
              :disabled="!checked"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleRegister"
            >
              立 即 注 册
            </el-button>
          </el-form-item>
          <div class="to-login">
            <span>已有账号？</span>
            <span class="btn" @click="$router.push({name: 'Login'})">立即登录</span>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidPhoneNumber, isvalidCode, isvalidPassword } from '@/assets/utils/validate'
export default {
  name: 'Register',
  data() {
    const validatePhoneNumber = (rule, value, callback) => {
      if (!isvalidPhoneNumber(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!isvalidPassword(value)) {
        callback(new Error('密码必须是数字+字母的组合，最少6位，最多20位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!isvalidCode(value)) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        phoneNumber: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      registerFormRules: {
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      redirect: undefined,
      word: '获取验证码',
      isOvertime: false,
      time: 60,
      checked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    confirmPsw() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.closeAll()
        this.$message.warning('两次密码输入不一致')
      }
    },
    sendMessage() {
      if (this.isOvertime) {
        return false // 还在倒计时，不往下执行
      }
      const params = {
        'phone': this.registerForm.phoneNumber
      }
      if (!params.phone) {
        this.$message.closeAll()
        this.$message.error('请先输入手机号码')
        return
      }
      if (!isvalidPhoneNumber(params.phone)) {
        this.$message.closeAll()
        this.$message.error('手机号格式不正确')
        return
      }
      this.loading = true
      this.$request.httpRequest({
        method: 'post',
        url: this.API.SendSms,
        returnFullData: true,
        noLoading: true,
        hideErrorMsg: true,
        params: params,
        success: (data) => {
          this.loading = false
          this.$message.closeAll()
          this.$message.success('验证码发送成功，请留意手机短信')
          const sendTimer = setInterval(() => {
            this.isOvertime = true
            this.word = `${this.time}s后重新获取`
            this.time--
            if (this.time <= 0) {
              this.isOvertime = false
              this.time = 60
              clearInterval(sendTimer)
              this.word = '获取验证码'
            }
          }, 1000)
        },
        error: (e) => {
          this.loading = false
          const errorMsg = e.hasOwnProperty('resultMessage') ? e.resultMessage : '获取验证码失败'
          this.$message({
            message: errorMsg,
            type: 'error',
            customClass: 'errorloginwidth',
            duration: 3000
          })
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            phone: this.registerForm.phoneNumber,
            password: this.registerForm.password,
            vin: this.registerForm.code
          }
          // 校验该手机号是否已经注册
          this.$request.httpRequest({
            method: 'post',
            url: this.API.CheckPhone,
            returnFullData: true,
            noLoading: true,
            params: {
              phone: params.phone
            },
            success: (data) => {
              if (data.resultMessage === '该手机号未注册') {
                this.$request.httpRequest({
                  method: 'post',
                  url: this.API.Register,
                  returnFullData: true,
                  noLoading: true,
                  params: params,
                  success: (data) => {
                    this.$message.closeAll()
                    this.$message.success('注册成功，跳转到登录页..')
                    this.$router.push({ name: 'Login' })
                    this.loading = false
                  },
                  error: () => {
                    this.loading = false
                  }
                })
              } else {
                this.loading = false
                this.$message.closeAll()
                this.$message.error('该账户已经存在')
              }
            },
            error: () => {
              this.loading = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/styles/mixin';
@import '~@/styles/login';
</style>
