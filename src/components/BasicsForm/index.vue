<template>
  <div>
    <el-form ref="basicsForm" :model="form" v-bind="attr" v-on="$listeners">
      <el-row v-bind="rowAttr">
        <template v-for="(item, index) in dataForms">
          <el-col :key="index" v-bind="item.colAttr">
            <!-- render 函数渲染 -->
            <custom-render
              v-if="item.render && !(item.visible === false)"
              :key="index"
              :render="e => item.render(e, item, form, index)"
            />

            <!-- slot 插槽 -->
            <slot
              v-if="item.slot && !(item.visible === false)"
              :name="item.slot"
              :item="item"
              :form="form"
            />

            <!-- 普通组件渲染 -->
            <el-form-item
              v-if="!item.render && !item.slot && !(item.visible === false)"
              :key="index"
              :class="formItemCls(item.type)"
              :prop="item.prop"
              :label="item.label"
              :rules="item.rules"
            >
              <!--单选：radio-->
              <el-radio-group
                v-if="item.type === 'radio'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              >
                <el-radio
                  v-for="(option, optionIndex) in item.options"
                  :key="optionIndex"
                  v-bind="option"
                  :label="option.value"
                >{{ option.label }}</el-radio>
              </el-radio-group>
              <!-- 单选：Button -->
              <el-radio-group
                v-if="item.type === 'radioButton'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              >
                <el-radio-button
                  v-for="(option, optionIndex) in item.options"
                  :key="optionIndex"
                  v-bind="option"
                  :label="option.value"
                >{{ option.label }}</el-radio-button>
              </el-radio-group>
              <!--多选：checkbox-->
              <el-checkbox-group
                v-if="item.type === 'checkbox'"
                v-model="form[item.prop]"
                class="form-item-element"
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
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--输入框：input 数字检验-->
              <el-input
                v-if="item.type === 'inputNum'"
                v-model.number="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--多行文本：textarea-->
              <el-input
                v-if="item.type === 'textarea'"
                v-model="form[item.prop]"
                type="textarea"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--计数器：inputNumber-->
              <el-input-number
                v-if="item.type === 'inputNumber'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--计数器：inputBox-->
              <input-box
                v-if="item.type === 'inputBox'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--选择器：select-->
              <el-select
                v-if="item.type === 'select'"
                v-model="form[item.prop]"
                class="form-item-element"
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
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--开关：switch-->
              <el-switch
                v-if="item.type === 'switch'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--开关：switch value: string $$ number-->
              <el-switch
                v-if="item.type === 'switchVal'"
                v-model="form[item.prop]"
                :active-value="1"
                :inactive-value="0"
                class="form-item-element"
              />
              <!--滑块：slider-->
              <el-slider
                v-if="item.type === 'slider'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--时间选择器：timePicker-->
              <el-time-select
                v-if="item.type === 'timePicker'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <el-date-picker
                v-if="item.type === 'datePickerDatetime'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
                type="datetime"
              />
              <!--日期选择器：datePicker-->
              <el-date-picker
                v-if="item.type === 'datePicker'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--日期时间选择器：dateTimePicker-->
              <el-date-picker
                v-if="item.type === 'dateTimePicker'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--上传：upload-->
              <custom-upload
                v-if="item.type === 'upload'"
                v-model="form[item.prop]"
                :item="item"
                @upload="uploadApi"
              />
              <!--评分：rate-->
              <el-rate
                v-if="item.type === 'rate'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--颜色选择器：colorPicker-->
              <el-color-picker
                v-if="item.type === 'colorPicker'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--穿梭框：transfer-->
              <el-transfer
                v-if="item.type === 'transfer'"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
              />
              <!--富文本：tinymce-->
              <tinymce
                v-if="item.type === 'tinymce'"
                :ref="`${item.prop}Tinymce`"
                v-model="form[item.prop]"
                class="form-item-element"
                v-bind="item.attr"
                :modify.sync="modifys[item.prop]"
                @upload="uploadApi"
              />
              <divider
                v-if="item.type === 'divider'"
                v-bind="item.attr"
              />
              <!--文本：text-->
              <div
                v-if="item.type === 'text'"
                class="form-item-element"
                v-bind="item.attr"
              >
                {{ form[item.prop] }}
              </div>
              <!--文本：checkbox-table 多选表格 用于展示项的多个属性-->
              <checkbox-table
                v-if="item.type === 'checkbox-table'"
                v-model="form[item.prop]"
                :item="item"
              />
              <!--上传媒体：upload-media-->
              <upload-media
                v-if="item.type === 'upload-media'"
                v-model="form[item.prop]"
                :item="item"
                v-on="$listeners"
                @upload="uploadApi"
              />
              <!--提示：note-->
              <div
                v-if="item.note"
                class="note"
                :class="`${item.noteConfig.style || 'info'}`"
              >
                <template v-if="item.noteConfig.type === 'text'">
                  <i :class="`${item.noteConfig.icon || 'el-icon-info'}`" />
                  <span>{{ item.noteConfig.text }}</span>
                </template>
                <template v-if="item.noteConfig.type === 'tooltip'">
                  <el-tooltip
                    v-bind="item.noteConfig.attr"
                    class="item"
                    effect="dark"
                    :content="item.noteConfig.text"
                    :placement="`${item.noteConfig.placement || 'right'}`"
                  >
                    <i :class="`${item.noteConfig.icon || 'el-icon-info'}`" />
                  </el-tooltip>
                </template>
                <template v-if="item.noteConfig.type === 'link'">
                  <a
                    v-bind="item.noteConfig.attr"
                  ><i
                     v-if="item.noteConfig.icon"
                     :class="item.noteConfig.icon"
                   />
                    {{ item.noteConfig.text }}</a>
                </template>
                <template v-if="item.noteConfig.type === 'a'">
                  <a
                    v-bind="item.noteConfig.attr"
                    href="javascript:;"
                    @click="item.noteConfig.click"
                  ><i
                     v-if="item.noteConfig.icon"
                     :class="item.noteConfig.icon"
                   />
                    {{ item.noteConfig.text }}</a>
                </template>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <!-- 操作条渲染 -->
      <el-form-item
        v-if="!hideAction()"
        :class="formActionCls"
        label=" "
        style="width: 100%"
      >
        <el-button
          v-if="!hideAction('submit')"
          :loading="loading"
          type="primary"
          :icon="defaultActionIcon('submit')"
          @click="defaultAction('submit')"
        >{{ defaultActionLabel("submit") }}</el-button>
        <el-button
          v-if="!hideAction('reset')"
          :loading="loading"
          type="info"
          plain
          :icon="defaultActionIcon('reset')"
          @click="defaultAction('reset')"
        >{{ defaultActionLabel("reset") }}</el-button>
        <el-button
          v-if="!hideAction('back')"
          :loading="loading"
          :icon="defaultActionIcon('back')"
          @click="defaultAction('back')"
        >{{ defaultActionLabel("back") }}</el-button>
        <template v-for="(item, index) in moreActions">
          <el-button
            v-if="item.type === 'button' && !(item.visible === false)"
            :key="index"
            v-bind="item.attr"
            :loading="loadings[item.attr ? item.attr.loading : false]"
            @click="item.click(form)"
          >{{ item.label }}</el-button>
          <a
            v-if="item.type === 'a'"
            :key="index"
            href="javascript:;"
            v-bind="item.attr"
            @click="item.click(form)"
          >{{ item.label }}</a>
          <a v-if="item.type === 'link'" :key="index" v-bind="item.attr">{{
            item.label
          }}</a>
          <!-- render 函数渲染 -->
          <custom-render
            v-if="item.render"
            :key="index"
            :render="e => item.render(e, item, form, index)"
          />
          <!-- slot 插槽 -->
          <slot v-if="item.slot" :name="item.slot" :item="item" :form="form" />
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { cloneDeep } from 'lodash'
import { upload } from '@/api/common'
import Tinymce from './components/Tinymce'
import CustomUpload from './components/Upload'
import UploadMedia from './components/UploadMedia'
import CheckboxTable from './components/CheckboxTable'
import InputBox from './components/InputBox'
import Divider from './components/Divider'
// import axios from 'axios'

export default {
  name: 'BasicsForm',
  components: {
    Divider,
    InputBox,
    Tinymce,
    CustomUpload,
    UploadMedia,
    CheckboxTable,
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
    // 表单配置
    forms: {
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
    },
    rowAttr: {
      default: () => ({}),
      type: Object
    },
    loading: {
      default: false,
      type: Boolean
    },
    loadings: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      form: {},
      dataForms: [],
      dataActons: [],
      recoveryData: {},
      modifys: {} // 富文本赋值后关闭
    }
  },
  computed: {
    // 渲染自定义操作按钮
    moreActions() {
      const { dataActons } = this
      const moreAt = []
      for (const name in dataActons) {
        if (['submit', 'reset', 'back'].indexOf(name) === -1) {
          moreAt.push(dataActons[name])
        }
      }
      return moreAt
    },
    formData() {
      return JSON.parse(JSON.stringify(this.form))
    },
    formItemCls() {
      return function(type) {
        const { attr } = this
        let className = 'form-item'
        if (!attr.labelWidth) {
          className += ' fixed-label-width'
        }
        if ('customClass' in attr) {
          className = attr.customClass
        }
        return [className, type === 'hidden' ? 'hidden' : '']
      }
    },
    formActionCls() {
      const { attr } = this
      let className = 'form-action'
      if (!attr.labelWidth) {
        className += ' fixed-label-width'
      }
      if ('customClass' in attr) {
        className += ` ${attr.customClass}`
      } else {
        className += ' form-item'
      }
      return className
    }
  },
  watch: {
    formData: {
      handler: function(val, oldVal) {
        // 当表单发生变化调用
        this.$emit(
          'changeForm',
          this.cleanNotUsed(val),
          this.cleanNotUsed(oldVal)
        )
      },
      deep: true
    }
  },
  created() {
    this.dataForms = this.forms
    this.dataActons = this.actions
    // this.testing()
    this.init()
  },
  methods: {
    uploadApi: upload,
    testing() {
      const { forms } = this
      const uploadType = ['upload', 'tinymce', 'upload-media']
      for (let i = 0; i < forms.length; i++) {
        if (
          uploadType.includes(forms[i].type) &&
          !('upload' in this.$listeners)
        ) {
          console.warn(
            `BasicsForm：${uploadType.join(
              '、'
            )}组件需要配置\`upload\`函数，不然上传将会失败！`
          )
        }
      }
    },
    // 赋默认值
    init() {
      const { forms } = this
      const defaultVal = {}
      forms.map(item => {
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
    // 默认操作绑定默认函数，如果设置confirm=true，将包一层confirm二次确认函数。如果包裹的是submit，将先表单validate校验
    defaultAction(type) {
      const { actions, dataActons } = this
      const _this = this;
      (async() => {
        let validateSta = true
        if (type === 'submit') {
          const va = () => {
            return new Promise((resolve, reject) => {
              _this.$refs.basicsForm.validate(valid => {
                if (valid) {
                  resolve(true)
                } else {
                  console.log('error submit!!')
                  reject(false)
                }
              })
            })
          }
          validateSta = await va()
        }
        if (!validateSta) {
          return false
        }
        const action = {
          submit: _this.submit,
          reset: _this.reset,
          back: _this.back
        }
        if (
          actions &&
          actions[type] &&
          'confirm' in actions[type] &&
          actions[type].confirm
        ) {
          _this.confirmAction(actions[type].confirmConfig, action[type])
        } else {
          action[type](dataActons[type]?.params || null)
        }
      })()
    },
    // confirm二次确认函数
    confirmAction(confirmConfig = {}, callback) {
      const config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        label: '提示',
        text: '请仔细确认该操作, 是否继续?',
        ...confirmConfig
      }
      this.$confirm(config.text, config.label, {
        confirmButtonText: config.confirmButtonText,
        cancelButtonText: config.cancelButtonText,
        type: config.type
      })
        .then(() => {
          callback && callback()
        })
        .catch(() => {})
    },
    // 默认操作按钮的隐藏显示控制
    hideAction(type = '') {
      const { dataActons = {}} = this
      if (type) {
        if (type === 'reset') {
          if (dataActons && dataActons[type] && 'hide' in dataActons[type]) {
            return (
              dataActons &&
              dataActons[type] &&
              'hide' in dataActons[type] &&
              dataActons[type].hide
            )
          } else {
            return true
          }
        }
        return (
          dataActons &&
          dataActons[type] &&
          'hide' in dataActons[type] &&
          dataActons[type].hide
        )
      }
      let hideLen = 0
      let len = 0
      for (const name in dataActons) {
        len += 1
        if (dataActons && dataActons[name] && dataActons[name].hide) {
          hideLen += 1
        }
      }
      return hideLen > len
    },
    // 默认操作按钮的文字赋值
    defaultActionLabel(type) {
      const { dataActons = {}} = this
      const label = {
        submit: '保存',
        reset: '重置',
        back: '返回'
      }
      return dataActons &&
        dataActons[type] &&
        'label' in dataActons[type] &&
        dataActons[type].label
        ? dataActons[type].label
        : label[type]
    },
    // 默认操作按钮的图标赋值
    defaultActionIcon(type) {
      const { dataActons = {}} = this
      const icon = {
        submit: 'el-icon-check',
        reset: 'el-icon-refresh',
        back: 'el-icon-back'
      }
      return dataActons &&
        dataActons[type] &&
        'attr' in dataActons[type] &&
        dataActons[type].attr &&
        'icon' in dataActons[type].attr &&
        dataActons[type].attr.icon
        ? dataActons[type].attr.icon
        : icon[type]
    },
    // 回显函数 - 可能取消
    recoveryForm(data, state = false) {
      const { form, forms } = this
      const defaultVal = {}
      forms.map(item => {
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
    // 重置表单，供外部操作
    resetFields() {
      this.$refs.basicsForm.resetFields()
    },
    // 设置表单各项属性，可设置包含（下拉项、默认值、显隐、校验规则、属性、整个元素），供外部操作
    set({ type = '', data = {}, validateField = true }) {
      const { dataForms, form } = this
      // console.log(dataForms, 'dataForms')
      // console.log(form, 'form')
      const sets = name => {
        let n = 0
        for (let i = 0; i < dataForms.length; i++) {
          const item = dataForms[i]
          if (item.prop in data) {
            n++
            if (name === 'item') {
              dataForms[i] = data[item.prop]
            } else if (item.type === 'cascader' && name === 'options') {
              dataForms[i].attr.options = data[item.prop]
            } else if (name === 'tableData') {
              dataForms[i].table.data = data[item.prop]
            } else if (name === 'defaultVal') {
              form[item.prop] = data[item.prop]
              if (dataForms[i].type === 'tinymce') {
                this.modifys[item.prop] = true
              }
            } else if (name === 'attr') {
              dataForms[i][name] = {
                ...dataForms[i][name],
                ...data[item.prop]
              }
            } else {
              dataForms[i][name] = data[item.prop]
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
          if (validateField) {
            this.form = { ...form }
            for (const name in data) {
              this.$refs.basicsForm.validateField(name)
            }
          }
          break
        case 'rules':
          sets('rules')
          break
        case 'mediaRules':
          sets('mediaRules')
          break
        case 'visible':
          sets('visible')
          break
        case 'attr':
          sets('attr')
          break
        case 'tableData':
          sets('tableData')
          break
        case 'item':
          sets('item')
          this.form = { ...form }
          break
        case 'noteConfig':
          sets('noteConfig')
          break
      }

      this.dataForms = [...dataForms]
    },
    // 设置表单操作，供外部操作
    setAction({ type = '', data = {}}) {
      const { dataActons } = this
      const sets = name => {
        for (const key in dataActons) {
          if (key in data) {
            if (name === 'item') {
              dataActons[key] = data[key]
            } else {
              dataActons[key][name] = data[key]
            }
          }
        }
      }
      switch (type) {
        case 'visible':
          sets('visible')
          break
        case 'attr':
          sets('attr')
          break
        case 'item':
          sets('item')
          break
      }
      this.dataActons = { ...dataActons }
    },
    // 回调函数时清除表单中脏参数
    cleanNotUsed(data) {
      const { forms } = this
      const cleanData = {}
      forms.map(item => {
        !(item.visible === false) && (cleanData[item.prop] = data[item.prop])
      })
      return cleanData
    },
    // 默认操作按钮submit事件
    submit() {
      // 当点击默认submit按钮调用
      this.$emit('submitForm', this.cleanNotUsed(this.form))
    },
    // 不同组件的默认值
    eleDefaultVal(type = '', subType = '') {
      const TYPE = {
        radio: '',
        checkbox: [],
        input: '',
        textarea: '',
        inputNumber: 0,
        inputBox: [],
        select: '',
        cascader: [],
        switch: false,
        slider: 0,
        timePicker: '',
        // datePicker: null,
        // dateTimePicker: null,
        upload: [],
        rate: 0,
        colorPicker: '',
        transfer: [],
        tinymce: '',
        text: '',
        'checkbox-table': [],
        'upload-media': '' // 图片就是字符串，视频是对象
      }
      const SUB_TYPE = {
        datePicker: {
          year: null,
          month: null,
          date: null,
          dates: null, // 数组
          week: null,
          datetime: undefined,
          datetimerange: null, // 数组
          daterange: null, // 数组
          monthrange: null // 数组
        },
        dateTimePicker: {
          year: null,
          month: null,
          date: null,
          week: null,
          datetime: undefined,
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
    // 默认操作按钮reset事件
    reset() {
      const { form, forms, recoveryData } = this
      const defaultStatus = {}
      forms.map(item => {
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
      for (const name in form) {
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
      // reset Tinymce
      for (const name in forms) {
        if (forms[name].type === 'tinymce') {
          this.$refs[`${forms[name].prop}Tinymce`][0].setContent('')
        }
      }
      this.form = {
        ...form,
        ...recoveryData
      }
    },
    // 默认操作按钮back事件
    back(params) {
      if (params) this.$router.push({ ...params })
      else window.history.back()
    },
    // form实例
    getRef() {
      return this.$refs.basicsForm
    }
  }
}
</script>

<style>
.samll-tooltip {
  width: 300px;
}
</style>
<style lang="scss" scoped>
.fixed-label-width {
  /deep/ .el-form-item__label {
    width: 106px !important;
  }
}
.form-item {
  display: flex;
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  /deep/ .el-form-item__label {
    display: flex;
    /*width: 86px !important;*/
    margin-right: 10px;
    align-items: center;
    justify-content: flex-end;
    align-self: flex-start;
    line-height: 1.3;
    min-height: 36px;
    vertical-align: middle;
    flex-shrink: 0;
  }
  .form-item-element {
    flex: 1;
  }
  /deep/ .el-input,
  /deep/ .el-slider,
  /deep/ .el-input-number,
  /deep/ .el-table,
  /deep/ .el-textarea,
  /deep/ .el-select {
    min-width: 320px;
  }
  /deep/ .el-checkbox-group {
    display: inline-table;
  }
  /deep/ .el-radio {
    /*line-height: 36px;*/
    line-height: 36px;
    float: left;
  }
  /deep/ .el-rate {
    height: 36px;
    display: flex;
    align-items: center;
    /*display: flex;*/
    /*align-items: center;*/
  }
}
.hidden {
  margin-bottom: 0;
}
.note {
  align-self: flex-start;
  /*margin-left: 10px;*/
  color: #999;
  font-size: 12px;
  line-height: 1.5;
  i {
    cursor: pointer;
  }
  &.primary {
    color: #409eff;
  }
  &.success {
    color: #67c23a;
  }
  &.info {
    color: #909399;
  }
  &.warning {
    color: #e6a23c;
  }
  &.danger {
    color: #f56c6c;
  }
}
/deep/ .el-form--inline {
  .el-form-item__label {
    justify-content: left;
    width: 100% !important;
  }
  .form-item {
    display: inline-block;
  }
  .form-action .el-form-item__label {
    display: none;
  }
}
</style>
