import { defineStore } from 'pinia'
import { store } from '@/store'

export const useCommentStore = defineStore({
  id: 'setting',
  state: () => ({
    currentPage: '兔子树洞',
    commentContent: '',
    commentBy: '',
    pageNo: 1,
    pageSize: 10,
  }),
  getters: {},
  actions: {},
})

// 在setup以外的地方使用
export function useCommentStoreOutOfSetup() {
  return useCommentStore(store)
}
