const table = {
  path: 'table',
  component: () => import('@/layout'),
  redirect: '/table/demo',
  name: 'Table',
  meta: {
    title: 'parentTitle',
    icon: 'table'
  },
  children: [
    {
      path: '/table/demo',
      name: 'TableDemo',
      component: resolve => void require(['@/views/table/demo'], resolve),
      meta: {
        title: 'tableDemo'
      }
    },
    {
      path: '/table/demoTest',
      name: 'DemoTest',
      component: resolve => void require(['@/views/table/demoTest'], resolve),
      meta: {
        title: 'demoTest'
      }
    }
  ]
}

export default table
