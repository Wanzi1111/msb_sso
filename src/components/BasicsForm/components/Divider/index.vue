<template>
  <div class="form-item-element line-top">
    <h4>{{ title }}</h4>
    <span>{{ subtitle }}</span>
  </div>
</template>

<script>
export default {
  name: 'Divider',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .line-top {
    &:after {
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #efefef;
      margin: 15px 0;
    }
    h4 {
      display: inline-block;
      margin: 0;
    }
    span {
      color: #ccc
    }
  }
</style>
