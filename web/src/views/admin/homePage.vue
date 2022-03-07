<template>
  <div>
    <n-card :bordered="false" class="rounded-16px shadow">
      <div class="flex w-full h-360px">
        <div class="w-200px h-full py-12px">
          <h3 class="text-16px font-bold">数据统计</h3>
          <p class="text-[#aaa]">一个月内的数据</p>
          <h3 class="pt-36px text-24px font-bold">
            <count-to :start-value="0" :end-value="7754" />
          </h3>
          <p class="text-[#aaa]">这个月的留言量</p>
          <h3 class="pt-36px text-24px font-bold">
            <count-to :start-value="0" :end-value="1234" />
          </h3>
          <p class="text-[#aaa]">这个月的浏览量</p>
          <n-button class="mt-24px" type="primary">上个月的统计</n-button>
        </div>
        <div class="flex-1-hidden h-full">
          <div ref="lineRef" class="wh-full"></div>
        </div>
      </div>
    </n-card>
    <n-grid
      class="mt-4"
      cols="s:1 m:2 l:4"
      responsive="screen"
      :x-gap="16"
      :y-gap="16"
    >
      <n-gi span="2">
        <n-card
          title="近期留言"
          :bordered="false"
          class="rounded-16px shadow-sm"
        >
          <div>
            <n-timeline>
              <n-timeline-item
                v-for="item in commentList"
                :key="item.type"
                v-bind="item"
              />
            </n-timeline>
          </div>
        </n-card>
      </n-gi>
      <n-gi v-for="item in cardData" :key="item.id">
        <gradient-bg
          class="h-100px"
          :start-color="item.colors[0]"
          :end-color="item.colors[1]"
        >
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <n-icon class="ml-2">
              <svg-icon class="!h-30px !w-30px" :name="item.icon" />
            </n-icon>
            <count-to
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </gradient-bg>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
// const handlerBtn = () => {
//   window.$loading.error()
//   window.$notification.error({
//     title: '功能未完善',
//     content: '请耐心等待功能实现',
//     duration: 3000,
//   })
// }

import { ref, onMounted, Ref } from 'vue'
import { Line } from '@antv/g2plot'
import CountTo from '@/components/common/CountTo/index.vue'
import GradientBg from './GradientBg.vue'
import SvgIcon from '@/components/common/Icons/SvgIcon.vue'
import data from './data.json'
import { axios } from '@/utils/http'

const lineRef = ref<HTMLElement>()
const line = ref<Line>()

const commentList: Ref<any[]> = ref([])
const commentLoading = ref(true)

function renderLineChart() {
  if (!lineRef.value) return
  line.value = new Line(lineRef.value, {
    data,
    autoFit: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    lineStyle: {
      lineWidth: 4,
    },
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 2000,
      },
    },
  })
  line.value.render()
}

interface CardData {
  id: string
  title: string
  value: number
  unit: string
  colors: [string, string]
  icon: string
}

const cardData: CardData[] = [
  {
    id: 'visit',
    title: '浏览数',
    value: 14632896,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'liulan',
  },
  {
    id: 'amount',
    title: '留言数',
    value: 234567,
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'comment',
  },
]

onMounted(async () => {
  renderLineChart()
  const res = await axios({
    url: '/CommentPage',
    method: 'post',
    data: {
      pageNo: 1,
      pageSize: 5,
    },
  })
  if (res.success) {
    res.data.rows.forEach(e => {
      commentList.value.push({
        type: 'default',
        title: e.nickname,
        content: e.comment,
        time: e.createdAt,
      })
    })
  }
})
</script>

<style lang="less" scoped></style>
