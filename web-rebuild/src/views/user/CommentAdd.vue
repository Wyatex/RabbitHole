<template>
  <div>
    <van-form class="mt-4">
      <van-cell-group inset>
        <van-field
          v-model="nickname"
          placeholder="请输入你的昵称或者输入想对谁说"
          label="昵称"
        />
        <van-field
          v-model="comment"
          type="textarea"
          placeholder="请输入你的留言内容"
          label="留言"
          maxlength="600"
          autosize
          show-word-limit
        />
        <van-field
          v-model="expirationString"
          placeholder="留空表示不过时"
          label="过期时间"
          clearable
          is-link
          readonly
          @click="timePickerShow = true"
        />
        <van-popup v-model:show="timePickerShow" position="bottom">
          <van-date-picker
            @cancel="timePickerShow = false"
            @confirm="onPickTime"
            :min-date="minDate"
          />
          <div class="m-[16px]">
            <van-button @click="clearTime" block type="warning" round>
              清除已选
            </van-button>
          </div>
        </van-popup>
      </van-cell-group>
      <div class="m-[16px]">
        <van-button
          @click="onAdd"
          :loading="loading"
          block
          type="primary"
          round
        >
          发表
        </van-button>
      </div>
    </van-form>
    <div class="tips mt-5">
      <h2 class="block-title">tips：昵称可以写你想对谁说哦~</h2>
      <h2 @click="clip" class="block-title">网络语句(点击复制语句)</h2>
      <van-cell-group @click="clip" inset>
        <van-cell title="句子" :label="sentence"></van-cell>
        <van-cell title="来源" :value="from"></van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import { cloud } from '@/utils/cloud'
import { showToast } from 'vant'

const router = useRouter()
const loading = ref(false)
const nickname = ref('')
const comment = ref('')
const expiration: Ref<null | number> = ref(null)
const expirationString = ref('')
const sentence = ref('')
const from = ref('')
const timePickerShow = ref(false)
const minDate = new Date()
const onAdd = async () => {
  loading.value = true
  let res
  if (expiration.value != null) {
    res = await cloud.invoke('CommentAdd', {
      comment: comment.value,
      nickname: nickname.value,
      expiration: expiration.value,
    })
  } else {
    res = await cloud.invoke('CommentAdd', {
      comment: comment.value,
      nickname: nickname.value,
    })
  }

  if (res.success) {
    showToast('发表成功')
    router.back()
  } else {
    showToast('发表失败，原因：' + res.message)
  }
  loading.value = false
}
const getSentence = async () => {
  const res = await axios.get('https://v1.hitokoto.cn?encode=json')
  sentence.value = res.data.hitokoto
  from.value = res.data.from
}
const clip = async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(sentence.value)
    showToast('复制成功')
  } else {
    showToast('浏览器不支持复制，请手动复制')
  }
}

const onPickTime = (val: Date) => {
  expirationString.value = dayjs(val).format('YYYY-MM-DD HH:mm')
  expiration.value = val.valueOf()
  timePickerShow.value = false
}

const clearTime = () => {
  expiration.value = null
  expirationString.value = ''
  timePickerShow.value = false
}

getSentence()
const timer = setInterval(getSentence, 5000)

onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style scoped></style>
