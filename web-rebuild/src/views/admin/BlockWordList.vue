<template>
  <div class="flex flex-col h-full">
    <n-card class="flex-1 shadow rounded-16px">
      <n-grid :col="24" :x-gap="24" :y-gap="16">
        <n-gi :span="6">
          <n-input
            v-model:value="blockWord"
            placeholder="请输入敏感词进行查询"
          />
        </n-gi>
        <n-gi :span="12">
          <n-button @click="reloadTable" type="primary" class="mr-2"
            >查询</n-button
          >
          <n-button @click="blockWord = ''" class="mr-2">重置</n-button>
        </n-gi>
        <n-gi :span="24">
          <BasicTable
            :columns="columns"
            :request="loadDataTable"
            :row-key="row => row._id"
            ref="actionRef"
            :action-column="actionColumn"
            @update:checked-row-keys="onCheckedRow"
            :scroll-x="1090"
          >
            <template #tableTitle>
              <n-button @click="handleDeleteByIds" class="mr-2" type="error">
                <template #icon>
                  <n-icon>
                    <DeleteOutlined />
                  </n-icon>
                </template>
                批量删除
              </n-button>
              <n-button
                @click="formRef.openAddForm()"
                class="mr-2"
                type="primary"
              >
                <template #icon>
                  <n-icon>
                    <PlusOutlined />
                  </n-icon>
                </template>
                添加
              </n-button>
            </template>
          </BasicTable>
        </n-gi>
      </n-grid>
    </n-card>
    <BlockWorldForm ref="formRef" @ok="handleOk" />
  </div>
</template>
<script setup lang="ts">
import { BasicTable, TableAction } from '@/components/common/Table'
import { useDialog, useMessage } from 'naive-ui'
import { axios } from '@/utils/http'
import BlockWorldForm from './BlockWorldForm.vue'
import dayjs from 'dayjs'

interface IBlockWord {
  _id: string
  word: string
  createdAt: string
}

const message = useMessage()
const dialog = useDialog()
const actionRef = ref()
const formRef = ref()
const blockWord = ref('')
const checkList: Ref<string[]> = ref([])

// 表头
const columns = [
  {
    title: '屏蔽词',
    key: 'word',
    width: 50,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 30,
    render(row: IBlockWord) {
      console.log(row)
      return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
]

// 表格操作栏
const actionColumn = reactive({
  width: 20,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction, {
      style: 'button',
      actions: [
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true
          },
        },
        {
          label: '删除',
          icon: 'ic:outline-delete-outline',
          onClick: handleDelete.bind(null, record),
          ifShow: () => {
            return true
          },
        },
      ],
      select: key => {
        message.info(`您点击了，${key} 按钮`)
      },
    })
  },
})

const onCheckedRow = rowKeys => {
  checkList.value = rowKeys
}

const loadDataTable = async res => {
  return await axios({
    url: '/BlockWordPage',
    method: 'post',
    data: {
      ...res,
      word: blockWord.value,
    },
  })
}

const handleOk = () => {
  reloadTable()
}

const handleDeleteByIds = async () => {
  if (checkList.value.length === 0) {
    message.info('您还未勾选任何记录')
    return
  }
  dialog.warning({
    title: '警告',
    content: `已勾选${checkList.value.length}条信息，是否确定批量删除？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await axios({
        url: '/BlockWordDel',
        method: 'post',
        data: {
          ids: checkList.value,
        },
      })
      if (res.success) {
        message.success('批量删除成功')
        reloadTable()
      } else {
        message.error('批量删除失败，原因：' + res.message)
      }
      //   console.log(checkList.value)
    },
  })
}

const handleEdit = async e => {
  formRef.value.openEditForm(e)
}

const handleDelete = async e => {
  dialog.warning({
    title: '警告',
    content: `请确定是否删除敏感词 ${e.word}？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await axios({
        url: '/BlockWordDel',
        method: 'post',
        data: {
          id: e._id,
        },
      })
      if (res.success) {
        message.success('删除成功')
        reloadTable()
      } else {
        message.error('删除失败')
      }
    },
    onNegativeClick: () => {
      message.error('已取消')
    },
  })
}

const reloadTable = () => {
  actionRef.value.reload()
}
</script>
<style scoped></style>
