module.exports = async function (params, context) {
  const { _id, word } = params
  const blockWordTable = inspirecloud.db.table('block_word')
  const ObjectId = inspirecloud.db.ObjectId
  const blockWord = await blockWordTable.where({_id:ObjectId(_id) }).findOne()
  blockWord.word = word
  await blockWordTable.save(blockWord)
  return {
      success: true
  };
}