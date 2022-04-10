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
      {
        path: 'mine',
        name: 'Mine',
        component: () => import('@/views/user/Mine.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login.vue'),
      },
      {
        path: 'reply',
        name: 'Reply',
        component: () => import('@/views/user/CommentReply.vue'),
      },
    ],
  },
]

export default routes
