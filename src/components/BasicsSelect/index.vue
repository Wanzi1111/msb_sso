<template>

  <div>
    <el-row class="search-container">
      <el-col
        v-for="(item, index) in dataSelects"
        :key="index"
        class="search-col"
      >
        <span class="select-title">{{ item.label }}:</span>
        <template v-for="(el) in item.list">
          <el-button :key="el.id" style="width: 120px;margin-bottom: 10px;" :type="item.value == el.value? 'primary': 'plain'" v-bind="item.attr" @click="selectFn(item,el.value)">{{ el.label }}</el-button>
        </template>
      </el-col>

    </el-row>
  </div>

</template>

<script>
export default {
  name: 'BasicsSelect',
  props: {
    // 按钮配置
    selects: {
      default: () => [],
      type: Array
    },
    // 操作按钮配置
    actions: {
      default: () => ({}),
      type: Object
    },
    attr: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      btnList: []
    }
  },
  created() {
    this.dataSelects = this.selects
    this.dataSelects.forEach(async(item, index) => {
      if (item.getListAsync) {
        const list = await item.getListAsync()
        this.$set(this.dataSelects[index], 'list', list)
        console.log(this.dataSelects[index])
      }
      // 如果没有匹配的value默认第一个
      const list = this.dataSelects[index].list
      if (list.findIndex((i) => i === item.value) === -1) {
        this.$set(this.dataSelects[index], 'value', list[0].value)
      }
    })
  },
  methods: {
    selectFn(item, value) {
      item.value = value
      this.$set(item, 'value', value)
      // this.$set(this.dataSelects[index], 'list', list)
      console.log('按钮点击', value)
      item.selectAct(item, value)
    }
  }

}

</script>

<style lang="scss" scoped>
  .search-container {
    margin-right: -10px;

    /deep/ .el-input__inner {
      line-height: 1;
    }

  }

  .select-title {
    /*display: block;*/
    width: 69px;
    /*height: 36px;*/
    text-align: right;
    margin-right: 16px;
    font-size: 14px;
    color: #606266;
  }

  .search-col {
    /*height: 36px;*/
    margin-bottom: 10px;
  }

</style>
