<template>
  <div>
    <div :class="{'basics-title': true, 'line-bottom': (line && line !== 'top') || line === 'bottom', 'line-top': line === 'top', }" v-bind="attr">
      <span v-if="back" class="back-cont"><i :class="`back ${backIcon}`" @click="onBack" />&ensp;|&ensp;</span>
      {{ title }}
      <div style="float: right; margin-bottom: -10px;">
        <basics-action :actions="actions" />
      </div>
      <div style="clear: both;" />
    </div>
    <div v-if="this.$slots.default" class="note">
      <slot />
    </div>
  </div>
</template>

<script>
import BasicsAction from '../BasicsAction'
export default {
  name: 'BasicsTitle',
  components: { BasicsAction },
  props: {
    title: {
      default: '标题',
      type: String
    },
    attr: {
      default: () => ({}),
      type: Object
    },
    line: {
      default: 'bottom',
      type: [String, Boolean]
    },
    actions: {
      default: () => [],
      type: Array
    },
    back: {
      default: false,
      type: Boolean
    },
    onBack: {
      default: () => window.history.back(),
      type: Function
    },
    backIcon: {
      default: 'el-icon-back',
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .basics-title {
    background-color: #FFF;
    color: rgba(0,0,0,.85);
    font-weight: 600;
    font-size: 18px;
    line-height: 36px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }
  .back-cont {
    color: #999999;
    font-weight: 300;
  }
  .back {
    cursor: pointer;
    font-size: 22px;
    color: #333333;
    vertical-align: middle;
    &:hover {
      color: #1890ff;
    }
  }
  .line-top {
    &:before {
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #efefef;
      margin: 15px 0;
    }
  }
  .line-bottom {
    &:after {
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #efefef;
      margin: 15px 0;
    }
  }
  .note {
    font-size: 14px;
    color: #666;
    margin: 10px 0 0 0;
  }
</style>
