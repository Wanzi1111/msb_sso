
# BasicsSearch

公共基础搜索使用说明

1.引入使用  
```
template
  <basics-search ref="search" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch"/>
script
  import BasicsSearch from '@/components/BasicsSearch'
  import searchs from './searchs/searchs'

  components: { BasicsSearch },
  data
    searchs
  methods
    changeSearch
    submitSearch
  created
    this.$nextTick
      this.$refs.search.recoveryForm
  mounted
    this.$refs.search.recoveryForm
```
2.参数说明  
```
ref：搜索组件对象名称，父页面调用搜索内部函数需要设置
forms：搜索组件配置项，包含大部分表单组件，下面详细说明具体配置结构
changeSearch：当组件值发生变化调用函数
submitSearch：当点击默认搜索按钮调用函数
```
4.父页面调用函数\[回显]  
```
this.$refs.search.recoveryForm：回显组件的默认值，在页面渲染完毕后调用
```
5.配置与函数具体说明  
```
// 搜索组件配置项结构
searchs: [{
  prop: 'time', // 变量名称 必传
  label: '日期时间', // 组件label
  type: 'dateTimePicker', // 组件类型 必传 包含大部分表单组件类型,
  hide: true, // 是否默认折叠
  layer: 'large', // 所占布局宽度 all、large、default、small，默认default
  defaultVal: [], // 默认值 根据组件性质，如checkbox多选框组件是数组
  options: [ // 子选项 在radio、checkbox和select三种组件需要设置该属性。其他拥有options属性的组件，如cascader，设置到attr中
    {
      label: 'A',
      value: 'a'
    }
  ],
  attr: { // 组件属性 根据不同组件可以设置不同属性，如Switch可以设置activeColor，设置的属性将全部绑定到组件上
    type: 'datetimerange',
    startPlaceholder: '开始日期A',
    endPlaceholder: '结束日期B',
    defaultTime: ['12:00:00'],
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
}]

// 当搜索组件发生变化调用函数
changeSearch(val, oldVal) {
  val // 最新搜索组件数据
  oldVal // 改变之前的搜索组件数据
}

// 当点击默认搜索按钮调用函数
submitSearch(val) {
  val // 最新搜索组件数据
}

// 回显函数
this.$refs.form.recoveryForm(form, state) 
form // 对应搜索组件数据，设置其中一个或多个进行回显
state // 回显数据是否替代默认值，默认false，该参数如果为true，那么回显某个组件的值后，再点击重置[reset]操作，将固定位回显的值

```