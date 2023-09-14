/**
 * CDN管理
 */
import Layout from '@/layout'

export default {
  path: '/project',
  component: Layout,
  redirect: '/project/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/project/index'),
      name: 'projectList',
      meta: { title: '项目列表', icon: 'list', affix: true }
    }
  ]
}
