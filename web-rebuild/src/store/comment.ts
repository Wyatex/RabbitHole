import { defineStore } from 'pinia'

export const useCommentStore = defineStore({
  id: 'setting',
  state: () => ({
    currentPage: '兔子树洞',
    commentContent: '',
    commentBy: '',
    pageNo: 1,
    pageSize: 10,
    animationType: '',
  }),
  getters: {},
  actions: {},
})