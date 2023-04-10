<template>
  <div class="page">
    <van-config-provider
      :theme="globalStore.darkTheme ? 'dark' : 'light'"
      :theme-vars="themeVars"
      class="min-h-100vh flex flex-col"
    >
      <van-nav-bar fixed safe-area-inset-top :title="commentStore.currentPage">
        <template v-if="navBarLeftIcon" #left>
          <van-icon name="arrow-left" size="28" @click="back" />
        </template>
        <template #title>
          <span class="font-bold text-xl">兔子树洞 · {{ pageName }}</span>
        </template>
        <template v-if="navBarRightIcon" #right>
          <van-icon name="plus" size="28" @click="toAdd" />
        </template>
      </van-nav-bar>
      <div class="h-[60px]"></div>

      <router-view v-slot="{ Component }">
        <transition :name="commentStore.animationType" mode="out-in" appear>
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
      <van-tabbar v-model="activePage" v-if="tabbarShow">
        <van-tabbar-item icon="chat-o" @click="toHome">留言</van-tabbar-item>
        <van-tabbar-item icon="user-o" @click="toMine">我的</van-tabbar-item>
      </van-tabbar>
    </van-config-provider>
  </div>
</template>
<script setup lang="ts" name="MobieLayout">
import { useCommentStore } from '@/store/comment'
import { useSettingStore } from '@/store/setting'

const globalStore = useSettingStore()
const activePage = ref(0)
const router = useRouter()
const route = useRoute()
const commentStore = useCommentStore()
const themeVars = {
  navBarHeight: '60px',
  skeletonRowBackgroundColor: '#eaeaea',
  skeletonAvatarBackgroundColor: '#eaeaea',
}
const pageName = ref('首页')
const navBarLeftIcon = ref(false)
const navBarRightIcon = ref(false)
const tabbarShow = ref(true)

const toAdd = () => {
  commentStore.animationType = 'fade-out'
  router.push('/add')
}

const back = async () => {
  commentStore.animationType = 'fade-in'
  await router.back()
}

const toMine = () => {
  commentStore.animationType = 'fade-left'
  router.push('/mine')
}

const toHome = () => {
  commentStore.animationType = 'fade-right'
  router.push('/')
}

const pathJudge = () => {
  if (route.path === '/') {
    activePage.value = 0
    pageName.value = '首页'
    navBarLeftIcon.value = false
    navBarRightIcon.value = true
    tabbarShow.value = true
  } else if (route.path === '/add') {
    pageName.value = '发表留言'
    navBarLeftIcon.value = true
    navBarRightIcon.value = false
    tabbarShow.value = false
  } else if (route.path === '/mine') {
    activePage.value = 1
    pageName.value = '我的'
    navBarLeftIcon.value = false
    navBarRightIcon.value = false
    tabbarShow.value = true
  } else if (route.path === '/login') {
    pageName.value = '登录'
    navBarLeftIcon.value = true
    navBarRightIcon.value = false
    tabbarShow.value = false
  } else if (route.path === '/reply') {
    pageName.value = '回复'
    navBarLeftIcon.value = true
    navBarRightIcon.value = false
    tabbarShow.value = false
  }
}

pathJudge()
watch(() => route.path, pathJudge)
</script>
<style scoped>
.page {
  min-height: 100vh;
  width: 100vw;
  background-color: #f7f8fa;
}
</style>
