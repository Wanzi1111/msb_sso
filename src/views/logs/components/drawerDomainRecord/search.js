export default [
  {
    prop: 'search_mode',
    label: '搜索类型',
    type: 'select', // 输入框,
    attr: {
      placeholder: '请输入姓名'
    },
    defaultVal: 'EXACT',
    options: [
      { label: '精准', value: 'EXACT' },
      { label: '模糊', value: 'LIKE' }
    ]
  },
  {
    prop: 'key_word',
    label: '关键字',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入关键字'
    }
  }
]
