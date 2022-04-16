module.exports = async function (params, context) {
    const { id, reply } = params
    if (!id || !reply) {
        return {
            success: false,
            message: '请携带id和reply'
        }
    }
    const commentTable = inspirecloud.db.table('comments')
    const ObjectId = inspirecloud.db.ObjectId
    const comment = await commentTable.where({_id:ObjectId(id) }).findOne()
    if (!comment) {
        return {
            success: false,
            message: '留言已被删除'
        }
    }
    console.log(comment.replys && comment.replys.length > 0)
    if (comment.replys && comment.replys.length > 0) {
        comment.replys.push(reply)
    } else {
        comment.replys = [reply]
    }
    const res = await commentTable.save(comment)
    return {
        success: true,
        message: '回复成功',
        res
    };
}