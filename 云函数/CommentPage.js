module.exports = async function (params, context) {
  const { pageSize, pageNo, keyword } = params
  if (!pageSize || !pageNo) {
    return {
      success: false,
      message: '缺少参数',
    }
  }
  const commentTable = inspirecloud.db.table('comments')
  // 有关键词
  if (keyword) {
    const regex = new RegExp(`${keyword}`)

    const rows = await commentTable
      .where({ nickname: regex })
      .or({ comment: regex })
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .find()
    const totalCount = await commentTable
      .where({ nickname: regex })
      .or({ comment: regex })
      .count()
    return {
      success: true,
      data: {
        pageSize,
        pageNo,
        rows,
        totalCount,
        totalPage: Math.ceil(totalCount / pageSize),
      },
    }
  }
  // 无关键词
  const rows = await commentTable
    .where()
    .sort({ createdAt: -1 })
    .skip(pageSize * (pageNo - 1))
    .limit(pageSize)
    .find()
  const totalCount = await commentTable.where().count()
  return {
    success: true,
    data: {
      pageSize,
      pageNo,
      rows,
      totalCount,
      totalPage: Math.ceil(totalCount / pageSize),
    },
  }
}
