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
          maxlength="300"
          autosize
          show-word-limit
        />
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
} from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { axios } from '@/utils/http'
const router = useRouter()
const loading = ref(false)
const nickname = ref('')
const comment = ref('')
const sentence = ref('')
const from = ref('')
const onAdd = async () => {
  loading.value = true
  const res = await axios({
    url: '/CommentAdd',
    method: 'post',
    data: {
      comment: comment.value,
      nickname: nickname.value,
    },
  })
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
  setTimeout(getSentence, 5000)
}
const clip = async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(sentence.value)
    Toast.success('复制成功')
  } else {
    Toast.fail('浏览器不支持复制，请手动复制')
  }
}

onMounted(getSentence)
</script>
<style scoped></style>
