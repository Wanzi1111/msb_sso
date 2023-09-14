<template>
  <div v-loading="loadings['_ops_deploy_api_v1_login-callback']" class="login-container">
    <el-form class="login-form">
      <div class="user_form">
        <div class="title-content">
          <img :src="logo" alt="">
          <h3 class="title" data-word="统一发布平台" />
        </div>
        <div id="login_container" />
        <!-- <iframe :srcdoc="iframeSrc" width="500" height="500" frameborder="0" /> -->
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

export default {
  name: 'Login',
  data() {
    return {
      logo: logo,
      redirect: undefined,
      otherQuery: {},
      iframeSrc: null,
      redirect_uri: process.env.VUE_APP_REDIRECT_URI,
      appid: process.env.VUE_APP_APPID,
      response_type: 'code',
      scope: 'snsapi_login',
      STATE: 'STATE'
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    console.log(this.$store)
  },
  mounted() {
    console.log('this.data :>> ', this.redirect_uri)
    // 背景画板
    this.backdrop = this.$refs['appBackDrop']
    document.body.insertBefore(this.backdrop, document.getElementById('app'))
    require(`@/assets/backdrops/0${Math.floor(Math.random() * 5) + 1}`)
    this.handleLoginCode()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
    document.body.removeChild(this.backdrop)
  },
  methods: {
    handleLoginCode() {
      const { code } = this.$route.query
      if (code) {
        this.handleLogin(code)
      } else {
        this.handleDingLogin()
      }
    },
    handleDingLogin() {
      const { redirect_uri, appid, response_type, scope, state } = this
      // 初始化钉钉扫码登录二维码
      var goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=${response_type}&scope=${scope}&state=${state}&redirect_uri=${redirect_uri}`)
      window.DDLogin({
        id: 'login_container', // 这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: goto, // 请参考注释里的方式
        style: 'border:none;background-color:#FFFFFF;',
        width: '365',
        height: '320'
      })

      // 处理扫码登录后的回调
      var handleMessage = (event) => {
        var origin = event.origin
        if (origin === 'https://login.dingtalk.com') { // 判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data
          // 获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=${response_type}&scope=snsapi_login&state=${state}&redirect_uri=${redirect_uri}&loginTmpCode=${loginTmpCode}`
        }
      }
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', handleMessage, false)
      } else if (typeof window.attachEvent !== 'undefined') {
        window.attachEvent('onmessage', handleMessage)
      }
    },
    handleLogin(code) {
      this.$store.dispatch('user/login', { code: code, state: 'STATE' })
        .then(() => {
          this.$router.push({ path: '/dashboard' })
        })
        .catch((err) => {
          if (err === 'login_permission_code') {
            this.$message.error('无此权限！')
          }
          console.log('err :>> ', err)
          this.$router.push({ path: '/dashboard' })
          this.handleLoginCode()
        })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #ddd;
$cursor: #ddd;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 25px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      border-bottom: 1px solid #484848;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
      &:focus {
        border-color: #65b1f7;
      }
    }
  }

}
</style>

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

#appBackDrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
}
//$bg: -webkit-linear-gradient(bottom, #005bea, #00c6fb);
$bg: #000;
$dark_gray: #DDD;
$light_gray: #DDD;

.login-container {
  min-height: 100vh;
  width: 100%;
  background: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
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

    .user_logo {
      flex: 1;
      text-align: center;

      img {
        width: 180px;
      }
    }

    .user_form {
      flex: 1;
      text-align: center;
    }
  }

  .form_box {
    margin: 40px auto;
    width: 80%;
    position: relative;
  }

  .get_code {
    position: absolute;
    border: 1px solid #1890ff;
    padding: 8px 10px;
    right: 0;
    top: 70px;
    border-radius: 4px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
    transition: all .35s;
    &:hover {
      border-color: #46a6ff;
      color: #46a6ff;
    }
  }

  .user_btn {
    width: 80%;
    height: 48px;
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

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    position: absolute;
    left: -6px;
    top: 6px;

    .svg-icon {
      font-size: 18px;
    }
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
