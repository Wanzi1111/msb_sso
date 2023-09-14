/**
 * 创建审批单
 */
import Layout from '@/layout'

export default {
  path: '/approval',
  component: Layout,
  redirect: '/approval/approvalList',
  meta: { title: '工单管理', icon: 'setting', affix: true },
  children: [
    {
      path: 'createApprovalForm',
      component: () => import('@/views/approval/createApprovalForm/index'),
      name: 'CreateApprovalForm',
      meta: { title: '创建审批单', icon: 'edit', affix: true }
    },
    {
      path: 'approvalList',
      component: () => import('@/views/approval/approvalList/index'),
      name: 'ApprovalList',
      meta: { title: '审批单列表', icon: 'form', affix: true }
    },
    {
      path: 'approvalHistoryList',
      component: () => import('@/views/approval/approvalHistoryList/index'),
      name: 'ApprovalHistroyList',
      meta: { title: '历史审批单', icon: 'table', affix: true }
    },
    {
      path: 'approvalManage',
      component: () => import('@/views/approval/approvalManage/index'),
      name: 'ApprovalManage',
      meta: { title: '审批单管理', icon: 'setting', affix: true }
    }
  ]
}
