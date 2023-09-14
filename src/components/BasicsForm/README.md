
# BasicsForm

公共基础表单使用说明

1.引入使用  
```
template
  <basics-form ref="form" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm"/>
script
  import BasicsForm from '@/components/BasicsForm'
  import forms, {actions} from './forms/forms'

  components: { BasicsForm },
  data
    forms
    actions
  methods
    changeForm
    submitForm
  created
    this.$nextTick
      this.$refs.form.recoveryForm
  mounted
    this.$refs.form.recoveryForm
  methods
    this.$refs.form.setVisible
```
2.参数说明  
```
ref：form对象名称，父页面调用表单内部函数需要设置
forms：表单组件配置项，包含element-ui@2.8.2所有表单组件，下面详细说明具体配置结构
actions：表单底部操作配置项，默认有submit、reset、back三个按钮，下面详细说明具体配置结构
changeForm：当表单发生变化调用函数
submitForm：当点击默认submit按钮调用函数
setVisible: 设置组件显隐
```
4.父页面调用函数\[回显]  
```
this.$refs.form.recoveryForm：回显组件的默认值，在页面渲染完毕后调用
```
5.配置与函数具体说明  
```
// 表单组件配置项结构
forms: [{
  prop: 'name1', // 变量名称 必传 
  label: '输入框', // 组件label 如果没有可以传空格或者空字符串占位
  type: 'input', // 组件类型 必传 支持2.8.2版本所有表单组件类型和富文本
  hide: true, // 是否隐藏、默认false
  note: true, // 组件格外说明
  noteConfig: { // 格外说明配置
    type: 'tooltip', // 展示方式text、tooltip
    text: '这是一段说明', // 说明内容
    icon: 'el-icon-info', // 图标
    placement: 'left', // tooltip的展示方向
    style: 'info', // 样式 primary、success、info、warning、danger，默认info
  },
  defaultVal: 1, // 默认值 根据组件性质，如cascader级联组件是数组
  recovery: false, // 点击reset是否恢复默认值 默认true 该属性配合操作按钮reset使用，当设置为false，那么点击reset将组件值设为空
  rules: [ // 校验 
    { required: true, message: '年龄不能为空'},
    { type: 'number', message: '年龄必须为数字值'}
  ],
  attr: { // 组件属性 根据不同组件可以设置不同属性，如Switch可以设置activeColor，设置的属性将全部绑定到组件上
    placeholder: '请输入内容',
    activeColor: '#13ce66'
  }
}]

// 表单底部操作配置项结构
actions: {
  submit: { // 默认按钮一
    hide: true, // 是否显示 默认false
    label: '修改', // 按钮label
    attr: { // 按钮属性
      icon: 'el-icon-xxx' // 可更换icon
    },
    confirm: true, // 是否包裹二次确认对话框
    confirmConfig: { // 自定二次确认对话框属性
      confirmButtonText: 'A',
      cancelButtonText: 'B',
      type: 'C',
      label: 'D',
      text: 'E',
    },
  },
  reset: {}, // 默认按钮二 配置同一
  back: {}, // 默认按钮三 配置同一
  ↑↑↑默认操作↑↑↑   

  ↓↓↓自定义操作↓↓↓
  goTo: { // 自定义操作，支持按钮和a标签
    click: this.goTo, // 事件 类型为button、a必传
    type: '', // 类型 必传 button、a、link
    label: 'GoTo', // label
    attr: { // 组件属性，设置的属性将全部绑定到组件上
      type: "primary", 
      icon: "el-icon-check",
    }
  }
}
区别：
  默认操作按钮：
    为了敏捷开发，组件预设了确认[submit]、重置[reset]、返回[back]三个按钮，分别对应调用submitForm、重置表单并调用changeForm、router.go(-1)三个操作
    默认操作按钮的配置只有是否显示、label、图标、是否包裹二次确认框4种，一般情况不用配置
  自定义操作按钮：
    在默认操作按钮不能适用的场景时，可以自定义操作，对应三种类型button、a、link，button、a是click事件，link是链接
    自定义操作的配置不局限与默认配置，可以在attr中设置对应组件的跟多属性，设置的属性将全部绑定到组件上
其他说明：
  当场景不需要这么多按钮，甚至不需要操作时，可以将三个默认按钮的hide属性设置为true，那么操作按钮全部不显示，并且包裹操作的块元素也会隐藏
  如果默认操作按钮的hide全部设置为true时，你还拥有一个自定义操作，那么将不会影响操作的显示

// 当表单发生变化调用函数
changeForm(val, oldVal) {
  val // 最新表单数据
  oldVal // 改变之前的表单数据
}

// 当点击默认submit按钮调用函数
submitForm(val) {
  val // 最新表单数据
}

// 回显函数
this.$refs.form.recoveryForm(form, state) 
form // 对应表单数据，设置其中一个或多个进行回显
state // 回显数据是否替代默认值，默认false，该参数如果为true，那么回显某个组件的值后，再点击重置[reset]操作，将固定位回显的值

// 设置组件显隐
this.$refs.form.setVisible({prop: false, prop: true})
参数对应forms的prop属性，false为隐藏，true为显示

```