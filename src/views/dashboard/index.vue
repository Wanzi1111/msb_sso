<template>
  <div v-loading="loading">
    <div class="title-container">
      <basics-title line title="欢迎使用统一登录系统" />
    </div>
    <div class="app-container">
      <img src="../../assets/svg/illustration.svg" style="width: 100%; height: 280px">
    </div>
  </div>
</template>

<script>

// import { getStatistics } from '@/api/workOrderManage'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      projectList: [],
      userList: []
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    loading() {
      const { loadings } = this
      return loadings._ops_release_api_v1_instance_statistic
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  .home-container {
    padding: 20px;
    margin: 20px;
    // height: calc(100% - 40px);
    width: calc(100% - 40px);
    // position: absolute;
    // display: flex;
    // flex-direction: column;
    /*!* justify-content: center;*/
    .list-box {
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 10px 0px;
        &-title {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
        }
        &-count {
          font-size: 12px;
          color: #999;
        }
        &-index {
          width: 20px;
          height: 20px;
          text-align: center;
          font-size: 12px;
          line-height: 20px;
          border-radius: 50%;
          color: #fff;
          background: #ddd;
        }
      }
      .list-item:nth-child(1){
        i {
          background: #fa541c
        }
      }
      .list-item:nth-child(2){
        i {
          background: #faad14
        }
      }
      .list-item:nth-child(3){
        i {
          background: #08979c
        }
      }
      .list-item:last-child  {
        border-bottom: none;
      }
    }
  }
</style>
