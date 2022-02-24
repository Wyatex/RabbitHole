module.exports = async function (params, context) {
  const { nickname, comment } = params
  if (!nickname || !comment) {
    return {
      success: false,
      message: '请输入昵称和内容',
    }
  }
  // 检查是否有敏感词
  const blockWordTable = inspirecloud.db.table('block_word')
  const blockWordList = (await blockWordTable.where().find()).map((e) => e.word)
  for (const word of blockWordList) {
    if (comment.indexOf(word) != -1) {
      return {
        success: false,
        message: '存在敏感词：' + word,
      }
    }
    if (nickname.indexOf(word) != -1) {
      return {
        success: false,
        message: '存在敏感词：' + word,
      }
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
