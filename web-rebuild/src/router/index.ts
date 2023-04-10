import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { createGuard } from './guard'
// import adminRoutes from './modules/admin'
import userRoutes from './modules/user'

// 导出默认静态路由
export const routes = [...userRoutes]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL as string),
  routes,
})

// 挂载路由和创建路由守卫
export function setupRouter(app: App<Element>) {
  app.use(router)
  createGuard(router)
}

// 也可以使用导出的路由实例进行挂载
export default router
