<template>
  <div class="navbar">
    <hamburger v-if="isAdmin" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <span class="nav-title">统一登录系统</span>

    <!-- <breadcrumb v-if="isAdmin" id="breadcrumb-container" class="breadcrumb-container" /> -->

    <!-- <el-button type="circle" icon="" /> -->
    <el-tooltip
      effect="light"
      placement="right"
    >
      <div slot="content">
        <p>1.SSO系统扫码登录（使用钉钉客户端扫码登录，只允许属于浙江艺旗教育科技有限公司员工用户登录）</p>
        <p>2.点击平台右侧头像框下拉菜单--选择“项目绑定”</p>
        <p>3.项目绑定输入登录系统的“手机账号”和“系统名称”</p>
        <p>4.短信滑块认证完成后输入收到的手机验证码，点击绑定即可完成项目绑定</p>
        <p>5.点击系统名称图标即可跳转到对应的系统</p>
      </div>
      <i class="el-icon-question" style="font-size: 20px; vertical-align: text-top; color: #e6a23c" />
    </el-tooltip>

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="avatar-nick">{{ name }}</span>
          <el-avatar :size="30" :src="avatar" />
          <i class="el-icon-caret-bottom" />
        </div>

        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <el-dropdown-item divided>-->
          <el-dropdown-item>
            <span style="display:block;" @click="handleDialogVis('bindProject')">项目绑定</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-if="env" style="float: right; margin-right: 5px;">
        <el-tag>{{ env }}</el-tag>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="centerDialogVisible"
      width="30%"
      :before-close="closeDl"
    >
      <update-password @closeDialog="centerDialogVisible = false" />
    </el-dialog>
    <dialog-bind-project v-if="dialogType === 'bindProject'" @handleDialogVis="handleDialogVis" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import DialogBindProject from './components/dialogBindProject'

const { VUE_APP_ENV_ENV } = process.env
const envTextMap = {
  'development': '本地',
  'dev': '开发',
  'test': '测试',
  'staging': '预发'
}

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    DialogBindProject
  },
  data() {
    return {
      centerDialogVisible: false,
      env: VUE_APP_ENV_ENV !== 'product' ? envTextMap[VUE_APP_ENV_ENV] || '' : '',
      dialogType: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar',
      'device',
      'isAdmin',
      'bindFromProject'
    ])
  },
  watch: {
    bindFromProject(val) {
      // clo
      if (val) {
        this.handleDialogVis('bindProject')
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('请确认，是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    },
    // 关闭弹窗
    closeDl() {
      this.centerDialogVisible = false
    },
    handleDialogVis(type) {
      this.dialogType = type
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .nav-title {
    line-height: 50px;
    margin-left: 10px;
    color: #5a5e66
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        font-size: 16px;
        display: flex;
        align-items: center;

        .avatar-nick {
          margin-right: 4px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
