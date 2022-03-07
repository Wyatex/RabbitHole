module.exports = async function (params, context) {
  const { pageSize, pageNo, keyword, isAdmin } = params
  if (!pageSize || !pageNo) {
    return {
      success: false,
      message: '缺少参数',
    }
  }
  const commentTable = inspirecloud.db.table('comments')
  const db = inspirecloud.db
  // 有关键词
  if (keyword) {
    const regex = new RegExp(`${keyword}`)
    if (isAdmin) {
      // 后台，不受过期时间影响
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
    } else {
      // 前台， 过期后不能查看
      const rows = await commentTable
        .where(
          db.and(
            db.or({ nickname: regex }, { comment: regex }),
            db.or({ expiration: db.gt(Date.now()) }, { expiration: null })
          )
        )
        .skip(pageSize * (pageNo - 1))
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .find()

      const totalCount = await commentTable
        .where(
          db.and(
            db.or({ nickname: regex }, { comment: regex }),
            db.or({ expiration: db.gt(Date.now()) }, { expiration: null })
          )
        )
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
  }
  // 无关键词
  if (isAdmin) {
    // 后台，不受过期时间影响
    const rows = await commentTable
      .where()
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 })
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
  } else {
    // 前台， 过期后不能查看
    const rows = await commentTable
      .where({ expiration: db.gt(Date.now()) })
      .or({ expiration: null })
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .find()

    const totalCount = await commentTable
      .where({ expiration: db.gt(Date.now()) })
      .or({ expiration: null })
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
}
