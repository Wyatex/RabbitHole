module.exports = async function(params, context) {
  // 从请求参数中获取电话号和验证码
  const { phoneNumber, code } = params;

  try {
    // 调用 inspirecloud.user.loginByPhone 校验验证码并登录，如果校验通过，会返回登录后的用户信息
    const { userInfo } = await inspirecloud.user.loginByPhone(
      context, // 注意，调用所有 inspirecloud.user 相关接口时，都需要传入云函数中的 context
      phoneNumber,
      code // 对应手机号上接到的验证码
    );

    return {
      success: true,
      userInfo,
    };
  } catch (error) {
    // 登录失败，返回错误原因
    return {
      success: false,
      message: error.message,
    };
  }
}