// import { LINE_TYPE, TTL_MAP } from '../../config'

export const TYPE_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'NS', value: 'NS' },
  { label: 'MX', value: 'MX' },
  { label: 'TXT', value: 'TXT' },
  { label: 'CNAME', value: 'CNAME' },
  { label: 'SRV', value: 'SRV' },
  { label: 'AAAA', value: 'AAAA' },
  { label: 'CAA', value: 'CAA' },
  { label: 'REDIRECT_URL', value: 'REDIRECT_URL' },
  { label: 'FORWARD_URL', value: 'FORWARD_URL' }
]

export const addDomainForm = [
  {
    prop: 'rr',
    label: '主机记录',
    type: 'input', // 选择器,
    attr: {
      placeholder: '请输入主机记录'
    },
    rules: [
      { required: true, message: '主机记录不能为空' }
    ],
    note: true,
    noteConfig: {
      type: 'text',
      text: '将域名指向一个IPV4地址'
    }
  },
  {
    prop: 'value',
    label: '记录值',
    type: 'input', // 选择器,
    attr: {
      placeholder: '记录值'
    },
    rules: [
      { required: true, message: '记录值不能为空' }
    ]
  },
  {
    prop: 'ttl',
    label: '缓存时间(TTL)',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择缓存时间'
    },
    // options: Object.keys(TTL_MAP).map((v) => ({ label: TTL_MAP[v], value: v })),
    defaultVal: '600',
    rules: [
      { required: true, message: '缓存时间不能为空' }
    ]
  },
  {
    prop: 'line',
    label: '解析线路(isp)',
    type: 'select', // 选择器,
    // options: Object.keys(LINE_TYPE).map((v) => ({ label: LINE_TYPE[v], value: v })),
    defaultVal: 'default',
    attr: {
      placeholder: '请选择解析线路'
    },
    rules: [
      { required: true, message: '解析线路不能为空' }
    ],
    note: true,
    noteConfig: {
      type: 'text',
      text: '未匹配到智能解析线路时，返回【默认】线路设置结果'
    }
  },
  {
    prop: 'type',
    label: '类型',
    type: 'select', // 选择器,
    options: TYPE_OPTIONS,
    defaultVal: 'A',
    attr: {
      placeholder: '请选择类型'
    },
    rules: [
      { required: true, message: '类型不能为空' }
    ]
  },
  {
    prop: 'priority',
    label: '优先级',
    type: 'input', // 选择器,
    attr: {
      placeholder: '请输入优先级'
    },
    visible: false,
    defaultVal: '0',
    rules: [
      { required: true, message: '优先级不能为空' }
    ]
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea', // 选择器,
    attr: {
      placeholder: '请输入备注'
    },
    rules: [
      { required: true, message: '备注不能为空' }
    ]
  }
]

export const addDomainFormAction = ({ quit }) => {
  return {
    submit: {
      label: '提交'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
