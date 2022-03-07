<template>
  <div>
    <van-form class="mt-4">
      <cell-group inset>
        <field
          v-model="nickname"
          placeholder="请输入你的昵称或者输入想对谁说"
          label="昵称"
        />
        <field
          v-model="comment"
          type="textarea"
          placeholder="请输入你的留言内容"
          label="留言"
          maxlength="600"
          autosize
          show-word-limit
        />
        <field
          v-model="expirationString"
          placeholder="留空表示不过时"
          label="过期时间"
          clearable
          is-link
          readonly
          @click="timePickerShow = true"
        />
        <popup v-model:show="timePickerShow" position="bottom">
          <datetime-picker
            @cancel="timePickerShow = false"
            @confirm="onPickTime"
            :min-date="minDate"
          />
          <div class="m-[16px]">
            <van-button @click="clearTime" block type="warning" round>
              清除已选
            </van-button>
          </div>
        </popup>
      </cell-group>
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
      <cell-group @click="clip" inset>
        <cell title="句子" :label="sentence"></cell>
        <cell title="来源" :value="from"></cell>
      </cell-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Toast,
  Form as VanForm,
  Field,
  CellGroup,
  Button as VanButton,
  Cell,
  DatetimePicker,
  Popup,
} from 'vant'
import { onUnmounted, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { axios } from '@/utils/http'
import dayjs from 'dayjs'

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
    res = await axios({
      url: '/CommentAdd',
      method: 'post',
      data: {
        comment: comment.value,
        nickname: nickname.value,
        expiration: expiration.value,
      },
    })
  } else {
    res = await axios({
      url: '/CommentAdd',
      method: 'post',
      data: {
        comment: comment.value,
        nickname: nickname.value,
      },
    })
  }

  if (res.success) {
    Toast.success('发表成功')
    router.back()
  } else {
    Toast.fail('发表失败，原因：' + res.message)
  }
  loading.value = false
}
const getSentence = async () => {
  const res = await axios({
    url: 'https://v1.hitokoto.cn?encode=json',
  })
  sentence.value = res.hitokoto
  from.value = res.from
}
const clip = async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(sentence.value)
    Toast.success('复制成功')
  } else {
    Toast.fail('浏览器不支持复制，请手动复制')
  }
}

const onPickTime = val => {
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
