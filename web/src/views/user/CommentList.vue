<template>
  <div class="flex-1">
    <pull-refresh v-model="loading" class="h-full" @refresh="onRefresh">
      <search
        v-model="keyword"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      />
      <div v-if="loading">
        <skeleton avatar :row="4" />
        <skeleton avatar :row="4" />
        <skeleton avatar :row="4" />
        <skeleton avatar :row="4" />
        <skeleton avatar :row="4" />
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
            <cell title="昵称" :value="item.nickname"></cell>
            <cell title="留言时间" :value="formatTime(item.createdAt)"></cell>
            <cell title="留言内容" :label="item.comment"></cell>
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

interface IComment {
  nickname: string
  comment: string
  createdAt: string
}

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
