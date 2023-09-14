<template>
  <el-tabs v-model="tab" @tab-click="handleTabClick">
    <el-tab-pane
      v-for="(item, index) in tabListClient"
      :key="index"
      :label="item.businessType+ '-' + item.clientType"
      :name="index.toString()"
    />
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tabListClient: [],
      tab: '0'
    }
  },
  computed: {
    ...mapGetters(['adConfig'])
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const { clientType, businessType } = this.adConfig
      businessType.forEach(item => {
        if (Array.isArray(clientType[item.value])) {
          clientType[item.value].forEach((val, index) => {
            this.tabListClient.push({
              businessType: item.value,
              clientType: val
            })
          })
        }
      })
      this.handleTabClick()
    },
    handleTabClick(item) {
      const index = item && item.index || 0
      this.$emit('handleTabClick', this.tabListClient[index])
    }
  }
}
</script>

<style scoped>

</style>
