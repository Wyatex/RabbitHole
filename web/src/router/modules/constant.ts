import { RouteRecordRaw } from 'vue-router'

import layout from '@/layouts/admin/index.vue'
import mobileLayout from '@/layouts/user/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    name: 'RedirectComponent',
    component: layout,
    meta: {
      hidden: true,
      hideBreadcrumb: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectComponent',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'Root',
    component: mobileLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '',
        name: 'CommentList',
        component: () => import('@/views/user/CommentList.vue'),
      },
      {
        path: 'add',
        name: 'CommentAdd',
        component: () => import('@/views/user/CommentAdd.vue'),
      },
    ],
  },
]

export default routes
