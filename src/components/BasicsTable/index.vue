/**
* @author: Liwei
* @description: 公共基础表格
* @date: 2020/1/3
*/
<template>
  <div class="basics-table">
    <div v-if="defaultPlugins && defaultPlugins.length" class="table-action">
      <template v-for="(item, index) in defaultPlugins">
        <custom-render v-if="item.render" :key="index" :render="(e) => item.render(e, index)" />
        <template v-else>
          <el-tooltip v-if="renderPlugins('download', item)" :key="index" effect="dark" content="下载" placement="top">
            <svg class="icon" aria-hidden="true" @click="downloadTable">
              <use xlink:href="#icon-download" />
            </svg>
          </el-tooltip>
          <el-tooltip v-if="renderPlugins('colum-height', item)" :key="index" effect="dark" content="密度" placement="top">
            <el-dropdown trigger="click" @command="changeColum">
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-colum-height" />
                </svg>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="medium">默认</el-dropdown-item>
                <el-dropdown-item command="small">中等</el-dropdown-item>
                <el-dropdown-item command="mini">紧凑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <!-- <el-tooltip v-if="renderPlugins('fullscreen', item)" :key="index" effect="dark" :content="fullscreenState ? '退出全屏' : '全屏'" placement="top">
            <svg class="icon" aria-hidden="true" @click="fullscreen">
              <use :xlink:href="fullscreenState ? '#icon-fullscreen-exit' : '#icon-fullscreen'" />
            </svg>
          </el-tooltip> -->
          <el-tooltip v-if="renderPlugins('reload', item)" :key="index" effect="dark" content="刷新" placement="top">
            <svg class="icon" aria-hidden="true" @click="getList">
              <use xlink:href="#icon-reload" />
            </svg>
          </el-tooltip>
          <el-tooltip v-if="renderPlugins('setting', item)" :key="index" effect="dark" content="列设置" placement="top">
            <el-popover
              placement="bottom"
              trigger="click"
            >
              <svg slot="reference" class="icon" aria-hidden="true">
                <use xlink:href="#icon-setting" />
              </svg>
              <el-tree
                ref="tree"
                class="setting-table"
                :data="columns"
                :default-checked-keys="defaultChecked"
                show-checkbox
                node-key="prop"
                default-expand-all
                check-on-click-node
                :expand-on-click-node="false"
                @check-change="checkChange"
              />
            </el-popover>
          </el-tooltip>
        </template>
      </template>
    </div>
    <el-table
      :key="tableKey"
      ref="BasicsTable"
      v-loading="loading"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :data="list"
      style="width: 100%"
      v-bind="{ border: true, fit: true, 'highlight-current-row': true, ...table, ...attr, ...attrs }"
      v-on="{...events, ...$listeners}"
    >
      <template v-for="(item, index) in columns">
        <table-column
          :key="index"
          :list="list"
          :index="index"
          :item="item"
          :checked="checked"
          :action-function="actionFunction"
          :loadings="loadings"
          :columns-slot="columnsSlot"
        >
          <template v-for="slotItem in columnsSlot" :slot="slotItem" slot-scope="scope">
            <slot :name="slotItem" :row="scope.row" :$index="scope.$index" :column="scope.column" :list="scope.list" />
          </template>
        </table-column>
      </template>
    </el-table>
    <pagination v-show="total>0" :total="total" :page-sizes="listQuery.pageSizes" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import './font/iconfont.min'
import Pagination from '../Pagination' // Secondary package based on el-pagination
import TableColumn from './components/TableColumn'
// import { exitFullscreen, launchFullscreen } from '@/utils'
const xlsxCDNJs = 'https://cdnvip.meishubao.com/vipboss/static/js/xlsx.full.min.js'
import load from './dynamicLoadScript'

export default {
  name: 'BasicsTable',
  components: {
    Pagination,
    TableColumn,
    CustomRender: {
      functional: true,
      render: (createElement, context) => {
        const h = context.props.render(createElement)
        const VNode = createElement('span').constructor
        if (h instanceof VNode) {
          return h
        } else {
          return createElement('span', h)
        }
      }
    }
  },
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    attr: {
      default: () => ({}),
      type: Object
    },
    events: {
      default: () => ({}),
      type: Object
    },
    table: {
      default: () => ({}),
      type: Object
    },
    list: {
      default: () => [],
      type: Array
    },
    columns: {
      default: () => [],
      type: Array
    },
    actionFunction: {
      default: () => ({}),
      type: Object
    },
    loadings: {
      default: () => ({}),
      type: Object
    },
    getList: {
      default: () => {},
      type: Function
    },
    total: {
      default: 0,
      type: Number
    },
    listQuery: {
      default: () => {
        return {
          page: 1,
          limit: 10
        }
      },
      type: Object
    },
    plugins: {
      default: false,
      type: [Array, Boolean]
    },
    rowStyle: {
      default: () => ({}),
      type: Object
    },
    cellStyle: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      fullscreenState: false,
      attrs: {},
      defaultPlugins: [],
      defaultChecked: [],
      checked: [],
      tableKey: 0
    }
  },
  computed: {
    columnsSlot() {
      const { columns } = this
      const slotLoop = (list) => {
        let slot = []
        list.map(item => {
          if (item.slot) {
            slot.push(item.slot)
          }
          if (item.children && item.children.length) {
            slot = [
              ...slot,
              ...slotLoop(item.children)
            ]
          }
        })
        return slot
      }
      return slotLoop(columns)
    }
  },
  watch: {
    columns() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { columns, plugins } = this
      if (columns) {
        const loopLabel = (list) => {
          let propArr = []
          list.map(item => {
            propArr.push(item.prop)
            if (item.children && item.children.length) {
              propArr = [...propArr, ...loopLabel(item.children)]
            }
          })
          return propArr
        }
        this.defaultChecked = loopLabel(columns) || []
        this.checked = this.defaultChecked
      }
      if (plugins === true) {
        this.defaultPlugins = ['download', 'colum-height', 'fullscreen', 'reload', 'setting']
      } else {
        if (plugins && plugins.length) {
          this.defaultPlugins = plugins
        }
      }
    },
    // 勾选指定行，供外部调用
    // toggleSelection(row) {
    //   this.$refs.table.toggleRowSelection(row)
    // },
    // // 清除勾选行，供外部调用
    // clearSelection() {
    //   this.$refs.table.clearSelection()
    // },
    renderPlugins(name, item) {
      if (typeof item !== 'string') {
        if ('name' in item) {
          return name === item.name
        }
      }
      return name === item
    },
    // 全屏，默认设置app-main
    // fullscreen() {
    //   // const domClass = '.basics-table'
    //   const { fullscreenState } = this
    //   // const dom = document.querySelector(domClass)
    //   if (fullscreenState) {
    //     exitFullscreen()
    //     // dom && removeClass(dom, 'fullscreen-fixed')
    //     this.fullscreenState = false
    //   } else {
    //     launchFullscreen()
    //     // dom && addClass(dom, 'fullscreen-fixed')
    //     this.fullscreenState = true
    //   }
    // },
    // 下载
    downloadTable() {
      const { columns, list, defaultPlugins } = this
      const downloadObj = defaultPlugins.filter(item => {
        if (typeof item !== 'string') {
          if ('name' in item && item.name === 'download') {
            return true
          }
        }
        return false
      })
      let download = null
      if (downloadObj.length) {
        download = downloadObj[0].click
      }
      if (download) {
        download()
      } else {
        this.$message('未发现下载接口，只能下载当前页表格')
        setTimeout(() => {
          const downloadMsg = this.$message({
            message: '当前页表格下载中...',
            type: 'success',
            duration: 0
          })

          load(xlsxCDNJs, (err) => {
            if (err) {
              this.$message.error(err.message)
              return
            }
              import('@/utils/Export2Excel').then(excel => {
                let tHead = []
                let tProp = []
                if (columns) {
                  const loopLabel = (list) => {
                    let head = []
                    let prop = []
                    list.map(item => {
                      if (item.children && item.children.length) {
                        const { head: chrHead, prop: chrProp } = loopLabel(item.children)
                        head = [...head, ...chrHead]
                        prop = [...prop, ...chrProp]
                      } else {
                        head.push(item.label)
                        prop.push(item.prop)
                      }
                    })
                    return {
                      head,
                      prop
                    }
                  }
                  const { head, prop } = loopLabel(columns)
                  tHead = head
                  tProp = prop
                }
                const formatJson = (filterVal, list) => {
                  return list.map(v => filterVal.map(j => {
                    return v[j]
                  }))
                }
                const data = formatJson(tProp, list)
                const date = new Date()
                excel.export_json_to_excel({
                  header: tHead,
                  data,
                  filename: `table-list-${date.getFullYear()}${date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1}${date.getDate()}`
                })
                setTimeout(() => {
                  downloadMsg.close()
                }, 1000)
              })
          })
        }, 500)
      }
    },
    // 行高改变
    changeColum(size) {
      const { table, attr } = this
      this.attrs = {
        ...table,
        ...attr,
        size: size
      }
    },
    // 列树改变
    checkChange() {
      const checkedNode = this.$refs.tree[0].getCheckedNodes(false, true)
      const prop = []
      checkedNode.map(item => {
        prop.push(item.prop)
      })
      this.checked = prop
      this.tableKey++
    },
    // form实例
    getRef() {
      return this.$refs.BasicsTable
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .table-action {
    padding: 8px 0;
    text-align: right;
    svg {
      color: #666666;
      font-size: 20px;
      font-weight: bold;
      margin: 0 2px;
      cursor: pointer;
      &:hover {
        color: #171717;
      }
    }
  }
  .setting-table {
    /deep/ .el-tree-node__label {
      margin-left: 4px;
    }
  }
  /deep/ .el-table__header {
    th {
      background-color: #f4f4f5;
    }
  }
  .level {
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      display: block;
      &.large {
        margin: 0 10px;
      }
      &.default {
        margin: 0 5px;
      }
      &.small {
        margin: 0 2px;
      }
    }
  }
  .vertical {
    .item {
      display: block;
      &.large {
        margin: 10px 0;
      }
      &.default {
        margin: 5px 0;
      }
      &.small {
        margin: 2px 0;
      }
    }
  }
  .table-img {
    width: 50px;
    height: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    img {
      width: 50px;
    }
  }
</style>
