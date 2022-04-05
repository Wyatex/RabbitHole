module.exports = async function(params, context) {
    // 从请求参数中获取电话号
    const { phoneNumber } = params;
  
    // 调用 inspirecloud.user.sendSMS 完成短信发送
    await inspirecloud.user.sendSMS(
      context, // 注意，调用所有 inspirecloud.user 相关接口时，都需要传入云函数中的 context
      phoneNumber
    );
  
    return { success: true };
  }