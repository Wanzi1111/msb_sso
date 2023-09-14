// import { LINE_TYPE, TTL_MAP } from '../../config'

export default [
  {
    prop: 'access_time',
    label: '访问时间',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'request_url',
    label: 'url记录',
    align: 'center',
    minWidth: 200
  }
  // {
  //   action: true,
  //   name: 'action',
  //   width: 160,
  //   prop: 'action',
  //   label: '操作',
  //   align: 'center',
  //   fixed: 'right'
  // }
]

export const actions = ({ handleTableActions }) => ({
  status: data => {
    return [
      {
        type: 'tag',
        label: data === 'ENABLE' ? '正常' : '禁用',
        attr: {
          type: data === 'ENABLE' ? 'success' : 'danger'
        }
      }
    ]
  },
  action: () => {
    return [
      {
        type: 'button',
        label: '删除',
        click: (_, row) => handleTableActions('delete', row),
        attr: {
          type: 'danger',
          icon: 'el-icon-delete',
          size: 'mini'
        }
      },
      {
        type: 'button', // 按钮
        label: '修改',
        click: (_, row) => handleTableActions('edit', row),
        align: 'right',
        attr: {
          // type: 'primary',
          plain: true,
          size: 'small',
          icon: 'el-icon-edit'
        }
      }
    ]
  }
})

export const basicsActions = handleBasicsAction => {
  return [
    {
      type: 'button', // 按钮
      label: '添加',
      click: () => handleBasicsAction('add'),
      align: 'right',
      attr: {
        // type: 'primary',
        plain: true,
        size: 'small',
        icon: 'el-icon-plus'
      }
    }
  ]
}
