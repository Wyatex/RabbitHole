<template>
  <div class="flex flex-col h-full">
    <n-card class="flex-1 shadow rounded-16px">
      <n-h2>敏感词管理</n-h2>
      <!-- 动态标签或者table选一个 -->
      <n-dynamic-tags />
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
          <n-button @click="handleDeleteByIds" class="mr-2" type="primary">
            <template #icon>
              <n-icon>
                <DeleteOutlined />
              </n-icon>
            </template>
            批量删除
          </n-button>
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>
<script setup>
import { BasicTable, TableAction } from '@/components/common/Table'
import { useDialog, useMessage } from 'naive-ui'
import { ref, reactive, h, Ref } from 'vue'
import { axios } from '@/utils/http'

interface IBlockWord {
    word: string
    createdAt: string
}

const message = useMessage()
const dialog = useDialog()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blockWordList: Ref<IBlockWord[]> = ref([])

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
    width: 50,
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
      keyword: keyword.value,
    },
  })
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
  console.log(e)
}

const handleDelete = async e => {
  dialog.warning({
    title: '警告',
    content: `请确定是否删除昵称 ${e.nickname} 的留言信息？`,
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
        message.fail('删除失败')
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
