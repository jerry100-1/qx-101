<template>
  <div class="login-page main-container">
    <div class="login-bg"></div>
    <div class="content-layout">
      <div class="title-wrapper">
        <div class="main-title">
          <span class="brand">记账宝</span>
          <span class="brand-en">meite</span>
        </div>
        <div class="sub-title">你的记账宝管家</div>
      </div>
      <div class="form-panel">
        <div class="form-wrapper">
          <form @submit.prevent="login" class="login-form">
            <div class="form-title">欢迎使用</div>
            <div class="form-subtitle">记账宝后台管理系统</div>
            <div class="form-input-group">
              <el-input
                :disabled="isLoggingIn"
                class="form-input"
                type="text"
                placeholder="请输入用户名"
                v-model.trim="name">
                <img slot="prefix" class="input-icon" src="../assets/images/icon-user.png">
              </el-input>
              <el-input
                :disabled="isLoggingIn"
                class="form-input"
                type="password"
                placeholder="请输入密码"
                v-model="pwd">
                <img slot="prefix" class="input-icon" src="../assets/images/icon-pwd.png">
              </el-input>
              <!-- <el-input
                :disabled="isLoggingIn"
                class="form-input code-input"
                type="text"
                :maxlength="4"
                placeholder="请输入验证码"
                v-model.trim="code">
                <img slot="prefix" class="input-icon" src="../assets/images/icon-code.png">
                <img slot="suffix" @click="refreshCode" :src="codeImgUrl" title="看不清? 换一张" class="code-img">
              </el-input> -->
            </div>
            <el-button :loading="isLoggingIn" native-type="submit" type="primary" class="btn-login">登录</el-button>
          </form>
        </div>
      </div>
    </div>
    <iframe ref="login-iframe" @load="loginCallback" name="login-no-redirect" class="d-none border-0" style="width: 0; height: 0;"></iframe>
    <form ref="login" :action="basePhp" method="post" target="login-no-redirect" class="d-none">
      <input type="hidden" name="AUTH" :value="token">
    </form>
  </div>
</template>

<script>
import * as LoginApi from '@/api/login'
import swal from 'sweetalert2'

export default {
  name: 'login',
  data () {
    return {
      codeImgUrl: null,
      name: null,
      pwd: null,
      vCode: null,
      code: null,
      isLoggingIn: false,
      isLoggedIn: false
    }
  },
  computed: {
    basePhp () {
      if (process.env.NODE_ENV === 'development') {
        return `${this.$config.HOST}/index.php`
      } else {
        return `//${location.host}/index.php`
      }
    },
    token () {
      return this.$store.getters.token
    }
  },
  created () {
    // this.refreshCode()
  },
  methods: {
    refreshCode () {
      if (this.isLoggingIn) return
      LoginApi.getLoginVcode().then(({ data }) => {
        if (data.Status === 200) {
          this.vCode = data.Result.v_code
          this.codeImgUrl = LoginApi.getVerifyImgUrl() + '&v_code=' + this.vCode
        }
      }).catch(() => {})
    },
    login () {
      if (!this.name || !this.pwd) {
        swal({
          text: '请输入用户名和密码',
          type: 'error'
        })
      } else {
        this.isLoggingIn = true
        this.$store.dispatch('LoginByUsername', {
          name: this.name,
          pwd: this.pwd
          // code: this.code,
          // vCode: this.vCode
        }).then(res => {
          const data = res.data
          if (data.Status === 200) {
            this.isLoggedIn = true
            this.$refs.login.submit()
          } else {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error'
            })
            this.isLoggingIn = false
            // this.refreshCode()
          }
        }).catch(() => {
          this.isLoggingIn = false
          // this.refreshCode()
        })
      }
    },
    loginCallback () {
      this.isLoggedIn && this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;
  background: #FDFDFD;
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 540px;
    background: url(../assets/images/login-bg.png) no-repeat;
    background-size: cover;
    background-position: center top;
  }
  .content-layout {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    padding: 110px 0 20px;
    .title-wrapper {
      width: 100%;
      text-align: center;
      .main-title {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 81px;
        .brand {
          font-family: PingFangSC-Semibold;
          font-size: 58px;
          font-weight: 600;
          line-height: 81px;
          color: rgba(253, 253, 253, 1);
        }
        .brand-en {
          font-family: PingFangSC-Regular;
          font-size: 43px;
          font-weight: 400;
          line-height: 61px;
          margin-left: 5px;
          color: rgba(253, 253, 253, 1);
        }
      }
      .sub-title {
        font-family: PingFangSC-Regular;
        font-size: 38px;
        font-weight: 400;
        line-height: 53px;
        margin-top: 9px;
        color: rgba(253, 253, 253, 1);
      }
    }
    .form-panel {
      position: relative;
      width: 670px;
      height: 538px;
      margin: 69px auto 0;
      &:before {
        content: '';
        position: absolute;
        top: 25px;
        left: 10px;
        width: 647px;
        height: 507px;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 16px 16px 16px 0px;
        filter: blur(26px);
      }
      .form-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 10;
        border-radius: 16px;
        background: rgba(255, 255, 255, 1);
        .login-form {
          text-align: center;
          overflow: hidden;
          .form-title {
            font-family: PingFangSC-Semibold;
            font-size: 40px;
            font-weight: 600;
            line-height: 56px;
            margin-top: 38px;
            color: rgba(50, 55, 76, 1);
          }
          .form-subtitle {
            font-family: PingFangSC-Regular;
            font-size: 28px;
            font-weight: 400;
            line-height: 40px;
            margin-top: 8px;
            color: rgba(50, 55, 76, 1);
          }
          .form-input-group {
            .form-input {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 388px;
              height: 58px;
              margin: 41px auto 0;
              &:first-child {
                margin-top: 48px;
              }
              .input-icon {
                display: block;
                width: 35px;
                height: 35px;
              }
            }
          }
          .btn-login {
            width: 388px;
            height: 54px;
            font-family: PingFangSC-Regular;
            font-size: 25px;
            font-weight: 400;
            line-height: 34px;
            margin-top: 53px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, 0.83);
            background: rgba(255, 136, 45, 1);
            color: #FFFFFF
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.login-page {
  .form-input {
    .el-input__inner {
      height: inherit;
      font-family: PingFangSC-Regular;
      font-size: 24px;
      font-weight: 400;
      line-height: 33px;
      padding-left: 72px;
      border-radius: 3px;
      border: 1px solid #999999;
      color: rgba(50, 55, 76, 1);
      &::placeholder {
        font-family: PingFangSC-Regular;
        font-size: 24px;
        font-weight: 400;
        color: rgba(50, 55, 76, 0.5);
      }
      &:-webkit-autofill {
        -webkit-box-shadow : 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: rgba(50, 55, 76, 1) !important;
        &:disabled {
          -webkit-text-fill-color: #c0c4cc !important;
        }
      }
    }
    &.code-input {
      .el-input__inner {
        padding-right: 100px;
      }
      .el-input__suffix {
        display: flex;
        align-items: center;
      }
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
      left: 8px;
      &:after {
        content: '';
        position: absolute;
        right: -8px;
        display: block;
        width: 1px;
        height: 26px;
        background: rgba(74, 74, 74, 1);
      }
    }
    &.is-disabled {
      .el-input__prefix,
      .el-input__suffix {
        opacity: 0.3;
      }
    }
  }
}
</style>
