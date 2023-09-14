<template>
  <div class="form-item-element" v-bind="item.attr">
    <el-table v-bind="item.table.attr" :data="item.table.data" stripe border fit highlight-current-row style="width: 100%" @selection-change="checkboxTableSelection">
      <el-table-column type="selection" width="40" />
      <template v-for="(columnItem, columnIndex) in item.table.column">
        <el-table-column :key="columnIndex" v-bind="columnItem" />
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CheckboxTable',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // 表格类型的选择
    checkboxTableSelection(select) {
      const list = []
      for (let i = 0; i < select.length; i++) {
        list.push(select[i].value)
      }
      this.$emit('input', list)
    }
  }
}
</script>
