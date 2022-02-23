<template>
  <div class="page">
    <config-provider :theme-vars="themeVars" class="h-full flex flex-col">
      <nav-bar fixed safe-area-inset-top :title="commentStore.currentPage">
        <template v-if="inCommentAddPage" #left>
          <icon name="arrow-left" size="28" @click="() => router.back()" />
        </template>
        <template #title>
          <span class="font-bold text-xl">兔子树洞 · {{ pageName }}</span>
        </template>
        <template v-if="inRootPage" #right>
          <icon name="plus" size="28" @click="() => router.push('/add')" />
        </template>
      </nav-bar>
      <div class="h-[60px]"></div>
      <router-view />
    </config-provider>
  </div>
</template>
<script setup lang="ts" name="MobieLayout">
import { useRouter, useRoute } from 'vue-router'
import { ConfigProvider, NavBar, Icon } from 'vant'
import { useCommentStore } from '@/store/modules/comment'
import { watch, ref } from 'vue'
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

watch(
  () => route.path,
  val => {
    console.log(val)
    if (val === '/') {
      pageName.value = '首页'
      inRootPage.value = true
      inCommentAddPage.value = false
    } else if (val === '/add') {
      pageName.value = '发表留言'
      inRootPage.value = false
      inCommentAddPage.value = true
    }
  }
)
</script>
<style scoped>
.page {
  min-height: 100vh;
  width: 100vw;
  background-color: #f7f8fa;
}
</style>
