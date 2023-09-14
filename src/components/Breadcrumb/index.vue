<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { asyncRoutes } from '@/router'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const routeStrArr = (route) => {
        const fxRouter = []
        const loop = (route, prefix = '', level = 0) => {
          let arr = []
          route.map(item => {
            const path = `${prefix}${level !== 0 ? '/' : ''}${item.path}`
            arr.push(path)
            fxRouter.push({
              meta: item.meta,
              path: path,
              redirect: item.redirect
            })
            if (item.children && item.children.length) {
              arr = [...arr, ...loop(item.children, item.path, level + 1)]
            }
          })
          return arr
        }
        return {
          arr: loop(route),
          fxRouter
        }
      }

      const routers = asyncRoutes
      // 读取路由列表，组装成一级数组
      const { arr, fxRouter } = routeStrArr(routers)

      // 当前路由path
      const nowPath = this.$route.path

      // only show routes with meta.title
      // let matched = this.$route.matched.filter(item => item.meta && item.meta.title)

      let matched = []
      arr.map((item, index) => {
        // 取出匹配到的父级路由
        if (item !== '/' && nowPath.indexOf(item) !== -1) {
          matched.push(fxRouter[index])
        }
      })

      const first = matched[0]

      if (!this.isDashboard(first)) {
        // 有主页后设置为主页
        matched = [{ path: '/dashboard', meta: { title: '主页' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
