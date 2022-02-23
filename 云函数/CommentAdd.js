module.exports = async function (params, context) {
  const { nickname, comment } = params
  if (!nickname || !comment) {
    return {
      success: false,
      message: '请输入昵称和内容',
    }
  }
  // 写入数据
  const commentTable = inspirecloud.db.table('comments')
  await commentTable.save({
    nickname,
    comment,
  })
  return {
    success: true,
    message: '留言成功',
  }
}
