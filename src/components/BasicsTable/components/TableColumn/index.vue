<template>
  <!-- render 函数列渲染 -->
  <el-table-column v-if="item.render && checked.includes(item.prop)" :key="index" v-bind="item">
    <template slot-scope="scope">
      <custom-render :key="index" :render="(e) => item.render(e, scope.row[item.prop], scope.row, index, list)" />
    </template>
  </el-table-column>

  <!-- slot 列渲染 -->
  <el-table-column v-else-if="item.slot && checked.includes(item.prop)" :key="index" v-bind="item">
    <template slot-scope="scope">
      <slot :name="item.slot" :row="scope.row" :$index="scope.$index" :column="scope.column" :list="scope.list">
        {{ scope.row[item.prop] }}
      </slot>
    </template>
  </el-table-column>

  <!-- 操作列渲染 -->
  <el-table-column v-else-if="item.action && checked.includes(item.prop)" :key="index" v-bind="item">
    <template slot-scope="scope">
      <div :class="`${item.layout || 'level'}`">
        <template v-for="(fuc, fucIndex) in getActionSet(item.name, scope.row[item.prop], scope.row, index)">
          <div v-if="fuc.dropdown" :key="fucIndex" :class="`item ${item.margin || 'default'}`">
            <el-dropdown v-if="fuc.dropdownConfig.item.length" v-bind="fuc.dropdownConfig.attr" @click="dropdownCilck(fuc, scope.row[item.prop], scope.row, scope.$index)" @command="e => dropdownCommand(e, fuc, scope.row[item.prop], scope.row, scope.$index)">
              <template v-if="!isSplitButton(fuc)">
                <!--按钮-->
                <basics-button v-if="fuc.type === 'button'" :attr="fuc.attr" :loadings="loadings" :click="fuc.click" :label="fuc.label" />
                <!--a标签按钮-->
                <a v-if="fuc.type === 'a'" href="javascript:;" v-bind="fuc.attr" @click="fuc.click">{{ fuc.label }}</a>
                <!--a标签链接-->
                <a v-if="fuc.type === 'link'" v-bind="fuc.attr">{{ fuc.label }}</a>
                <!--span标签文本-->
                <span v-if="fuc.type === 'span'" v-bind="fuc.attr">{{ fuc.label }}</span>
                <!--提示信息-->
                <el-alert v-if="fuc.type === 'alert'" :title="fuc.label" v-bind="fuc.attr" />
              </template>
              <template v-else>{{ fuc.label }}</template>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(dropdownItem, dropdownIndex) in fuc.dropdownConfig.item" :key="dropdownIndex" v-bind="dropdownItem.attr">{{ dropdownItem.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else :key="fucIndex" :class="`item ${item.margin || 'default'}`">
            <el-button v-if="fuc.type === 'button'" :class="fuc.label ? '' : 'empty'" v-bind="fuc.attr" :loading="fuc.attr.loadingFn ? fuc.attr.loadingFn(scope.row) : loadings[fuc.attr ? fuc.attr.loading : false]" @click="fuc.click(scope.row[item.prop], scope.row, scope.$index)">{{ renders(fuc, scope.row[item.prop], scope.row, index) }}</el-button>
            <a v-else-if="fuc.type === 'link'" v-bind="fuc.attr" :href="fuc.href">{{ renders(fuc, scope.row[item.prop], scope.row, index) }}</a>
            <a v-else-if="fuc.type === 'a'" v-bind="fuc.attr" href="javascript:;" @click="fuc.click(scope.row[item.prop], scope.row, scope.$index)">{{ renders(fuc, scope.row[item.prop], scope.row, index) }}</a>
            <el-tag v-else-if="fuc.type === 'tag'" v-bind="fuc.attr" :title="fuc.label">{{ renders(fuc, scope.row[item.prop], scope.row, index) }}</el-tag>
            <el-popover
              v-else-if="fuc.type === 'img'"
              placement="top"
              trigger="hover"
            >
              <div>
                <img style="width: 300px;" :src="scope.row[item.prop]" alt="">
              </div>
              <div slot="reference" class="table-img">
                <div>
                  <img v-bind="fuc.attr" :src="scope.row[item.prop]" alt="">
                </div>
              </div>
            </el-popover>
            <span v-else v-bind="fuc.attr">{{ renders(fuc, scope.row[item.prop], scope.row, index) }}</span>
          </div>
        </template>
      </div>
    </template>
  </el-table-column>

  <!-- 嵌套表头列渲染 -->
  <el-table-column v-else-if="item.children && checked.includes(item.prop)" :key="index" v-bind="item">
    <template v-for="(childrenItem, childrenIndex) in item.children">
      <table-column
        :key="childrenIndex"
        :index="childrenIndex"
        :item="childrenItem"
        :list="list"
        :checked="checked"
        :action-function="actionFunction"
        :loadings="loadings"
      >
        <template v-for="slotItem in columnsSlot" :slot="slotItem" slot-scope="scope">
          <slot :name="slotItem" :row="scope.row" :$index="scope.$index" :column="scope.column" :list="scope.list" />
        </template>
      </table-column>
    </template>
  </el-table-column>

  <!-- 普通列 -->
  <el-table-column
    v-else-if="!item.render && !item.action && !item.children && checked.includes(item.prop)"
    :key="index"
    v-bind="item"
  />
</template>

<script>
import BasicsButton from '../Button'

export default {
  name: 'TableColumn',
  components: {
    BasicsButton,
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
    item: {
      default: () => ({}),
      type: Object
    },
    list: {
      default: () => [],
      type: Array
    },
    checked: {
      default: () => [],
      type: Array
    },
    index: {
      default: () => {},
      type: Number
    },
    actionFunction: {
      default: () => ({}),
      type: Object
    },
    loadings: {
      default: () => ({}),
      type: Object
    },
    columnsSlot: {
      default: () => [],
      type: Array
    }
  },
  methods: {
    // 渲染自定义方法中的label
    renders(fuc, item, row, index) {
      if (fuc.render) {
        return fuc.render(item, row, index)
      } else {
        return fuc.label
      }
    },
    // 如果列的action为true，那么列会根据actionFunction渲染操作块
    getActionSet(name, dat, row, index) {
      const { actionFunction } = this
      if (!actionFunction) {
        return []
      }
      // console.log(actionFunction)
      // console.log(actionFunction[name])
      if (typeof actionFunction[name || row.prop] === 'function') {
        return actionFunction[name || row.prop](dat, row, index)
      }
      return actionFunction[name || row.prop] || []
    },
    isSplitButton(dat) {
      try {
        return dat.dropdownConfig.attr.splitButton
      } catch (e) {
        return false
      }
    },
    dropdownCilck(dat, data, row, index) {
      try {
        return dat.dropdownConfig.click(data, row, index)
      } catch (e) {
        return () => {
          console.log('not find dropdown click Function!')
        }
      }
    },
    dropdownCommand(e, dat, data, row, index) {
      try {
        return dat.dropdownConfig.command(e, data, row, index)
      } catch (e) {
        return () => {
          console.log('not find dropdown command Function!')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty {
		/deep/ span {
			margin: 0;
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
		> div {

		}
		img {
			width: 50px;
		}
	}
</style>
