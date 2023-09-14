export default [
  {
    prop: 'forbid_type',
    label: '类型',
    type: 'radio', // 选择器,
    options: [
      { label: '钉钉ID', value: 'dd_userid' },
      { label: '登录账户', value: 'sub_service_id' },
      { label: '系统ID', value: 'sub_service_uid' }
    ],
    defaultVal: 'dd_userid',
    rules: [
      { required: true, message: '请选择封禁类型！' }
    ]
  },
  {
    prop: 'dd_userid',
    label: '钉钉ID',
    type: 'input', // 选择器,
    rules: [
      { required: true, message: '请输入dd_userid！' }
    ],
    visible: true
  },
  {
    prop: 'sub_service_id',
    label: '登录账户',
    type: 'input', // 选择器,
    rules: [
      { required: true, message: '请输入sub_service_id！' }
    ],
    visible: true
  },
  {
    prop: 'sub_service_uid',
    label: '系统ID',
    type: 'input', // 选择器,
    rules: [
      { required: true, message: '请输入sub_service_uid！' }
    ],
    visible: true
  }
]

export const formActions = ({ cancel }) => {
  return {
    submit: {
      hide: false // 是否显示 默认false
    },
    reset: {
      hide: true
    },
    back: {
      hide: true
    },
    cancel: {
      click: () => cancel(),
      type: 'button',
      label: '取消'
    }
  }
}
