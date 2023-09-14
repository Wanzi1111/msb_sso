
<template>
  <div>
    <el-drawer
      title="详情"
      size="50%"
      destroy-on-close
      :visible.sync="visible"
      @closed="handleDrawerClose"
    >
      <div v-loading="loading" style="padding: 15px 15px 40px 15px">
        <!-- <basics-search ref="search" :searchs="searchs" @submitSearch="submitSearch" /> -->
        <!-- <basics-action :actions="act" /> -->
        <basics-table
          :list="list"
          :get-list="getList"
          :columns="columns"
          :total="total"
          :list-query="listQuery"
          :action-function="actionFunction"
          destroy-on-close
        />
      </div>
    </el-drawer>
    <!-- <dialog-add-domainRecord :vis="dialogVis" :data-source="dataSource" :edit-data="editData" @handleDialogVis="handleDialogVis" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSubSystemLog } from '@/api/logs'
import { getToken } from '@/utils/auth'
import columns, { actions, basicsActions } from './config'
// import DialogAddDomainRecord from '../dialogAddDomainRecord'
import searchs from './search'

const initPagination = { page: 1, limit: 20 }

export default {
  name: 'DrawerDomainRecord',
  // components: { DialogAddDomainRecord },
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      columns,
      searchs: searchs,
      listQuery: { ...initPagination },
      actionFunction: actions({ handleTableActions: this.handleTableActions }),
      act: basicsActions(this.handleBasicsActions),
      visible: true,
      dialogVis: false,
      deploy_user: getToken('cname'),
      deptId: getToken('deptId'),
      searchQuery: {},
      needRefresh: false, // 是否有操作、需要更新列表
      editData: null
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    loading() {
      const { loadings } = this
      return loadings._ops_domain_api_v1_domainRecordList
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
    // 获取域名列表
    getList() {
      const { listQuery: { page, limit: page_size }, searchQuery } = this
      const { service: system, jwt: jwt_token } = this.dataSource
      getSubSystemLog({ page, page_size, system, jwt_token, ...searchQuery })
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
        // 删除
        case 'delete': {
          // this.$confirm('确定删除吗？', '', { type: 'warning' }).then(() => {
          //   delAnalysisRecord({ record_id: rowData.RecordId, username: this.deploy_user }).then(res => {
          //     if (res?.code === 0) {
          //       this.$message.success('删除成功')
          //       this.handleNeedRefresh()
          //     }
          //   })
          // })
          break
        }
        case 'edit': {
          this.editData = rowData
          this.dialogVis = true
          break
        }
      }
    },
    // 关闭抽屉
    handleDrawerClose() {
      this.$emit('handleDrawerVis', false, this.needRefresh)
    },
    handleBasicsActions(type) {
      switch (type) {
        case 'add': {
          this.dialogVis = true
          break
        }
      }
    },
    handleDialogVis(vis, ifRefreshList) {
      this.dialogVis = !!vis
      this.editData = null
      if (ifRefreshList) {
        this.handleNeedRefresh()
      }
    },
    handleNeedRefresh() {
      this.needRefresh = true
      this.initGetList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
