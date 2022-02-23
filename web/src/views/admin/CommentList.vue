<template>
  <div class="flex flex-col h-full">
    <n-card class="flex-1 shadow rounded-16px">
      <n-grid :col="24" :x-gap="24" :y-gap="16">
        <n-gi :span="6">
          <n-input v-model:value="keyword" placeholder="请输入关键词进行查询" />
        </n-gi>
        <n-gi :span="12">
          <n-button @click="reloadTable" type="primary" class="mr-2"
            >查询</n-button
          >
          <n-button @click="keyword = ''" class="mr-2">重置</n-button>
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
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>
<script setup>
import { BasicTable, TableAction } from '@/components/common/Table'
import { useDialog, useMessage } from 'naive-ui'
import { ref, reactive, h } from 'vue'
import { axios } from '@/utils/http'
import dayjs from 'dayjs'

const message = useMessage()
const dialog = useDialog()
const actionRef = ref()
const keyword = ref('')
const checkList = ref([])

// 表头
const columns = [
  {
    title: '昵称',
    key: 'nickname',
    width: 50,
  },
  {
    title: '留言',
    key: 'comment',
    width: 150,
  },
  {
    title: '发表时间',
    key: 'createdAt',
    width: 30,
    render(row) {
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
          label: '删除',
          icon: 'ic:outline-delete-outline',
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
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
    url: '/CommentPage',
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
        url: '/CommentDel',
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
    },
  })
}

const handleDelete = async e => {
  dialog.warning({
    title: '警告',
    content: `请确定是否删除昵称 ${e.nickname} 的留言信息？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await axios({
        url: '/CommentDel',
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
