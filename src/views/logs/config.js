/*
 * @Author: ZhangYeLei
 * @Date: 2021-11-06 14:55:04
 * @LastEditTime: 2022-04-02 15:07:42
 * @LastEditors: ZhangYeLei
 */

export default [
  {
    prop: 'service',
    label: '系统名',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'dd_username',
    label: '钉钉用户名',
    align: 'center',
    minWidth: 130
  },
  {
    prop: 'sub_userid',
    label: '子系统ID',
    minWidth: 130,
    align: 'center'
  },
  {
    prop: 'dd_userid',
    label: '钉钉ID',
    minWidth: 270,
    align: 'center'
  },
  // {
  //   prop: 'jwt',
  //   label: 'jwt',
  //   align: 'center',
  //   minWidth: 200,
  //   showOverflowTooltip: true
  // },
  {
    prop: 'msg',
    label: '行为记录',
    minWidth: 170,
    align: 'center'
  },
  {
    prop: 'ctime',
    label: '记录时间',
    minWidth: 180,
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    width: 100,
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
        label: '明细',
        click: (_, row) => handleTableActions('viewDetails', row),
        attr: {
          // type: statusArr[data] || ''
          icon: 'el-icon-view',
          size: 'mini'
        }
      }
    ]
  }
})
