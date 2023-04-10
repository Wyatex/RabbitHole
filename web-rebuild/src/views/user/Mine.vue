<template>
  <div>
    <div class="h-10px"></div>
    <van-contact-card v-if="isLogin" type="edit" :name="userInfo.username" />
    <van-cell v-else title="未登录" is-link value="点击登录" to="login" />
    <h2 class="block-title">我的留言</h2>
    <van-empty description="暂无留言" />
  </div>
</template>
<script setup lang="ts">
import { cloud } from '@/utils/cloud'

interface UserInfo {
  username?: string
  password?: string
  nickname?: string
}
const userInfo = ref<UserInfo>({})
const isLogin = ref(false)

const getUserInfo = async () => {
  const res = await cloud.invoke('UserInfo', {
    type: 'get',
  })
  if (res?.success) {
    userInfo.value.username = res.user.username
    isLogin.value = true
  } else {
    isLogin.value = false
  }
}
getUserInfo()
</script>
