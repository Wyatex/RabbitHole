import { useRouteStore } from '@/store/route'
import { isNavigationFailure, Router } from 'vue-router'

export function createGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    const Loading = window['$loading'] || null
    Loading && Loading.start()
    next()
    Loading && Loading.finish()
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
    if (isNavigationFailure(failure)) {
      console.error('failed navigation', failure)
    }

    const routeStore = useRouteStore()
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = routeStore.keepAliveComponents
    const currentComName: any = to.matched.find(
      item => item.name == to.name
    )?.name
    if (
      currentComName &&
      !keepAliveComponents.includes(currentComName) &&
      to.meta?.keepAlive
    ) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName)
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = routeStore.keepAliveComponents.findIndex(
        name => name == currentComName
      )
      if (index != -1) {
        keepAliveComponents.splice(index, 1)
      }
    }
    routeStore.setKeepAliveComponents(keepAliveComponents)

    const Loading = window['$loading'] || null
    Loading && Loading.finish()
  })

  router.onError(error => {
    console.error('路由错误:', error)
  })
}
