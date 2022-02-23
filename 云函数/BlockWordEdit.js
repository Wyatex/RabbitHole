module.exports = async function (params, context) {
  const { id, word } = params
  const commentTable = inspirecloud.db.table('block_word')
  const ObjectId = inspirecloud.db.ObjectId
  const blockWord = await commentTable.where({ _id: ObjectId(id) }).findOne()
  blockWord.word = word
  await commentTable.save(blockWord)
  return {
    success: true,
  }
}
