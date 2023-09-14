/**
 * CDN管理
 */
import Layout from '@/layout'

export default {
  path: '/forbidden',
  component: Layout,
  redirect: '/forbidden/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/forbidden/index'),
      name: 'domainList',
      meta: { title: '禁用', icon: 'setting', affix: true }
    }
  ]
}

