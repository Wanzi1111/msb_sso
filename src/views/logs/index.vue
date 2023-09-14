
<template>
  <div v-loading="loading" class="app-container">
    <basics-search ref="search" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-table
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
      :attr="{'max-height': 650}"
      destroy-on-close
    />
    <drawer-domain-record v-if="drawerVis" :data-source="drawerData" @handleDrawerVis="handleDrawerVis" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSsoLog } from '@/api/logs'
import { getToken } from '@/utils/auth'
import columns, { actions } from './config'
import searchs from './searchs'
import DrawerDomainRecord from './components/drawerDomainRecord'

const initPagination = { page: 1, limit: 20 }

export default {
  name: 'Logs',
  components: {
    DrawerDomainRecord
  },
  data() {
    return {
      list: [],
      total: 0,
      columns,
      searchs,
      listQuery: { ...initPagination },
      actionFunction: actions({ handleTableActions: this.handleTableActions }),
      drawerVis: false,
      drawerData: null,
      deploy_user: getToken('cname'),
      deptId: getToken('deptId'),
      searchQuery: {}
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    loading() {
      const { loadings } = this
      return loadings._ops_domain_api_v1_domainList
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    initGetList() {
      this.listQuery = { ...initPagination }
      this.getList()
    },
    submitSearch(val) {
      this.searchQuery = val
      this.initGetList()
    },
    getList() {
      const { listQuery: { page, limit: pagesize }, searchQuery } = this
      getSsoLog({ page, pagesize, ...searchQuery })
        .then(res => {
          const { data: { log, total }} = res
          this.list = log
          this.total = ~~total
        })
        .catch(() => {
          this.list = []
          this.total = 0
        })
    },
    handleTableActions(type, rowData) {
      switch (type) {
        // 查看详情
        case 'viewDetails': {
          this.drawerData = rowData
          this.handleDrawerVis(true)
          break
        }
      }
    },
    // 处理抽屉
    handleDrawerVis(vis, ifGetList) {
      this.drawerVis = !!vis
      if (!vis) {
        this.drawerData = null
      }
      ifGetList && this.getList()
    },
    handleDialogVis(vis) {
      this.dialogVis = !!vis
      if (!vis) {
        this.dialogData = null
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
