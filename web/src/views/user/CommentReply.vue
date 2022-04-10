<template>
  <div>
    <div class="flex justify-start items-center h-60px bg-white mt-16px">
      <van-icon
        class="ml-16px"
        size="30"
        name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png"
      />
      <div class="ml-16px">
        <h2 class="text-xl">{{ comment.nickname }}</h2>
        <p class="text-xs">{{ data }}</p>
      </div>
    </div>
    <div>
      <h2 class="block-title">评论区</h2>
    </div>
    <div></div>
    <van-action-bar>
      <van-field
        placeholder="请输入留言"
        class="bg-gray-300 !w-70vw"
        v-model="reply"
      />
      <van-action-bar-button type="danger" text="回复" />
    </van-action-bar>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import dayjs from 'dayjs'

const comment = ref<any>()
const reply = ref<any>()
const route = useRoute()
const data = dayjs(route.params.createdAt as string).format(
  'YYYY-MM-DD H:MM:ss'
)
const replys = route.params.replys || []
comment.value = route.params
console.log(route.params)
</script>
