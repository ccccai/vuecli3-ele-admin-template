const table = {
  path: 'table',
  component: () => import('@/layout'),
  redirect: '/table/demo',
  name: 'Table',
  meta: {
    title: '表格',
    icon: 'table'
  },
  children: [
    {
      path: '/table/demo',
      name: 'TableDemo',
      component: resolve => void require(['@/views/table/demo'], resolve),
      meta: {
        title: 'demo1'
      }
    }
  ]
}

export default table
