<template>
  <div class="page">
    <config-provider :theme-vars="themeVars" class="h-full flex flex-col">
      <nav-bar fixed safe-area-inset-top :title="commentStore.currentPage">
        <template v-if="inCommentAddPage" #left>
          <icon name="arrow-left" size="28" @click="back" />
        </template>
        <template #title>
          <span class="font-bold text-xl">兔子树洞 · {{ pageName }}</span>
        </template>
        <template v-if="inRootPage" #right>
          <icon name="plus" size="28" @click="toAdd" />
        </template>
      </nav-bar>
      <div class="h-[60px]"></div>

      <router-view v-slot="{ Component }">
        <transition :name="animationType" mode="out-in" appear>
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
      <!-- <router-view /> -->
      <!-- <action-bar class="flex justify-evenly">
        <action-bar-icon icon="chat-o" text="发表" />
        <action-bar-icon icon="user-o" text="我的" />
        <action-bar-button type="danger" text="登录 / 注册" />
      </action-bar> -->
      <tabbar v-model="activePage">
        <tabbar-item icon="chat-o">留言</tabbar-item>
        <tabbar-item icon="user-o">我的</tabbar-item>
      </tabbar>
    </config-provider>
  </div>
</template>
<script setup lang="ts" name="MobieLayout">
import { useRouter, useRoute } from 'vue-router'
import {
  ConfigProvider,
  NavBar,
  Icon,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Tabbar,
  TabbarItem,
} from 'vant'
import { useCommentStore } from '@/store/modules/comment'
import { watch, ref } from 'vue'

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
const inRootPage = ref(true)
const inCommentAddPage = ref(false)
const animationType = ref('')

const toAdd = () => {
  animationType.value = 'zoom-fade-reverse'
  router.push('/add')
}

const back = async () => {
  animationType.value = 'zoom-fade'
  await router.back()
}

const pathJudge = () => {
  if (route.path === '/') {
    pageName.value = '首页'
    inRootPage.value = true
    inCommentAddPage.value = false
  } else if (route.path === '/add') {
    pageName.value = '发表留言'
    inRootPage.value = false
    inCommentAddPage.value = true
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
