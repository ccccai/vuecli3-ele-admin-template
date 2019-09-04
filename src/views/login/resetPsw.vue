/* 重置密码 */
<template>
  <div>
    <div class="reset-container">
      <el-form
        ref="resetForm"
        :model="resetForm"
        :rules="resetFormRules"
        autocomplete="off"
        class="reset-form"
        label-position="left"
      >
        <div class="title">
          欢迎登录后台管理系统
        </div>
        <el-card shadow="hover" class="reset-card">
          <div class="reset-tab">
            <div class="tab-item">
              重置密码
            </div>
          </div>
          <el-form-item prop="phoneNumber" class="reset-input-item">
            <el-input
              v-model="resetForm.phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item prop="code" class="reset-input-item">
            <el-input
              v-model="resetForm.code"
              type="number"
              name="code"
              placeholder="请输入短信验证码"
              maxlength="4"
            />
            <span :style="{ cursor: isOvertime ? 'default' : 'pointer'}" class="code" @click="sendMessage">{{ word }}</span>
          </el-form-item>
          <el-form-item prop="newPassword" class="reset-input-item">
            <el-input
              v-model="resetForm.newPassword"
              show-password
              name="newPassword"
              placeholder="设置新的登录密码(数字+字母，最少6位)"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" class="reset-input-item">
            <el-input
              v-model="resetForm.confirmPassword"
              name="confirmPassword"
              show-password
              placeholder="再次输入登录密码"
              @blur="confirmPsw"
            />
          </el-form-item>
          <el-form-item style="margin-bottom:0">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleReset"
            >
              重 置
            </el-button>
          </el-form-item>
          <div class="to-login">
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
  name: 'Reset',
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
      resetForm: {
        phoneNumber: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      resetFormRules: {
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePass }],
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
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        this.$message.closeAll()
        this.$message.warning('两次密码输入不一致')
      }
    },
    sendMessage() {
      if (this.isOvertime) {
        return false // 还在倒计时，不往下执行
      }
      const params = {
        'phone': this.resetForm.phoneNumber
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
    handleReset() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            phone: this.resetForm.phoneNumber,
            password: this.resetForm.newPassword,
            vin: this.resetForm.code
          }
          this.$request.httpRequest({
            method: 'post',
            url: this.API.ResetPwd,
            returnFullData: true,
            noLoading: true,
            params: params,
            success: (data) => {
              this.$message.closeAll()
              this.$message.success('恭喜重置密码成功，请用新密码登录')
              this.loading = false
              this.$router.push({ name: 'Login' })
            },
            error: res => {
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
$bg: #ffffff;
$dark_gray: rgb(18, 29, 37);
$light_gray: rgb(18, 29, 37);

/* reset element-ui css */
.reset-container {
  .el-input {
    display: inline-block;
    width: 100%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: rgb(18, 29, 37) !important;
      }
    }
  }
  .el-form-item {
    margin-bottom: 25px;
  }
  .reset-card {
    border-radius: 8px;
    .el-card__body {
      padding: 40px;
    }
  }
  .accept-agreement {
    .el-checkbox {
      margin-right: 0;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/mixin';
$bg: rgb(245, 245, 245);
$dark_gray: rgb(18, 29, 37);
$light_gray: rgb(18, 29, 37);
.reset-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .reset-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 540px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    .reset-card {
      .reset-tab {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 20px 20px;
        .tab-item {
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #121d25 !important;
          }
        }
      }
      .reset-input-item {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        .code {
          position: absolute;
          right: 10px;
          top: 2px;
          font-size: 14px;
          color: #121d25;
          cursor: pointer;
          user-select: none;
        }
      }
      .to-login {
        display: flex;
        justify-content: flex-end;
        font-size: 14px;
        margin-top: 8px;
        .btn {
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
      }
      .accept-agreement {
        margin-bottom: 20px;
        font-size: 14px;
        .agreement {
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
  .title {
    font-size: 32px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    letter-spacing: 1px;
  }
}
</style>
