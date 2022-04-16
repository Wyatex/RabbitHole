module.exports = async function (params, context) {
  let { nickname, comment, expiration } = params
  if (!comment) {
      return {
          success: false,
          message: "请输入内容"
      }
  }
  // 检查时间是否为时间戳
  if (expiration && typeof expiration !== 'number') {
      return {
          success: false,
          message: "到期时间格式不正确"
      }
  }

  nickname = nickname ? nickname : ''
  // 检查是否有敏感词
  const blockWordTable = inspirecloud.db.table('block_word')
  const blockWordList = (await blockWordTable.where().find()).map(e => e.word)
  for (const word of blockWordList) {
      if (comment.indexOf(word) != -1) {
          return {
              success: false,
              message: "存在敏感词：" + word
          }
      }
      if (nickname.indexOf(word) != -1) {
          return {
              success: false,
              message: "存在敏感词：" + word
          }
      }
  }

  const userInfo = await await inspirecloud.user.current(context)
  if (userInfo) {
      // 写入数据
      const commentTable = inspirecloud.db.table('comments')
      await commentTable.save({
          nickname,
          comment,
          expiration,
          uid: userInfo._id
      })
  } else {
      // 写入数据
      const commentTable = inspirecloud.db.table('comments')
      await commentTable.save({
          nickname,
          comment,
          expiration
      })
  }

  return {
      success: true,
      message: '留言成功'
  };
}