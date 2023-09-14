export default [
  {
    prop: 'user_name',
    label: '钉钉用户名',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'dept_list',
    label: '钉钉组织架构',
    align: 'center',
    minWidth: 130
  },
  {
    prop: 'dd_userid',
    label: '钉钉ID',
    minWidth: 200,
    align: 'center'
  },
  {
    prop: 'forbidden',
    label: '是否禁用',
    minWidth: 120,
    align: 'center'
  }
  // {
  //   prop: 'jwt',
  //   label: 'jwt',
  //   align: 'center',
  //   minWidth: 200,
  //   showOverflowTooltip: true
  // },
  // {
  //   prop: 'msg',
  //   label: 'msg',
  //   minWidth: 170,
  //   align: 'center'
  // },
  // {
  //   prop: 'ctime',
  //   label: 'ctime',
  //   minWidth: 180,
  //   align: 'center'
  // }
  // {
  //   action: true,
  //   name: 'action',
  //   width: 130,
  //   prop: 'action',
  //   label: '操作',
  //   align: 'center',
  //   fixed: 'right'
  // }
]

export const columns2 = [
  {
    prop: 'username',
    label: '钉钉用户名',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'service_name',
    label: '系统名称',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'sub_service_uid',
    label: '账户',
    align: 'center',
    minWidth: 130
  },
  {
    prop: 'dd_userid',
    label: '钉钉ID',
    minWidth: 200,
    align: 'center'
  },
  {
    prop: 'account_forbidden',
    label: '账户封禁',
    align: 'center',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'user_forbidden',
    label: '用户封禁',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'serv_forbidden',
    label: '项目封禁',
    minWidth: 120,
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    width: 130,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]

export const actions = ({ handleTableActions }) => ({
  action: (data) => {
    return [
      {
        type: 'button',
        label: '封禁',
        click: (_, row) => handleTableActions('forbid', row),
        attr: {
          type: 'warning',
          size: 'mini'
        }
      },
      {
        type: 'button',
        label: '解禁',
        click: (_, row) => handleTableActions('unforbid', row),
        attr: {
          // type: statusArr[data] || ''
          size: 'mini'
        }
      }
    ]
  }
})
