module.exports = async function (params, context) {
  const { _id, word } = params
  const commentTable = inspirecloud.db.table('block_word')
  const ObjectId = inspirecloud.db.ObjectId
  const blockWord = await commentTable.where({ _id: ObjectId(_id) }).findOne()
  blockWord.word = word
  await commentTable.save(blockWord)
  return {
    success: true,
  }
}
