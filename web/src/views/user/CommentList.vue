<template>
  <div class="flex-1">
    <pull-refresh v-model="loading" class="h-full" @refresh="onRefresh">
      <search
        v-model="keyword"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      />
      <div v-if="loading">
        <skeleton :row="4" />
        <skeleton :row="4" />
        <skeleton :row="4" />
        <skeleton :row="4" />
        <skeleton :row="4" />
      </div>
      <div class="content">
        <list
          finished-text="没有更多了"
          v-model:loading="loading"
          :finished="finish"
          @load="loadData"
        >
          <cell-group
            class="!mt-4"
            inset
            v-for="item in dataList"
            :key="item._id"
          >
            <cell v-if="item.nickname">
              <template #title>
                <span
                  style="color: var(--van-cell-value-color); font-size: 10px"
                  >{{ item.nickname }}</span
                >
              </template>
              <template #value>
                <span
                  style="color: var(--van-cell-value-color); font-size: 10px"
                  >{{ formatTime(item.createdAt) }}</span
                >
              </template>
            </cell>
            <cell v-else>
              <template #title>
                <span></span>
              </template>
              <template #value>
                <span
                  style="color: var(--van-cell-value-color); font-size: 10px"
                  >{{ formatTime(item.createdAt) }}</span
                >
              </template>
            </cell>
            <cell is-link @click="toReply(item)">
              <template #title>
                <span style="white-space: pre-wrap">
                  {{ item.comment }}
                </span>
              </template>
              <template #right-icon>
                <div></div>
              </template>
            </cell>
          </cell-group>
        </list>
      </div>
    </pull-refresh>
  </div>
</template>
<script setup lang="ts">
import { PullRefresh, Search, Skeleton, List, Cell, CellGroup } from 'vant'
import { ref, Ref } from 'vue'
import { axios } from '@/utils/http'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useCommentStore } from '@/store/modules/comment'

interface IComment {
  _id: string
  nickname: string
  comment: string
  createdAt: string
}

const router = useRouter()
const commentStore = useCommentStore()
const loading = ref(false)
const keyword = ref('')
const dataList: Ref<IComment[]> = ref([])
const pageNo = ref(0)
const finish = ref(false)
const onRefresh = async () => {
  dataList.value = []
  pageNo.value = 0
  finish.value = false
  loadData()
}
const onSearch = async () => {
  dataList.value = []
  pageNo.value = 0
  finish.value = false
  loadData()
}

const toReply = (comment: any) => {
  commentStore.animationType = 'zoom-fade-reverse'
  router.push({
    name: 'Reply',
    params: comment,
  })
}

const loadData = async () => {
  loading.value = true
  if (keyword.value) {
    const res = await axios({
      url: '/CommentPage',
      method: 'post',
      data: {
        pageNo: pageNo.value + 1,
        pageSize: 10,
        keyword: keyword.value,
      },
    })
    if (res.success) {
      pageNo.value = res.data.pageNo
      dataList.value = [...dataList.value, ...res.data.rows]
      if (dataList.value.length >= res.data.totalCount) {
        finish.value = true
      }
    } else {
      finish.value = true
    }
    loading.value = false
    return
  }
  const res = await axios({
    url: '/CommentPage',
    method: 'post',
    data: {
      pageNo: pageNo.value + 1,
      pageSize: 10,
    },
  })
  if (res.success) {
    pageNo.value = res.data.pageNo
    dataList.value = [...dataList.value, ...res.data.rows]
    if (dataList.value.length >= res.data.totalCount) {
      finish.value = true
    }
  } else {
    finish.value = true
  }
  loading.value = false
}
const formatTime = date => dayjs(date).format('YYYY-MM-DD HH:mm')
</script>
<style scoped>
.van-skeleton {
  margin: 20px;
}
:deep(.van-search__field) {
  flex: 1;
  padding: 5px var(--van-padding-xs) 5px 0 !important;
  background-color: transparent !important;
}
</style>
