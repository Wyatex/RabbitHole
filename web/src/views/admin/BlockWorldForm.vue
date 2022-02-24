<template>
  <div>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :title="modelTitle"
      :mask-closable="false"
    >
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="屏蔽词" path="word">
          <n-input placeholder="请输入屏蔽词" v-model:value="formParams.word" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm"
            >确定</n-button
          >
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { axios } from '@/utils/http'
const message = useMessage()
const formBtnLoading = ref(false)
const showModal = ref(false)
const modelTitle = ref('')
const formParams = reactive({
  _id: '',
  word: '',
})

// 表单校验
const rules = {
  word: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入屏蔽词',
  },
}

// 打开添加框
function openAddForm() {
  showModal.value = true
  modelTitle.value = '添加屏蔽词'
  formParams.word = ''
}

// 打开编辑
function openEditForm(record: { _id: string; word: string }) {
  showModal.value = true
  modelTitle.value = '修改屏蔽词'
  formParams._id = record._id
  formParams.word = record.word
}

// 确认
async function confirmForm() {
  formBtnLoading.value = true
  if (modelTitle.value === '添加屏蔽词') {
    const res = await axios({
      url: '/BlockWordAdd',
      method: 'post',
      data: {
        ...formParams,
      },
    })
    if (res.success) {
      message.success('添加成功')
      showModal.value = false
      emits('ok')
    } else {
      message.error(res.message)
    }
  } else {
    const res = await axios({
      url: '/BlockWordEdit',
      method: 'post',
      data: {
        ...formParams,
      },
    })
    if (res.success) {
      message.success('修改成功')
      showModal.value = false
      emits('ok')
    } else {
      message.error(res.message)
    }
  }
  formBtnLoading.value = false
}

// 导出
defineExpose({
  openAddForm,
  openEditForm,
})

const emits = defineEmits<{
  (e: 'ok'): void
}>()
</script>
<style scoped></style>
