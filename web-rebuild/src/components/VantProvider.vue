<template>
  <van-config-provider
    :theme="globalStore.darkTheme ? 'dark' : 'light'"
    :theme-vars="themeVars"
    :theme-vars-dark="themeVarsDark"
    :theme-vars-light="themeVarsLight"
  >
    <slot></slot>
  </van-config-provider>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/setting'

const globalStore = useSettingStore()
// 可以在这配置主题
const themeVars = {}
const themeVarsLight = {}
const themeVarsDark = {
  emptyDescriptionColor: 'white',
}
</script>
