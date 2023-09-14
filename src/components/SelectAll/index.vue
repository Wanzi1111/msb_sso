<template>
  <div>
    <el-select
      v-model="myvalue"
      multiple
      collapse-tags
      :placeholder="placeholder"
      @change="selectAll"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectAll',
  components: { },
  props: {
    // 表单配置
    options: {
      default: () => {},
      type: Array
    },
    placeholder: {
      default: () => {},
      type: String
    }
  },
  data() {
    return {
      myvalue: [],
      oldOptions: [[]]
    }
  },
  created() {
    this.options.unshift({
      value: '-1',
      label: '所有选项'
    },)
  },
  methods: {
    selectAll(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.options) {
        allValues.push(item.value)
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]

      // 若是全部选择
      if (val.includes('-1')) this.myvalue = allValues

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('-1') && !val.includes('-1')) this.myvalue = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('-1') && val.includes('-1')) {
        const index = val.indexOf('-1')
        val.splice(index, 1) // 排除全选选项
        this.myvalue = val
      }

      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('-1') && !val.includes('-1')) {
        if (val.length === allValues.length - 1) this.myvalue = ['-1'].concat(val)
      }

      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions[1] = this.myvalue
    }
  }
}
</script>
