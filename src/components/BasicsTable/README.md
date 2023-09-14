
# BasicsTable

公共基础表格使用说明

1.引入使用  
```
template
  <basics-table
    ref="table"
    :table="table"
    :handle-selection-change="handleSelectionChange"
    :loading="loading"
    :list="list"
    :get-list="getList"
    :columns="columns"
    :total="total"
    :list-query="listQuery"
    :action-function="actionFunction"
  />
script
  import BasicsTable from '@/components/BasicsTable'
  import columns, { actions } from './columns/list'

  components: { BasicsTable },
  data
    table: { stripe: false },
    columns: columns,
    actionFunction: actions({ ok: this.ok }),
    list: null,
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      limit: 10
    }
  methods
    getList
    handleSelectionChange
    this.$refs.table.toggleRowSelection(row)
    this.$refs.table.clearSelection()
```
2.参数说明  
```
ref：表格对象名称，父页面调用搜索内部函数需要设置
table: 表格配置项，所有配置将绑定到el-table上
columns: 表头配置，下面详细说明具体配置结构
actionFunction: 列操作函数配置，下面详细说明具体配置结构
list: 表格数据
loading: 加载遮罩
total: 分页总数
listQuery: { 分页配置
  page: 1,
  limit: 10
}
getList：获取数据函数，分页组件调用
handleSelectionChange：行勾选变化回调函数
```
4.父页面调用函数   
```
this.$refs.table.toggleRowSelection(row)：表格行勾选指定行
this.$refs.table.clearSelection()：表格行清除勾选行
```
5.配置与函数具体说明  
```

// 表格配置，所有原生table配置可写在这里，将全部绑定到el-table上
table: {
  stripe: false,
  ...
}
跟多配置项查看：https://element.eleme.io/2.7/#/zh-CN/component/table#table-attributes

// 表头配置项结构
columns: [
{ // A型 - 可选择表头
  type: 'selection', // 设置该列为可选列
  width: 40,
  align: 'center'
},
{ // B型 - 普通表头
  prop: 'forecast', // 变量名称 必传 
  label: '物料尺寸', // 表头标题
  align: 'center', // 对齐方式
  width: 40, // 宽度
  showOverflowTooltip: true, // 超出省略，并以Tooltip显示
  ... // 更多el-table-column原生属性都可以设置
  render: (dat, row, index) => { // 自定义渲染显示，传递当前列数据、行数据、行下标三个参数
    const stutas = {
      a: 'success',
      b: 'error'
    };
    return stutas[row.stutas]
  }
},
{ // C型 - 操作列，高配置自由度
  name: 'one', // 对应actionFunction中的函数对象（）
  prop: 'action',
  label: '操作1',
  align: 'center',
  action: true, // 设置该列为操作列，name和margin需要该属性才生效，actionFunction中需有对应name的对象才生效
  margin: 'large' // 布局，在该列中的元素间的间距设置，分为large、default、small，默认default
}]

// 操作列函数配置
actionFunction: {
  one: [ // 对象名对应columns表头中设置action为true的name
    {
      type: 'button', // Button类型
      click: ok, // 点击调用函数
      label: 'ok', // label
      attr: { // 组件属性 根据不同组件可以设置不同属性，设置的属性将全部绑定到组件上
        plain: true,
        type: 'danger',
        round: true,
        circle: true
      }
    },
    {
      type: 'a', // a标签按钮类型（href设置为javascript:;）
      label: 'button a',
      click: ok,
      attr: {
        style: {
          color: '#4CAF50'
        }
      }
    },
    {
      type: 'link', // a标签链接类型
      label: 'link a',
      attr: {
        href: 'http://baidu.com',
        style: {
          'text-decoration': 'underline',
          color: '#1890ff'
        }
      }
    },
    {
      type: 'span', // span标签文本类型
      label: 'span',
      attr: {
        style: {
          color: '#333'
        }
      }
    }
  ],
  two: [],
  ...
}


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