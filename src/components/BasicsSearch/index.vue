<template>
  <div>
    <el-row class="search-container">
      <!-- 组件渲染 -->
      <el-col
        v-for="(item, index) in dataSearchs"
        v-show="!(item.visible === false) && (!item.hide || globalHide)"
        :key="index"
        v-bind="getLayout(item)"
        class="search-item"
      >
        <span v-if="item.label" class="search-item-label">{{
          item.label
        }}</span>
        <!--单选：radio-->
        <el-radio-group
          v-if="item.type === 'radio'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        >
          <el-radio
            v-for="(option, optionIndex) in item.options"
            :key="optionIndex"
            v-bind="option"
            :label="option.value"
          >{{ option.label }}</el-radio>
        </el-radio-group>
        <!--多选：checkbox-->
        <el-checkbox-group
          v-if="item.type === 'checkbox'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        >
          <el-checkbox
            v-for="(option, optionIndex) in item.options"
            :key="optionIndex"
            :label="option.value"
          >{{ option.label }}</el-checkbox>
        </el-checkbox-group>
        <!--输入框：input-->
        <el-input
          v-if="item.type === 'input'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
          @keyup.enter.native="search"
        />
        <el-input v-if="item.type === 'inputSelect'" v-model="form[item.prop]" class="search-item-element" v-bind="item.attr" @keyup.enter.native="search">
          <el-select slot="prepend" v-model="form[item.inputSelect.prop]" class="search-item-element-input-select" v-bind="item.inputSelect.attr">
            <el-option v-for="(option, optionIndex) in item.inputSelect.options" :key="optionIndex" v-bind="option" />
          </el-select>
        </el-input>
        <!--计数器：inputNumber-->
        <el-input-number
          v-if="item.type === 'inputNumber'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--选择器：select-->
        <el-select
          v-if="item.type === 'select'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        >
          <el-option
            v-for="(option, optionIndex) in item.options"
            :key="optionIndex"
            v-bind="option"
          />
        </el-select>
        <!--级联选择器：cascader-->
        <el-cascader
          v-if="item.type === 'cascader'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--开关：switch-->
        <el-switch
          v-if="item.type === 'switch'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--滑块：slider-->
        <el-slider
          v-if="item.type === 'slider'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--时间选择器：timePicker-->
        <el-time-select
          v-if="item.type === 'timePicker'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--日期选择器：datePicker-->
        <el-date-picker
          v-if="item.type === 'datePicker'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--日期时间选择器：dateTimePicker-->
        <el-date-picker
          v-if="item.type === 'dateTimePicker'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--评分：rate-->
        <el-rate
          v-if="item.type === 'rate'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!--颜色选择器：colorPicker-->
        <el-color-picker
          v-if="item.type === 'colorPicker'"
          v-model="form[item.prop]"
          class="search-item-element"
          v-bind="item.attr"
        />
        <!-- slot 插槽 -->
        <slot v-if="item.slot" :name="item.slot" :item="item" :form="form" />
      </el-col>

      <!-- 自动补齐布局渲染 -->
      <el-col class="search-item" v-bind="seatSpan" />

      <!-- 操作渲染 -->
      <el-col
        v-bind="getLayout({ layer: 'default' })"
        class="search-item search-action-item"
      >
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="search"
        >查询</el-button>
        <el-button
          :loading="loading"
          type="info"
          plain
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
        <div v-show="hideActionVisible" class="open-action" @click="hideAction">
          <span v-if="!globalHide">展开</span>
          <span v-else>收起</span>
          <i
            :class="`el-icon-arrow-down open-dom ${globalHide ? 'opened' : ''}`"
          />
        </div>
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
  name: 'BasicsSearch',
  props: {
    searchs: {
      default: () => [],
      type: Array
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      form: {},
      dataSearchs: {},
      recoveryData: {},
      globalHide: false,
      seatSpan: {},
      hideActionVisible: true
    }
  },
  computed: {
    formData() {
      return JSON.parse(JSON.stringify(this.form))
    }
  },
  watch: {
    formData: {
      handler: function(val, oldVal) {
        this.$emit('changeSearch', val, oldVal)
        if (val.length !== oldVal.length) {
          this.seat()
        }
      },
      deep: true
    },
    globalHide() {
      this.seat()
    }
  },
  created() {
    this.dataSearchs = this.searchs
    this.init()
  },
  mounted() {
    this.seat()
    this.seatInit()
  },
  destroyed() {
    window.removeEventListener('resize', this.seat)
  },
  methods: {
    init() {
      const { searchs } = this
      const defaultVal = {}
      searchs.map(item => {
        let subType = ''
        if (
          'attr' in item &&
          item.attr &&
          'type' in item.attr &&
          item.attr.type
        ) {
          subType = item.attr.type
        }
        // && item.defaultVal !== NaN
        if (
          item.defaultVal !== null &&
          item.defaultVal !== undefined &&
          item.defaultVal !== '' &&
          item.defaultVal !== ''
        ) {
          defaultVal[item.prop] = item.defaultVal
        } else {
          defaultVal[item.prop] = this.eleDefaultVal(item.type, subType)
        }
      })
      this.form = { ...defaultVal }
    },
    seatInit() {
      window.addEventListener('resize', this.seat, false)
    },
    // 展开、折叠函数
    hideAction() {
      this.globalHide = !this.globalHide
    },
    // 回显函数 - 可能删除
    recoveryForm(data, state = false) {
      const { form, searchs } = this
      const defaultVal = {}
      searchs.map(item => {
        defaultVal[item.prop] = ''
      })
      state && (this.recoveryData = data)
      const eleValue = {}
      for (const name in data) {
        name in defaultVal && (eleValue[name] = data[name])
      }
      this.form = {
        ...form,
        ...eleValue
      }
    },
    // 设置表单各项属性，可设置包含（下拉项、默认值、显隐、属性、整个元素）
    set({ type = '', data = {}}) {
      console.log(data)
      const { dataSearchs, form } = this
      const sets = name => {
        let n = 0
        for (let i = 0; i < dataSearchs.length; i++) {
          const item = dataSearchs[i]
          if (item.prop in data) {
            n++
            if (name === 'item') {
              dataSearchs[i] = data[item.prop]
            } else if (item.type === 'cascader' && name === 'options') {
              dataSearchs[i].attr.options = data[item.prop]
            } else if (name === 'defaultVal') {
              form[item.prop] = data[item.prop]
            } else if (name === 'attr') {
              dataSearchs[i][name] = {
                ...dataSearchs[i][name],
                ...data[item.prop]
              }
            } else {
              dataSearchs[i][name] = data[item.prop]
            }
            if (n >= Object.keys(data).length) {
              break
            }
          }
        }
      }
      switch (type) {
        case 'options':
          sets('options')
          break
        case 'defaultVal':
          sets('defaultVal')
          this.form = { ...form }
          break
        case 'visible':
          sets('visible')
          this.seat()
          break
        case 'attr':
          sets('attr')
          break
        case 'item':
          sets('item')
          this.form = { ...form }
          break
      }

      this.dataSearchs = [...dataSearchs]
    },
    // 点击搜索函数
    search() {
      this.$emit('submitSearch', this.form)
    },
    // 不同组件的默认值
    eleDefaultVal(type = '', subType = '') {
      const TYPE = {
        radio: '',
        checkbox: [],
        input: '',
        inputNumber: undefined,
        select: '',
        cascader: [],
        switch: false,
        slider: 0,
        timePicker: '',
        // datePicker: null,
        // dateTimePicker: null,
        upload: '',
        rate: 0,
        colorPicker: '',
        transfer: []
      }
      const SUB_TYPE = {
        datePicker: {
          year: null,
          month: null,
          date: null,
          dates: null, // 数组
          week: null,
          datetime: null,
          datetimerange: null, // 数组
          daterange: null, // 数组
          monthrange: null // 数组
        },
        dateTimePicker: {
          year: null,
          month: null,
          date: null,
          week: null,
          datetime: null,
          datetimerange: null, // 数组
          daterange: null // 数组
        },
        input: {
          textarea: '',
          number: undefined
        }
      }
      if (subType) {
        return SUB_TYPE[type][subType]
      }
      return TYPE[type]
    },
    // 点击重置函数
    reset() {
      const { form, searchs, recoveryData } = this
      const defaultStatus = {}
      searchs.map(item => {
        let recovery = true
        let subType = ''
        if ('recovery' in item) {
          recovery = item.recovery
        }
        if (
          'attr' in item &&
          item.attr &&
          'type' in item.attr &&
          item.attr.type
        ) {
          subType = item.attr.type
        }
        defaultStatus[item.prop] = {
          type: item.type,
          subType: subType,
          value: item.defaultVal,
          recovery: recovery
        }
      })
      // 兼容广告位
      const handleForm = form
      if (handleForm.endTime || handleForm.startTime) {
        delete handleForm.endTime
        delete handleForm.startTime
      }
      if (handleForm.positionId) {
        delete handleForm.positionId
      }
      if (handleForm.groupId) {
        delete handleForm.groupId
      }
      for (const name in handleForm) {
        form[name] =
          defaultStatus[name] &&
          'recovery' in defaultStatus[name] &&
          defaultStatus[name].recovery
            ? defaultStatus[name].value
            : this.eleDefaultVal(
              defaultStatus[name].type,
              defaultStatus[name].subType
            )
      }
      this.form = {
        ...form,
        ...recoveryData
      }
      this.$emit('submitSearch', this.form, true)
    },
    // 获取栏栅布局函数
    getLayout(dat) {
      return LAYOUT[dat.layer || 'default']
    },
    // 为了将操作元素居右，监听展开折叠与屏幕宽度来给操作元素前面补充空白col
    seat() {
      const { searchs, globalHide } = this
      const differentLayout = {
        xl: 0,
        lg: 0,
        md: 0,
        sm: 0,
        xs: 0
      }
      let haveHide = false
      searchs.map(item => {
        if (item.hide && !(item.visible === false)) {
          haveHide = true
        }
        if (!(item.visible === false) && (!item.hide || globalHide)) {
          differentLayout.xl += LAYOUT[item.layer || 'default'].xl
          differentLayout.lg += LAYOUT[item.layer || 'default'].lg
          differentLayout.md += LAYOUT[item.layer || 'default'].md
          differentLayout.sm += LAYOUT[item.layer || 'default'].sm
          differentLayout.xs += LAYOUT[item.layer || 'default'].xs
        }
      })
      this.hideActionVisible = haveHide
      // xs	<768px
      // sm	≥768px
      // md	≥992px
      // lg	≥1200px
      // xl	≥1920px
      const screenWidth = document.body.scrollWidth
      let nowSpan = 0
      let actionSpan = 0
      const actionLayout = this.getLayout({ layer: 'default' })
      if (screenWidth >= 1920) {
        nowSpan = differentLayout.xl
        actionSpan = actionLayout.xl
      } else if (screenWidth >= 1200) {
        nowSpan = differentLayout.lg
        actionSpan = actionLayout.lg
      } else if (screenWidth >= 992) {
        nowSpan = differentLayout.md
        actionSpan = actionLayout.md
      } else if (screenWidth >= 768) {
        nowSpan = differentLayout.sm
        actionSpan = actionLayout.sm
      } else if (screenWidth < 768) {
        nowSpan = differentLayout.xs
        actionSpan = actionLayout.xs
      } else {
        nowSpan = 18
        actionSpan = 6
      }
      const seatSpan = 24 - (nowSpan % 24) - actionSpan
      if (seatSpan === 0) {
        this.seatSpan = { style: { display: 'none' }}
      } else {
        this.seatSpan = {
          xl: seatSpan,
          lg: seatSpan,
          md: seatSpan,
          sm: seatSpan,
          xs: seatSpan
        }
      }
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
.search-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  .search-item-label {
    display: block;
    width: 79px;
    /*text-align-last: justify;*/
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color: #606266;
  }
  .search-item-element {
      flex: 1;
      margin-right: 10px;
      /deep/ {
        .search-item-element-input-select {
          .el-input--suffix{
            width: 90px;
          }
        }
      }
    }
}
.search-action-item {
  justify-content: flex-end;
  padding-right: 10px;
}

.open-action {
  cursor: pointer;
  margin-left: 10px;
  color: #666;
  transition: all 0.35s;
  &:hover {
    color: #1790ff;
  }
  span {
    user-select: none;
  }
}
.open-dom {
  transition: all 0.35s;
}
.opened {
  transform: rotate(180deg);
}
</style>
