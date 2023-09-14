<template>
  <div class="no_captcha">
    <nocaptcha style="width:'335px'" :appkey="appkey" :scene="scene" :lang="lang" @callback="getToken" />
  </div>
</template>

<script>
import { nocaptcha } from 'vue-nocaptcha'

export default {
  name: 'CaptchaCompon',
  components: {
    nocaptcha
  },

  data() {
    return {
      // nocaptcha 配置 start
      appkey: 'FFFF0N0000000000A148',
      scene: 'nc_login',
      lang: 'cn',
      upLang: '请按住滑块，拖动到最右边'
      // nocaptcha 配置 end
    }
  },
  created() {
    this.$nextTick(() => {
      document.getElementsByClassName('nc-lang-cnt')[0].innerHTML = this.upLang
    })
  },
  methods: {
    getToken(data) { // 滑块回掉
      const dat = { ...data, verif: false }
      this.$emit('getVerif', dat)
    }
  }
}
</script>
