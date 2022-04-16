module.exports = async function (params, context) {
  const { pageSize, pageNo, word } = params
  if (!pageSize || !pageNo) {
      return {
          success: false,
          message: '缺少参数'
      }
  }
  const blockWordTable = inspirecloud.db.table('block_word')
  // 有关键词
  if (word) {
      const regex = new RegExp(word)
      const rows = await blockWordTable.where({ word: regex })
          .skip(pageSize * (pageNo - 1))
          .limit(pageSize)
          .sort({ createdAt: -1 }).find()
      const totalCount = await blockWordTable.where({ word: regex }).count()
      return {
          success: true,
          data: {
              pageSize,
              pageNo,
              rows,
              totalPage: 　Math.ceil(totalCount / pageSize),
          }
      }
  }
  // 无关键词
  const rows = await blockWordTable.where()
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .find()
  const totalCount = await blockWordTable.where().count()
  return {
      success: true,
      data: {
          pageSize,
          pageNo,
          rows,
          totalPage: 　Math.ceil(totalCount / pageSize),
      }
  };
}