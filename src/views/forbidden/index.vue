<template>
  <div>
    <div class="app-container">
      <el-card>
        <div slot="header">用户列表</div>
        <basics-search ref="search" :searchs="searchs" @submitSearch="submitSearch" />
        <basics-table
          :list="list"
          :columns="columns"
          :loading="loadings._ops_api_v1_forbidden_get_user_list_by_keyword"
          destroy-on-close
        />
      </el-card>
      <el-divider />
      <el-card>
        <div slot="header">用户信息</div>
        <basics-search ref="search2" :searchs="searchs2" @submitSearch="submitSearch2" />
        <basics-table
          :list="list2"
          :columns="columns2"
          :action-function="actionFunction"
          :loading="loadings._ops_api_v1_forbidden_get_user_infos_by_uid"
          destroy-on-close
        />
      </el-card>

      <dialog-forbid v-if="['forbid', 'unforbid'].includes(dialogType)" :dialog-type="dialogType" :dialog-data="dialogData" @handleDialogVis="handleDialogVis" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getForbiddenUserList, getUserInfosByUid } from '@/api/forbidden'
import searchs, { searchs2 } from './searchs'
import columns, { columns2, actions } from './columns'
import DialogForbid from './components/dialogForbid'

export default {
  name: 'Forbidden',
  components: { DialogForbid },
  data() {
    return {
      searchs,
      searchs2,
      list: [],
      list2: [],
      columns,
      columns2,
      actionFunction: actions({ handleTableActions: this.handleTableActions }),
      dialogType: '',
      dialogData: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {},
  mounted() {

  },
  methods: {
    submitSearch(val, reset) {
      if (reset) {
        this.list = []
        return
      }
      getForbiddenUserList({ ...val })
        .then(({ data }) => {
          this.list = data
        })
    },
    submitSearch2(val, reset) {
      if (reset) {
        this.list2 = []
        return
      }

      getUserInfosByUid({ ...val })
        .then(({ data }) => {
          this.list2 = data
        })
    },
    handleTableActions(type, rowData) {
      this.handleDialogVis(type, rowData)
      // switch (type) {
      //   // 查看详情
      //   case 'forbid': {
      //     this.handleDialogVis('forbid', rowData)
      //     break
      //   }
      // }
    },
    handleDialogVis(type, data, refresh) {
      this.dialogType = type
      this.dialogData = data || {}
      refresh && this.$refs.search2.search()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
