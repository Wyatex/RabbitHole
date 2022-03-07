import { RouteRecordRaw } from 'vue-router'
import { renderIcon, renderSvgIcon } from '@/utils'
import layout from '@/layouts/admin/index.vue'
import { HomeOutline as HomeIcon } from '@/components/common/Icons'
import { adminUrl } from '@/settings'

const routes: Array<RouteRecordRaw> = [
  {
    path: adminUrl as string,
    name: 'admin',
    component: layout,
    meta: {
      isRoot: true,
      icon: renderIcon(HomeIcon),
    },
    children: [
      {
        path: '',
        name: 'admin-index',
        component: () => import('@/views/admin/homePage.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
  {
    path: adminUrl + '/comments',
    name: 'comments',
    component: layout,
    meta: {
      isRoot: true,
      icon: renderSvgIcon('comment'),
    },
    children: [
      {
        path: '',
        name: 'comment-index',
        component: () => import('@/views/admin/CommentList.vue'),
        meta: {
          title: '留言',
        },
      },
    ],
  },
  {
    path: adminUrl + '/block-word',
    name: 'blockWord',
    component: layout,
    meta: {
      isRoot: true,
      icon: renderSvgIcon('mgc'),
    },
    children: [
      {
        path: '',
        name: 'blockWordIndex',
        component: () => import('@/views/admin/BlockWordList.vue'),
        meta: {
          title: '敏感词',
        },
      },
    ],
  },
]

export default routes
