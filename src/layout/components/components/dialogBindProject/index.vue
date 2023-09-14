<template>
  <div>
    <el-dialog
      title="项目绑定"
      :close-on-click-modal="false"
      :visible.sync="visiable"
      width="520px"
      @close="onDialogClose"
    >
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="账号" prop="binging_mobile">
            <el-input v-model="form.binging_mobile" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="项目列表" prop="sub_service_id">
            <el-select v-model="form.sub_service_id" filterable placeholder="请选择项目">
              <el-option v-for="v in projectList" :key="v.sid" :label="v.service_name" :value="v.sid" />
            </el-select>
          </el-form-item>
          <el-form-item label="验证码" prop="smsCode">
            <div class="sms-box">
              <captcha-compon class="no_captcha" @getVerif="getVerif" />
              <el-input v-model="form.smsCode" class="smsCode" placeholder="验证码" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onFormSubmit">立即绑定</el-button>
            <el-button @click="onDialogClose">取消</el-button>
          </el-form-item>
          <!-- <el-form-item>

          </el-form-item> -->
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllSubService, bindingProject, getSmsCode } from '@/api/project'
import { getToken } from '@/utils/auth'
import CaptchaCompon from './no-captcha.vue'

const rules = {
  binging_mobile: [{ required: true, message: '请输入账户！', trigger: 'blur' }],
  sub_service_id: [{ required: true, message: '请选择项目！', trigger: 'blur' }],
  // verif: [{ required: true, message: '请进行滑块认证！' }],
  smsCode: [{ required: true, message: '请输入手机验证码！', trigger: 'blur' }]
}

export default {
  name: 'DialogBindProject',
  components: { CaptchaCompon },
  props: {
    handleDialogVis: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visiable: true,
      rules,
      projectList: [],
      dd_userid: getToken('userid'),
      form: {
        binging_mobile: getToken('mobile'),
        sub_service_id: '',
        verif: '',
        smsCode: ''
      }
    }
  },
  computed: {
    ...mapGetters(['loadings', 'bindFromProject'])
  },
  mounted() {
    this.getAllSubService()
  },
  methods: {
    getAllSubService() {
      getAllSubService()
        .then(res => {
          this.projectList = res.data
          this.form.sub_service_id = res.data.filter(v => v.redirect_url?.match(this.bindingProject))?.[0]?.sub_service_id
        })
    },
    getVerif(data) {
      this.form.verif = data?.token || ''
      const { dd_userid, form: { binging_mobile, sub_service_id }} = this
      const { VUE_APP_ENV_ENV } = process.env
      getSmsCode({ dd_userid, binging_mobile, sub_service_id })
        .then(res => {
          // 测试环境固定验证码
          if (['development', 'test'].includes(VUE_APP_ENV_ENV)) {
            this.form.smsCode = '1234'
            this.$message.success('测试环境已自动回填验证码~')
          } else {
            this.$message.success('发送短信验证码成功，有效期为5分钟。')
          }
        })
    },
    onDialogClose(ifRefreshList) {
      this.$emit('handleDialogVis', '', '', ifRefreshList)
    },
    onFormSubmit() {
      if (!this.form.verif) {
        this.$message.error('请先进行滑块认证！')
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { dd_userid, form: { binging_mobile, sub_service_id, smsCode }} = this
          bindingProject({ dd_userid, binging_mobile, sub_service_id, code: smsCode })
            .then(() => {
              this.$message.success('绑定成功~')
              this.$store.dispatch('global/refreshProject')
              this.$emit('handleDialogVis', '', '')
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  /deep/ .el-select {
    width: 100%
  }

  .sms-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .no_captcha{
      width: 300px;
      opacity: 0.9;
      /deep/.nc_scale{
        width: 300px;
        span{
          height: 34px;
        }
      }
    }
    .smsCode {
      width: 90px !important;
    }
  }
}
</style>
