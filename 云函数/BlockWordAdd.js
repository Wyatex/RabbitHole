module.exports = async function (params, context) {
  const { word } = params
  if (!word) {
    return {
      success: false,
      message: '请输入屏蔽词',
    }
  }
  // 写入数据
  const blockWordTable = inspirecloud.db.table('block_word')
  const count = blockWordTable.where({ word }).limit(1).count()
  if (count) {
    return {
      success: false,
      message: '该屏蔽词已存在',
    }
  }
  await commentTable.save({
    word,
  })
  return {
    success: true,
    message: '添加成功',
  }
}
