module.exports = async function (params, context) {
  const { id, ids } = params
  const blockWordTable = inspirecloud.db.table('block_word')
  let ObjectId = inspirecloud.db.ObjectId
  if (id) {
      _id = ObjectId(id)
      const result = await blockWordTable.where({ _id }).delete()
      return {
          success: true,
          result,
      }
  } else if (ids && ids.length > 0) {
      for (const id of ids) {
          _id = ObjectId(id)
          const result = await blockWordTable.where({ _id }).delete()
      }
      return {
          success: true,
      }
  } else {
      return {
          success: false,
          mesage: '缺少参数或参数类型错误'
      }
  }
}