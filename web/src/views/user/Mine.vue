<template>
  <div>
    <div class="h-10px"></div>
    <van-contact-card
      v-if="isLogin"
      type="edit"
      :name="userInfo.username"
      :tel="userInfo.phone"
    />
    <van-cell v-else title="未登录" is-link value="点击登录" to="login" />
    <h2 class="block-title">我的留言</h2>
    <van-empty description="暂无留言" />
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { serviceId } from '@/settings'
import InspireCloud from '@byteinspire/js-sdk'

const inspirecloud = new InspireCloud({ serviceId })
interface UserInfo {
  username: string
  phone: string
}
const userInfo: Ref<UserInfo> = ref({})
const isLogin = ref(false)

const getUserInfo = async () => {
  const res = await inspirecloud.run('UserInfo', {})
  if (res?.success) {
    userInfo.value.phone = res.user.phoneNumber
    userInfo.value.username = res.user.username
    isLogin.value = true
  } else {
    isLogin.value = false
  }
}
getUserInfo()
</script>
