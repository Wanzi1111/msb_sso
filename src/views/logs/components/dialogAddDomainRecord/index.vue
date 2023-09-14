<template>
  <div>
    <el-dialog
      :title="`${editData ? '修改' : '添加'}域名`"
      width="560px"
      :visible.sync="dialogVis"
      @closed="handleAddDomainQuit"
    >
      <div v-loading="loading" class="form-box">
        <basics-form
          ref="formRef"
          :forms="addDomainForm"
          :actions="addDomainFormAction"
          @submitForm="handleAddDomainFormSubmit"
          @changeForm="handleAddDomainFormChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import {
  addAnalysisRecord,
  updateAnalysisRecordList,
  updateAnalysisRecordRemarkList
} from '@/api/domainManage/domainList'
import { getToken } from '@/utils/auth'
import { addDomainForm, addDomainFormAction } from './config'

export default {
  name: 'DialogAddDomainRecord',
  components: {},
  props: {
    vis: {
      type: Boolean,
      default: () => false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    },
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVis: false,
      addDomainForm,
      addDomainFormAction: addDomainFormAction({ quit: this.handleAddDomainQuit }),
      deploy_user: getToken('cname'),
      deptId: getToken('deptId')
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    loading() {
      const { loadings } = this
      return loadings._ops_domain_api_v1_AddAnalysisRecord ||
              loadings._ops_domain_api_v1_UpdateAnalysisRecordList ||
              loadings.UpdateAnalysisRecordRemarkList
    }
  },
  watch: {
    vis(val) {
      this.dialogVis = val
      this.$nextTick(() => {
        if (val) {
          this.handleEditDomain()
        } else {
          this.$refs.formRef.resetFields()
        }
      })
    }
  },
  mounted() {
  },
  methods: {
    handleEditDomain() {
      if (this.editData) {
        console.log('【editData】', this.editData)
        const { RR: rr, Value: value, TTL: ttl, Line: line, Type: type, Remark: remark, Priority: priority } = this.editData
        this.$refs.formRef.set({
          type: 'defaultVal',
          data: { rr, value, ttl: ttl + '', line, type, priority: priority + '', remark }
        })
      }
    },
    handleAddDomainFormSubmit(values) {
      const { dataSource: { DomainName: domain_name }, deploy_user: username, editData } = this
      if (editData) {
        const { RR: rr, Value: value, TTL: ttl, Line: line, Type: type, Remark: remark, RecordId: record_id, Priority: priority } = editData
        const editOtherData = { rr, value, ttl: ttl + '', line, priority: priority + '', type }
        const { remark: remarkVal, ...otherVal } = values
        const payload = { ...values, ttl: ~~values.ttl, record_id, username }
        if (payload.type === 'MX') {
          payload.priority = ~~payload.priority
        }
        // 不修改备注修改其他的
        if (remarkVal === remark && !(_.isEqual(otherVal, editOtherData))) {
          updateAnalysisRecordList(payload)
            .then(res => {
              if (res.code === 0) {
                this.$message.success('修改成功～')
                this.$emit('handleDialogVis', false, true)
              }
            })
        // 修改备注未修改其他的
        } else if (remarkVal !== remark && _.isEqual(otherVal, editOtherData)) {
          updateAnalysisRecordRemarkList({ record_id, username, remark: values.remark })
            .then(res => {
              if (res.code === 0) {
                this.$message.success('修改成功～')
                this.$emit('handleDialogVis', false, true)
              }
            })
        // 都修改了
        } else if (remarkVal !== remark && !(_.isEqual(otherVal, editOtherData))) {
          if (payload.type === 'MX') {
            payload.priority = ~~payload.priority
          }
          Promise.all(
            [
              updateAnalysisRecordRemarkList({ record_id, username, remark: values.remark }),
              updateAnalysisRecordList(payload)
            ]
          )
            .then(res => {
              if (res[0].code === 0 && res[1].code === 0) {
                this.$message.success('修改成功～')
                this.$emit('handleDialogVis', false, true)
              }
            })
        }
      } else {
        const payload = { ...values, ttl: ~~values.ttl, domain_name, username }
        if (payload.type === 'MX') {
          payload.priority = ~~payload.priority
        }
        addAnalysisRecord(payload).then(res => {
          if (res?.code === 0) {
            this.$message.success('添加成功～')
            this.$emit('handleDialogVis', false, true)
          }
        })
      }
    },
    handleAddDomainFormChange(newVals, oldVals) {
      if (newVals.type && newVals.type !== oldVals.type) {
        this.$refs.formRef.set({
          type: 'visible',
          data: {
            priority: newVals.type === 'MX'
          }
        })
      }
    },
    handleAddDomainQuit() {
      this.$emit('handleDialogVis', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.form-box {
  /deep/ .el-form-item__label {
    width: 112px !important;
  }
}
</style>
