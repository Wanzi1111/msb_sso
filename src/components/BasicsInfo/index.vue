<template>
  <div class="basics-info">
    <el-row :class="{'basics-info-container': true, 'narrow-info': narrow}">
      <el-col v-for="(item, index) in info" :key="index" v-bind="getLayout(item)" class="search-item">
        <template v-if="item.render">
          <!-- render 函数渲染 -->
          <custom-render :render="(e) => item.render(e, item, index)" />
        </template>
        <template v-else-if="item.popover">
          <!-- render 函数渲染 -->
          <span class="search-item-label">{{ item.label }}</span>
          <span class="search-item-element">
            <el-popover
              ref="popover"
              :content="item.value"
              trigger="hover"
            >
              <span slot="reference" v-popover:popover class="value popover-value">{{ item.value }}</span>
            </el-popover>
          </span>
        </template>
        <template v-else>
          <span class="label">{{ item.label }}</span>
          <span class="value">{{ item.value }}</span>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const LAYOUT = {
  all: { xl: 24, lg: 24, md: 24, sm: 24, xs: 24 },
  large: { xl: 12, lg: 12, md: 12, sm: 24, xs: 24 },
  default: { xl: 6, lg: 6, md: 12, sm: 12, xs: 24 },
  small: { xl: 3, lg: 3, md: 6, sm: 12, xs: 24 }
}
export default {
  name: 'BasicsInfo',
  components: {
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
    info: {
      default: () => [],
      type: Array
    },
    narrow: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    // 获取栏栅布局函数
    getLayout(dat) {
      return LAYOUT[dat.layer || 'default']
    }
  }
}
</script>

<style lang="scss" scoped>
  .basics-info-container {
    /*margin-top: 10px;*/
    font-size: 14px;
    /deep/ .el-input__inner {
      line-height: 1;
    }
  }
  .narrow-info {
    padding: 0 20px;
  }
  .search-item {
    /*margin-bottom: 10px;*/
    display: flex;
    align-items: center;
    /*justify-content: center;*/
    height: 36px;
    .search-item-label {
      display: block;
      width: max-content;
      /*text-align-last: justify;*/
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      color: #333333;
    }
    .search-item-element {
      flex: 1;
      color: #666666;
    }
  }
  .label {
    color: #333333;
  }
  .value {
    color: #666666;
  }
  .popover-value {
    cursor: pointer;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

</style>
