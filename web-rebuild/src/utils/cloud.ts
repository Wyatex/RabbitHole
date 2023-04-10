import { Cloud } from 'laf-client-sdk'

export const cloud = new Cloud({
  baseUrl: import.meta.env.VITE_SERVICE_URL, // <APP_ID> 在首页应用列表获取
  getAccessToken: () => '', // 这里不需要授权，先填空
})
