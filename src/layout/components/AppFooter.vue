<template>
  <div class="app-footer" :class="{'app-foot-fixed': !isAdmin}">
    <p>Copyright <svg-icon icon-class="copyright" /> 浙江艺旗教育科技有限公司产研技术部出品</p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar',
      'isAdmin'
    ])
  }
}
</script>
<style lang="scss" scoped>
  .app-footer {
    background-color: #f1f1f1;
    height: 36px;
    p {
      font-size: 14px;
      line-height: 40px;
      margin: 0;
      text-align: center;
      color: #999;
    }
  }
  .app-foot-fixed {
    width: 100%;
    position: fixed;
    left: 0px;
    bottom: 0px;
  }
</style>
