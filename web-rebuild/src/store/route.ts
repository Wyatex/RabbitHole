import { defineStore } from 'pinia'
import { routes } from '@/router'
import { RouteRecordRaw } from 'vue-router'

export interface IRouteState {
  keepAliveComponents: string[]
  routes: RouteRecordRaw[]
}

export const useRouteStore = defineStore({
  id: 'route',
  state: (): IRouteState => ({
    keepAliveComponents: [],
    routes,
  }),
  actions: {
    setKeepAliveComponents(compNames: string[]) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames
    },
  },
})
