<template>
  <div>
    <el-dialog
      :title="dialogType === 'forbid' ? '封禁' : '解禁'"
      :visible.sync="visiable"
      width="600px"
      @close="onDialogClose"
    >
      <div class="form-box">
        <basics-form
          ref="formRef"
          :forms="forms"
          :loading="loadings._ops_api_v1_forbidden_forbidden_users || loadings._ops_api_v1_forbidden_open_users"
          :actions="formActions"
          @submitForm="onFormSubmit"
          @changeForm="onFormChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { forbiddenUsers, openUsers } from '@/api/forbidden'
import forms, { formActions } from './form'

export default {
  name: 'DialogForbid',
  props: {
    handleDialogVis: { type: Function, default: () => {} },
    dialogData: { type: Object, default: () => ({}) },
    dialogType: { type: String, default: '' }
  },
  data() {
    return {
      visiable: true,
      forms,
      formActions: formActions({ cancel: this.onDialogClose })
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  mounted() {
    const { dd_userid, sub_service_id, sub_service_uid } = this.dialogData
    this.$nextTick(() => {
      this.$refs.formRef.recoveryForm({ dd_userid, sub_service_id, sub_service_uid })
    })
  },
  methods: {
    onDialogClose() {
      this.$emit('handleDialogVis', '')
    },
    onFormSubmit(values) {
      const { dialogData: { username, service_name }} = this
      const fn = this.dialogType === 'forbid' ? forbiddenUsers : openUsers
      fn({ ...values, username, service_name })
        .then((res) => {
          this.$message.success(res.msg)
          this.$emit('handleDialogVis', '', '', 1)
        })
    },
    onFormChange(newValues, oldValues) {
      if (newValues.forbid_type !== oldValues.forbid_type && newValues.forbid_type) {
        const forbidMap = {
          dd_userid: { dd_userid: true, sub_service_id: false, sub_service_uid: false },
          sub_service_id: { dd_userid: true, sub_service_id: true, sub_service_uid: false },
          sub_service_uid: { dd_userid: true, sub_service_id: true, sub_service_uid: true }
        }
        this.$nextTick(() => {
          this.$refs.formRef.set({
            type: 'visible',
            data: forbidMap[newValues.forbid_type]
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-box {
    /deep/ .el-form-item__label {
      width: 130px !important;
    }
  }
</style>
