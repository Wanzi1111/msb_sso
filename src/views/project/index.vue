<template>
  <div>
    <div v-loading="loadings._ops_api_v1_sub_service_user_services" class="app-container">
      <div v-if="fromProject">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="from-project-box">
              <el-tooltip effect="light" :content="fromProject.redirect_url">
                <div slot="content">
                  <div style="text-align: center;">{{ fromProject.sub_id }}</div>
                  <div>{{ fromProject.redirect_url }}</div>
                </div>
                <div class="project-item-box" @click="jump(fromProject, true)">
                  <img class="item-circle" :src="fromProject.icon_url">
                  <div class="item-title">{{ fromProject.service_name }}</div>
                </div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="list.length" style="margin-top: 50px;">
        <el-row :gutter="24">
          <el-col v-for="v in list" :key="v.redirect_url" :span="4">
            <div>
              <el-tooltip effect="light" :content="v.redirect_url">
                <div slot="content">
                  <div style="text-align: center;">{{ v.sub_id }}</div>
                  <div>{{ v.redirect_url }}</div>
                </div>
                <div class="project-item-box" @click="jump(v)">
                  <img class="item-circle" :src="v.icon_url">
                  <div class="item-title">{{ v.service_name }}</div>
                </div>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-empty>
          <!-- <el-button type="primary">按钮</el-button> -->
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { gotoJump, unBindingProject, getSubService } from '@/api/project'
import { jump } from '@/utils'

const getLocalStorageItem = (val) => {
  const item = localStorage.getItem(val)
  if (item === 'undefined' || !val) {
    return undefined
  }
  return item
}

export default {
  name: 'Project',
  data() {
    return {
      list: [],
      fromProject: null, // 从已绑定的项目中过滤出的跳转来源
      from: '', // 跳转来源
      productUrl: '' // 本地开发时，跳转到sso需加上此参数，值为当前环境的线上地址。用于匹配跳转时是否跳转到本地
    }
  },
  computed: {
    ...mapGetters(['loadings', 'refreshProjectFlag'])
  },
  watch: {
    refreshProjectFlag() {
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    getList() {
      getSubService()
        .then(({ data }) => {
          data.forEach(v => {
            v.phone = v.sub_id.slice(0, 3) + '****' + v.sub_id.slice(7)
          })
          this.list = data
          this.handleFromProject()
        })
    },
    handleFromProject() {
      const from = getLocalStorageItem('from')
      const productUrl = getLocalStorageItem('productUrl')
      if (from) {
        this.from = from
        this.productUrl = productUrl
        const mtchingRulesUrl = productUrl || from
        // 过滤出来源项目信息
        const fromProject = this.list.filter(v => mtchingRulesUrl.match(v.redirect_url))?.[0]

        if (fromProject) {
          this.fromProject = fromProject
        } else {
          // 首次绑定项目 快捷绑定
          this.$store.dispatch('global/toBindFromProject', mtchingRulesUrl)
        }
        localStorage.removeItem('from')
        localStorage.removeItem('productUrl')
      }
    },
    /**
     * @param {object} val 跳转对象
     * @param {boolean} type 为true时为from跳转（从别的项目跳转来登录）
     */
    jump(val, type) {
      const { dd_userid, sub_id, service_name, sub_service_id, jwt_url, redirect_url } = val
      gotoJump({
        uid: dd_userid,
        sub_uid: sub_id,
        system: service_name,
        check_url: jwt_url,
        redirect_url: redirect_url
      })
        .then(({ data, redirect_url }) => {
          const { from, productUrl } = this
          let url = redirect_url
          // 兼容下本地跳转登录，要不本地老往product环境跳转
          if ((productUrl && productUrl.match(redirect_url)) || (from && from.match(redirect_url))) {
            url = from
          }
          // 保留跳转来源redirect等路由信息
          url = `${url}${url.includes('?') ? '&' : '?'}auth_code=${data}`

          this.from = ''
          this.fromProject = ''
          this.productUrl = ''
          jump(url)
        })
        .catch(({ code }) => {
          if (type) this.fromProject = null
          if (code === 404) {
            unBindingProject({ dd_userid, sub_service_id, binging_mobile: sub_id })
              .then(() => {
                this.$store.dispatch('global/refreshProject')
              })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.project-item-box {
  width: 180px;
  height: 120px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  .item-circle {
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    font-size: 24px;
    color: #fff;
    border-radius: 16px;
    box-shadow: 0 0 5px #999;
  }
  .item-title {
    font-size: 14px;
    color: #5a5e66;
  }
  .item-link {
    font-size: 14px;
    color: #808591;
  }
}
.from-project-box {
  margin: 0 auto;
  width: 300px;
  height: 140px;
  .project-item-box {
    width: 300px;
    height: 140px;
    .item-circle {
      width: 100px;
      height: 100px;
      border-radius: 24px;
    }
    .item-title {
      font-size: 16px;
    }
  }
}
</style>
