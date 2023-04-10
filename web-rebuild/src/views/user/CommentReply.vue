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
        <p class="text-xs">{{ date }}</p>
      </div>
    </div>
    <div>
      <h2 class="block-title">评论区</h2>
    </div>
    <div>
      <van-cell-group>
        <van-cell
          :title="replyInComment"
          v-for="(replyInComment, index) in replys"
          :key="index"
        />
      </van-cell-group>
    </div>
    <van-action-bar>
      <van-field
        placeholder="请输入留言"
        class="bg-gray-300 !w-70vw"
        v-model="reply"
      />
      <van-action-bar-button type="danger" text="回复" @click="handleReply" />
    </van-action-bar>
  </div>
</template>
<script setup lang="ts">
import { showNotify } from 'vant'
import dayjs from 'dayjs'
import { cloud } from '@/utils/cloud'

const comment = ref<IComment>()
const reply = ref<any>()
const route = useRoute()
const date = dayjs(history.state.createdAt as string).format(
  'YYYY-MM-DD H:MM:ss'
)
const replys = ref<string[]>((history.state.replys as string[]) ?? [])
comment.value = history.state as unknown as IComment
console.log(history.state)
const handleReply = async () => {
  const res = await cloud.invoke('CommentReply', {
    id: history.state._id,
    reply: reply.value,
  })
  if (res.success) {
    showNotify('回复成功')
    replys.value.push(reply.value)
  } else {
    showNotify('回复失败')
  }
}
</script>
