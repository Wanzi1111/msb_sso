<template>
  <div>
    <el-input
      v-model="first"
      style="width: 140px;min-width: 120px"
      class="form-item-element"
      controls-position="right"
      placeholder="从"
    />&ensp;—&ensp;<el-input
      v-model="second"
      style="width: 140px;min-width: 120px"
      class="form-item-element"
      controls-position="right"
      placeholder="到"
    />
  </div>
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      first: '',
      second: ''
    }
  },
  watch: {
    value(val) {
      if (val.length) {
        if (val[0] !== this.first) {
          this.first = val[0]
        }
        if (val[1] !== this.second) {
          this.second = val[1]
        }
      }
    },
    first(val) {
      this.$emit('input', [val, this.second])
    },
    second(val) {
      this.$emit('input', [this.first, val])
    }
  }
}
</script>
