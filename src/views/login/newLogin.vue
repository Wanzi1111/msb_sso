<template>
  <div v-loading="loadings['_ops_login_dinglogin']" class="login-container">
    <div id="login-bg">
      <vue-particles
        class="login-bg"
        color="#39AFFD"
        hover-mode="grab"
        click-mode="push"
        shape-type="circle"
        lines-color="#8DD1FE"
        :particle-opacity="0.7"
        :particles-number="100"
        :particle-size="4"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        :click-effect="true"
      />
    </div>
    <el-form v-if="loginType === 'phone'" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
      <div class="user_form">
        <div class="title-content">
          <img :src="logo" alt="">
          <h3 class="title" data-word="统一登录平台" />
        </div>
        <div class="form_box">
          <el-form-item prop="phone">
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="手机号"
              name="phone"
              type="text"
              maxlength="11"
            />
          </el-form-item>
          <div class="sms-box">
            <captcha-compon class="no_captcha" @getVerif="getVerif" />
            <el-form-item prop="smsCode" class="sms-item">
              <el-input
                ref="smsCode"
                v-model="loginForm.smsCode"
                placeholder="验证码"
                name="smsCode"
                type="text"
                maxlength="11"
              />
            </el-form-item>
          </div>
        </div>
        <el-button :disabled="verif" class="user_btn" :loading="loadings['_ops_login_dinglogin']" type="primary" @click.native.prevent="handlePhoneLoginCb">登&emsp;录</el-button>
      </div>
    </el-form>
    <el-form v-else class="login-form">
      <div class="user_form">
        <div class="title-content">
          <img :src="logo" alt="">
          <h3 class="title" data-word="统一登录平台" />
        </div>
      </div>
    </el-form>
    <div class="copyright">
      <span>Powered by </span>
      <svg-icon icon-class="copyright" />
      <span> 2022 MEISHUBAO.COM</span>
    </div>
    <canvas id="appBackDrop" ref="appBackDrop" />
  </div>
</template>

<script>
import logo from '@/assets/images/msb-transparent.png'
import { mapGetters } from 'vuex'
import { getEnv } from '@/utils'
import CaptchaCompon from '@/layout/components/components/dialogBindProject/no-captcha.vue'
import { sendSms } from '@/api/login'

export default {
  name: 'NewLogin',
  components: {
    CaptchaCompon
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (value.length < 11 || value.length > 11) {
        callback(new Error('手机号需11位'))
      } else {
        callback()
      }
    }
    const validateSmsCode = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      verif: '',
      logo: logo,
      loginForm: {
        phone: '',
        smsCode: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }]
      },
      // dingtalkAuthUri: 'https://oapi.dingtalk.com/connect/qrconnect',
      dingtalkAuthUri: 'https://login.dingtalk.com/oauth2/auth',
      redirect_uri: process.env.VUE_APP_REDIRECT_URI,
      appkey: process.env.VUE_APP_APPKEY,
      appsecret: process.env.VUE_APP_APPSECRET,
      response_type: 'code',
      scope: 'openid',
      // scope: 'snsapi_login',
      prompt: 'consent',
      state: 'STATE',
      loginType: 'ding'
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  mounted() {
    this.handleLoginPre()
  },
  methods: {
    handleLoginPre() {
      console.log('VUE_APP_LOGIN_TYPE', getEnv('VUE_APP_LOGIN_TYPE'))
      if (getEnv('VUE_APP_LOGIN_TYPE') === '0') {
        this.handlePhoneLogin()
      } else {
        this.handleDingLogin()
      }
    },
    // 滑块、验证码处理
    getVerif(data) {
      // data 成功回调内容
      this.verif = data.verif
      Object.assign(this.loginForm, data)
      if (!this.loginForm.phone) {
        this.$message.error('请先输入手机号！')
        return
      }
      sendSms({ mobile: this.loginForm.phone })
        .then(() => {
          this.$message.success('发送短信验证码成功，有效期为5分钟。')
        })
    },
    // 手机号登录预处理
    handlePhoneLogin() {
      this.loginType = 'phone'
    },
    // 钉钉登录预处理
    handleDingLogin() {
      const { authCode } = this.$route.query
      if (authCode) {
        this.handleDingTalkLoginCb(authCode)
      } else {
        this.handleDingTalkLogin()
      }
    },
    // 钉钉授权
    handleDingTalkLogin() {
      const { dingtalkAuthUri, redirect_uri, appkey, response_type, scope, prompt } = this
      window.location.href = `${dingtalkAuthUri}?redirect_uri=${redirect_uri}&client_id=${appkey}&response_type=${response_type}&scope=${scope}&prompt=${prompt}`
    },
    // 钉钉登录
    handleDingTalkLoginCb(code) {
      // this.handleLogin({ authCode: code }, 'ding')
      this.$store.dispatch('user/login', { payload: { authCode: code }, type: 'ding' })
        .then(() => {
          this.$router.push({ path: '/dashboard' })
        })
        .catch((err) => {
          const errMsg = `${err.message}（点击x号重新登录）`
          this.$message({
            message: errMsg,
            type: 'error',
            duration: 0,
            showClose: true,
            onClose: () => {
              this.$router.replace('/dashboard')
              this.handleLoginPre()
            }
          })
        })
    },
    // 手机号登录
    handlePhoneLoginCb() {
      const { phone, smsCode } = this.loginForm
      this.$store.dispatch('user/login', { payload: { mobile: phone, code: smsCode }, type: 'phone' })
        .then(() => {
          this.$router.push({ path: '/dashboard' })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

@keyframes move {
    10% {
        top: -0.4px;
        left: -1.1px;
    }
    20% {
        filter: hue-rotate(-90deg);
        top: 0.4px;
        left: -0.2px;
    }
    30% {
        filter: hue-rotate(0);
        left: .5px;
    }
    40% {
        top: -0.3px;
        left: -0.7px;
    }
    50% {
        filter: blur(1px);
        left: 0.2px;
    }
    60% {
        filter: blur(0);
        top: 1.8px;
        left: -1.2px;
    }
    70% {
        top: -1px;
        left: 0.1px;
    }
    80% {
        top: -0.4px;
        left: -0.9px;
    }
    90% {
        left: 1.2px;
    }
    100% {
        left: -1.2px;
    }
}

//$bg: -webkit-linear-gradient(bottom, #005bea, #00c6fb);
$bg: #000;
$dark_gray: #DDD;
$light_gray: #DDD;

.login-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: $bg;
  overflow: hidden;

  .login-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  .login-form {
    position: relative;
    z-index: 2;
    width: 520px;
    height: 400px;
    max-width: 100%;
    padding: 0 50px;
    margin: 120px auto 0;
    /*background-color: rgba(255,255,255,.15);*/
    border-radius: 10px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(255,255,255,.1);

    .user_form {
      flex: 1;
      text-align: center;
    }
  }

  .form_box {
    margin: 20px auto;
    width: 80%;
    position: relative;
  }

  .sms-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    .sms-item {
      width: 80px;
    }
  }

  .no_captcha{
    opacity: 0.9;
      /deep/.nc_scale{
        width: 236px;
        span{
          height: 34px;
        }
      }
  }

  .user_btn {
    width: 80%;
    // height: 48px;
    font-size: 16px;
    box-shadow: 0 4px 10px #005eea, 0 0 1px #005eea;
  }

  .code_val {
    /deep/ input {
      padding-right: 105px;
    }
  }

  .copyright {
    position: relative;
    color: #76808a;
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
  }

  .title-content {
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80px;
      position: absolute;
      left: 22%;
      top: 10%;
    }

    .title {
      font-size: 22px;
      position: absolute;
      top: -20%;
      left: 63%;
      transform: translate(-50%, -50%) scale(2.5);
      width: 140px;
      font-family: Raleway, Verdana, Arial;
      color: $light_gray;
      text-align: center;
      font-weight: bold;
      // font-family: serif, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      transform: translate(-50%, -50%)
    }
    .title::before {
      content: attr(data-word);
      position: absolute;
      top: 0;
      left: 0;
      height: 36px;
      color: red;
      overflow: hidden;
      z-index: 2;
      filter: contrast(200%);
      text-shadow: 1px 0 0 red;
      animation: move 0.95s infinite;
    }
    .title::after {
        content: attr(data-word);
        position: absolute;
        top: 0;
        left: -1px;
        height: 36px;
        color: rgba(255, 255, 255, 0.8);
        overflow: hidden;
        z-index: 3;
        color: cyan;
        filter: contrast(200%);
        text-shadow: -1px 0 0 cyan;
        mix-blend-mode: lighten;
        animation: move 1.1s infinite -0.5s;
    }
  }
}
</style>
