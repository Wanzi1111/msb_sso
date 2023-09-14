/**
 * 日志
 */
import Layout from '@/layout'

export default {
  path: '/logs',
  component: Layout,
  redirect: '/logs/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/logs/index'),
      name: 'domainList',
      meta: { title: '日志', icon: 'list', affix: true }
    }
  ]
}

