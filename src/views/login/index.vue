/* 登录 */
<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="activeTab===1 ? loginByPswRules : loginByMsgRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title">
        欢迎登录后台管理系统
      </div>
      <el-card shadow="hover" class="login-card">
        <div class="login-tab">
          <div
            v-for="item in tabList"
            :key="item.value"
            :style="{'color': activeTab === item.value ? '#121d25' : '#ccc'}"
            class="tab-item"
            @click="handleTab(item.value)"
          >
            {{ item.name }}
          </div>
        </div>
        <template v-if="activeTab===1">
          <el-form-item prop="user" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.user"
              autocomplete="on"
              name="user"
              type="text"
              placeholder="手机号/用户名"
              style="padding-left: 45px"
            />
          </el-form-item>
          <el-form-item prop="password" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.password"
              autocomplete="on"
              show-password
              name="password"
              placeholder="请输入密码"
              style="padding-left: 45px"
              @paste.native.capture.prevent="() => {return}"
              @copy.native.capture.prevent="() => {return}"
              @cut.native.capture.prevent="() => {return}"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <div class="forget-psw" @click="$router.push({name: 'ResetPsw'})">
            忘记密码？
          </div>
        </template>
        <template v-if="activeTab===2">
          <el-form-item prop="phoneNumber" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.phoneNumber"
              autocomplete="on"
              name="phoneNumber"
              type="text"
              placeholder="手机号"
              style="padding-left: 45px"
            />
          </el-form-item>
          <el-form-item prop="code" class="login-input-item">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.code"
              autocomplete="off"
              type="number"
              name="code"
              placeholder="验证码"
              maxlength="4"
              style="padding-left: 45px"
              @keyup.enter.native="handleLogin"
            />
            <span :style="{ cursor: isOvertime ? 'default' : 'pointer'}" class="code" @click="sendMessage">{{ word }}</span>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            style="width:100%;"
            @click="$router.push({name: 'Register'})"
          >
            立 即 注 册
          </el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { isvalidPhoneNumber, isvalidCode, isvalidPassword } from '@/assets/utils/validate'
export default {
  name: 'Login',
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
        callback(new Error('密码格式不正确'))
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
      loginForm: {
        user: '',
        phoneNumber: '',
        password: '',
        code: ''
      },
      loginByPswRules: {
        user: [{ required: true, trigger: 'blur', message: '请输入用户名或手机号码' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loginByMsgRules: {
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        code: [{ required: true, trigger: 'change', validator: validateCode }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      activeTab: 1,
      tabList: [
        {
          value: 1,
          name: '密码登录'
        },
        {
          value: 2,
          name: '短信登录'
        }
      ],
      word: '获取验证码',
      isOvertime: false,
      time: 60
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
  created() {
    this.$store.commit('SET_DEFAULT_PAGE_PATH', '')
  },
  methods: {
    sendMessage() {
      if (this.isOvertime) {
        return false // 还在倒计时，不往下执行
      }
      const params = {
        'phone': this.loginForm.phoneNumber
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
    handleTab(tab) {
      this.activeTab = tab
      this.$refs.loginForm.resetFields()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {}
          switch (this.activeTab) {
            case 1:
              params = {
                'username': this.loginForm.user,
                'password': this.loginForm.password
              }
              this.$store.dispatch('Login', params).then(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/home' })
              }).catch(() => {
                this.loading = false
              })
              break
            case 2:
              params = {
                'phone': this.loginForm.phoneNumber,
                'vin': this.loginForm.code
              }
              this.$store.dispatch('LoginByVin', params).then(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/home' })
              }).catch(() => {
                this.loading = false
              })
          }
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
