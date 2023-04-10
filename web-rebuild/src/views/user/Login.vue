<template>
  <van-form @submit="handleLogin">
    <div class="h-10px"></div>
    <van-cell-group inset>
      <van-field
        type="tel"
        v-model="phone"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <van-field
        v-model="code"
        name="验证码"
        label="验证码"
        placeholder="请输入短信验证码"
        center
        clearable
      >
        <template #button>
          <van-button
            @click="handleSendSms"
            size="small"
            type="primary"
            :disabled="!canSend"
          >
            {{ canSend ? '发送验证码' : canSendAfter + '秒后重试' }}
          </van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showNotify  } from 'vant'
import { cloud } from '@/utils/cloud'

const router = useRouter()
const phone = ref('')
const code = ref('')
const canSend = ref(true)
const canSendAfter = ref(0)

const handleSendSms = async () => {
  // if (
  //   !/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(
  //     phone.value
  //   )
  // ) {
  //   showNotify ('手机号不正确，请重试')
  //   return
  // }
  // canSendAfter.value = 60
  // const key = setInterval(() => {
  //   canSend.value = false
  //   canSendAfter.value--
  //   if (canSendAfter.value <= 0) {
  //     canSend.value = true
  //     clearInterval(key)
  //   }
  // }, 1000)
  // const res = await await cloud.invoke('SendMessageAPI', {
  //   phoneNumber: phone.value,
  // })
  // console.log(res)
}

const handleLogin = async () => {
  if (phone.value === '' || code.value === '') {
    showNotify ('请输入验证码')
    return
  }
  const res = await cloud.invoke('Login', {
    username: phone.value,
    password: code.value,
  })
  if (res?.success) {
    router.push('/mine')
  }
}
</script>
